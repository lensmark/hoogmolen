import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AddressAutocomplete,
  emptyAddress,
  formatAddress,
  type AddressValue,
} from "@/components/AddressAutocomplete";

/**
 * /vergader-offerte — dedicated offerteformulier voor vergaderingen.
 */

const FORMULES = [
  { id: "4u", label: "4-uurs vergaderarrangement (€31,50 p.p.)" },
  { id: "8u", label: "8-uurs vergaderarrangement (€51,50 p.p.)" },
  { id: "12u", label: "12-uurs vergaderarrangement (€110 p.p.)" },
  { id: "24u", label: "24-uurs met overnachting (€225 p.p.)" },
  { id: "48u", label: "48-uurs met 2 overnachtingen (€450 p.p.)" },
  { id: "anders", label: "Andere / op maat" },
];

const VergaderOfferte = () => {
  const [params] = useSearchParams();
  const initialFormule = params.get("formule") || "";

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formule, setFormule] = useState(initialFormule);
  const [address, setAddress] = useState<AddressValue>(emptyAddress());

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const fd = new FormData(e.currentTarget);
    if ((fd.get("bot-field") as string)?.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke("send-form-email", {
        body: {
          formType: "vergader",
          firstName: fd.get("firstName"),
          lastName: fd.get("lastName"),
          name: `${fd.get("firstName")} ${fd.get("lastName")}`.trim(),
          org: fd.get("org"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          address: formatAddress(address),
          street: address.street,
          housenumber: address.housenumber,
          postcode: address.postcode,
          city: address.city,
          arrival: fd.get("arrival"),
          departure: fd.get("departure"),
          guests: fd.get("guests"),
          formule: FORMULES.find((f) => f.id === formule)?.label || "",
          message: fd.get("message"),
        },
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons direct.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PageHero
        eyebrow="Vergaderoffert​e op maat"
        title="Vraag uw vergaderoffert​e aan"
        subtitle="Vertel ons over uw vergadering — wij bezorgen u binnen 24 uur een persoonlijk voorstel."
      />
      <section className="py-20">
        <div className="container-narrow">
          {submitted ? (
            <div className="surface-card p-10 text-center">
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" aria-hidden="true" />
              <div className="font-display text-2xl text-primary-deep mb-3">
                Aanvraag verstuurd!
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                Bedankt — we hebben uw vergaderaanvraag ontvangen. Een bevestiging is naar uw mailbox
                verstuurd. Binnen 24 uur ontvangt u een persoonlijk voorstel op maat.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="surface-card p-8 space-y-5" noValidate>
              <p className="hidden">
                <label>
                  Niet invullen: <input name="bot-field" />
                </label>
              </p>

              {/* Voornaam + Naam */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">Voornaam *</Label>
                  <Input id="firstName" name="firstName" required maxLength={80} autoComplete="given-name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Naam *</Label>
                  <Input id="lastName" name="lastName" required maxLength={80} autoComplete="family-name" />
                </div>
              </div>

              {/* Bedrijf */}
              <div className="space-y-1.5">
                <Label htmlFor="org">Bedrijf / organisatie</Label>
                <Input id="org" name="org" maxLength={160} autoComplete="organization" />
              </div>

              {/* E-mail + Telefoon */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Telefoon / GSM *</Label>
                  <Input id="phone" name="phone" type="tel" required maxLength={60} autoComplete="tel" />
                </div>
              </div>

              {/* Adres met autocomplete */}
              <AddressAutocomplete value={address} onChange={setAddress} />

              {/* Datum van - tot + aantal personen */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="arrival">Datum van *</Label>
                  <Input id="arrival" name="arrival" type="date" required min={today} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="departure">Datum tot *</Label>
                  <Input id="departure" name="departure" type="date" required min={today} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="guests">Aantal personen *</Label>
                  <Input id="guests" name="guests" type="number" min={1} max={48} required />
                </div>
              </div>

              {/* Formule-keuze */}
              <div className="space-y-1.5">
                <Label htmlFor="formule">Vergaderformule</Label>
                <Select value={formule} onValueChange={setFormule}>
                  <SelectTrigger id="formule">
                    <SelectValue placeholder="Kies een formule (optioneel)" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMULES.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bericht */}
              <div className="space-y-1.5">
                <Label htmlFor="message">Eventuele opmerking of vraag</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={4000}
                  placeholder="Bv. opstelling van de zaal, dieetwensen, gewenste extras..."
                />
              </div>

              <Button type="submit" size="lg" disabled={loading} className="bg-primary hover:bg-primary-deep">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Versturen…
                  </>
                ) : (
                  "Vergaderoffert​e aanvragen"
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default VergaderOfferte;
