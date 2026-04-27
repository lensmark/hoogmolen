/**
 * /admin/auth/callback
 * Publieke landingspagina voor alle Supabase auth e-maillinks
 * (signup-verificatie, magic link, password recovery, e-mailwijziging).
 *
 * Verantwoordelijkheden:
 * - Tokens uit URL hash (#access_token=...&type=recovery) verwerken.
 * - Tokens uit query (?token_hash=...&type=recovery) verwerken via verifyOtp.
 * - Op basis van type doorsturen:
 *     - "recovery"          → /admin/reset-password (recovery-sessie blijft actief)
 *     - "signup" / "invite" → /admin (geverifieerd + ingelogd)
 *     - "magiclink"         → /admin
 *     - onbekend / fout     → /admin/login met foutmelding
 *
 * Doel: e-maillinks landen NOOIT op een beschermde route waar ProtectedRoute
 * direct redirect naar /admin/login (wat de auth-sessie verstoort en als
 * 404/loop kan voelen).
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Status = "processing" | "error";

const AdminAuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("processing");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    const handle = async () => {
      // 1. Parse hash- en query-parameters
      const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(window.location.search);

      const hashError = hashParams.get("error_description") || hashParams.get("error");
      const queryError = queryParams.get("error_description") || queryParams.get("error");
      if (hashError || queryError) {
        if (cancelled) return;
        setErrorMsg(decodeURIComponent(hashError || queryError || "Onbekende fout"));
        setStatus("error");
        return;
      }

      // Type kan in hash of query staan
      const type =
        hashParams.get("type") ||
        queryParams.get("type") ||
        "";

      // 2a. Nieuwe PKCE-stijl: ?token_hash=...&type=...
      const tokenHash = queryParams.get("token_hash");
      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "signup" | "recovery" | "invite" | "magiclink" | "email_change",
        });
        if (cancelled) return;
        if (error) {
          setErrorMsg(error.message);
          setStatus("error");
          return;
        }
      }

      // 2b. Legacy hash-stijl: #access_token=...&refresh_token=...&type=...
      // Supabase parseert hash automatisch en zet de sessie. We hoeven niets
      // te doen — wachten op getSession() volstaat.

      // 3. Wacht kort tot Supabase de sessie heeft gezet
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      // 4. Routeer op basis van type
      if (type === "recovery") {
        // Recovery-sessie is actief — laat de gebruiker een nieuw wachtwoord kiezen
        navigate("/admin/reset-password", { replace: true });
        return;
      }

      if (type === "signup" || type === "invite" || type === "magiclink" || type === "email_change") {
        navigate("/admin", { replace: true });
        return;
      }

      // 5. Geen type meegegeven maar wel een sessie → ga naar admin
      if (data.session) {
        navigate("/admin", { replace: true });
        return;
      }

      // 6. Niets bruikbaars
      setErrorMsg(
        "Deze link is niet geldig of al gebruikt. Vraag opnieuw een verificatie- of reset-mail aan.",
      );
      setStatus("error");
    };

    handle();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (status === "processing") {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Bezig met verifiëren…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center bg-card border border-border rounded-md p-8 shadow-soft">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <h1 className="font-display text-2xl text-primary-deep mb-3">Link niet geldig</h1>
        <p className="text-sm text-muted-foreground mb-6">{errorMsg}</p>
        <a
          href="/admin/login"
          className="inline-block text-sm text-primary underline underline-offset-4"
        >
          Terug naar login
        </a>
      </div>
    </main>
  );
};

export default AdminAuthCallback;
