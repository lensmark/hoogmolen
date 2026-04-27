/**
 * TemplateHouse — detailpagina voor type "house"
 * (Peerdermolen, Watermolen, Plus-formules, Volmolen, Landgoed).
 * Focus: groep, faciliteiten (privétuin, keuken, Molenhuys).
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
import { PropertyMolenhuys } from "@/components/property/PropertyMolenhuys";
import { PropertyFooterNav } from "@/components/property/PropertyFooterNav";
import type { Property } from "@/config/propertyConfig";
import { usePropertyImages } from "@/hooks/usePropertyImages";
import { Home, Bed, Bath, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SUB_GROUP = [
  { label: "Vakantiewoningen", to: "/overnachten/vakantiewoningen" },
  { label: "Suites & kamers", to: "/overnachten/suites-kamers", matchPrefix: true },
  { label: "Boekingsinformatie", to: "/overnachten/boekingsinformatie" },
];

export const TemplateHouse = ({ property }: { property: Property }) => {
  const { hero, images } = usePropertyImages(property);
  return (
  <Layout>
    <SubNav items={SUB_GROUP} />
    <PropertyHero property={property} heroImageOverride={hero} />
    <Breadcrumbs />
    <FastFacts />

    <PropertyUSPGrid
      items={[
        { icon: <Home className="w-5 h-5 text-primary" />, value: String(property.capacity), label: "Personen" },
        { icon: <Bed className="w-5 h-5 text-primary" />, value: String(property.bedrooms), label: "Slaapkamers" },
        { icon: <Bath className="w-5 h-5 text-primary" />, value: String(property.bathrooms), label: "Badkamers" },
        { icon: <MapPin className="w-5 h-5 text-primary" />, value: "Oudsbergen", label: "Locatie" },
      ]}
    />

    <PropertyPriceBar property={property} />
    <PropertyPhotoGrid slug={property.slug} images={images} />
    <PropertyAmenities items={property.amenities ?? []} />

    <section className="py-8 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-2">Over deze woning</h2>
        <div className="border-t border-border mb-4" />
        {property.summary?.map((p, i) => (
          <p key={i} className="text-sm md:text-base text-primary-deep leading-relaxed mb-3 max-w-4xl">
            {p}
          </p>
        ))}
      </div>
    </section>

    {property.hasMolenhuys && <PropertyMolenhuys />}

    {/* Cross-sell groepsverblijf — full-card clickable */}
    {property.capacity < 30 && (
      <section className="pb-8 bg-background">
        <div className="container-wide">
          <Link
            to="/groepsverblijf"
            aria-label="Bekijk groepsverblijf voor 10 tot 53 personen"
            className="group block border border-accent bg-accent/30 px-5 py-4 text-sm text-primary-deep transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
          >
            <div className="flex items-center justify-between gap-4">
              <span>
                Met een grotere groep? Bekijk groepsverblijf 10–53 personen.
              </span>
              <span className="inline-flex items-center gap-1 text-primary group-hover:gap-2 transition-all shrink-0">
                Ontdek <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>
    )}

    <FAQAccordion context="verblijf" />
    <PropertyFooterNav
      backHref="/overnachten/vakantiewoningen"
      backLabel="Andere vakantiewoningen"
    />
    <AvailabilityBar />
    <StickyMobileCTA bookingUrl={property.bookingUrl} label={`Boek ${property.name}`} />
  </Layout>
  );
};
