/**
 * Paardenlogies — strikte wireframe-implementatie (image-46).
 * v4.22.2 — 'Combineer met'-categorienamen (Paardrijden / Verblijf / Activiteiten)
 * fors vergroot en gecentreerd als visuele hoofd-anchor in de header van elke kaart.
 */
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { FastFacts } from "@/components/FastFacts";
import { FAQAccordion } from "@/components/FAQAccordion";
import { cn } from "@/lib/utils";
import { resolveImageSrc } from "@/lib/imageSource";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableImage from "@/components/admin/EditableImage";

// Default hero (foto #45) — drone-shot vijver/sfeer.
// Admin-override op page_path "/paardenlogies" + section_key "hero" heeft voorrang.
const DEFAULT_HERO_IMAGE_ID = "hoogmolen-drone-domein-natuur-vijver-sfeer-09";

const cardBase =
  "group surface-card overflow-hidden flex flex-col bg-card border border-border transition-all hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const FACILITEITEN = [
  "Stalling voor paarden",
  "Ruiterroutes aan de deur",
  "Verblijf in suites of kamers",
  "Nationaal Park Hoge Kempen",
  "Gratis parking met trailer-mogelijkheid",
  "Uniek in de regio",
];

const RUITER_PAARD = [
  {
    title: "Voor de ruiter",
    cta: "Verblijf in suites of kamers",
    to: "/overnachten/suites-kamers",
  },
  {
    title: "Voor het paard",
    cta: "Stalling op het domein",
    to: "/contact",
  },
];

const COMBINEER = [
  {
    eyebrow: "Paardrijden",
    title: "Paardrijden in de omgeving",
    cta: "Meer info",
    to: "/activiteiten/paardrijden",
    headerTone: "soft" as const,
  },
  {
    eyebrow: "Verblijf",
    title: "Overnachten op het domein",
    cta: "Bekijk verblijven",
    to: "/overnachten",
    headerTone: "deep" as const,
  },
  {
    eyebrow: "Activiteiten",
    title: "Wandelen & fietsen",
    cta: "Ontdek",
    to: "/activiteiten",
    headerTone: "soft" as const,
  },
] as const;

const Paardenlogies = () => {
  const { isAdminMode, getOverride } = useAdminMode();
  const location = useLocation();
  const heroOverride = getOverride(location.pathname, "hero");
  const heroSrc = heroOverride ?? resolveImageSrc(DEFAULT_HERO_IMAGE_ID);

  const heroSection = (
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div
        className="absolute inset-0 ken-burns bg-cover bg-center"
        style={{ backgroundImage: `url(${heroSrc})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent"
        aria-hidden="true"
      />
      <div className="relative container-wide py-16 md:py-24 z-[1]">
        <div className="text-[11px] uppercase tracking-[0.2em] text-secondary/85 mb-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
          Uniek in de regio
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
          Paardenlogies op Landgoed De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
          Verblijf voor ruiter en paard — midden in het Nationaal Park Hoge Kempen
        </p>
      </div>
    </section>
  );

  return (
    <Layout>
      {/* HERO */}
      {isAdminMode ? (
        <EditableImage sectionKey="hero" contextHint="paardenlogies">
          {heroSection}
        </EditableImage>
      ) : (
        heroSection
      )}

    <FastFacts />

    {/* INTRO-bar */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/30 px-5 py-4 space-y-2">
          <div className="h-2 bg-primary-deep/15 rounded w-11/12 max-w-3xl" />
          <div className="h-2 bg-primary-deep/10 rounded w-2/3 max-w-2xl" />
        </div>
      </div>
    </section>

    {/* 2-KOLOMS CARDS — full-card click */}
    <section className="pb-10 bg-background">
      <div className="container-wide grid md:grid-cols-2 gap-5">
        {RUITER_PAARD.map((c) => (
          <Link
            key={c.title}
            to={c.to}
            className={cn(cardBase, "p-6")}
            aria-label={`${c.cta} — ${c.title}`}
          >
            <h2 className="font-display text-xl text-primary-deep mb-3">{c.title}</h2>
            <div className="space-y-2 mb-5 flex-1">
              <div className="h-2 bg-muted rounded w-11/12" />
              <div className="h-2 bg-muted rounded w-3/4" />
            </div>
            <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
              {c.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* FACILITEITEN */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Faciliteiten</h2>
        <div className="border-t border-border pt-4 flex flex-wrap gap-2">
          {FACILITEITEN.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-2 border border-accent bg-accent/30 text-primary-deep px-3 py-2 text-sm"
            >
              <span className="text-primary" aria-hidden>✓</span>
              {f}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* COMBINEER MET — full-card click */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer met</h2>
        <div className="border-t border-border pt-4 grid md:grid-cols-3 gap-4">
          {COMBINEER.map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className={cardBase}
              aria-label={`${c.cta} — ${c.title}`}
            >
              <div
                className={cn(
                  "px-5 py-10 md:py-14 text-center flex items-center justify-center min-h-[140px] md:min-h-[180px]",
                  c.headerTone === "deep"
                    ? "bg-gradient-to-br from-primary to-primary-deep text-secondary"
                    : "bg-accent/40 text-primary-deep",
                )}
              >
                <span className="font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight">
                  {c.eyebrow}
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-base text-primary-deep/80 mb-2">{c.title}</h3>
                <div className="space-y-2 mb-5 flex-1">
                  <div className="h-2 bg-muted rounded w-11/12" />
                  <div className="h-2 bg-muted rounded w-2/3" />
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
                  {c.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Donkere CTA-bar */}
    <section className="py-5 bg-primary-deep text-secondary">
      <div className="container-wide flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1.5">
          <div className="h-2 bg-secondary/20 rounded w-2/3 max-w-md" />
          <div className="h-2 bg-secondary/15 rounded w-1/3 max-w-xs" />
        </div>
        <Link
          to="/contact"
          className="bg-secondary text-primary-deep hover:bg-accent px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Vraag info aan
        </Link>
      </div>
    </section>

      <FAQAccordion context="praktisch" />
    </Layout>
  );
};

export default Paardenlogies;
