import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AddressAutocomplete,
  emptyAddress,
  formatAddress,
  type AddressValue,
} from "@/components/AddressAutocomplete";

const GroepsverblijfAanvragen = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<AddressValue>(emptyAddress());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    const fd = new FormData(e.currentTarget);
    if ((fd.get("bot-field") as string)?.trim()) return;

    setLoading(true);
    try {
      const firstName = (fd.get("firstName") as string)?.trim() || "";
      const lastName = (fd.get("lastName") as string)?.trim() || "";
      const { error } = await supabase.functions.invoke("send-form-email", {
        body: {
          formType: "groepsverblijf",
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          org: fd.get("org"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          address: formatAddress(address),
          street: address.street,
          housenumber: address.housenumber,
          postcode: address.postcode,
          city: address.city,
          guests: fd.get("guests"),
          arrival: fd.get("arrival"),
          departure: fd.get("departure"),
          occasion: fd.get("occasion"),
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
        eyebrow="Offerte op maat"
        title="Vraag uw groepsverblijf aan"
        subtitle="Vertel ons over uw groep en wensen. Wij bezorgen u binnen 24 uur een passend voorstel."
      />
      <section className="py-20">
        <div className="container-narrow">
          {submitted ? (
            <div className="surface-card p-10 text-center">
              <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" aria-hidden="true" />
              <div className="font-display text-2xl text-primary-deep mb-3">Aanvraag verstuurd!</div>
              <p className="text-muted-foreground max-w-md mx-auto">
                Bedankt — we hebben uw groepsaanvraag ontvangen. Een bevestiging is verstuurd naar uw mailbox. Binnen 24 uur ontvangt u een persoonlijk voorstel op maat.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="surface-card p-8 space-y-5" noValidate>
              <p className="hidden"><label>Niet invullen: <input name="bot-field" /></label></p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label htmlFor="firstName">Voornaam *</Label><Input id="firstName" name="firstName" required maxLength={80} autoComplete="given-name" /></div>
                <div className="space-y-1.5"><Label htmlFor="lastName">Naam *</Label><Input id="lastName" name="lastName" required maxLength={80} autoComplete="family-name" /></div>
              </div>
              <div className="space-y-1.5"><Label htmlFor="org">Organisatie</Label><Input id="org" name="org" maxLength={160} autoComplete="organization" /></div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5"><Label htmlFor="email">E-mail *</Label><Input id="email" name="email" type="email" required maxLength={200} autoComplete="email" /></div>
                <div className="space-y-1.5"><Label htmlFor="phone">Telefoon *</Label><Input id="phone" name="phone" type="tel" required maxLength={60} autoComplete="tel" /></div>
              </div>

              <AddressAutocomplete value={address} onChange={setAddress} />

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5"><Label htmlFor="guests">Aantal personen *</Label><Input id="guests" name="guests" type="number" min={1} max={53} required /></div>
                <div className="space-y-1.5"><Label htmlFor="arrival">Aankomst</Label><Input id="arrival" name="arrival" type="date" /></div>
                <div className="space-y-1.5"><Label htmlFor="departure">Vertrek</Label><Input id="departure" name="departure" type="date" /></div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="occasion">Aanleiding</Label>
                <Input id="occasion" name="occasion" placeholder="Familiereünie, bruiloft, bedrijfsretraite..." maxLength={200} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Wensen / vragen</Label>
                <Textarea id="message" name="message" rows={5} maxLength={4000} />
              </div>
              <Button type="submit" size="lg" disabled={loading} className="bg-primary hover:bg-primary-deep">
                {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Versturen…</>) : "Aanvraag versturen"}
              </Button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default GroepsverblijfAanvragen;
