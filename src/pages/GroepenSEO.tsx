/**
 * GroepenSEO — herbruikbaar template voor de 4 SEO-landingspagina's onder /groepen/*.
 * Niet opgenomen in het hoofdmenu, wel geïndexeerd door Google.
 *
 * Layout exact volgens wireframe image-36 (Groepsaccommodatie voor 20 personen):
 *   1. SubNav (Groepen 20p / 30p / 40p+ / Flexibele modules / Culinair)
 *   2. Donkere hero (eyebrow + titel + subtitel)
 *   3. Cream intro-banner met linker accent-streep
 *   4. "Aanbevolen samenstelling" tabel
 *   5. Unit-kaarten (Bekijk woning / Aanvullen met suites)
 *   6. "Ideaal voor" pills met groene vinkjes
 *   7. Activiteit-tegels
 *   8. Cream callout (combinatietip)
 *   9. SEO-meta: interne links + canonical-info
 *  10. Donkere CTA-bar
 */
import { Link, useLocation, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Button } from "@/components/ui/button";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { Check } from "lucide-react";
import { getProperty } from "@/config/propertyConfig";
import { galleryLocationIdsForSlugs } from "@/lib/locationId";

const GROEPEN_SUBNAV = [
  { label: "Groepen 20p", to: "/groepen/groepsaccommodatie-20-personen" },
  { label: "Groepen 30p", to: "/groepen/groepsaccommodatie-30-personen" },
  { label: "Groepen 40p+", to: "/groepen/groepsaccommodatie-40-personen" },
  { label: "Flexibele modules", to: "/groepen/flexibele-modules-8-tot-53-personen" },
  { label: "Culinair", to: "/activiteiten/culinair" },
];

interface UnitCardCfg {
  /** property-slug (haalt naam, capacity etc.) of null voor "Suites A1-A6" generic */
  slug: string | null;
  /** Optionele gallery-input voor generieke formules/overzichtskaarten. */
  gallerySlugs?: string[];
  /** custom titel (als slug=null) */
  title?: string;
  /** capaciteit-pill ("17p", "1-6p") */
  capacityLabel?: string;
  /** header-label in italic */
  headerLabel?: string;
  /** CTA-tekst + variant */
  ctaLabel: string;
  ctaTo: string;
  ctaVariant: "primary" | "outline";
  /** korte body-tekst */
  body?: string;
  /** optionele feature-pills met vinkjes binnen de kaart */
  features?: string[];
}

interface SeoBucket {
  parentBucket: "10-20" | "20-30" | "30-53";
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  /** override voor de titel boven de aanbevolen-tabel */
  recommendedTitle?: string;
  /** override voor kolomkoppen (default: Formule / Units / Personen / Toelichting) */
  recommendedColumns?: [string, string, string, string];
  recommended: { name: string; units: string; persons: string; note: string }[];
  cards: UnitCardCfg[];
  /** override voor de titel boven de kaarten-grid */
  cardsTitle?: string;
  /** kolommen in cards-grid (default 3) */
  cardsCols?: 2 | 3;
  /** kaartstijl: 'unit' (kleine header-label) | 'combo' (grote pill met capaciteit, middelste highlight) */
  cardsStyle?: "unit" | "combo";
  idealFor?: string[];
  activities?: { icon: string; label: string }[];
  callout?: string;
  /** Optionele extra "Inbegrepen bij ..." pills-sectie */
  included?: { title: string; items: string[] };
  /** terug-link in seo-meta blok (optioneel — niet alle SEO-pagina's tonen het meta-blok) */
  parentNav?: { label: string; to: string };
  /** CTA-bar knop */
  ctaLabel: string;
  ctaTo: string;
}

