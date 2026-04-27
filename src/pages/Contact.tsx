import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { CONTACT } from "@/config/navigationConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AddressAutocomplete,
  emptyAddress,
  formatAddress,
  type AddressValue,
} from "@/components/AddressAutocomplete";

const Contact = () => {
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
          formType: "contact",
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
          email: fd.get("email"),
          phone: fd.get("phone"),
          address: formatAddress(address),
          street: address.street,
          housenumber: address.housenumber,
          postcode: address.postcode,
          city: address.city,
          subject: fd.get("subject"),
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
      <PageHero eyebrow="Contact" title="Een vraag, een wens, een idee?" subtitle="We horen graag van u — antwoord binnen 24u." />
      <section className="py-20">
        <div className="container-wide grid lg:grid-cols-3 gap-12">
          <aside className="lg:col-span-1 space-y-8">
            <div>
              <div className="eyebrow mb-3">Direct contact</div>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3"><MapPin className="w-5 h-5 text-primary mt-0.5" /><span className="text-primary-deep">{CONTACT.address}</span></li>
                <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><a href={`tel:${CONTACT.phone}`} className="text-primary-deep hover:text-primary">{CONTACT.phone}</a></li>
                <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><a href={`mailto:${CONTACT.email}`} className="text-primary-deep hover:text-primary">{CONTACT.email}</a></li>
              </ul>
            </div>
            <div className="surface-card p-6">
              <div className="font-display text-xl text-primary-deep mb-2">Direct boeken?</div>
              <p className="text-sm text-muted-foreground mb-4">Reserveer uw verblijf rechtstreeks via ons boekingsplatform.</p>
              <Button asChild className="bg-primary hover:bg-primary-deep w-full">
                <a href={CONTACT.bookingUrl} target="_blank" rel="noopener noreferrer">Naar hoogmolen.com</a>
              </Button>
            </div>
          </aside>
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="surface-card p-10 text-center">
                <CheckCircle2 className="w-14 h-14 text-primary mx-auto mb-4" aria-hidden="true" />
                <div className="font-display text-2xl text-primary-deep mb-3">Bedankt voor uw bericht!</div>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We hebben uw bericht in goede orde ontvangen. Een bevestiging is naar uw mailbox verstuurd. We nemen binnen 24 uur persoonlijk contact met u op.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="surface-card p-8 space-y-5" noValidate>
                <p className="hidden"><label>Niet invullen: <input name="bot-field" /></label></p>

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

                <AddressAutocomplete value={address} onChange={setAddress} />

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Onderwerp</Label>
                  <Input id="subject" name="subject" maxLength={200} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Bericht *</Label>
                  <Textarea id="message" name="message" rows={6} required maxLength={4000} />
                </div>

                <Button type="submit" size="lg" disabled={loading} className="bg-primary hover:bg-primary-deep">
                  {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Versturen…</>) : "Bericht versturen"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
