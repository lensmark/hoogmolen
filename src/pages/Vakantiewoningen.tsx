/**
 * /overnachten/vakantiewoningen
 *
 * v3.7.0 — Universal Full-Card Clickability
 *  • UnitFeatureCard: hele kaart is één <Link>; "Boek nu" verplaatst naar
 *    detailpagina (kaart-CTA = "Bekijk →" als visuele wegwijzer).
 *  • Groepsformule-tegels: hele tegel klikbaar; "Meer info →" als hint.
 *  • Molenhuys highlight: hele kaart klikbaar.
 *  • Safety fallback: zonder image_override toont elke kaart de huidige
 *    hardcoded foto (UnitGallerySlider) of gradient — niets blijft leeg.
 *  • Admin-mode: navigatie gepauzeerd op groepsformule + Molenhuys-kaart
 *    via e.preventDefault() in de Link-handler; UnitGallerySlider blijft
 *    z'n eigen edit-flow gebruiken.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { getUnitBySlug, UNITS, Unit } from "@/config/unitsConfig";
import { Users, Bed, Bath, Sparkles, ArrowRight } from "lucide-react";
import { useAdminMode } from "@/contexts/AdminModeContext";

const peerdermolen = getUnitBySlug("peerdermolen")!;
const watermolen = getUnitBySlug("watermolen")!;

const GROUP_FORMULAS = ["volmolen", "volmolen-plus", "landgoed-de-hoogmolen"]
  .map((s) => UNITS.find((u) => u.slug === s)!)
  .filter(Boolean) as Unit[];

const Vakantiewoningen = () => (
  <Layout>
    {/* HERO */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-16 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Vakantiewoningen op De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Twee historische erfgoedwoningen — privé, exclusief, volledig ingericht
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* INTRO PLACEHOLDER */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-6 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Peerdermolen en Watermolen vormen samen het hart van het landgoed —
            twee zelfstandige vakantiewoningen, ieder met privé-tuin en overdekt
            terras, beide gehuld in eeuwenoud erfgoed.
          </p>
        </div>
      </div>
    </section>

    {/* TWEE WONINGEN GRID */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UnitFeatureCard unit={peerdermolen} />
          <UnitFeatureCard unit={watermolen} />
        </div>
      </div>
    </section>

    {/* CTA-BANNER NAAR GROEPEN */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 px-6 py-5">
          <p className="text-sm md:text-base text-primary-deep">
            <strong>Meer dan 17 personen?</strong>{" "}
            Bekijk onze{" "}
            <Link
              to="/groepsverblijf"
              className="underline underline-offset-2 hover:text-primary"
            >
              groepsverblijven tot 53 personen
            </Link>
            .
          </p>
        </div>
      </div>
    </section>

    {/* GROEPSFORMULES */}
    <section className="py-12 bg-background border-t border-border">
      <div className="container-wide">
        <div className="mb-8">
          <div className="eyebrow mb-2">Combineren</div>
          <h2 className="font-display text-2xl md:text-3xl text-primary-deep">
            Groepsformules — voor 20 tot 53 gasten
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mt-2">
            Combineer beide woningen met duplexsuites en het Molenhuys, of huur
            het volledige landgoed exclusief af.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GROUP_FORMULAS.map((u) => (
            <GroupFormulaCard key={u.id} unit={u} />
          ))}
        </div>
      </div>
    </section>

    {/* MOLENHUYS HIGHLIGHT */}
    <MolenhuysCard />

    <AvailabilityBar />
  </Layout>
);

/* ─────────── Subcomponents ─────────── */

/**
 * UnitFeatureCard — twee grote woning-tegels.
 * Hele kaart is klikbaar (<Link>) → /overnachten/vakantiewoningen/{slug}.
 * Boekingsknop verhuist naar de detailpagina (geen dubbele actie).
 * Admin-mode: navigatie wordt gepauzeerd zodat de UnitGallerySlider z'n
 * eigen MediaPicker-flow kan blijven gebruiken zonder per-ongelukse jump.
 */
