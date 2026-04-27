/**
 * PropertySchema — per-property JSON-LD voor accommodatie-detailpagina's.
 *
 * Type-mapping (Google-regel: metadata = exact wat op de pagina staat):
 *  - type "house"  → Product (6 vakantiewoningen + Landgoed-formules)
 *    met Offer { lowPrice = startingPrice, priceCurrency "EUR",
 *    availability InStock }.
 *  - type "room" / "suite" / "duplex" → HotelRoom met
 *    occupancy + bed + makesOffer { Offer InStock }.
 *
 * AggregateRating standaard 4.9 / 142 reviews (Google Business).
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { Property } from "@/config/propertyConfig";
import { CONTACT } from "@/config/navigationConfig";

const SCRIPT_ID = "ld-json-property";

const PRODUCT_TYPES = new Set(["house"]);

interface Props {
  property: Property;
}

export const PropertySchema = ({ property }: Props) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `https://hoogmolen.be${pathname}`;
    const isProduct = PRODUCT_TYPES.has(property.type);

    const aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      reviewCount: "142",
    };

    const offerBase = {
      "@type": "Offer",
      url: property.bookingUrl,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "LodgingBusiness",
        name: CONTACT.name,
        "@id": "https://hoogmolen.be/#lodging",
      },
    };

    let payload: Record<string, unknown>;

    if (isProduct) {
      payload = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: property.name,
        description: property.summary?.[0] ?? property.tagline ?? property.name,
        url,
        brand: { "@type": "Brand", name: CONTACT.name },
        category: "Vakantiewoning",
        offers: {
          ...offerBase,
          "@type": "AggregateOffer",
          lowPrice: property.startingPrice,
          priceCurrency: "EUR",
          offerCount: 1,
          availability: "https://schema.org/InStock",
        },
        aggregateRating,
      };
    } else {
      payload = {
        "@context": "https://schema.org",
        "@type": "HotelRoom",
        name: property.name,
        description: property.summary?.[0] ?? property.tagline ?? property.name,
        url,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: property.capacity,
          unitCode: "C62",
        },
        numberOfRooms: property.bedrooms,
        bed: property.bedConfig
          ? { "@type": "BedDetails", typeOfBed: property.bedConfig }
          : undefined,
        amenityFeature: (property.amenities ?? []).map((a) => ({
          "@type": "LocationFeatureSpecification",
          name: a,
        })),
        makesOffer: {
          ...offerBase,
          price: property.startingPrice,
          priceCurrency: "EUR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: property.startingPrice,
            priceCurrency: "EUR",
            unitCode: "DAY",
          },
        },
        aggregateRating,
        containedInPlace: { "@id": "https://hoogmolen.be/#lodging" },
      };
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);

    return () => {
      // Bij unmount opruimen zodat detailpagina-schema niet blijft staan op niet-detailroutes.
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) existing.remove();
    };
  }, [pathname, property]);

  return null;
};
