/**
 * /overnachten — Overzichtspagina conform screenshot.
 * - Hero met dynamische aggregatie-foto (alle accommodaties)
 * - 3-koloms accommodatiegrid (Vakantiewoningen · Duplexsuites · Kamers) — met dynamische galleries
 * - Info-kaart "Boekingsinformatie" — met dynamische gallery
 * - Beige CTA-banner naar groepsverblijven
 * - Donkergroene beschikbaarheidsbalk
 *
 * v4.4.0 — Foto-gallery's toegevoegd aan alle kaarten + hero-foto via
 * UnitGallerySlider/PageHero patroon (consistent met SuitesKamers/Vakantiewoningen).
 */
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { CONTACT } from "@/config/navigationConfig";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableText from "@/components/admin/EditableText";
import { cn } from "@/lib/utils";

interface AccoCard {
  category: string;
  title: string;
  badge?: string;
  description: string;
  ctaLabel: string;
  to: string;
  /** unieke key voor text-overrides */
  sectionKey: string;
  /** slug voor gallery-resolver (primary unit) */
  gallerySlug: string;
  /** extra location IDs voor aggregatie (overzichtskaart) */
  extraIds?: string[];
  /** placeholder-label als geen foto's gevonden */
  placeholderLabel: string;
}

const VAKANTIEWONINGEN_IDS = [
  "hoogmolen-verblijf-peerdermolen",
  "hoogmolen-verblijf-watermolen",
];

const DUPLEX_OVERVIEW_IDS = [
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
  "hoogmolen-verblijf-suite-a5",
  "hoogmolen-verblijf-suite-a6",
];

const KAMERS_OVERVIEW_IDS = [
  "hoogmolen-verblijf-peerdermolen-kamer-b1",
  "hoogmolen-verblijf-peerdermolen-kamer-b2",
  "hoogmolen-verblijf-peerdermolen-kamer-b3",
  "hoogmolen-verblijf-peerdermolen-kamer-b4",
  "hoogmolen-verblijf-peerdermolen-kamer-b5",
];

// Hero aggregeert alle accommodatie-IDs voor een sfeer-impressie
const HERO_ALL_IDS = [
  ...VAKANTIEWONINGEN_IDS,
  ...DUPLEX_OVERVIEW_IDS,
  ...KAMERS_OVERVIEW_IDS,
];

const ACCO_CARDS: AccoCard[] = [
  {
    category: "Vakantiewoningen",
    title: "Vakantiewoningen",
    description:
      "Twee historische erfgoedwoningen — Peerdermolen (12p) en Watermolen (17p) — privé en volledig uitgerust voor uw gezelschap.",
    ctaLabel: "Bekijk woningen",
    to: "/overnachten/vakantiewoningen",
    sectionKey: "overnachten.acco.vakantiewoningen",
    gallerySlug: "vakantiewoningen-overview",
    extraIds: VAKANTIEWONINGEN_IDS,
    placeholderLabel: "Vakantiewoningen",
  },
  {
    category: "Duplexsuites",
    title: "Duplexsuites A1–A6",
    badge: "1–6p",
    description:
      "Zes intieme suites over twee verdiepingen, elk met privé terras of zicht op de molenvijver.",
    ctaLabel: "Bekijk suites",
    to: "/overnachten/suites-kamers/duplexsuites",
    sectionKey: "overnachten.acco.duplexsuites",
    gallerySlug: "duplexsuites-overview",
    extraIds: DUPLEX_OVERVIEW_IDS,
    placeholderLabel: "6 duplexsuites",
  },
  {
    category: "Kamers",
    title: "Kamers B1–B5",
    badge: "1–4p",
    description:
      "Comfortabele kamers in het hoofdgebouw, ideaal voor koppels of kleine families.",
    ctaLabel: "Bekijk kamers",
    to: "/overnachten/suites-kamers/kamers",
    sectionKey: "overnachten.acco.kamers",
    gallerySlug: "kamers-overview",
    extraIds: KAMERS_OVERVIEW_IDS,
    placeholderLabel: "5 kamers",
  },
];

const AccoTile = ({ card }: { card: AccoCard }) => {
  const { isAdminMode } = useAdminMode();
  const cardClasses =
    "group surface-card overflow-hidden flex flex-col bg-card border border-border transition-all hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

  const body = (
    <>
      {/* Foto-gallery top — vervangt de oude tekst-banner */}
      <UnitGallerySlider
        slug={card.gallerySlug}
        extraLocationIds={card.extraIds}
        alt={card.title}
        placeholderLabel={card.placeholderLabel}
      />

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <EditableText
            sectionKey={`${card.sectionKey}.title`}
            defaultText={card.title}
            as="h2"
            singleLine
            className="font-display text-xl text-primary-deep"
          />
          {card.badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 bg-accent/60 text-primary-deep rounded-full">
              {card.badge}
            </span>
          )}
        </div>
        <EditableText
          sectionKey={`${card.sectionKey}.description`}
          defaultText={card.description}
          as="p"
          className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1"
        />
        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
          {card.ctaLabel}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </>
  );

  if (isAdminMode) {
    return (
      <article className={cn(cardClasses, "ring-1 ring-blue-400/40")}>{body}</article>
    );
  }

  return (
    <Link to={card.to} className={cardClasses} aria-label={`${card.ctaLabel} — ${card.title}`}>
      {body}
    </Link>
  );
};

