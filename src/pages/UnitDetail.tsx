import { useParams, Link, Navigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { getUnitBySlug, type Unit } from "@/config/unitsConfig";
import { resolveImageSrc } from "@/lib/imageSource";
import { useUnitGallery } from "@/hooks/useUnitGallery";
import { locationIdsForSlug } from "@/lib/locationId";
import { getExtraLocationIds } from "@/config/unitCompositionConfig";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableImage from "@/components/admin/EditableImage";
import { Users, Bed, Bath, Check, ArrowRight, MapPin } from "lucide-react";

const heroBg: Record<Unit["iconHint"], string> = {
  house: "bg-gradient-soft",
  water: "bg-gradient-deep",
  estate: "bg-gradient-hero",
  suite: "bg-gradient-soft",
  room: "bg-secondary",
  horse: "bg-gradient-soft",
};

const UnitDetail = () => {
  const { slug, suite } = useParams();
  const location = useLocation();
  const { isAdminMode, getOverride } = useAdminMode();
  const lookup = suite ? `duplexsuite/${suite}` : slug ?? "";
  const unit = getUnitBySlug(lookup);

  if (!unit) return <Navigate to="/overnachten" replace />;

  const locIds = locationIdsForSlug(unit.slug);
  const { images: galleryImages } = useUnitGallery({
    locationId: locIds.primary,
    parentLocationId: locIds.parent,
    extraLocationIds: getExtraLocationIds(unit.slug),
    configImages: unit.galleryImages,
  });
  // Prio: admin override (image_overrides) > unit.heroImage > eerste gallery-foto
  const heroOverride = getOverride(location.pathname, "hero");
  const fallbackHero = unit.heroImage ?? galleryImages[0];
  const heroSrc = heroOverride ?? (fallbackHero ? resolveImageSrc(fallbackHero) : null);

  const seoTitle = `${unit.name} — ${unit.capacity.min}-${unit.capacity.max}p in Oudsbergen`;
  const seoDescription =
    unit.tagline ??
    unit.description?.[0] ??
    `${unit.name}: ${unit.bedrooms} slaapkamers, ${unit.bathrooms} badkamers voor ${unit.capacity.min}-${unit.capacity.max} gasten op Landgoed De Hoogmolen.`;

  const heroSection = (
    <section className="relative min-h-[70vh] flex items-end overflow-hidden">
      {heroSrc ? (
        <div
          className="absolute inset-0 ken-burns bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSrc})` }}
          aria-hidden="true"
        />
      ) : (
        <div className={`absolute inset-0 ${heroBg[unit.iconHint]} ken-burns`} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/60 via-primary-deep/20 to-transparent" />
      <div className="relative container-wide pb-12 md:pb-20 pt-32 text-secondary">
        <div className="text-[11px] uppercase tracking-[0.2em] text-secondary/70 mb-3">{unit.category}</div>
        <h1 className="heading-display text-secondary mb-4 max-w-3xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">{unit.name}</h1>
        <p className="lead text-secondary/85 max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]">{unit.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 bg-secondary/15 backdrop-blur border border-secondary/20 px-3 py-1.5 rounded-full text-xs"><Users className="w-3.5 h-3.5" /> {unit.capacity.min}–{unit.capacity.max} gasten</span>
          <span className="inline-flex items-center gap-1.5 bg-secondary/15 backdrop-blur border border-secondary/20 px-3 py-1.5 rounded-full text-xs"><Bed className="w-3.5 h-3.5" /> {unit.bedrooms} slaapkamers</span>
          <span className="inline-flex items-center gap-1.5 bg-secondary/15 backdrop-blur border border-secondary/20 px-3 py-1.5 rounded-full text-xs"><Bath className="w-3.5 h-3.5" /> {unit.bathrooms} badkamers</span>
        </div>
      </div>
    </section>
  );

  return (
    <Layout transparentHeader>
      <SEO title={seoTitle} description={seoDescription} type="product" />
      {/* HERO */}
      {isAdminMode ? (
        <EditableImage sectionKey="hero" contextHint={unit.slug}>
          {heroSection}
        </EditableImage>
      ) : (
        heroSection
      )}

      <Breadcrumbs />

      {/* CONTENT */}
      <section className="py-16 md:py-24">
        <div className="container-wide grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="space-y-5">
              <div className="eyebrow">Het verblijf</div>
              {unit.description.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed text-base">{p}</p>
              ))}
            </div>

            <div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-6">Slaapindeling</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {unit.beds.map((b, i) => (
                  <div key={i} className="surface-card p-4">
                    <div className="font-medium text-primary-deep text-sm">{b.room}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.description}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-6">Faciliteiten</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {unit.amenities.map((a) => (
                  <div key={a} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" /> {a}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-6">Hoogtepunten</h2>
              <ul className="space-y-2">
                {unit.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-foreground">
                    <span className="text-primary mt-1">◆</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* BOOKING ASIDE */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 surface-card p-6 space-y-5">
              <div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">vanaf</div>
                <div className="font-display text-4xl text-primary-deep">€{unit.pricing.weekdayBase}</div>
                <div className="text-xs text-muted-foreground">per nacht (weekdag, basis {unit.pricing.baseOccupancy} pers.)</div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-secondary/40 rounded-md p-3">
                  <div className="text-muted-foreground">Weekend</div>
                  <div className="font-medium text-primary-deep">€{unit.pricing.weekendBase}</div>
                </div>
                {unit.pricing.weekBase && (
                  <div className="bg-secondary/40 rounded-md p-3">
                    <div className="text-muted-foreground">Week</div>
                    <div className="font-medium text-primary-deep">€{unit.pricing.weekBase}</div>
                  </div>
                )}
                <div className="bg-secondary/40 rounded-md p-3">
                  <div className="text-muted-foreground">Extra pers.</div>
                  <div className="font-medium text-primary-deep">€{unit.pricing.extraPerPerson}</div>
                </div>
                <div className="bg-secondary/40 rounded-md p-3">
                  <div className="text-muted-foreground">Schoonmaak</div>
                  <div className="font-medium text-primary-deep">€{unit.pricing.cleaningFee}</div>
                </div>
              </div>
              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary-deep">
                <a href={unit.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Boek nu <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full border-primary-deep text-primary-deep">
                <Link to="/contact">Stel een vraag</Link>
              </Button>
              <div className="pt-3 border-t border-border text-xs text-muted-foreground flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary" />
                Hoogmolenweg 15, 3670 Oudsbergen
              </div>
            </div>
          </aside>
        </div>
      </section>

      <FAQAccordion context={unit.capacity.max >= 12 ? "groepsverblijf" : "kamer"} title="Veelgestelde vragen" />
      <StickyMobileCTA bookingUrl={unit.bookingUrl} label={`Boek ${unit.shortName}`} />
    </Layout>
  );
};

export default UnitDetail;
