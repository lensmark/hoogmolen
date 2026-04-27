import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Clock, Key, Wifi, Car, Dog, MapPin } from "lucide-react";
import { CONTACT } from "@/config/navigationConfig";

const blocks = [
  { icon: Clock, title: "Check-in & check-out", text: "Inchecken vanaf 15u00, uitchecken om 10u00. Self check-in 24/7 met persoonlijke pincode." },
  { icon: Key, title: "Self-hosting", text: "Geen receptie, geen wachttijden. Wij zijn altijd bereikbaar via WhatsApp, e-mail of telefoon." },
  { icon: Wifi, title: "Inbegrepen", text: "Bedlinnen, handdoeken, verzorgingsproducten, koffie, high-speed wifi en parking." },
  { icon: Car, title: "Bereikbaarheid", text: `${CONTACT.address}. 1u15 vanaf Brussel, 30 min vanaf Hasselt of Eindhoven.` },
  { icon: Dog, title: "Huisdieren", text: "Honden zijn nergens op het domein toegelaten. Paarden welkom in onze 6 boxen (€25 eerste nacht)." },
  { icon: MapPin, title: "Boekingsinfo", text: "Reserveer rechtstreeks via hoogmolen.com of vraag een offerte voor groepen." },
];

// Sfeerbeelden voor de hero — aggregeert alle accommodatie-prefixes
const PRAKTISCH_HERO_IDS = [
  "hoogmolen-verblijf-peerdermolen",
  "hoogmolen-verblijf-watermolen",
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
  "hoogmolen-verblijf-suite-a5",
  "hoogmolen-verblijf-suite-a6",
  "hoogmolen-verblijf-peerdermolen-kamer-b1",
  "hoogmolen-verblijf-peerdermolen-kamer-b2",
  "hoogmolen-verblijf-peerdermolen-kamer-b3",
  "hoogmolen-verblijf-peerdermolen-kamer-b4",
  "hoogmolen-verblijf-peerdermolen-kamer-b5",
];

const Praktisch = () => (
  <Layout>
    <PageHero
      eyebrow="Praktische info"
      title="Alles wat u wilt weten, op één plek."
      heroSlug="praktisch-hero"
      heroExtraIds={PRAKTISCH_HERO_IDS}
    />
    <section className="py-20">
      <div className="container-wide grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="surface-card p-7">
            <Icon className="w-7 h-7 text-primary mb-4" />
            <div className="font-display text-xl text-primary-deep mb-2">{title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </div>
    </section>
    <FAQAccordion context="praktisch" title="Veelgestelde vragen" />
  </Layout>
);

export default Praktisch;