const SEO: Record<string, SeoBucket> = {
  "groepsaccommodatie-20-personen": {
    parentBucket: "10-20",
    eyebrow: "Groepsaccommodatie Belgisch Limburg",
    title: "Groepsaccommodatie voor 20 personen in Belgisch Limburg",
    subtitle:
      "De ideale groepsaccommodatie in het hart van Nationaal Park Hoge Kempen · Oudsbergen",
    intro:
      "Op zoek naar een groepsverblijf voor 20 personen in Belgisch Limburg? Landgoed De Hoogmolen biedt complete vakantiewoningen die u flexibel kunt combineren — perfect voor families, vriendengroepen en bedrijfsuitjes in een eeuwenoud erfgoeddomein aan de Abeek.",
    recommended: [
      { name: "Watermolen", units: "1 vakantiewoning", persons: "17p", note: "Volledige vakantiewoning met 6+ slaapkamers" },
      { name: "+ Duplex Suite A6 (De Jutlander)", units: "+ 1 suite", persons: "+6p", note: "Groepsduplex met terras voor extra gasten" },
      { name: "Alternatief: Peerdermolen", units: "1 vakantiewoning", persons: "12p", note: "Kleinere woning + suites aanvullen" },
    ],
    cards: [
      {
        slug: "watermolen",
        capacityLabel: "17p",
        headerLabel: "Watermolen",
        ctaLabel: "Bekijk woning",
        ctaTo: "/overnachten/vakantiewoningen/watermolen",
        ctaVariant: "primary",
        body: "Vakantiewoning voor 17 personen — 5 slaapkamers, eigen tuin en open haard.",
      },
      {
        slug: "peerdermolen",
        capacityLabel: "12p",
        headerLabel: "Peerdermolen",
        ctaLabel: "Bekijk woning",
        ctaTo: "/overnachten/vakantiewoningen/peerdermolen",
        ctaVariant: "primary",
        body: "Statige vakantiewoning voor 12 personen — 5 slaapkamers met eigen badkamer.",
      },
      {
        slug: null,
        title: "Duplexsuites",
        gallerySlugs: ["de-fries", "de-fjord", "de-brabander", "de-draver", "de-shetlander", "de-jutlander"],
        capacityLabel: "1-6p",
        headerLabel: "Suites A1-A6",
        ctaLabel: "Aanvullen met suites",
        ctaTo: "/overnachten/suites-kamers/duplexsuites",
        ctaVariant: "outline",
        body: "Zes duplexsuites met terras — combineerbaar om de groepsgrootte aan te vullen.",
      },
    ],
    idealFor: [
      "Grote families",
      "Vriendengroepen",
      "Sportclubs",
      "Schoolreizen",
      "Bedrijfsuitjes",
      "Verjaardagsweekend",
    ],
    activities: [
      { icon: "🥾", label: "Wandelen" },
      { icon: "🚴", label: "Fietsen" },
      { icon: "🏄", label: "Terhills" },
      { icon: "⛷️", label: "Snow Valley" },
      { icon: "🎱", label: "Molenhuys" },
    ],
    callout:
      "Combineer met vergaderen voor een volledig bedrijfsevenement. Molenhuys gratis bij grotere formules.",
    parentNav: { label: "/groepsverblijf/10-20-personen/", to: "/groepsverblijf/10-20-personen" },
    ctaLabel: "Vraag groepsofferte aan",
    ctaTo: "/groepsverblijf/aanvragen",
  },
  "groepsaccommodatie-30-personen": {
    parentBucket: "20-30",
    eyebrow: "Groepsaccommodatie Belgisch Limburg",
    title: "Groepsaccommodatie voor 30 personen in Belgisch Limburg",
    subtitle: "Vakantie voor grotere groepen in Nationaal Park Hoge Kempen · Oudsbergen · Ellikom",
    intro:
      "Voor groepen van rond de 30 personen biedt Landgoed De Hoogmolen complete formules met exclusieve toegang tot het Molenhuys — een centrale ontspanningsruimte met bar, professionele keuken en spelvoorzieningen.",
    recommended: [
      { name: "Watermolen + Peerdermolen", units: "2 vakantiewoningen", persons: "29p", note: "Beide woningen samen = Volmolen formule" },
      { name: "Volmolen formule", units: "2 woningen", persons: "29p", note: "Kant-en-klare formule voor 29 personen" },
      { name: "+ extra suites toevoegen", units: "+ suites A1-A6", persons: "tot 35p", note: "Uitbreiden met duplexsuites" },
    ],
    cards: [
      {
        slug: "watermolen",
        capacityLabel: "17p",
        headerLabel: "Watermolen",
        ctaLabel: "Bekijk woning",
        ctaTo: "/overnachten/vakantiewoningen/watermolen",
        ctaVariant: "primary",
        body: "Vakantiewoning voor 17 personen — 5 slaapkamers, eigen tuin en open haard.",
      },
      {
        slug: "peerdermolen",
        capacityLabel: "12p",
        headerLabel: "Peerdermolen",
        ctaLabel: "Bekijk woning",
        ctaTo: "/overnachten/vakantiewoningen/peerdermolen",
        ctaVariant: "primary",
        body: "Statige vakantiewoning voor 12 personen — 5 slaapkamers met eigen badkamer.",
      },
      {
        slug: "volmolen",
        title: "Volmolen formule",
        capacityLabel: "29p",
        headerLabel: "Watermolen + Peerdermolen",
        ctaLabel: "Bekijk Volmolen",
        ctaTo: "/overnachten/vakantiewoningen/volmolen",
        ctaVariant: "outline",
        body: "Beide vakantiewoningen + Molenhuys voor 29 personen — kant-en-klare groepsformule.",
      },
    ],
    idealFor: ["Grote familiefeesten", "Sportclubs", "Bedrijfsretraites", "Jeugdbewegingen", "Klasreizen", "Teambuilding weekends"],
    included: {
      title: "Inbegrepen bij Volmolen formule",
      items: ["Watermolen (17p)", "Peerdermolen (12p)", "Molenhuys entertainment", "Gratis parking", "5-sterren domein"],
    },
    ctaLabel: "Vraag groepsofferte aan",
    ctaTo: "/groepsverblijf/aanvragen",
  },
  "groepsaccommodatie-40-personen": {
    parentBucket: "30-53",
    eyebrow: "Grote groepen · Exclusief domein",
    title: "Groepsaccommodatie voor 40+ personen in Belgisch Limburg",
    subtitle: "Grote vakantiegroepen tot 53 personen · exclusief domein · Nationaal Park Hoge Kempen",
    intro:
      "Voor groepen vanaf 40 personen tot 53 gasten boekt u het volledige landgoed exclusief — twee vakantiewoningen, zes duplexsuites, vijf kamers en het Molenhuys met vergaderfaciliteiten.",
    recommendedTitle: "Formules voor 40+ personen",
    cardsTitle: "Beschikbare formules",
    cardsCols: 2,
    recommended: [
      { name: "Volmolen Plus", units: "2 woningen + suites", persons: "37p", note: "Watermolen + Peerdermolen + extra suites A" },
      { name: "Exclusief landgoed", units: "Volledig domein", persons: "53p", note: "Alle woningen + alle suites + Molenhuys" },
    ],
    cards: [
      {
        slug: "volmolen-plus",
        title: "Volmolen Plus",
        capacityLabel: "37p",
        headerLabel: "Volmolen Plus",
        ctaLabel: "Bekijk formule",
        ctaTo: "/overnachten/vakantiewoningen/volmolen-plus",
        ctaVariant: "primary",
        body: "Watermolen + Peerdermolen + extra duplexsuites",
        features: ["Watermolen (17p)", "Peerdermolen (12p)", "Extra duplexsuites A", "Molenhuys entertainment"],
      },
      {
        slug: null,
        title: "Exclusief landgoed",
        gallerySlugs: ["landgoed-de-hoogmolen"],
        capacityLabel: "53p",
        headerLabel: "Exclusief domein",
        ctaLabel: "Maatwerkaanvraag",
        ctaTo: "/groepsverblijf/aanvragen",
        ctaVariant: "outline",
        body: "Volledig domein voor uw groep — privaat",
        features: ["Alle vakantiewoningen", "Alle duplexsuites A1-A6", "Alle kamers B1-B5", "Molenhuys entertainment", "Vergaderfaciliteiten"],
      },
    ],
    idealFor: ["Grote familiefeesten", "Bedrijfsevenementen", "Jubilea", "Sporttoernooien", "Meerdaagse trainingen", "Grote reünies"],
    callout: "Voor groepen van 40+ personen adviseren we altijd een persoonlijk gesprek. Offerte volledig op maat.",
    ctaLabel: "Vraag maatwerkaanvraag aan",
    ctaTo: "/groepsverblijf/aanvragen",
  },
  "flexibele-modules-8-tot-53-personen": {
    parentBucket: "10-20",
    eyebrow: "Flexibele groepsaccommodatie",
    title: "Flexibele modules van 8 tot 53 personen",
    subtitle: "Stel uw groepsverblijf modulair samen · elke groepsgrootte mogelijk · Belgisch Limburg",
    intro:
      "Bij Landgoed De Hoogmolen stelt u uw groepsverblijf zelf samen — combineer woningen, suites, kamers en het Molenhuys tot een formule op maat van 8 tot 53 gasten.",
    recommendedTitle: "Alle beschikbare modules",
    recommendedColumns: ["Module", "Type", "Personen", "Toelichting"],
    recommended: [
      { name: "Peerdermolen", units: "Vakantiewoning", persons: "12p", note: "Zelfstandige woning · volledig uitgerust" },
      { name: "Watermolen", units: "Vakantiewoning", persons: "17p", note: "Zelfstandige woning · aan de Abeek" },
      { name: "Duplex Suite A1-A4", units: "Duplexsuite", persons: "4p elk", note: "Junior duplexsuite met terras · 4 stuks" },
      { name: "Duplex Suite A5 (De Shetlander)", units: "Deluxe kamer", persons: "2p", note: "Deluxe kamer met terras" },
      { name: "Duplex Suite A6 (De Jutlander)", units: "Groepsduplex", persons: "6p", note: "Grootste suite · ideaal als aanvulling" },
      { name: "Kamer B1 & B2", units: "Deluxe kamer", persons: "2p elk", note: "Klassieke deluxe kamers op verdieping" },
      { name: "Familiekamer B3+B4", units: "Familiekamer", persons: "4p", note: "Tussendeur · 2 badkamers · 1e verdieping" },
      { name: "Suite B5", units: "Studio suite", persons: "4p", note: "Gelijkvloers · 2 slaapkamers" },
      { name: "Volledig domein", units: "Exclusief", persons: "53p", note: "Alles samen · privaat · incl. Molenhuys" },
    ],
    cardsTitle: "Populaire combinaties",
    cardsCols: 3,
    cardsStyle: "combo",
    cards: [
      {
        slug: null,
        title: "Kleine groepen",
        capacityLabel: "8-20p",
        headerLabel: "8-20p",
        body: "Peerdermolen of Watermolen + suites",
        ctaLabel: "Bekijk →",
        ctaTo: "/groepsverblijf/10-20-personen",
        ctaVariant: "primary",
      },
      {
        slug: null,
        title: "Middelgrote groepen",
        capacityLabel: "20-30p",
        headerLabel: "20-30p",
        body: "Volmolen formule (beide woningen)",
        ctaLabel: "Bekijk →",
        ctaTo: "/groepsverblijf/20-30-personen",
        ctaVariant: "primary",
      },
      {
        slug: null,
        title: "Grote groepen",
        capacityLabel: "30-53p",
        headerLabel: "30-53p",
        body: "Volmolen Plus of exclusief domein",
        ctaLabel: "Bekijk →",
        ctaTo: "/groepsverblijf/30-53-personen",
        ctaVariant: "primary",
      },
    ],
    callout: "Prijs op aanvraag. Hoe meer modules u combineert, hoe interessanter de prijs per persoon.",
    ctaLabel: "Stel uw formule samen",
    ctaTo: "/groepsverblijf/aanvragen",
  },
};