const InfoTile = () => {
  const { isAdminMode } = useAdminMode();
  const to = "/overnachten/boekingsinformatie";
  const baseKey = "overnachten.info.boekingsinformatie";
  const cardClasses =
    "group surface-card overflow-hidden flex flex-col bg-card border border-border transition-all hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-w-md";

  const body = (
    <>
      {/* Foto-gallery top — sfeerbeeld van het volledige domein */}
      <UnitGallerySlider
        slug="info-overview"
        extraLocationIds={HERO_ALL_IDS}
        alt="Boekingsinformatie"
        placeholderLabel="Info"
      />
      <div className="p-6">
        <EditableText
          sectionKey={`${baseKey}.title`}
          defaultText="Boekingsinformatie"
          as="h2"
          singleLine
          className="font-display text-xl text-primary-deep mb-3"
        />
        <EditableText
          sectionKey={`${baseKey}.description`}
          defaultText="Aankomst- en vertrektijden, annulatievoorwaarden, betaling en praktische tips voor uw verblijf."
          as="p"
          className="text-sm text-muted-foreground leading-relaxed mb-6"
        />
        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
          Meer info
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </>
  );

  if (isAdminMode) {
    return <article className={cn(cardClasses, "ring-1 ring-blue-400/40")}>{body}</article>;
  }

  return (
    <Link to={to} className={cardClasses} aria-label="Bekijk boekingsinformatie">
      {body}
    </Link>
  );
};

const Overnachten = () => (
  <Layout>
    {/* ───────── HERO met dynamische foto-achtergrond ───────── */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      {/* Achtergrond-slider (sfeer) — v4.22.4: helder recept (homepage/paardenlogies) */}
      <div className="absolute inset-0">
        <UnitGallerySlider
          slug="overnachten-hero"
          extraLocationIds={HERO_ALL_IDS}
          alt="Overnachten op Landgoed De Hoogmolen"
          placeholderLabel=""
          aspectClass="h-full"
        />
      </div>
      {/* Leesbaarheids-overlay — dubbele lichte gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent pointer-events-none" aria-hidden="true" />

      <div className="relative container-wide py-16 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          Overnachten op Landgoed De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          Luxe, natuur en erfgoed
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* ───────── INTRO BLOK ───────── */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-6 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Of u nu komt voor een romantisch weekend met twee, een familievakantie
            of een uitzonderlijke viering met dertig gasten — De Hoogmolen biedt
            een verblijfsformule die past bij elk gezelschap. Ontdek hieronder
            onze vakantiewoningen, duplexsuites en kamers.
          </p>
        </div>
      </div>
    </section>

    {/* ───────── 3-KOLOMS ACCOMMODATIE GRID ───────── */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACCO_CARDS.map((card) => (
            <AccoTile key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>

    {/* ───────── INFO KAART ───────── */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <InfoTile />
      </div>
    </section>

    {/* ───────── BEIGE CTA-BANNER (groepen) ───────── */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <Link
          to="/groepsverblijf"
          className="group block border border-accent bg-accent/30 px-6 py-5 transition-all hover:-translate-y-0.5 hover:shadow-card hover:bg-accent/50"
          aria-label="Bekijk onze groepsverblijven voor formules tot 53 personen"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm md:text-base text-primary-deep">
              <strong>Met een grotere groep?</strong>{" "}
              Bekijk onze groepsverblijven voor formules tot 53 personen.
            </p>
            <ArrowRight className="w-5 h-5 text-primary-deep shrink-0 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </section>

    {/* ───────── DONKERGROENE BESCHIKBAARHEIDSBALK ───────── */}
    <section className="bg-primary-deep text-secondary">
      <div className="container-wide py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="font-display text-lg text-secondary mb-1">
            Klaar om te boeken?
          </div>
          <div className="text-sm text-secondary/80">
            Live beschikbaarheid en directe reservatie via ons boekingsplatform.
          </div>
        </div>
        <Button
          asChild
          size="lg"
          className="bg-secondary text-primary-deep hover:bg-accent shrink-0"
        >
          <a href={CONTACT.bookingUrl} target="_blank" rel="noopener noreferrer">
            Bekijk beschikbaarheid
          </a>
        </Button>
      </div>
    </section>
  </Layout>
);

export default Overnachten;
