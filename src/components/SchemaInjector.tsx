/**
 * SchemaInjector — injecteert JSON-LD in <head> op basis van SITE_CONTENT_MAP.
 * Gebruikt schemaType + facts + faqs om een minimale, geldige Schema.org
 * markup te bouwen voor Google Rich Snippets.
 *
 * Geen externe deps (geen react-helmet) — direct DOM-manipulatie in useEffect.
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_CONTENT_MAP, getSchemaType } from "@/config/siteContentConfig";
import { CONTACT } from "@/config/navigationConfig";

const SCRIPT_ID = "ld-json-page";

export const SchemaInjector = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const data = SITE_CONTENT_MAP[pathname];
    const schemaType = getSchemaType(pathname);
    const pageName = data?.pageName ?? CONTACT.name;

    const base: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schemaType,
      name: pageName,
      url: `https://hoogmolen.be${pathname}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Hoogmolenweg 15",
        postalCode: "3670",
        addressLocality: "Oudsbergen (Ellikom)",
        addressCountry: "BE",
      },
      telephone: CONTACT.phone,
      email: CONTACT.email,
      // Triple Trust — geaggregeerde rating uit Airbnb/Booking/Google.
      // Gewogen gemiddelde van 4.97 (Airbnb, 571), 9.3/10 → 4.65 (Booking) en 4.9 (Google).
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        reviewCount: "571",
      },
    };

    if (data?.facts?.length) {
      base.amenityFeature = data.facts.map((f) => ({
        "@type": "LocationFeatureSpecification",
        name: f.label,
        value: f.value,
      }));
    }

    // Bouw losse FAQPage entry indien er pagina-specifieke FAQ's zijn
    const graph: Record<string, unknown>[] = [base];
    if (data?.faqs?.length) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        // Speakable — maakt FAQ's beschikbaar voor voice/AI-assistants
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".faq-question", ".faq-answer"],
        },
        mainEntity: data.faqs.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      });
    }

    // Article schema voor content/erfgoed-pagina's — kritiek voor GEO
    // (LLM's wegen author/datePublished mee bij citaties).
    const ARTICLE_PATHS = new Set([
      "/geschiedenis",
      "/geschiedenis/erfgoed",
      "/geschiedenis/natuur",
      "/geschiedenis/duurzaamheid",
      "/over-ons",
      "/team",
      "/ervaringen",
    ]);
    if (ARTICLE_PATHS.has(pathname)) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: pageName,
        url: `https://hoogmolen.be${pathname}`,
        author: { "@type": "Organization", name: CONTACT.name, "@id": "https://hoogmolen.be/#lodging" },
        publisher: { "@id": "https://hoogmolen.be/#lodging" },
        inLanguage: "nl-BE",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".lead", "p"],
        },
      });
    }

    const payload = graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);

    return () => {
      // Bij route-wissel laten staan; volgende effect overschrijft.
    };
  }, [pathname]);

  return null;
};
