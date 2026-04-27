/**
 * GlobalSchema — globale JSON-LD (LodgingBusiness + WebSite met SearchAction).
 * Wordt één keer in <head> geïnjecteerd en blijft staan ongeacht route.
 *
 * - LodgingBusiness: officiële NAP-data + geo-coördinaten + sameAs (Facebook,
 *   Instagram) → maximale GEO/lokale autoriteit.
 * - WebSite + SearchAction: koppelt interne zoek (Google Custom Search-style
 *   target) zodat Google een sitelinks-searchbox kan tonen.
 */
import { useEffect } from "react";
import { CONTACT } from "@/config/navigationConfig";

const SCRIPT_ID = "ld-json-global";

const SOCIAL = {
  facebook: "https://www.facebook.com/landgoeddehoogmolen",
  instagram: "https://www.instagram.com/landgoed_de_hoogmolen/",
  // Externe autoriteit-bronnen — kritiek voor GEO entity-resolutie
  // (LLM's volgen deze refs om de entiteit te valideren).
  google: "https://www.google.com/maps/place/?q=place_id:Landgoed+De+Hoogmolen",
  airbnb: "https://www.airbnb.be/users/show/landgoed-de-hoogmolen",
  booking: "https://www.booking.com/hotel/be/landgoed-de-hoogmolen.html",
  tripadvisor: "https://www.tripadvisor.com/Hotel_Review-Landgoed-De-Hoogmolen.html",
};

// Entity-knowledge — helpt LLM's de plaats van De Hoogmolen
// in een bredere kennis-graph te positioneren.
const KNOWS_ABOUT = [
  "Vakantiewoningen Limburg",
  "Groepsverblijf België",
  "Vergaderlocatie Limburg",
  "Teambuilding Limburg",
  "Watermolen erfgoed",
  "Nationaal Park Hoge Kempen",
  "Bosland",
  "Paardenlogies",
  "Fietsen door het Water Bokrijk",
  "Fietsen door de Bomen Pijnven",
];

// Coördinaten Hoogmolenweg 15, 3670 Oudsbergen (Ellikom) via Google Maps.
const GEO = { latitude: 51.1632, longitude: 5.5402 };

const SITE_URL = "https://hoogmolen.be";

export const GlobalSchema = () => {
  useEffect(() => {
    const lodging = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "@id": `${SITE_URL}/#lodging`,
      name: CONTACT.name,
      url: SITE_URL,
      telephone: CONTACT.phone,
      email: CONTACT.email,
      image: `${SITE_URL}/og-image.jpg`,
      priceRange: "€€",
      checkinTime: "15:00",
      checkoutTime: "10:00",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hoogmolenweg 15",
        postalCode: "3670",
        addressLocality: "Oudsbergen",
        addressRegion: "Limburg",
        addressCountry: "BE",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: GEO.latitude,
        longitude: GEO.longitude,
      },
      hasMap: `https://www.google.com/maps/search/?api=1&query=${GEO.latitude},${GEO.longitude}`,
      sameAs: [
        SOCIAL.facebook,
        SOCIAL.instagram,
        SOCIAL.google,
        SOCIAL.airbnb,
        SOCIAL.booking,
        SOCIAL.tripadvisor,
      ],
      knowsAbout: KNOWS_ABOUT,
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Limburg, België",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "571",
      },
    };

    const website = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: CONTACT.name,
      publisher: { "@id": `${SITE_URL}/#lodging` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/zoeken?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };

    const payload = {
      "@context": "https://schema.org",
      "@graph": [lodging, website],
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);
  }, []);

  return null;
};
