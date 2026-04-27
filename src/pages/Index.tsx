/**
 * Home — Hero + 4×3 Master Grid (12 tegels) + Trust-bar + Intro/Geschiedenis + Groep-CTA + FAQ.
 * Het Master Grid gebruikt één herbruikbare FeatureCard component.
 * Responsive: mobiel 1 kolom · tablet 2 kolommen · desktop 4 kolommen.
 */
import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FeatureCard, type FeatureCardProps } from "@/components/FeatureCard";
import { CONTACT } from "@/config/navigationConfig";
import { resolveImageSrc } from "@/lib/imageSource";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableImage from "@/components/admin/EditableImage";

// Default hero (foto #49) — drone-shot domein/omgeving.
// Admin-override op page_path "/" + section_key "hero" heeft voorrang.
const DEFAULT_HERO_IMAGE_ID = "hoogmolen-drone-domein-lucht-omgeving-06";

/* ───── 4×3 Master Grid — gegroepeerd per rij met titel + lijntje ───── */
type GridRow = { title: string; tiles: FeatureCardProps[] };

const GRID_ROWS: GridRow[] = [
  {
    title: "Kies uw beleving",
    tiles: [
      {
        title: "Overnachten",
        description: "Individueel of kleine groepen.",
        to: "/overnachten",
      },
      {
        title: "Groepsverblijf",
        badge: "10–53p",
        description: "Samen verblijven tot 53 personen.",
        to: "/groepsverblijf",
      },
      {
        title: "Teambuilding",
        description: "Zakelijke & groepsdynamiek.",
        to: "/teambuildings",
      },
      {
        title: "Vergaderruimtes",
        description: "Professionele faciliteiten.",
        to: "/vergaderen",
      },
    ],
  },
  {
    title: "De Logies",
    tiles: [
      {
        title: "Vakantiewoningen",
        description: "De Watermolen & De Peerdermolen.",
        to: "/overnachten/vakantiewoningen",
      },
      {
        title: "Duplexen",
        description: "Ruimtelijke luxe verblijven.",
        to: "/overnachten/suites-kamers/duplexsuites",
      },
      {
        title: "Suites & Kamers",
        description: "Comfort in het hoofdgebouw.",
        to: "/overnachten/suites-kamers",
      },
      {
        title: "Het Landgoed",
        description: "Exclusieve huur (totaaloverzicht).",
        to: "/groepsverblijf",
      },
    ],
  },
  {
    title: "Extra's",
    tiles: [
      {
        title: "Familie",
        description: "Ideaal voor familieweekenden en uitjes.",
        to: "/activiteiten/familie",
      },
      {
        title: "Entertainment Ruimte",
        description: "Ontspanning & fun op locatie.",
        to: "/overnachten/molenhuys",
      },
      {
        title: "Activiteiten",
        description: "Ontdek de regio Oudsbergen.",
        to: "/activiteiten",
      },
      {
        title: "Gidsen",
        description: "Download onze informatiegidsen en plannen.",
        to: "/praktisch/download-gidsen",
      },
    ],
  },
];

/* Trust-bar USPs — exact 4 items uit screenshot */
const TRUST_ITEMS = [
  { icon: "⭐", value: "4.9/5", label: "Reviews" },
  { icon: "🏡", value: "8–53p", label: "Capaciteit" },
  { icon: "🌳", value: "Natuur", label: "Abeekvallei" },
  { icon: "🅿️", value: "Gratis", label: "Parking" },
] as const;

