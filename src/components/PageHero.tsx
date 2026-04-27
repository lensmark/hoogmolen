import { useLocation } from "react-router-dom";
import { resolveImageSrc } from "@/lib/imageSource";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableImage from "@/components/admin/EditableImage";
import EditableText from "@/components/admin/EditableText";
import logo from "@/assets/hoogmolen-logo.png";

const DEFAULT_HERO_EXTRA_IDS = [
  "hoogmolen-verblijf-peerdermolen",
  "hoogmolen-verblijf-watermolen",
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
  "hoogmolen-verblijf-suite-a5",
  "hoogmolen-verblijf-suite-a6",
  "hoogmolen-verblijf-peerdermolen-kamer-b1",
  "hoogmolen-verblijf-peerdermolen-kamer-b2",
  "hoogmolen-verblijf-peerdermolen-kamer-b3",
  "hoogmolen-verblijf-peerdermolen-kamer-b4",
  "hoogmolen-verblijf-peerdermolen-kamer-b5",
];

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** "compact" verkleint de verticale padding voor sub-pagina's met sticky tabs eronder. */
  size?: "default" | "compact";
  /**
   * Optioneel achtergrond-beeld (CF-ID of full URL, auto-detect).
   * Aanwezig → ken-burns achtergrond + leesbaarheids-overlay.
   * Leeg → dynamische gallery (heroSlug/heroExtraIds) of site-wide fallback.
   */
  heroImage?: string;
  /**
   * Optioneel: dynamische foto-achtergrond via UnitGallerySlider.
   * Wanneer geen `heroImage` aanwezig is en `heroSlug` of `heroExtraIds`
   * gezet zijn, toont de hero een sfeer-slider met overlay.
   */
  heroSlug?: string;
  heroExtraIds?: string[];
}

export const PageHero = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  size = "default",
  heroImage,
  heroSlug,
  heroExtraIds,
}: PageHeroProps) => {
  const { isAdminMode, getOverride } = useAdminMode();
  const location = useLocation();
  const heroOverride = getOverride(location.pathname, "hero");

  const padding =
    size === "compact"
      ? "pt-28 pb-10 md:pt-32 md:pb-12"
      : "pt-32 pb-16 md:pt-40 md:pb-24";

  // Prio: admin override > prop heroImage > dynamic gallery
  const resolvedSrc = heroOverride ?? (heroImage ? resolveImageSrc(heroImage) : null);
  const effectiveHeroSlug = heroSlug ?? "page-hero";
  const effectiveHeroExtraIds =
    heroExtraIds && heroExtraIds.length > 0 ? heroExtraIds : DEFAULT_HERO_EXTRA_IDS;
  const useDynamicGallery = !resolvedSrc && effectiveHeroExtraIds.length > 0;

  const content = (
    <section
      className={`relative bg-gradient-deep text-secondary ${padding} overflow-hidden`}
    >
      {/* Beeld-achtergrond (statisch of admin-override) — v4.22.1: lichtere overlay
          afgestemd op homepage/paardenlogies voor consistente helderheid. */}
      {resolvedSrc && (
        <>
          <div
            className="absolute inset-0 ken-burns bg-cover bg-center"
            style={{ backgroundImage: `url(${resolvedSrc})` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent"
            aria-hidden="true"
          />
        </>
      )}

      {/* Dynamische gallery-achtergrond — zelfde overlay-recept */}
      {useDynamicGallery && (
        <>
          <div className="absolute inset-0">
            <UnitGallerySlider
              slug={effectiveHeroSlug}
              extraLocationIds={effectiveHeroExtraIds}
              alt={title}
              placeholderLabel=""
              aspectClass="h-full"
            />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent pointer-events-none"
            aria-hidden="true"
          />
        </>
      )}

      {!resolvedSrc && !useDynamicGallery && (
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent))_0%,transparent_50%)]" />
      )}

      <div className={`relative container-wide ${align === "center" ? "text-center" : ""}`}>
        {eyebrow && (
          <EditableText
            sectionKey="hero.eyebrow"
            defaultText={eyebrow}
            as="div"
            singleLine
            className="eyebrow text-secondary/70 mb-3"
          />
        )}
        <EditableText
          sectionKey="hero.title"
          defaultText={title}
          as="h1"
          singleLine
          className="heading-display max-w-4xl mx-auto text-secondary drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
        />
        {subtitle && (
          <EditableText
            sectionKey="hero.subtitle"
            defaultText={subtitle}
            as="p"
            className="lead text-secondary/85 max-w-2xl mt-4 mx-auto drop-shadow-[0_1px_4px_rgba(0,0,0,0.25)]"
          />
        )}
      </div>

      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-none select-none z-[1]">
        <img
          src={logo}
          alt="Landgoed De Hoogmolen"
          className="h-10 md:h-14 lg:h-16 w-auto opacity-90 brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
          loading="lazy"
        />
      </div>
    </section>
  );

  if (isAdminMode) {
    return (
      <EditableImage sectionKey="hero" contextHint={location.pathname}>
        {content}
      </EditableImage>
    );
  }
  return content;
};
