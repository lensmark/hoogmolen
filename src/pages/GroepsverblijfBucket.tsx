/**
 * GroepsverblijfBucket — sub-pagina per groepsgrootte (10-20 / 20-30 / 30-53).
 * Wireframe-getrouw per bucket; alle secties optioneel via BucketDef-flags.
 *
 *  - 10-20: titel, intro, 3 kaarten light, activiteiten-tegels + 1 SEO-link
 *  - 20-30: titel + "Middelgrote groepen", 2 kaarten (deep+light), CTA "Vraag offerte aan"
 *  - 30-53: titel + "Grote groepen", 2 kaarten beide deep (Volmolen Plus + Exclusief landgoed
 *           met "Maatwerkaanvraag"-CTA), 3 SEO-links, CTA "Offerte op maat"
 *
 * Tier 2-balk wordt globaal door <Header> gerenderd.
 */
import { useState } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { getProperty } from "@/config/propertyConfig";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableText from "@/components/admin/EditableText";
import MediaPicker from "@/components/admin/MediaPicker";
import { cfImage } from "@/config/cloudflareImagesConfig";
import { toast } from "@/hooks/use-toast";
import { galleryLocationIdsForSlugs } from "@/lib/locationId";
import { cn } from "@/lib/utils";

type CardTone = "deep" | "light";

interface CardOverride {
  /** custom titel als deze afwijkt van property.name (bv. "Exclusief landgoed") */
  displayName?: string;
  /** custom CTA-label per kaart (default "Bekijk") */
  ctaLabel?: string;
  /** custom CTA-link (default → /overnachten/vakantiewoningen/:slug) */
  ctaTo?: string;
  /** style van de CTA-knop (default "primary") */
  ctaVariant?: "primary" | "deep";
  /** label boven de kaart (italic in header) — overschrijft naam */
  headerLabel?: string;
}

interface BucketDef {
  title: string;
  subtitle?: string;
  intro: string;
  slugs: string[];
  cardTones?: CardTone[];
  cardOverrides?: Record<number, CardOverride>;
  showActivities?: boolean;
  /** 1+ SEO-landingspagina links */
  seoLinks?: { label: string; to: string }[];
  ctaLabel: string;
}

const BUCKETS: Record<string, BucketDef> = {
  "10-20": {
    title: "Groepsverblijf 10–20 personen",
    intro:
      "Drie complete vakantiewoningen voor intieme groepsweekenden — Peerdermolen (12p), Watermolen (17p) en Peerdermolen Plus (20p). Elk met privé-ingang, eigen tuin en alle voorzieningen.",
    slugs: ["peerdermolen", "watermolen", "peerdermolen-plus"],
    cardTones: ["light", "light", "light"],
    showActivities: true,
    seoLinks: [
      {
        label: "Groepsaccommodatie voor 20 personen in Belgisch Limburg",
        to: "/groepen/groepsaccommodatie-20-personen",
      },
    ],
    ctaLabel: "Groepsverblijf aanvragen",
  },
  "20-30": {
    title: "Groepsverblijf 20–30 personen",
    subtitle: "Middelgrote groepen",
    intro:
      "Twee gecombineerde formules met exclusieve toegang tot het Molenhuys — Watermolen Plus (25p) en Volmolen (29p). Perfect voor uitgebreide families of teams die privacy combineren met een centrale ontmoetingsruimte.",
    slugs: ["watermolen-plus", "volmolen"],
    cardTones: ["deep", "light"],
    ctaLabel: "Vraag offerte aan",
  },
  "30-53": {
    title: "Groepsverblijf 30–53 personen",
    subtitle: "Grote groepen",
    intro:
      "De grootste formules van het landgoed — Volmolen Plus (37p) en het volledige Landgoed De Hoogmolen (53p). Voor reünies, bruiloften en bedrijfsretraites op uitzonderlijke schaal.",
    slugs: ["volmolen-plus", "landgoed-de-hoogmolen"],
    cardTones: ["deep", "deep"],
    cardOverrides: {
      1: {
        displayName: "Exclusief landgoed",
        headerLabel: "Exclusief",
        ctaLabel: "Maatwerkaanvraag",
        ctaTo: "/groepsverblijf/aanvragen",
        ctaVariant: "deep",
      },
    },
    seoLinks: [
      {
        label: "Groepsaccommodatie voor 30 personen in Belgisch Limburg",
        to: "/groepen/groepsaccommodatie-30-personen",
      },
      {
        label: "Groepsaccommodatie voor 40+ personen in Belgisch Limburg",
        to: "/groepen/groepsaccommodatie-40-personen",
      },
      {
        label: "Flexibele modules van 8 tot 53 personen",
        to: "/groepen/flexibele-modules-8-tot-53-personen",
      },
    ],
    ctaLabel: "Offerte op maat",
  },
};