const Index = () => {
  const { isAdminMode, getOverride } = useAdminMode();
  const location = useLocation();

  // Prio: admin override (image_overrides) > hardcoded default
  const heroOverride = getOverride(location.pathname, "hero");
  const heroSrc = heroOverride ?? resolveImageSrc(DEFAULT_HERO_IMAGE_ID);

  const heroSection = (
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      {/* Achtergrond-foto met ken-burns + leesbaarheids-overlays */}
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

      {/* Drone/sfeervideo placeholder badge — top-right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1 border border-secondary/40 rounded-sm text-[10px] uppercase tracking-[0.2em] text-secondary/80 bg-primary-deep/30 backdrop-blur-sm z-[1]">
        Drone / sfeervideo
      </div>

      <div className="relative container-wide pt-32 pb-14 md:pt-40 md:pb-20 min-h-[60vh] flex items-end z-[1]">
        <div className="max-w-3xl animate-rise">
          <div className="text-[11px] font-medium uppercase tracking-[0.25em] text-secondary/85 mb-5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]">
            Landgoed De Hoogmolen · Oudsbergen · Limburg
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-secondary mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
            Verblijf, beleef &amp; vergader in de natuur van Limburg
          </h1>
          <p className="text-sm md:text-base text-secondary/90 mb-8 drop-shadow-[0_1px_4px_rgba(0,0,0,0.35)]">
            Erfgoeddomein aan de Abeekvallei · 8 tot 53 personen
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="bg-primary-deep hover:bg-primary-deep/90 text-secondary border border-primary-deep"
            >
              <Link to="/overnachten">Bekijk verblijven</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-surface text-primary-deep border-surface hover:bg-secondary"
            >
              <Link to="/groepsverblijf/aanvragen">Groepsverblijf aanvragen</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-primary-deep hover:bg-accent"
            >
              <Link to="/vergaderen">
                Vergaderen <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <Layout transparentHeader>
      {/* ───────────────── HERO ───────────────── */}
      {isAdminMode ? (
        <EditableImage sectionKey="hero" contextHint="homepage">
          {heroSection}
        </EditableImage>
      ) : (
        heroSection
      )}

      {/* ───────────────── 4×3 MASTER GRID — 3 rijen met titel + lijntje ───────────────── */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-wide space-y-12 md:space-y-14">
          {GRID_ROWS.map((row) => (
            <div key={row.title}>
              <h2 className="font-display text-2xl md:text-3xl text-primary-deep mb-2">
                {row.title}
              </h2>
              <div className="border-t border-border mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {row.tiles.map((tile) => (
                  <FeatureCard key={tile.title} {...tile} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── TRUST-BAR (4) ───────────────── */}
      <section className="pb-16 md:pb-20">
        <div className="container-wide">
          <div className="surface-card bg-secondary/50 px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {TRUST_ITEMS.map((t) => (
              <div key={t.label} className="flex flex-col items-center text-center">
                <span className="text-2xl mb-2" aria-hidden>
                  {t.icon}
                </span>
                <div className="font-display text-lg text-primary-deep leading-none mb-1">
                  {t.value}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {t.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────── INTRO + GESCHIEDENIS ───────────────── */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="container-narrow grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="eyebrow mb-4">Welkom op het landgoed</div>
            <h2 className="heading-section text-primary-deep mb-6">
              Een eeuwenoud molenerf,
              <br />
              verfijnd voor de moderne gast.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                De Hoogmolen is een historische watermolen, voor het eerst vermeld in{" "}
                <strong>1500</strong> als korenwatermolen voor de lokale bevolking. In 1995 werd
                het domein beschermd als monument en dorpsgezicht; sinds 2016 wekt onze eigen{" "}
                <strong>waterkrachtcentrale</strong> elektriciteit op voor het Molenhuys en
                vijftien gezinnen in de buurt.
              </p>
              <p>
                Op dit 5-sterren landgoed vindt u de perfecte combinatie van luxe, comfort, rust,
                natuur en privacy. Of u nu komt met twee, met uw familie van twintig, of het
                volledige domein voor drieënvijftig gasten exclusief reserveert: De Hoogmolen
                vraagt niets van u, behalve dat u even niets meer hoeft.
              </p>
            </div>
            <div className="mt-8">
              <Button asChild variant="outline" className="border-primary-deep text-primary-deep">
                <Link to="/over-ons">Onze geschiedenis</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] rounded-md overflow-hidden shadow-elevated">
            <div className="absolute inset-0 bg-gradient-deep" />
            <div className="absolute inset-0 bg-gradient-overlay" />
            <div className="absolute bottom-6 left-6 right-6 text-secondary">
              <div className="eyebrow text-secondary/80 mb-2">Vanaf 1500</div>
              <div className="font-display text-2xl">Vijf eeuwen molengeschiedenis</div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── GROEP-CTA ───────────────── */}
      <section className="py-16 md:py-24 bg-gradient-deep text-secondary">
        <div className="container-narrow text-center">
          <div className="eyebrow text-secondary/70 mb-4">Voor groepen tot 53 gasten</div>
          <h2 className="heading-section text-secondary mb-6">
            Het volledige landgoed,
            <br />
            exclusief voor uw gezelschap.
          </h2>
          <p className="lead text-secondary/85 max-w-2xl mx-auto mb-8">
            Familiereünies, bruiloften, bedrijfsretraites of uitzonderlijke vieringen. Sluit de
            poort achter u en maak van vijf eeuwen erfgoed even uw eigen domein.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <a href={CONTACT.bookingUrl} target="_blank" rel="noopener noreferrer">
                Boek uw verblijf
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-secondary text-primary-deep hover:bg-accent"
            >
              <Link to="/groepsverblijf/aanvragen">Vraag een offerte</Link>
            </Button>
          </div>
        </div>
      </section>

      <FAQAccordion context="home" title="Veelgestelde vragen" />
    </Layout>
  );
};

export default Index;
