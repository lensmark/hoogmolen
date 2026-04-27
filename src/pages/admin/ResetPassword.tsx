/**
 * /admin/reset-password
 * Bestemming voor Supabase password-recovery e-mails (na callback).
 *
 * Drie staten:
 * - "loading"  → wachten tot we weten of er een (recovery-)sessie is
 * - "ready"    → formulier tonen om nieuw wachtwoord in te stellen
 * - "invalid"  → nette foutmelding i.p.v. een 404-loop
 *
 * Belangrijke fix: indien tokens nog in de URL-hash staan (oude mail-links die
 * direct naar /admin/reset-password wijzen i.p.v. via /admin/auth/callback),
 * laten we Supabase de sessie eerst opzetten voor we "invalid" tonen.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type State = "loading" | "ready" | "invalid";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<State>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    // 1. Eerst: listener voor PASSWORD_RECOVERY (oude hash-flow)
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelled) return;
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setState("ready");
      }
    });

    // 2. Probeer query token_hash (nieuwe PKCE-stijl) — voor links die rechtstreeks
    //    naar /admin/reset-password?token_hash=...&type=recovery wijzen.
    const queryParams = new URLSearchParams(window.location.search);
    const tokenHash = queryParams.get("token_hash");
    const type = queryParams.get("type");

    const init = async () => {
      if (tokenHash && type === "recovery") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });
        if (cancelled) return;
        if (error) {
          setErrorMsg(error.message);
          setState("invalid");
          return;
        }
        setState("ready");
        return;
      }

      // 3. Geef Supabase even tijd om de hash automatisch te parsen
      await new Promise((r) => setTimeout(r, 350));
      if (cancelled) return;

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (data.session) {
        setState("ready");
      } else {
        setErrorMsg(
          "Deze reset-link is verlopen of al gebruikt. Vraag opnieuw een nieuwe reset-mail aan.",
        );
        setState("invalid");
      }
    };

    init();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({
        title: "Wachtwoord te kort",
        description: "Minimaal 8 tekens.",
        variant: "destructive",
      });
      return;
    }
    if (password !== confirm) {
      toast({ title: "Wachtwoorden komen niet overeen", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Fout", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Wachtwoord opgeslagen",
      description: "U wordt doorgestuurd naar de console.",
    });
    setTimeout(() => navigate("/admin", { replace: true }), 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8">
        <h1 className="font-display text-3xl text-primary-deep mb-2">Wachtwoord instellen</h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Kies een nieuw wachtwoord voor uw admin-account.
        </p>

        {state === "loading" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sessie laden…
          </div>
        )}

        {state === "invalid" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-md p-4">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{errorMsg}</p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/login", { replace: true })}
            >
              Terug naar login
            </Button>
          </div>
        )}

        {state === "ready" && (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pw">Nieuw wachtwoord</Label>
              <Input
                id="pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="pw2">Bevestig wachtwoord</Label>
              <Input
                id="pw2"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-deep"
              disabled={loading}
            >
              {loading ? "Bezig…" : "Wachtwoord opslaan"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
