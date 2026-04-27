/**
 * AdminSettings — globale site-instellingen (contact-info).
 * Alleen admins.
 */
import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Settings {
  id: string;
  contact_phone: string | null;
  contact_email: string | null;
  whatsapp_number: string | null;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("id, contact_phone, contact_email, whatsapp_number")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) {
        toast({ title: "Kon instellingen niet laden", description: error.message, variant: "destructive" });
      } else if (data) {
        setSettings(data as Settings);
      }
      setLoading(false);
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        contact_phone: settings.contact_phone,
        contact_email: settings.contact_email,
        whatsapp_number: settings.whatsapp_number,
      })
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Instellingen opgeslagen" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="font-display text-3xl text-primary-deep">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Globale contactgegevens. Deze waarden worden zichtbaar in de footer en op contactpagina's
          (zodra de frontend ze leest uit de database — momenteel nog hardcoded in de config).
        </p>
      </header>

      <form onSubmit={save} className="bg-card border border-border rounded-md p-6 shadow-soft space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefoonnummer</Label>
          <Input
            id="phone"
            type="tel"
            value={settings.contact_phone ?? ""}
            onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
            placeholder="+32 11 90 11 00"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-mailadres</Label>
          <Input
            id="email"
            type="email"
            value={settings.contact_email ?? ""}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            placeholder="info@hoogmolen.com"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wa">WhatsApp-nummer</Label>
          <Input
            id="wa"
            type="tel"
            value={settings.whatsapp_number ?? ""}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+3211901100"
          />
          <p className="text-xs text-muted-foreground">
            Zonder spaties of streepjes (formaat voor wa.me-links).
          </p>
        </div>
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Opslaan…" : "Opslaan"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
