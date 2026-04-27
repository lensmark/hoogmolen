/**
 * Groepsverblijf — HUB-pagina (Tier 1 landingspagina).
 * Layout: groene hero + 3 grote kaarten (10-20 / 20-30 / 30-53 personen).
 * Tier 2-balk wordt globaal door <Header> gerenderd.
 *
 * v3.4.0 — Universal Full-Card Clickability:
 *  • Hele kaart is één <Link> (gasten) of edit-target (admins).
 *  • CTA-tekst zonder knop-styling, enkel tekst + ArrowRight.
 *  • Hover-lift (-translate-y-1) + shadow voor klikbaarheids-feedback.
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import MediaPicker from "@/components/admin/MediaPicker";
import { cfImage } from "@/config/cloudflareImagesConfig";
import { toast } from "@/hooks/use-toast";
import { galleryLocationIdsForSlugs } from "@/lib/locationId";
import { cn } from "@/lib/utils";

type BucketTone = "deep" | "olive";

interface BucketDef {
  range: string;
  title: string;
  description: string;
  to: string;
  cta: string;
  tone: BucketTone;
  gallerySlugs: string[];
}

const BUCKETS: BucketDef[] = [
  {
    range: "10-20",
    title: "10–20 personen",
    description:
      "Peerdermolen (12p), Watermolen (17p) of Peerdermolen Plus (20p) — intieme groepsweekenden in één compleet huis.",
    to: "/groepsverblijf/10-20-personen",
    cta: "Bekijk",
    tone: "deep",
    gallerySlugs: ["peerdermolen", "watermolen", "peerdermolen-plus"],
  },
  {
    range: "20-30",
    title: "20–30 personen",
    description:
      "Watermolen Plus (25p) of Volmolen (29p) — twee complete keukens en exclusieve toegang tot het Molenhuys.",
    to: "/groepsverblijf/20-30-personen",
    cta: "Bekijk",
    tone: "olive",
    gallerySlugs: ["watermolen-plus", "volmolen"],
  },
  {
    range: "30-53",
    title: "30–53 personen",
    description:
      "Volmolen Plus (37p) of het volledige Landgoed (53p) — voor reünies, bruiloften en bedrijfsretraites op maat.",
    to: "/groepsverblijf/aanvragen",
    cta: "Offerte",
    tone: "deep",
    gallerySlugs: ["volmolen-plus", "landgoed-de-hoogmolen"],
  },
];

const GROEPSVERBLIJF_HERO_IDS = [
  "hoogmolen-verblijf-peerdermolen",
  "hoogmolen-verblijf-watermolen",
  "hoogmolen-verblijf-molenhuys",
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
  "hoogmolen-verblijf-suite-a5",
  "hoogmolen-verblijf-suite-a6",
];

/**
 * HeroSection — eigen hero voor /groepsverblijf.
 * Toont admin-override foto (image_overrides @ sectionKey "hero") als die gezet is,
 * anders de dynamische sfeer-gallery. Tekst is inline editable via EditableText.
 */
