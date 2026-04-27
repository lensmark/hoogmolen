/**
 * SEO — centrale per-route metadata-handler.
 *
 * Wordt gerenderd in `Layout`, dus actief op élke pagina. Op basis van de
 * route haalt hij `title` + `description` uit `seoConfig` (SEO_GEO §12.2)
 * en bouwt hij een `BreadcrumbList` JSON-LD op.
 *
 * Per-prop overrides (title/description/canonical/image) hebben voorrang —
 * handig voor dynamische detailpagina's.
 */
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getRouteSEO } from "@/config/seoConfig";
import { buildBreadcrumbs } from "@/config/breadcrumbConfig";
import { getPageName } from "@/config/siteContentConfig";

const ORIGIN = "https://hoogmolen.be";
const BRAND = "Hoogmolen";
const DEFAULT_OG = `${ORIGIN}/og-image.jpg`;

interface SEOProps {
  title?: string;
  description?: string;
  /** absolute URL of pad — standaard huidige route */
  canonical?: string;
  image?: string;
  /** "website" | "article" | "product" — default "website" */
  type?: string;
  /** zet noindex,nofollow */
  noIndex?: boolean;
}

const clip = (s: string, max: number) =>
  s.length <= max ? s : `${s.slice(0, max - 1).trimEnd()}…`;

const buildTitle = (raw: string) => {
  if (raw.includes("| Hoogmolen")) return clip(raw, 60);
  const composed = `${raw} | ${BRAND}`;
  return clip(composed, 60);
};

export const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_OG,
  type = "website",
  noIndex = false,
}: SEOProps) => {
  const { pathname } = useLocation();
  const route = getRouteSEO(pathname);
  const pageName = getPageName(pathname);

  const finalTitleRaw =
    title ?? route?.title ?? (pageName ? `${pageName}` : "Landgoed De Hoogmolen");
  const finalTitle = buildTitle(finalTitleRaw);

  const finalDescription = clip(
    description ??
      route?.description ??
      "Landgoed De Hoogmolen — exclusief erfgoeddomein in Oudsbergen (Limburg) voor 1 tot 53 gasten.",
    155,
  );

  const finalCanonical = canonical?.startsWith("http")
    ? canonical
    : `${ORIGIN}${canonical ?? pathname}`;

  const breadcrumbs = buildBreadcrumbs(pathname, ORIGIN);
  const breadcrumbLD = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={finalCanonical} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Landgoed De Hoogmolen" />
      <meta property="og:locale" content="nl_BE" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />

      {/* BreadcrumbList JSON-LD — geldig voor alle 77 routes */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbLD)}
      </script>
    </Helmet>
  );
};
