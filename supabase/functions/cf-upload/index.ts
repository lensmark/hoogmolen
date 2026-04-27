/**
 * cf-upload — proxied upload naar Cloudflare Images.
 *
 * Beveiligd: alleen ingelogde Lovable Cloud users mogen uploaden.
 * Het Cloudflare API-token blijft server-side in CF_API_TOKEN secret.
 *
 * Body: multipart/form-data met velden:
 *   - file: binary
 *   - id:   custom Cloudflare image ID (gesanitiseerd door client)
 */
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";

const CF_ACCOUNT_ID = "1bb10d948fa79207a1c987659583a827";

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

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsErr } = await supabase.auth.getClaims(token);
    if (claimsErr || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
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

    const incoming = await req.formData();
    const file = incoming.get("file");
    const id = incoming.get("id");

    if (!(file instanceof File) || typeof id !== "string" || !id) {
      return new Response(
        JSON.stringify({ error: "file en id zijn verplicht" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Validatie ID (alleen veilige chars)
    if (!/^[a-z0-9_-]{1,128}$/.test(id)) {
      return new Response(
        JSON.stringify({ error: "Ongeldig ID. Gebruik a-z, 0-9, - en _ (max 128)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Bouw multipart body voor Cloudflare
    const cfBody = new FormData();
    cfBody.append("file", file, file.name);
    cfBody.append("id", id);
    cfBody.append("requireSignedURLs", "false");

    const cfRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${CF_API_TOKEN}` },
        body: cfBody,
      },
    );

    const cfJson = await cfRes.json();
    if (!cfRes.ok || !cfJson.success) {
      // Extract Cloudflare error code if present (bv. 5409 = ID al in gebruik)
      const cfErr = Array.isArray(cfJson.errors) && cfJson.errors[0];
      const cfCode = cfErr?.code;
      const cfMessage = cfErr?.message ?? "Cloudflare upload faalde";

      // Map CF code → HTTP status zodat frontend de juiste tip toont
      let status = cfRes.status;
      if (cfCode === 5409) status = 400; // ID conflict
      if (cfCode === 5408) status = 413; // file too large

      return new Response(
        JSON.stringify({
          error: cfMessage,
          cf_code: cfCode,
          details: cfJson,
        }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true, result: cfJson.result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
