/**
 * PropertyHero — uniforme hero voor alle 17 detailpagina's.
 *
 * Achtergrond-prioriteit:
 *  1. Admin override (image_overrides @ sectionKey="hero") — bestaand
 *  2. property.heroImage (CF-ID of full URL) — nieuw v3.1.0
 *  3. Olijfgroene gradient — fallback (huidig gedrag, geen breaking change)
 *
 * Beeld-achtergronden krijgen een ken-burns animatie en een donkere
 * gradient-overlay (`from-primary-deep/80 to-transparent`) voor leesbaarheid
 * van de witte tekst.
 *
 * Admin-mode: rendert binnen EditableImage zodat de hero-foto vervangbaar is.
 */
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import type { Property } from "@/config/propertyConfig";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableImage from "@/components/admin/EditableImage";
import EditableText from "@/components/admin/EditableText";
import { resolveImageSrc } from "@/lib/imageSource";
import logo from "@/assets/hoogmolen-logo.png";

interface Props {
  property: Property;
  /** extra context labels achter capaciteit (bv. "Junior duplexsuite · €150/nacht · score 4.15") */
  metaSuffix?: string;
  /** strikte wireframe-modus: verberg meta-line onder H1 (image-45) */
  hideMeta?: boolean;
  /**
   * Resolved hero-bron (CF-ID of URL) van buitenaf.
   * Wordt gebruikt als property.heroImage NIET expliciet is gezet, zodat
   * de template z'n auto-matched eerste gallery-foto kan doorsturen.
   * Admin-override blijft hoogste prioriteit.
   */
  heroImageOverride?: string;
}

export const PropertyHero = ({ property, metaSuffix, hideMeta = false, heroImageOverride }: Props) => {
  const { isAdminMode, getOverride } = useAdminMode();
  const location = useLocation();
  const heroOverride = getOverride(location.pathname, "hero");

  // Prio: admin override > property.heroImage > heroImageOverride (auto-match) > geen
  const fallbackSrc = property.heroImage ?? heroImageOverride;
  const resolvedHeroSrc =
    heroOverride ?? (fallbackSrc ? resolveImageSrc(fallbackSrc) : null);

  const metaParts = [
    `${property.capacity} ${property.capacity === 1 ? "persoon" : "personen"}`,
    property.location,
    ...(property.highlights ?? []).slice(0, 2),
    metaSuffix,
  ].filter(Boolean);

  const content = (
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      {/* v4.17.9 — LCP boost: preload de hero-image zodat de browser-preload-scanner
          'm direct kan ophalen, parallel met HTML-parse. CSS-bg is anders pas
          ontdekt na CSSOM-build → vertraagt LCP met ~500-1000ms. */}
      {resolvedHeroSrc && (
        <Helmet>
          {/* @ts-expect-error — fetchpriority is a valid HTML attribute on <link> */}
          <link rel="preload" as="image" href={resolvedHeroSrc} fetchpriority="high" />
        </Helmet>
      )}
      {/* Achtergrond-laag: ken-burns image (indien gezet) — v4.22.1:
          overlay-recept gelijkgetrokken met homepage/paardenlogies voor
          consistent heldere hero-foto's site-wide. */}
      {resolvedHeroSrc && (
        <>
          <div
            className="absolute inset-0 ken-burns bg-cover bg-center"
            style={{ backgroundImage: `url(${resolvedHeroSrc})` }}
            aria-hidden="true"
          />
          {/* Verticale overlay — donker onder, transparant boven */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent"
            aria-hidden="true"
          />
          {/* Horizontale overlay — extra leesbaarheid links zonder hele beeld te verduisteren */}
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent"
            aria-hidden="true"
          />
        </>
      )}

      {/* Foto-hint rechtsboven (admin/visueel anker) */}
      <div className="absolute top-3 right-4 z-10 text-[11px] tracking-wide text-secondary/80 border border-secondary/30 rounded-sm px-2 py-1 bg-primary-deep/30 backdrop-blur-sm">
        {resolvedHeroSrc ? "Hero-foto actief" : "Foto exterieur · interieur · terras"}
      </div>

      <div className="relative container-wide py-16 md:py-20 z-[1]">
        <EditableText
          sectionKey="hero.title"
          defaultText={
            property.type === "house"
              ? `${property.name} — vakantiewoning voor ${property.capacity} personen`
              : property.capacity > 1
                ? `${property.name} — ${property.capacity} personen`
                : property.name
          }
          as="h1"
          singleLine
          className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        />
        {!hideMeta && (
          <EditableText
            sectionKey="hero.meta"
            defaultText={metaParts.join(" · ")}
            as="p"
            singleLine
            className="text-sm md:text-base text-secondary/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
          />
        )}
      </div>

      {/* Brand-logo rechter onderhoek */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 pointer-events-none select-none z-[1]">
        <img
          src={logo}
          alt="Landgoed De Hoogmolen — Anno 1500"
          className="h-10 md:h-16 lg:h-20 w-auto opacity-90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] brightness-0 invert"
          loading="lazy"
        />
      </div>
    </section>
  );

  if (isAdminMode) {
    return (
      <EditableImage sectionKey="hero" contextHint={property.slug}>
        {content}
      </EditableImage>
    );
  }
  return content;
};
