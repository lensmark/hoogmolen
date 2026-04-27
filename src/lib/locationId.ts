/**
 * locationId.ts — bouw de "Unique Location ID" voor units/properties die
 * matcht met de upload-conventie:
 *
 *   hoogmolen-verblijf-<unit>[-kamer-<bN>] | hoogmolen-verblijf-duplexsuite-<aN>
 *
 * Wordt door useUnitGallery gebruikt om het juiste subset van geüploade
 * Cloudflare images te vinden (longest-prefix match).
 */
import { resolveCfTokens } from "@/config/cloudflareImagesConfig";
import { getExtraLocationIds } from "@/config/unitCompositionConfig";

export interface LocationIds {
  /** Specifieke locationId voor deze unit/property. */
  primary: string;
  /** Parent locationId (alleen als unit zelf een sub-unit is, bv. kamer of duplexsuite). */
  parent?: string;
}

/**
 * Bouw de location-IDs voor een gegeven slug (property of unit).
 * - "peerdermolen"          → primary: hoogmolen-verblijf-peerdermolen
 * - "deluxe-kamer-b2"       → primary: hoogmolen-verblijf-peerdermolen-kamer-b2,
 *                             parent : hoogmolen-verblijf-peerdermolen
 * - "duplexsuite/de-fries"  → primary: hoogmolen-verblijf-duplexsuite-a1,
 *                             parent : hoogmolen-verblijf-duplexsuite
 */
export const locationIdsForSlug = (slug: string): LocationIds => {
  // Force lowercase: Cloudflare prefixes zijn altijd lowercase. Mismatch
  // tussen "Watermolen" (DB display) en "watermolen" (CF prefix) is een
  // veelvoorkomende oorzaak van lege galerijen.
  const normalized = (slug ?? "").toLowerCase().trim();
  const { unit, room } = resolveCfTokens(normalized);
  const base = `hoogmolen-verblijf-${unit.toLowerCase()}`;
  if (!room) return { primary: base };
  if (room.startsWith("b") || room === "familie") {
    return { primary: `${base}-kamer-${room.toLowerCase()}`, parent: base };
  }
  // a-rooms (duplexsuites)
  return { primary: `${base}-${room.toLowerCase()}`, parent: base };
};

/**
 * Geef alle gallery-relevante location IDs voor één of meerdere slugs:
 * primaire prefix + eventuele samengestelde module-prefixes, gededupliceerd.
 */
export const galleryLocationIdsForSlugs = (slugs: string[]): string[] => {
  const seen = new Set<string>();

  return slugs.flatMap((slug) => {
    const normalized = (slug ?? "").toLowerCase().trim();
    if (!normalized) return [];

    const ids = [locationIdsForSlug(normalized).primary, ...getExtraLocationIds(normalized)]
      .map((id) => id.toLowerCase().trim())
      .filter((id) => {
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });

    return ids;
  });
};
