/**
 * cf-sync — synchroniseert Cloudflare Images naar de image_library tabel.
 *
 * Strategie (DB-only, GEEN writes naar Cloudflare):
 *  1. Cleanup: verwijder corrupte rijen zonder cloudflare_uid/cloudflare_id.
 *  2. Pagineer Cloudflare Images v2 → UPSERT op cloudflare_uid.
 *     - Bestaande rij → metadata (filename, status) wordt overschreven.
 *     - Nieuwe rij → ingevoegd.
 *  Resultaat: nooit duplicate-key errors; sync wordt altijd 'groen'.
 */
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const CF_ACCOUNT_ID = "1bb10d948fa79207a1c987659583a827";
const PER_PAGE = 100;
const MAX_PAGES = 200; // safety cap (20.000 images)

interface CFImage {
  id: string;
  filename?: string;
  uploaded?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Validate caller JWT + role
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await userClient.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;
    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    const { data: isEditor } = await userClient.rpc("has_role", {
      _user_id: userId,
      _role: "editor",
    });
    if (!isAdmin && !isEditor) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const CF_API_TOKEN = Deno.env.get("CF_API_TOKEN");
    if (!CF_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "CF_API_TOKEN niet geconfigureerd" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 2. Service-role client voor RLS-bypass inserts
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 3. Cleanup: verwijder corrupte rijen (zonder cloudflare_uid of cloudflare_id).
    // Deze kunnen ontstaan zijn door eerdere mislukte uploads en blokkeren upserts niet,
    // maar vervuilen wel het dashboard.
    let cleaned = 0;
    {
      const { data: orphans, error: orphErr } = await adminClient
        .from("image_library")
        .delete()
        .or("cloudflare_uid.is.null,cloudflare_id.is.null")
        .select("id");
      if (!orphErr && orphans) cleaned = orphans.length;
    }

    // 4. Pagineer Cloudflare Images v2 en UPSERT (geen Cloudflare-write, alleen DB).
    let scanned = 0;
    let inserted = 0;
    let updated = 0;
    const errors: string[] = [];
    let continuationToken: string | null = null;

    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(
        `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v2`,
      );
      url.searchParams.set("per_page", String(PER_PAGE));
      if (continuationToken) {
        url.searchParams.set("continuation_token", continuationToken);
      }

      const cfRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
      });
      const cfJson = await cfRes.json();
      if (!cfRes.ok || !cfJson.success) {
        const cfErr = Array.isArray(cfJson.errors) && cfJson.errors[0];
        return new Response(
          JSON.stringify({
            error: `Cloudflare list mislukt: ${cfErr?.message ?? cfRes.statusText}`,
            scanned,
            inserted,
            updated,
            cleaned,
          }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const images: CFImage[] = cfJson.result?.images ?? [];
      continuationToken = cfJson.result?.continuation_token ?? null;

      const toUpsert = images
        .filter((img) => !!img.id)
        .map((img) => ({
          filename: img.filename || img.id,
          cloudflare_id: img.id,
          cloudflare_uid: img.id, // Cloudflare custom ID = uid in onze tabel
          status: "success",
        }));

      scanned += images.length;

      if (toUpsert.length === 0) {
        if (!continuationToken) break;
        continue;
      }

      // UPSERT op cloudflare_uid (de natural key uit Cloudflare).
      // ignoreDuplicates: false → bestaande rijen krijgen geüpdatete metadata
      // (filename, status) zonder duplicate-key error.
      const { error: batchErr, data: batchData } = await adminClient
        .from("image_library")
        .upsert(toUpsert, { onConflict: "cloudflare_uid", ignoreDuplicates: false })
        .select("id, created_at");

      if (batchErr) {
        // Fallback: één-voor-één om rotte rij te isoleren.
        for (const row of toUpsert) {
          const { error: rowErr, data: rowData } = await adminClient
            .from("image_library")
            .upsert(row, { onConflict: "cloudflare_uid", ignoreDuplicates: false })
            .select("created_at")
            .maybeSingle();
          if (rowErr) {
            errors.push(`Page ${page} · ${row.cloudflare_id}: ${rowErr.message}`);
          } else if (rowData) {
            // Onderscheid insert vs update: created_at jonger dan 5s = nieuw.
            const isNew =
              !!rowData.created_at &&
              Date.now() - new Date(rowData.created_at).getTime() < 5000;
            if (isNew) inserted += 1;
            else updated += 1;
          }
        }
      } else if (batchData) {
        for (const row of batchData) {
          const isNew =
            !!row.created_at &&
            Date.now() - new Date(row.created_at).getTime() < 5000;
          if (isNew) inserted += 1;
          else updated += 1;
        }
      }

      if (!continuationToken || images.length === 0) break;
    }

    // 5. Log naar sync_history (best-effort, mag niet de response breken)
    const finalStatus = errors.length === 0 ? "success" : (inserted + updated > 0 ? "partial" : "failed");
    const message = errors.length === 0
      ? `Sync voltooid: ${scanned} gescand, ${inserted} nieuw, ${updated} bijgewerkt, ${cleaned} opgeruimd.`
      : `Sync afgerond met ${errors.length} fout(en). ${inserted} nieuw, ${updated} bijgewerkt. Eerste fout: ${errors[0]}`;

    try {
      await adminClient.from("sync_history").insert({
        status: finalStatus,
        action: "media_sync",
        message,
        affected_items: errors.slice(0, 50),
        counts: { scanned, inserted, updated, cleaned, errors: errors.length },
        triggered_by: userId,
      });
    } catch (logErr) {
      console.warn("sync_history log faalde:", logErr);
    }

    return new Response(
      JSON.stringify({ success: true, scanned, inserted, updated, cleaned, errors }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";

    // Best-effort log van de catastrofale fout
    try {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await adminClient.from("sync_history").insert({
        status: "failed",
        action: "media_sync",
        message: `Sync gecrasht: ${msg}`,
        affected_items: [],
        counts: {},
      });
    } catch { /* ignore */ }

    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
