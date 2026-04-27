/**
 * TemplateDuplex — detailpagina voor type "duplex" (A1–A4, A6).
 * Focus: split-level (woonkamer beneden, slaapkamer boven) + privéterras.
 */
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { FastFacts } from "@/components/FastFacts";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { PropertyHero } from "@/components/property/PropertyHero";
import { PropertyUSPGrid } from "@/components/property/PropertyUSPGrid";
import { PropertyPriceBar } from "@/components/property/PropertyPriceBar";
import { PropertyPhotoGrid } from "@/components/property/PropertyPhotoGrid";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyFooterNav } from "@/components/property/PropertyFooterNav";
import type { Property } from "@/config/propertyConfig";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Bed, Home, Trees, Tv } from "lucide-react";

const SUB = [
  { label: "Suites & kamers", to: "/overnachten/suites-kamers" },
  { label: "Duplexsuites A1-A6", to: "/overnachten/suites-kamers/duplexsuites", matchPrefix: true },
  { label: "Kamers B1-B5", to: "/overnachten/suites-kamers/kamers", matchPrefix: true },
];

export const TemplateDuplex = ({ property }: { property: Property }) => {
  const { hero, images } = usePropertyImages(property);
  return (
  <Layout>
    <SubNav items={SUB} />
    <PropertyHero property={property} heroImageOverride={hero} />
    <Breadcrumbs />
    <FastFacts />

    <PropertyUSPGrid
      items={[
        { icon: <Bed className="w-5 h-5 text-primary" />, value: `${property.capacity} personen`, label: "Personen" },
        { icon: <Home className="w-5 h-5 text-primary" />, value: "Duplexsuite met terras", label: "Ligging" },
        { icon: <Trees className="w-5 h-5 text-primary" />, value: "Eigen terras · slaapkamer boven", label: "Terras" },
        { icon: <Tv className="w-5 h-5 text-primary" />, value: "TV + WiFi", label: "Comfort" },
      ]}
    />

    <PropertyPriceBar property={property} />
    <PropertyPhotoGrid slug={property.slug} images={images} />
    <PropertyAmenities items={property.amenities ?? []} />

    {/* Kenmerk callout */}
    {property.highlights && property.highlights.length > 0 && (
      <section className="pb-6 bg-background">
        <div className="container-wide">
          <div className="border border-accent bg-secondary/30 px-5 py-3 text-sm text-primary-deep">
            <span className="font-medium">Kenmerk:</span>{" "}
            <span className="text-primary-deep/85">
              {property.highlights.join(" · ")}
            </span>
          </div>
        </div>
      </section>
    )}

    {/* Let-op vanafprijs */}
    <section className="pb-8 bg-background">
      <div className="container-wide">
        <div className="bg-accent/40 px-5 py-3 text-sm text-primary-deep">
          <span className="font-medium">Let op:</span> Vanafprijs: €{property.startingPrice}/nacht
        </div>
      </div>
    </section>

    {/* Indeling */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-2">Indeling</h2>
        <div className="border-t border-border mb-4" />
        {property.summary?.map((p, i) => (
          <p key={i} className="text-sm md:text-base text-primary-deep leading-relaxed mb-3 max-w-4xl">
            {p}
          </p>
        ))}
      </div>
    </section>

    <FAQAccordion context="kamer" />
    <PropertyFooterNav
      backHref="/overnachten/suites-kamers/duplexsuites"
      backLabel="Andere suites/kamers"
    />
    <AvailabilityBar />
    <StickyMobileCTA bookingUrl={property.bookingUrl} label={`Boek ${property.name}`} />
  </Layout>
  );
};
