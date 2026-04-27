/**
 * cf-rename — hernoemt een Cloudflare Image (custom ID) + image_library rij.
 *
 * Cloudflare Images ondersteunt geen native rename. Strategie:
 *   1. Download originele blob via delivery URL
 *   2. Upload onder nieuwe custom ID
 *   3. Delete originele image
 *   4. Update image_library rij (cloudflare_id + filename)
 *
 * Body (JSON):
 *   { oldId: string, newId: string }
 */
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const CF_ACCOUNT_ID = "1bb10d948fa79207a1c987659583a827";
const CF_ACCOUNT_HASH = "5O4MPZuZcLR_Jv2Gxn3iWA";
const CF_VARIANT = "public";

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

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    // Service-role client voor sync_history logging (RLS-bypass)
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const logHistory = async (
      status: "success" | "failed",
      message: string,
      counts: Record<string, unknown> = {},
      affected: string[] = [],
      userId?: string,
    ) => {
      try {
        await adminClient.from("sync_history").insert({
          status,
          action: "rename",
          message,
          affected_items: affected,
          counts,
          triggered_by: userId ?? null,
        });
      } catch (e) {
        console.warn("sync_history log faalde:", e);
      }
    };

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claims.claims.sub as string;

    const CF_API_TOKEN = Deno.env.get("CF_API_TOKEN");
    if (!CF_API_TOKEN) {
      return new Response(
        JSON.stringify({ error: "CF_API_TOKEN niet geconfigureerd" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => null);
    const oldId = body?.oldId;
    const newId = body?.newId;

    if (typeof oldId !== "string" || typeof newId !== "string" || !oldId || !newId) {
      return new Response(
        JSON.stringify({ error: "oldId en newId zijn verplicht" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (oldId === newId) {
      return new Response(
        JSON.stringify({ error: "oldId en newId zijn identiek" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!/^[a-z0-9_-]{1,128}$/.test(newId)) {
      return new Response(
        JSON.stringify({ error: "Ongeldig newId. Gebruik a-z, 0-9, - en _ (max 128)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // 1. Download originele blob
    const deliveryUrl = `https://imagedelivery.net/${CF_ACCOUNT_HASH}/${oldId}/${CF_VARIANT}`;
    const blobRes = await fetch(deliveryUrl);
    if (!blobRes.ok) {
      return new Response(
        JSON.stringify({ error: `Kan originele image niet ophalen (${blobRes.status})` }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const blob = await blobRes.blob();

    // 2. Upload onder nieuwe ID
    const cfBody = new FormData();
    cfBody.append("file", blob, `${newId}.jpg`);
    cfBody.append("id", newId);
    cfBody.append("requireSignedURLs", "false");

    const uploadRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        body: cfBody,
      },
    );
    const uploadJson = await uploadRes.json();
    if (!uploadRes.ok || !uploadJson.success) {
      const cfErr = Array.isArray(uploadJson.errors) && uploadJson.errors[0];
      return new Response(
        JSON.stringify({
          error: cfErr?.message ?? "Upload nieuwe ID faalde",
          cf_code: cfErr?.code,
        }),
        {
          status: cfErr?.code === 5409 ? 400 : uploadRes.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const newUid = uploadJson.result?.id ?? newId;

    // 3. Delete originele
    const deleteRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1/${oldId}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${CF_API_TOKEN}` } },
    );
    if (!deleteRes.ok) {
      // Niet fataal — log maar geef succes terug (nieuwe staat live).
      console.warn(`Delete originele ${oldId} faalde:`, deleteRes.status);
    }

    // 4. Update image_library
    const { error: updateErr } = await supabase
      .from("image_library")
      .update({
        cloudflare_id: newId,
        cloudflare_uid: newUid,
        filename: `${newId}.jpg`,
      })
      .eq("cloudflare_id", oldId);

    if (updateErr) {
      console.warn("DB-update faalde:", updateErr.message);
    }

    // 5. Schrijf alias zodat oude code-referenties naar oldId blijven werken.
    //    Bestaat er al een alias voor deze oldId? Update naar nieuwste new_id.
    const { error: aliasErr } = await adminClient
      .from("image_aliases")
      .upsert(
        { old_id: oldId, new_id: newId, created_by: userId },
        { onConflict: "old_id", ignoreDuplicates: false },
      );

    if (aliasErr) {
      console.warn("Alias-insert faalde:", aliasErr.message);
    }

    await logHistory(
      "success",
      `Rename ${oldId} → ${newId} voltooid${updateErr ? " (DB-update faalde)" : ""}${aliasErr ? " (alias-write faalde)" : ""}.`,
      { deleted: deleteRes.ok, dbUpdated: !updateErr, aliasWritten: !aliasErr },
      [oldId, newId],
      userId,
    );

    return new Response(
      JSON.stringify({
        success: true,
        oldId,
        newId,
        deleted: deleteRes.ok,
        dbUpdated: !updateErr,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";

    try {
      const adminClient = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await adminClient.from("sync_history").insert({
        status: "failed",
        action: "rename",
        message: `Rename gecrasht: ${msg}`,
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
