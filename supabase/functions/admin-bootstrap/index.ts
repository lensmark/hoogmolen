// One-shot edge function: creates a user account, assigns admin role, sends password-reset mail.
// Hardcoded for marc.lens@spartasolutions.eu — single bootstrap use.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const targetEmail = "mark.lens@spartasolutions.eu";

  try {
    // 1. Check / create user
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (existing) {
      userId = existing.id;
    } else {
      const tempPassword = crypto.randomUUID() + "Aa1!";
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: targetEmail,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { display_name: targetEmail },
      });
      if (createErr) throw createErr;
      userId = created.user.id;
    }

    // 2. Ensure profile exists
    await admin.from("profiles").upsert(
      { user_id: userId, display_name: targetEmail },
      { onConflict: "user_id" },
    );

    // 3. Assign admin role (idempotent via unique constraint)
    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr && !roleErr.message.includes("duplicate")) {
      console.error("role insert", roleErr);
    }

    // 4. Trigger password reset email — land op publieke callback die de
    //    recovery-sessie opzet en daarna naar /admin/reset-password navigeert.
    const origin = req.headers.get("origin") ?? "https://intelligent-guesty-hub.lovable.app";
    const redirectTo = `${origin}/admin/auth/callback`;
    const { error: resetErr } = await admin.auth.resetPasswordForEmail(targetEmail, { redirectTo });
    if (resetErr) console.error("reset", resetErr);

    return new Response(
      JSON.stringify({ ok: true, userId, email: targetEmail, resetSent: !resetErr }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: e instanceof Error ? e.message : String(e) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
