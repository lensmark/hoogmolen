/**
 * AdminLogin — gebrandeerde login + signup voor /admin.
 * - E-mail + wachtwoord, met emailverificatie verplicht voor nieuwe accounts.
 * - Bij geslaagde signup: tonen "Bevestig je e-mail" boodschap.
 * - Reeds ingelogd → redirect naar /admin.
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/hoogmolen-logo.png";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signupSent, setSignupSent] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: "E-mail vereist",
        description: "Vul eerst uw e-mailadres in om uw wachtwoord te herstellen.",
        variant: "destructive",
      });
      return;
    }
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (error) throw error;
      setResetSent(email);
    } catch (err) {
      toast({
        title: "Herstel mislukt",
        description: err instanceof Error ? err.message : "Onbekende fout",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  useEffect(() => {
    // Belangrijk: PASSWORD_RECOVERY-sessies NIET wegredirecten naar /admin —
    // de gebruiker moet eerst zijn wachtwoord kunnen herzetten.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        navigate("/admin/reset-password", { replace: true });
        return;
      }
      if (session && event === "SIGNED_IN") {
        navigate("/admin", { replace: true });
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Land op publieke callback i.p.v. beschermde /admin route.
            emailRedirectTo: `${window.location.origin}/admin/auth/callback`,
            data: { display_name: email },
          },
        });
        if (error) throw error;
        setSignupSent(email);
      }
    } catch (err) {
      toast({
        title: mode === "signin" ? "Inloggen mislukt" : "Registreren mislukt",
        description: err instanceof Error ? err.message : "Onbekende fout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left: brand panel */}
      <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary to-primary-deep text-secondary p-12 relative overflow-hidden">
        <div>
          <img
            src={logo}
            alt="Hoogmolen"
            className="h-14 w-auto brightness-0 invert opacity-90 mb-6"
          />
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
            Admin Console
          </span>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-4xl leading-tight mb-4">
            Beheer Landgoed De Hoogmolen
          </h2>
          <p className="text-secondary/85 leading-relaxed">
            Upload foto's, wijs ze visueel toe aan pagina's en beheer admin-gebruikers
            — alles vanuit één geïntegreerde console.
          </p>
        </div>
        <div className="text-xs text-accent/60">
          © {new Date().getFullYear()} Landgoed De Hoogmolen — Anno 1500
        </div>
      </aside>

      {/* Right: form */}
      <section className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <img src={logo} alt="Hoogmolen" className="h-14 w-auto mx-auto mb-3" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Admin Console
            </span>
          </div>

          {signupSent ? (
            <div className="bg-card border border-border rounded-lg shadow-soft p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-primary-deep" />
              </div>
              <h1 className="font-display text-2xl text-primary-deep">Bevestig je e-mail</h1>
              <p className="text-sm text-muted-foreground">
                We stuurden een verificatielink naar <strong>{signupSent}</strong>. Open de mail
                en klik de link om je account te activeren.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSignupSent(null);
                  setMode("signin");
                }}
                className="w-full"
              >
                Terug naar inloggen
              </Button>
            </div>
          ) : resetSent ? (
            <div className="bg-card border border-border rounded-lg shadow-soft p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6 text-primary-deep" />
              </div>
              <h1 className="font-display text-2xl text-primary-deep">Controleer uw e-mail</h1>
              <p className="text-sm text-muted-foreground">
                We stuurden een herstellink naar <strong>{resetSent}</strong>. Klik de link in
                de mail om een nieuw wachtwoord in te stellen.
              </p>
              <Button
                variant="outline"
                onClick={() => setResetSent(null)}
                className="w-full"
              >
                Terug naar inloggen
              </Button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg shadow-soft p-8">
              <h1 className="font-display text-2xl text-primary-deep">
                {mode === "signin" ? "Welkom terug" : "Account aanmaken"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {mode === "signin"
                  ? "Log in om de admin-console te openen."
                  : "Vraag een bestaande admin om je rechten toe te kennen na registratie."}
              </p>

              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Wachtwoord</Label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={resetLoading}
                        className="text-xs text-primary hover:text-primary-deep underline underline-offset-4 disabled:opacity-50"
                      >
                        {resetLoading ? "Versturen…" : "Wachtwoord vergeten?"}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={mode === "signin" ? "current-password" : "new-password"}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {mode === "signin" ? "Inloggen" : "Registreren"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-xs text-primary hover:text-primary-deep underline underline-offset-4"
                >
                  {mode === "signin"
                    ? "Nog geen account? Registreren"
                    : "Al een account? Inloggen"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminLoginPage;
