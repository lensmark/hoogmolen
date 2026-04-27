/**
 * UnitGallerySlider — UnitSlider-wrapper die zelf de juiste image-bron
 * resolveert via longest-prefix match in image_library, met config-override
 * en parent-fallback.
 *
 * Houdt overzichtspagina's (DuplexsuitesOverview, KamersOverview,
 * Vakantiewoningen) idiomatisch: één component per kaart, automatische
 * image-binding zonder per-kaart hooks in de pagina-loop.
 *
 * v3.x — Force recompute wanneer DB-cache van `unit_compositions` binnenkomt:
 *   gebruikt `useCompositionCacheVersion` als render-trigger zodat slugs
 *   zoals `volmolen` / `watermolen-plus` direct hun extra modules krijgen
 *   zodra de DB-fetch klaar is (geen page reload nodig).
 *
 * Diagnose: bij een échte mismatch (geen config, geen primary match, geen
 * extras, geen parent fallback) loggen we één duidelijke console-warning
 * met slug + verwachte locationId zodat ontbrekende uploads of foutieve
 * compositie-mapping zichtbaar worden.
 */
import { useEffect, useMemo, useRef } from "react";
import { UnitSlider } from "@/components/UnitSlider";
import { useUnitGallery } from "@/hooks/useUnitGallery";
import { locationIdsForSlug } from "@/lib/locationId";
import { getExtraLocationIds } from "@/config/unitCompositionConfig";
import { useCompositionCacheVersion } from "@/hooks/useCompositionCacheVersion";

interface UnitGallerySliderProps {
  /** Slug van property of unit (zelfde input als locationIdsForSlug). */
  slug: string;
  /** Optioneel: expliciete config-images (krijgen voorrang op auto-match). */
  configImages?: string[];
  /** Optioneel: extra location-IDs bovenop de compositiecache voor overzichtskaarten. */
  extraLocationIds?: string[];
  /** Alt-tekst basis. */
  alt: string;
  /** Tekst op placeholder-tegels bij lege bron. */
  placeholderLabel?: string;
  aspectClass?: string;
}

export const UnitGallerySlider = ({
  slug,
  configImages,
  extraLocationIds: extraLocationIdsProp,
  alt,
  placeholderLabel,
  aspectClass,
}: UnitGallerySliderProps) => {
  const cacheVersion = useCompositionCacheVersion();
  // Force lowercase: voorkomt mismatch tussen "Watermolen" (display) en
  // "watermolen" (Cloudflare prefix). Cloudflare paden zijn altijd lowercase.
  const normalizedSlug = useMemo(() => (slug ?? "").toLowerCase().trim(), [slug]);
  const locIds = useMemo(() => locationIdsForSlug(normalizedSlug), [normalizedSlug]);

  // Re-resolve extras wanneer de DB-cache her-laadt (cacheVersion bumpt).
  const extraLocationIds = useMemo(
    () => {
      const seen = new Set<string>();
      const merged = [
        ...getExtraLocationIds(normalizedSlug),
        ...(extraLocationIdsProp ?? []),
      ]
        .map((id) => id.toLowerCase().trim())
        .filter((id) => {
          if (!id || seen.has(id)) return false;
          seen.add(id);
          return true;
        });
      return merged;
    },
    [normalizedSlug, cacheVersion, extraLocationIdsProp],
  );

  const { images, loading } = useUnitGallery({
    locationId: locIds.primary,
    parentLocationId: locIds.parent,
    extraLocationIds,
    configImages,
  });

  // Diagnose: 1× per slug+versie waarschuwen bij echte mismatch.
  const warnedRef = useRef<string>("");
  useEffect(() => {
    if (loading) return;
    if (configImages && configImages.length > 0) return;
    if (images.length > 0) return;
    const key = `${normalizedSlug}|${cacheVersion}`;
    if (warnedRef.current === key) return;
    warnedRef.current = key;
    const casingNotice =
      slug !== normalizedSlug
        ? ` (input slug "${slug}" werd genormaliseerd naar lowercase "${normalizedSlug}")`
        : "";
    // eslint-disable-next-line no-console
    console.warn(
      `[UnitGallery] Geen foto's voor slug "${normalizedSlug}"${casingNotice}. ` +
        `Verwacht prefix: "${locIds.primary}"` +
        (locIds.parent ? ` (fallback parent: "${locIds.parent}")` : "") +
        (extraLocationIds.length > 0
          ? `, samengestelde modules: [${extraLocationIds.join(", ")}]`
          : "") +
        ". Controleer (1) of er Cloudflare-uploads bestaan met deze prefix in image_library (alle lowercase!), en (2) of unit_compositions.modules + module_location_ids correct gezet zijn op /admin/compositions.",
    );
  }, [
    loading,
    images.length,
    slug,
    normalizedSlug,
    cacheVersion,
    configImages,
    locIds.primary,
    locIds.parent,
    extraLocationIds,
  ]);

  return (
    <UnitSlider
      images={images}
      alt={alt}
      placeholderLabel={placeholderLabel}
      aspectClass={aspectClass}
    />
  );
};
