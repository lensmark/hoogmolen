/**
 * PropertyDetail — slimme router-pagina.
 * Leest :slug uit URL → haalt Property uit propertyConfig.
 *
 * Template-keuze (volgens wireframes image-26 en image-27):
 *  - URL bevat /duplexsuites/  → TemplateDuplex (A-vleugel: A1-A6, ook A5)
 *  - URL bevat /kamers/        → TemplateRoom   (B-vleugel: B1-B5 + familiekamer)
 *  - URL bevat /vakantiewoningen/ → TemplateHouse
 *  - Anders → fallback op property.type
 */
import { useParams, useLocation, Navigate } from "react-router-dom";
import { getProperty } from "@/config/propertyConfig";
import { TemplateDuplex } from "@/components/property/TemplateDuplex";
import { TemplateRoom } from "@/components/property/TemplateRoom";
import { TemplateHouse } from "@/components/property/TemplateHouse";
import { TemplateHouseStrict } from "@/components/property/TemplateHouseStrict";
import { PropertySchema } from "@/components/PropertySchema";
import { SEO } from "@/components/SEO";

/** 6 woningen die de strikte wireframe-template (image-43) krijgen */
const STRICT_HOUSES = new Set([
  "peerdermolen",
  "watermolen",
  "peerdermolen-plus",
  "watermolen-plus",
  "volmolen",
  "volmolen-plus",
]);

const PropertyDetail = () => {
  const { slug = "" } = useParams();
  const { pathname } = useLocation();
  const property = getProperty(slug);

  if (!property) return <Navigate to="/overnachten" replace />;

  // URL-prefix overschrijft type, zodat A5 (type:"room") onder /duplexsuites/
  // toch de duplex-template krijgt — conform wireframe image-27.
  const renderTemplate = () => {
    if (pathname.includes("/duplexsuites/")) return <TemplateDuplex property={property} />;
    if (pathname.includes("/suites-kamers/kamers/")) return <TemplateRoom property={property} />;
    if (pathname.includes("/vakantiewoningen/")) {
      return STRICT_HOUSES.has(property.slug)
        ? <TemplateHouseStrict property={property} />
        : <TemplateHouse property={property} />;
    }
    switch (property.type) {
      case "duplex":
        return <TemplateDuplex property={property} />;
      case "room":
      case "suite":
        return <TemplateRoom property={property} />;
      case "house":
        return <TemplateHouse property={property} />;
      default:
        return <Navigate to="/overnachten" replace />;
    }
  };

  // Dynamische SEO — per-verblijf title + description, valt terug op SEO_MAP
  // wanneer route in seoConfig staat (bv. /overnachten/vakantiewoningen/watermolen).
  const seoTitle = `${property.name} — ${property.capacity}p verblijf in Limburg`;
  const seoDescription =
    property.summary?.[0] ??
    property.tagline ??
    `${property.name}: ${property.bedrooms} slaapkamers, ${property.bathrooms} badkamers voor max ${property.capacity} gasten op Landgoed De Hoogmolen in Oudsbergen.`;

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} type="product" />
      <PropertySchema property={property} />
      {renderTemplate()}
    </>
  );
};

export default PropertyDetail;