const ACTIVITIES = [
  { icon: "🌲", label: "Avontuur", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
  { icon: "🏎️", label: "Raceland", to: "/teambuildings/in-limburg" },
  { icon: "🥾", label: "Wandelen", to: "/activiteiten/wandelen" },
  { icon: "🚵", label: "Fietsen", to: "/activiteiten/fietsen" },
];

const GroepsverblijfBucket = () => {
  const { pathname } = useLocation();
  const bucket = pathname.includes("10-20")
    ? "10-20"
    : pathname.includes("20-30")
    ? "20-30"
    : pathname.includes("30-53")
    ? "30-53"
    : "";
  const def = BUCKETS[bucket];
  if (!def) return <Navigate to="/groepsverblijf" replace />;

  const properties = def.slugs
    .map((s) => getProperty(s))
    .filter((p): p is NonNullable<ReturnType<typeof getProperty>> => Boolean(p));

  return (
    <Layout>
      {/* Titel + optionele subtitel */}
      <section className="pt-8 pb-4 bg-background">
        <div className="container-wide">
          <h1 className="font-display text-2xl md:text-3xl text-primary-deep mb-1">
            {def.title}
          </h1>
          {def.subtitle && (
            <p className="text-sm text-primary mb-2">{def.subtitle}</p>
          )}
          <div className="border-t border-border" />
        </div>
      </section>

      {/* Intro-banner: cream met linker accent-streep */}
      <section className="pb-6 bg-background">
        <div className="container-wide">
          <div className="flex bg-secondary/50 border border-border">
            <div className="w-1.5 bg-primary shrink-0" />
            <p className="px-5 py-4 text-sm text-primary-deep/85 leading-relaxed">
              {def.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Woning-kaarten */}
      <section className="pb-6 bg-background">
        <div className="container-wide grid md:grid-cols-2 gap-4">
          {properties.map((p, i) => {
            const tone: CardTone = def.cardTones?.[i] ?? "light";
            const ov = def.cardOverrides?.[i] ?? {};
            const ctaTo = ov.ctaTo ?? `/overnachten/vakantiewoningen/${p.slug}`;
            return (
              <BucketCard
                key={`${p.slug}-${i}`}
                slug={p.slug}
                tone={tone}
                defaultDisplayName={ov.displayName ?? p.name}
                defaultHeaderLabel={ov.headerLabel ?? p.name}
                defaultTagline={p.tagline ?? ""}
                capacity={p.capacity}
                ctaTo={ctaTo}
                ctaLabel={ov.ctaLabel ?? "Bekijk"}
              />
            );
          })}
        </div>
      </section>

      {/* 4 activiteit-tegels — alleen 10-20 */}
      {def.showActivities && (
        <section className="pb-6 bg-background">
          <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-3">
            {ACTIVITIES.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="border border-border bg-secondary/40 hover:bg-secondary/70 transition-colors px-5 py-6 text-center flex flex-col items-center gap-2"
              >
                <span className="text-2xl leading-none">{a.icon}</span>
                <span className="text-sm font-medium text-primary-deep">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SEO-landingspagina banner — 1 of meerdere links */}
      {def.seoLinks && def.seoLinks.length > 0 && (
        <section className="pb-6 bg-background">
          <div className="container-wide">
            <div className="border-2 border-dashed border-primary/40 bg-secondary/30 p-5">
              <div className="eyebrow text-primary-deep/70 mb-3">
                SEO-landingspagina{def.seoLinks.length > 1 ? "s" : ""} — niet in menu, wel
                geïndexeerd door Google
              </div>
              <div className="flex flex-col gap-2">
                {def.seoLinks.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="inline-flex items-center gap-2 text-sm text-primary-deep border border-border bg-card px-4 py-2 hover:bg-secondary"
                  >
                    <span className="text-primary">→</span>
                    <span className="underline underline-offset-2">{s.label}</span>
                    <span className="text-muted-foreground text-xs ml-2">{s.to}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Donkere CTA-bar */}
      <section className="py-6 bg-primary-deep text-secondary">
        <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-secondary/85 max-w-2xl">
            Twijfelt u welke woning past bij uw groep? Vraag een offerte op maat aan — wij
            antwoorden binnen 24 uur.
          </p>
          <Button
            asChild
            className="bg-secondary text-primary-deep hover:bg-accent self-start md:self-auto"
          >
            <Link to="/groepsverblijf/aanvragen">{def.ctaLabel}</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

/**
 * BucketCard — full-clickable woning-kaart met admin-mode editing.
 *  • Normaal: hele <Link> wrap → klik = navigeer naar `ctaTo`.
 *  • Admin: navigatie geblokkeerd; titel/header/tagline inline editable;
 *    edit-overlay op header opent MediaPicker (image_overrides).
 */
interface BucketCardProps {
  slug: string;
  tone: CardTone;
  defaultDisplayName: string;
  defaultHeaderLabel: string;
  defaultTagline: string;
  capacity: number;
  ctaTo: string;
  ctaLabel: string;
}

const BucketCard = ({
  slug,
  tone,
  defaultDisplayName,
  defaultHeaderLabel,
  defaultTagline,
  capacity,
  ctaTo,
  ctaLabel,
}: BucketCardProps) => {
  const { isAdminMode, getOverride, saveOverride } = useAdminMode();
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);

  const baseKey = `bucket-card.${slug}`;
  const titleKey = `${baseKey}.title`;
  const headerKey = `${baseKey}.header`;
  const taglineKey = `${baseKey}.tagline`;
  const imageKey = `${baseKey}.image`;
  const path = location.pathname;
  const imageOverride = getOverride(path, imageKey);
  const galleryLocationIds = galleryLocationIdsForSlugs([slug]);

  const headerClass =
    tone === "deep"
      ? "bg-gradient-to-br from-primary-deep to-primary text-secondary/85"
      : "bg-gradient-to-br from-accent/60 to-accent/30 text-primary-deep/70";

  const cardWrap =
    "border border-border bg-card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-card hover:-translate-y-1";

  const headerSlot = imageOverride ? (
    <div
      className="aspect-[16/7] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageOverride})` }}
      aria-hidden
    />
  ) : (
    <div className="relative">
      <UnitGallerySlider
        slug={`${slug}-bucket-card`}
        extraLocationIds={galleryLocationIds}
        alt={defaultDisplayName}
        placeholderLabel={defaultDisplayName}
        aspectClass="aspect-[16/7]"
      />
      <div className={`absolute inset-x-0 bottom-0 px-4 py-2 ${headerClass} bg-opacity-80 pointer-events-none`}>
        <EditableText
          sectionKey={headerKey}
          defaultText={defaultHeaderLabel}
          as="span"
          singleLine
          className="font-display italic text-lg"
        />
      </div>
    </div>
  );

  const body = (
    <>
      {headerSlot}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <EditableText
            sectionKey={titleKey}
            defaultText={defaultDisplayName}
            as="h3"
            singleLine
            className="font-display text-xl text-primary-deep"
          />
          <span className="text-[11px] bg-accent/60 text-primary-deep px-2 py-0.5 rounded-sm">
            {capacity}p
          </span>
        </div>
        {defaultTagline && (
          <EditableText
            sectionKey={taglineKey}
            defaultText={defaultTagline}
            as="p"
            className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2"
          />
        )}
        <div className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
          {ctaLabel} <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </>
  );

  if (isAdminMode) {
    return (
      <article className={cn(cardWrap, "relative ring-1 ring-blue-400/40")}>
        <div className="relative group/img">
          {headerSlot}
          <div className="absolute inset-0 bg-blue-500/0 group-hover/img:bg-blue-500/25 transition-colors pointer-events-none" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpen(true);
            }}
            className="absolute top-2 right-2 inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-blue-700"
            title={`Wijzig foto — ${imageKey}`}
          >
            <Pencil className="w-3.5 h-3.5" /> Foto
          </button>
          <span className="absolute top-2 left-2 text-[10px] font-mono bg-blue-600/90 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/img:opacity-100 transition-opacity">
            {imageKey}
          </span>
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <EditableText
              sectionKey={titleKey}
              defaultText={defaultDisplayName}
              as="h3"
              singleLine
              className="font-display text-xl text-primary-deep flex-1"
            />
            <span className="text-[11px] bg-accent/60 text-primary-deep px-2 py-0.5 rounded-sm">
              {capacity}p
            </span>
          </div>
          {defaultTagline && (
            <EditableText
              sectionKey={taglineKey}
              defaultText={defaultTagline}
              as="p"
              className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2"
            />
          )}
          <div className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary opacity-60">
            {ctaLabel} <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <MediaPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          contextSlug={slug}
          onSelect={async (cfId, filename) => {
            const url = cfImage(cfId);
            const { error } = await saveOverride(path, imageKey, url);
            if (error) {
              toast({
                title: "Foto niet opgeslagen",
                description: error,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Foto bijgewerkt",
                description: `${imageKey} → ${filename}`,
              });
            }
          }}
        />
      </article>
    );
  }

  return (
    <Link to={ctaTo} className={cn(cardWrap, "group")}>
      {body}
    </Link>
  );
};

export default GroepsverblijfBucket;

