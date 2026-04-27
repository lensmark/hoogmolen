// Admin-only edge function: deletes a user from auth.users.
// Cascades remove profile + user_roles via FK / manual cleanup.
// Caller must be authenticated AND have role 'admin'.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ ok: false, error: "Geen auth-header" }, 401);
    }

    // Verify caller identity & admin role using their JWT
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return json({ ok: false, error: "Ongeldige sessie" }, 401);
    }
    const callerId = userData.user.id;

    const { data: roleCheck, error: roleErr } = await userClient.rpc("has_role", {
      _user_id: callerId,
      _role: "admin",
    });
    if (roleErr || !roleCheck) {
      return json({ ok: false, error: "Alleen admins mogen gebruikers verwijderen" }, 403);
    }

    const body = await req.json().catch(() => ({}));
    const targetUserId: string | undefined = body?.user_id;
    if (!targetUserId) {
      return json({ ok: false, error: "user_id ontbreekt" }, 400);
    }
    if (targetUserId === callerId) {
      return json({ ok: false, error: "Je kunt jezelf niet verwijderen" }, 400);
    }

    // Service-role client for the actual delete
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

    // Cleanup app rows first (no FK to auth.users in public schema)
    await admin.from("user_roles").delete().eq("user_id", targetUserId);
    await admin.from("profiles").delete().eq("user_id", targetUserId);

    const { error: delErr } = await admin.auth.admin.deleteUser(targetUserId);
    if (delErr) throw delErr;

    return json({ ok: true, deleted: targetUserId });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
