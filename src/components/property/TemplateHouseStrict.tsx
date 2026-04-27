/**
 * TemplateHouseStrict — strikte wireframe-versie (image-43) voor de 6 kern-vakantiewoningen:
 * Peerdermolen, Watermolen, Peerdermolen Plus, Watermolen Plus, Volmolen, Volmolen Plus.
 *
 * Volgorde EXACT zoals screenshot:
 *   Hero → USP-grid → PriceBar → PhotoGrid → Faciliteiten → FAQ
 *   → cross-sell banner (groepsverblijf) → donkere CTA-bar
 *
 * Geen "Over deze woning" tekstblok, geen aparte Molenhuys-sectie.
 */
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyUSPGrid } from "@/components/property/PropertyUSPGrid";
import { PropertyPriceBar } from "@/components/property/PropertyPriceBar";
import { PropertyPhotoGrid } from "@/components/property/PropertyPhotoGrid";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import type { Property } from "@/config/propertyConfig";
import { usePropertyImages } from "@/hooks/usePropertyImages";


const SUB_GROUP = [
  { label: "Vakantiewoningen", to: "/overnachten/vakantiewoningen" },
  { label: "Suites & kamers", to: "/overnachten/suites-kamers", matchPrefix: true },
  { label: "Boekingsinformatie", to: "/overnachten/boekingsinformatie" },
];

/** Bucket-mapping voor cross-sell banner */
const bucketFor = (cap: number) =>
  cap <= 20 ? "10-20" : cap <= 30 ? "20-30" : "30-53";

export const TemplateHouseStrict = ({ property }: { property: Property }) => {
  const bucket = bucketFor(property.capacity);
  const { hero, images } = usePropertyImages(property);
  return (
    <Layout>
      <SubNav items={SUB_GROUP} />
      <PropertyHero property={property} heroImageOverride={hero} hideMeta />
      <Breadcrumbs />

      <PropertyUSPGrid
        items={[
          { icon: <span aria-hidden>🏠</span>, value: String(property.capacity), label: "Personen" },
          {
            icon: <span aria-hidden>🛏</span>,
            value: property.bedConfig ?? `${property.bedrooms}+`,
            label: property.bedConfig ? "Bedden" : "Slaapkamers",
          },
          { icon: <span aria-hidden>🛁</span>, value: String(property.bathrooms), label: "Badkamers" },
          { icon: <span aria-hidden>📍</span>, value: "Oudsbergen", label: "Locatie" },
        ]}
      />

      <PropertyPriceBar property={property} />
      <PropertyPhotoGrid slug={property.slug} images={images} />
      <PropertyAmenities items={property.amenities ?? []} />

      <FAQAccordion context="verblijf" title="Veelgestelde vragen" />

      {/* Cross-sell groepsverblijf — bucket-specifieke link */}
      <section className="pb-6 bg-background">
        <div className="container-wide">
          <div className="border border-accent bg-accent/30 px-5 py-3 text-sm text-primary-deep">
            Met een grotere groep? Bekijk{" "}
            <a
              href={`/groepsverblijf/${bucket}-personen`}
              className="underline underline-offset-2 hover:text-primary"
            >
              groepsverblijf {bucket} personen
            </a>
            .
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
          <a
            href={property.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-primary-deep hover:bg-accent px-5 py-2.5 text-sm font-medium transition-colors"
          >
            Boek nu
          </a>
        </div>
      </section>

      <AvailabilityBar />
      <StickyMobileCTA bookingUrl={property.bookingUrl} label={`Boek ${property.name}`} />
    </Layout>
  );
};