const GroepenSEO = () => {
  const { pathname } = useLocation();
  const slug = pathname.split("/").filter(Boolean)[1] ?? "";
  const data = SEO[slug];
  if (!data) return <Navigate to="/groepsverblijf" replace />;

  return (
    <Layout>
      <SubNav items={GROEPEN_SUBNAV} />

      {/* Donkere hero */}
      <section className="bg-gradient-to-br from-primary-deep via-primary-deep to-primary text-secondary">
        <div className="container-wide py-12 md:py-16">
          <div className="eyebrow text-secondary/70 mb-3 uppercase tracking-[0.18em]">
            {data.eyebrow}
          </div>
          <h1 className="font-display text-2xl md:text-4xl font-semibold leading-tight text-secondary mb-3">
            {data.title}
          </h1>
          <p className="text-sm md:text-base text-secondary/80">{data.subtitle}</p>
        </div>
      </section>

      {/* Intro-banner */}
      <section className="py-6 bg-background">
        <div className="container-wide">
          <div className="flex bg-secondary/50 border border-border">
            <div className="w-1.5 bg-primary shrink-0" />
            <p className="px-5 py-4 text-sm text-primary-deep/85 leading-relaxed">
              {data.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Aanbevolen samenstelling */}
      <section className="pb-6 bg-background">
        <div className="container-wide">
          <h2 className="font-display text-lg text-primary-deep mb-2">
            {data.recommendedTitle ?? `Aanbevolen samenstelling voor ${data.parentBucket} personen`}
          </h2>
          <div className="border-t border-border mb-3" />
          <div className="border border-border bg-secondary/40 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-accent/50">
                <tr className="text-left text-primary-deep">
                  {(data.recommendedColumns ?? ["Formule / module", "Units", "Personen", "Toelichting"]).map((col) => (
                    <th key={col} className="px-4 py-3 font-medium">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recommended.map((r, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="px-4 py-3 font-medium text-primary-deep">{r.name}</td>
                    <td className="px-4 py-3 text-primary-deep/85">{r.units}</td>
                    <td className="px-4 py-3 font-display text-primary">{r.persons}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Beschikbare eenheden — kaarten */}
      <section className="pb-6 bg-background">
        <div className="container-wide">
          <h2 className="font-display text-lg text-primary-deep mb-2">{data.cardsTitle ?? "Beschikbare eenheden"}</h2>
          <div className="border-t border-border mb-3" />
          <div className={`grid gap-4 ${data.cardsCols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
            {data.cards.map((c, i) => {
              const property = c.slug ? getProperty(c.slug) : null;
              const galleryLocationIds = galleryLocationIdsForSlugs(c.gallerySlugs ?? (c.slug ? [c.slug] : []));
              const displayName = property?.name ?? c.title ?? "";
              const isCombo = data.cardsStyle === "combo";
              const isMiddle = isCombo && i === 1;
              const headerClass = isCombo
                ? isMiddle
                  ? "bg-primary text-secondary"
                  : "bg-primary-deep text-secondary"
                : c.ctaVariant === "outline"
                  ? "bg-gradient-to-br from-primary-deep to-primary text-secondary/85"
                  : "bg-gradient-to-br from-accent/60 to-accent/30 text-primary-deep/70";
              return (
                <article
                  key={i}
                  className={`border border-border overflow-hidden flex flex-col ${isMiddle ? "bg-accent/40" : "bg-card"}`}
                >
                  <div className="relative">
                    <div
                      className={`flex items-center justify-center ${headerClass} ${
                        isCombo ? "py-6" : "aspect-[16/8]"
                      }`}
                    >
                      {galleryLocationIds.length > 0 && !isCombo ? (
                        <UnitGallerySlider
                          slug={`groepen-seo-${slug}-${i}`}
                          extraLocationIds={galleryLocationIds}
                          alt={displayName || c.headerLabel || c.title || "Groepsverblijf"}
                          placeholderLabel={c.headerLabel ?? c.title ?? "Groepsverblijf"}
                          aspectClass="aspect-[16/8]"
                        />
                      ) : null}
                      <span
                        className={
                          isCombo
                            ? "font-display text-2xl"
                            : "absolute inset-x-0 bottom-0 px-4 py-2 font-display italic text-base pointer-events-none"
                        }
                      >
                        {c.headerLabel}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    {!isCombo && (
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display text-lg text-primary-deep">{displayName}</h3>
                        {c.capacityLabel && (
                          <span className="text-[11px] bg-accent/60 text-primary-deep px-2 py-0.5 rounded-sm">
                            {c.capacityLabel}
                          </span>
                        )}
                      </div>
                    )}
                    {isCombo && (
                      <h3 className="font-display text-lg text-primary-deep mb-2">{displayName}</h3>
                    )}
                    {c.body && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {c.body}
                      </p>
                    )}
                    {c.features && c.features.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {c.features.map((f) => (
                          <span
                            key={f}
                            className="inline-flex items-center gap-1.5 text-xs text-primary-deep border border-accent bg-secondary/50 px-2.5 py-1 rounded-md"
                          >
                            <Check className="w-3 h-3 text-primary" /> {f}
                          </span>
                        ))}
                      </div>
                    )}
                    {isCombo ? (
                      <Link
                        to={c.ctaTo}
                        className="text-sm font-medium text-primary-deep underline underline-offset-4 decoration-primary hover:text-primary self-start"
                      >
                        {c.ctaLabel}
                      </Link>
                    ) : c.ctaVariant === "outline" ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary self-start"
                      >
                        <Link to={c.ctaTo}>{c.ctaLabel}</Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary hover:bg-primary-deep text-secondary self-start"
                      >
                        <Link to={c.ctaTo}>{c.ctaLabel}</Link>
                      </Button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ideaal voor — pills met vinkjes (optioneel) */}
      {data.idealFor && data.idealFor.length > 0 && (
        <section className="pb-6 bg-background">
          <div className="container-wide">
            <h2 className="font-display text-lg text-primary-deep mb-2">Ideaal voor</h2>
            <div className="border-t border-border mb-3" />
            <div className="flex flex-wrap gap-2">
              {data.idealFor.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-deep border border-accent bg-secondary/40 px-3 py-1.5 rounded-md"
                >
                  <Check className="w-3.5 h-3.5 text-primary" /> {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Inbegrepen — pills (optioneel) */}
      {data.included && (
        <section className="pb-6 bg-background">
          <div className="container-wide">
            <h2 className="font-display text-lg text-primary-deep mb-2">{data.included.title}</h2>
            <div className="border-t border-border mb-3" />
            <div className="flex flex-wrap gap-2">
              {data.included.items.map((label) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-sm text-primary-deep border border-accent bg-secondary/40 px-3 py-1.5 rounded-md"
                >
                  <Check className="w-3.5 h-3.5 text-primary" /> {label}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Activiteit-tegels (optioneel) */}
      {data.activities && data.activities.length > 0 && (
        <section className="pb-6 bg-background">
          <div className="container-wide">
            <h2 className="font-display text-lg text-primary-deep mb-2">Activiteiten voor uw groep</h2>
            <div className="border-t border-border mb-3" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {data.activities.map((a) => (
                <div
                  key={a.label}
                  className="border border-border bg-secondary/40 px-5 py-6 text-center flex flex-col items-center gap-2"
                >
                  <span className="text-2xl leading-none">{a.icon}</span>
                  <span className="text-sm font-medium text-primary-deep">{a.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cream callout (optioneel) */}
      {data.callout && (
        <section className="pb-6 bg-background">
          <div className="container-wide">
            <div className="border border-accent bg-accent/30 px-5 py-3 text-sm text-primary-deep">
              {data.callout}
            </div>
          </div>
        </section>
      )}

      {/* Donkere CTA-bar */}
      <section className="py-6 bg-primary-deep text-secondary">
        <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-secondary/85 max-w-2xl">
            Klaar om uw groepsverblijf te boeken? Vraag een offerte op maat — wij antwoorden
            binnen 24 uur.
          </p>
          <Button
            asChild
            className="bg-secondary text-primary-deep hover:bg-accent self-start md:self-auto"
          >
            <Link to={data.ctaTo}>{data.ctaLabel}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default GroepenSEO;