const UnitFeatureCard = ({ unit }: { unit: Unit }) => {
  const { isAdminMode } = useAdminMode();

  const handleClick = (e: React.MouseEvent) => {
    if (isAdminMode) {
      e.preventDefault();
    }
  };

  return (
    <Link
      to={`/overnachten/vakantiewoningen/${unit.slug}`}
      onClick={handleClick}
      className="group border border-border bg-card flex flex-col overflow-hidden transition-all duration-300 hover:shadow-card hover:-translate-y-1"
    >
      <UnitGallerySlider
        slug={unit.slug}
        configImages={unit.galleryImages}
        alt={unit.name}
        placeholderLabel={unit.name}
      />
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h2 className="font-display text-2xl text-primary-deep">{unit.name}</h2>
          <span className="text-[11px] font-medium px-2 py-0.5 bg-accent/60 text-primary-deep rounded-full">
            {unit.capacity.max} personen
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {unit.description[0]}
        </p>
        <div className="flex items-center gap-4 text-xs text-primary-deep mb-5">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> tot {unit.capacity.max}
          </span>
          <span className="flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5" /> {unit.bedrooms} kamers
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5" /> {unit.bathrooms} badkamers
          </span>
        </div>
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">vanaf</div>
            <div className="font-display text-2xl text-primary-deep">
              €{unit.pricing.weekdayBase}
              <span className="text-[10px] text-muted-foreground font-body ml-1">/ nacht</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all">
            Bekijk {unit.name} <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

/**
 * GroupFormulaCard — drie tegels (Volmolen / Volmolen Plus / Landgoed).
 * Volledige tegel klikbaar; admin-mode pauzeert navigatie.
 */
const GroupFormulaCard = ({ unit }: { unit: Unit }) => {
  const { isAdminMode } = useAdminMode();

  const handleClick = (e: React.MouseEvent) => {
    if (isAdminMode) e.preventDefault();
  };

  return (
    <Link
      to={`/overnachten/vakantiewoningen/${unit.slug}`}
      onClick={handleClick}
      className="group border border-border bg-surface flex flex-col transition-all duration-300 hover:shadow-card hover:-translate-y-1"
    >
      <div className="bg-gradient-to-br from-primary to-primary-deep text-secondary px-6 py-7 text-center">
        <span className="font-display italic text-base">{unit.name}</span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-display text-lg text-primary-deep">
            {unit.shortName}
          </h3>
          <span className="text-[11px] font-medium px-2 py-0.5 bg-accent/60 text-primary-deep rounded-full">
            tot {unit.capacity.max}p
          </span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
          {unit.tagline}
        </p>
        <div className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all">
          Meer info <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
};

/**
 * MolenhuysCard — highlight-blok onderaan.
 * Hele kaart is een <Link> naar /overnachten/molenhuys.
 * Admin-mode pauzeert navigatie.
 */
const MolenhuysCard = () => {
  const { isAdminMode } = useAdminMode();
  const handleClick = (e: React.MouseEvent) => {
    if (isAdminMode) e.preventDefault();
  };

  return (
    <section className="py-12 bg-secondary/40 border-t border-border">
      <div className="container-wide">
        <Link
          to="/overnachten/molenhuys"
          onClick={handleClick}
          className="group block border border-border bg-card p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center transition-all duration-300 hover:shadow-card hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="eyebrow">Exclusieve toegang</span>
            </div>
            <h3 className="font-display text-2xl text-primary-deep mb-2">
              Het Molenhuys — uw eigen ontspanningsruimte
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Bij Plus-formules of boekingen van meerdere woningen krijgt u
              exclusieve toegang tot het Molenhuys: een professioneel uitgeruste
              keuken, selfservice bar met tap, ping-pong, darts en kicker.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all whitespace-nowrap">
            Ontdek het Molenhuys <ArrowRight className="w-4 h-4" />
          </span>
        </Link>
      </div>
    </section>
  );
};

export default Vakantiewoningen;