const HeroSection = () => {
  const { getOverride } = useAdminMode();
  const location = useLocation();
  const heroOverride = getOverride(location.pathname, "hero");

  return (
    <section className="relative bg-gradient-to-br from-primary-deep via-primary-deep to-primary text-secondary overflow-hidden">
      {heroOverride ? (
        <>
          <div
            className="absolute inset-0 ken-burns bg-cover bg-center"
            style={{ backgroundImage: `url(${heroOverride})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-primary-deep/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div className="absolute inset-0">
            <UnitGallerySlider
              slug="groepsverblijf-hero"
              extraLocationIds={GROEPSVERBLIJF_HERO_IDS}
              aspectClass="h-full"
              alt="Groepsverblijf op Landgoed De Hoogmolen"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}
      <div className="absolute top-3 right-4 text-[11px] tracking-wide text-secondary/70 border border-secondary/30 rounded-sm px-2 py-1 z-10">
        {heroOverride ? "Hero-foto actief" : "Drone"}
      </div>
      <div className="container-wide py-16 md:py-24 relative z-10">
        <EditableText
          sectionKey="hero.title"
          defaultText="Groepsverblijf in Limburg voor 8 tot 53 personen"
          as="h1"
          singleLine
          className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        />
        <EditableText
          sectionKey="hero.subtitle"
          defaultText="Flexibele modules"
          as="p"
          singleLine
          className="text-sm md:text-base text-secondary/80 mb-6 drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
        />
        <div className="flex flex-wrap gap-3">
          <Button asChild className="bg-primary hover:bg-secondary hover:text-primary-deep text-secondary">
            <a href="#groepsgroottes">Kies groepsgrootte</a>
          </Button>
          <Button asChild className="bg-secondary text-primary-deep hover:bg-accent">
            <Link to="/groepsverblijf/aanvragen">Vraag offerte aan</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const Groepsverblijf = () => (
  <Layout>
    {/* Hero — bewerkbaar via Visual Editor (foto + tekst) */}
    <EditableImage sectionKey="hero" contextHint="/groepsverblijf">
      <HeroSection />
    </EditableImage>

    <Breadcrumbs />

    {/* 3 hub-kaarten — full-clickable */}
    <section id="groepsgroottes" className="py-10 bg-background">
      <div className="container-wide grid md:grid-cols-3 gap-4">
        {BUCKETS.map((b) => (
          <HubBucketCard key={b.range} bucket={b} />
        ))}
      </div>
    </section>

    {/* Bottom dark CTA-bar */}
    <section className="py-6 bg-primary-deep text-secondary">
      <div className="container-wide flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-sm text-secondary/85 max-w-2xl">
          Niet zeker welke formule past? Vertel ons over uw groep, datum en wensen — wij stellen
          binnen 24 uur een passend voorstel op.
        </p>
        <Button asChild className="bg-secondary text-primary-deep hover:bg-accent">
          <Link to="/groepsverblijf/aanvragen">Groepsverblijf aanvragen</Link>
        </Button>
      </div>
    </section>

    <FAQAccordion context="groepsverblijf" title="Veelgestelde vragen over groepsverblijf" />
  </Layout>
);

/* ─────────────────────────────────────────────────────────────
 * HubBucketCard — volledig klikbare hub-tegel met admin-editing.
 *  • Gasten: hele kaart is één <Link to={bucket.to}>.
 *  • Admin:  navigatie geblokkeerd; titel/beschrijving editable;
 *            header-zone opent MediaPicker (image_overrides).
 * ───────────────────────────────────────────────────────────── */
const HubBucketCard = ({ bucket }: { bucket: BucketDef }) => {
  const { isAdminMode, getOverride, saveOverride } = useAdminMode();
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);

  const baseKey = `hub-bucket.${bucket.range}`;
  const titleKey = `${baseKey}.title`;
  const descKey = `${baseKey}.description`;
  const imageKey = `${baseKey}.image`;
  const path = location.pathname;
  const imageOverride = getOverride(path, imageKey);
  const galleryLocationIds = galleryLocationIdsForSlugs(bucket.gallerySlugs);

  const headerToneClass =
    bucket.tone === "deep" ? "bg-primary-deep text-secondary" : "bg-primary text-secondary";

  const cardWrap =
    "group border border-border bg-card overflow-hidden flex flex-col transition-all duration-300 hover:shadow-card hover:-translate-y-1";

  const headerSlot = imageOverride ? (
    <div
      className="aspect-[16/7] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageOverride})` }}
      aria-hidden
    />
  ) : (
    <div className="relative">
      <UnitGallerySlider
        slug={`groepsverblijf-${bucket.range}`}
        extraLocationIds={galleryLocationIds}
        alt={bucket.title}
        placeholderLabel={bucket.title}
        aspectClass="aspect-[16/7]"
      />
      <div className={`absolute inset-x-0 bottom-0 px-6 py-3 text-center font-display text-2xl ${headerToneClass} pointer-events-none`}>
        {bucket.range}
      </div>
    </div>
  );

  const body = (
    <>
      {headerSlot}
      <div className="p-5 flex-1 flex flex-col">
        <EditableText
          sectionKey={titleKey}
          defaultText={bucket.title}
          as="h3"
          singleLine
          className="font-display text-base text-primary-deep mb-2"
        />
        <EditableText
          sectionKey={descKey}
          defaultText={bucket.description}
          as="p"
          className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1"
        />
        <div className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all">
          {bucket.cta} <ArrowRight className="w-3.5 h-3.5" />
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
          <EditableText
            sectionKey={titleKey}
            defaultText={bucket.title}
            as="h3"
            singleLine
            className="font-display text-base text-primary-deep mb-2"
          />
          <EditableText
            sectionKey={descKey}
            defaultText={bucket.description}
            as="p"
            className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1"
          />
          <div className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary opacity-60">
            {bucket.cta} <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        <MediaPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          contextSlug={bucket.range}
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
    <Link to={bucket.to} className={cardWrap}>
      {body}
    </Link>
  );
};

export default Groepsverblijf;
