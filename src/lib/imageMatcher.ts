/**
 * imageMatcher.ts — Longest-Prefix Match voor geüploade Cloudflare images.
 *
 * STRATEGIE
 * =========
 * Iedere geüploade afbeelding heeft een filename / cloudflare_id volgens conventie:
 *
 *   hoogmolen-verblijf-<...location-segments...>-<seo>-<seo>-<index>
 *
 * De LAATSTE 3 segmenten zijn metadata (2 SEO-termen + 2-cijferige index),
 * alles ervoor vormt het **Unique Location ID**.
 *
 * Voorbeelden:
 *   hoogmolen-verblijf-peerdermolen-kamer-b2-bed-detail-01
 *     → location = "hoogmolen-verblijf-peerdermolen-kamer-b2"
 *     → meta     = ["bed", "detail", "01"]
 *
 *   hoogmolen-verblijf-peerdermolen-overzicht-keuken-03
 *     → location = "hoogmolen-verblijf-peerdermolen"
 *     → meta     = ["overzicht", "keuken", "03"]
 *
 * GALLERY-SELECTIE
 * ----------------
 * 1. Filter alle images waarvan location === unitLocationId (exact match).
 * 2. Indien leeg én parentLocationId opgegeven → fallback op parent.
 * 3. Sorteer op index (laatste segment) zodat -01 vóór -02 komt.
 */

export interface ParsedImageId {
  raw: string;
  /** Alles vóór de laatste 3 segmenten. */
  locationId: string;
  /** [seoA, seoB, indexNN]. */
  meta: [string, string, string] | null;
  /** Numerieke index of Number.MAX_SAFE_INTEGER als geen geldig getal. */
  index: number;
}

/** Strip extension + lowercase, dan splits op "-". */
const cleanId = (raw: string): string =>
  raw.toLowerCase().replace(/\.[a-z0-9]+$/i, "");

/**
 * Parse een Cloudflare image-ID/filename volgens de conventie.
 * - Minimaal 4 segmenten vereist (anders kan er geen locationId zijn).
 * - Laatste segment moet numeriek zijn om als 'index' te tellen.
 */
export const parseImageId = (raw: string): ParsedImageId => {
  const id = cleanId(raw);
  const parts = id.split("-");

  if (parts.length < 4) {
    return { raw, locationId: id, meta: null, index: Number.MAX_SAFE_INTEGER };
  }

  const last = parts[parts.length - 1];
  const indexNum = /^\d+$/.test(last) ? parseInt(last, 10) : Number.MAX_SAFE_INTEGER;

  // Indien laatste segment NIET numeriek → behandel als deel van location.
  if (indexNum === Number.MAX_SAFE_INTEGER) {
    return { raw, locationId: id, meta: null, index: indexNum };
  }

  const meta: [string, string, string] = [
    parts[parts.length - 3],
    parts[parts.length - 2],
    last,
  ];
  const locationId = parts.slice(0, parts.length - 3).join("-");
  return { raw, locationId, meta, index: indexNum };
};

/**
 * Filter een lijst image-IDs op een unit's locationId (exact prefix match
 * op de "Unique Location ID" deel — niet substring).
 *
 * @param ids       lijst Cloudflare custom-IDs (zonder extensie)
 * @param locationId bv. "hoogmolen-verblijf-peerdermolen-kamer-b2"
 * @returns         gesorteerd op index ascending
 */
export const matchByLocationId = (
  ids: string[],
  locationId: string
): string[] => {
  const target = cleanId(locationId);
  return ids
    .map(parseImageId)
    .filter((p) => p.locationId === target)
    .sort((a, b) => a.index - b.index)
    .map((p) => p.raw);
};

/**
 * Brede prefix-match: alle IDs die letterlijk beginnen met `<locationId>-`.
 *
 * Nodig voor properties met **vrije naamgeving** (bv. Peerdermolen-foto's
 * met 4+ meta-segmenten zoals `peerdermolen-woonkamer-eetkamer-bankstel-02`)
 * waar de strikte 3-segment regel uit `parseImageId()` te aggressief afkapt.
 *
 * Excludeert sub-unit images (kamer-b#, kamer-familie, a#) zodat de
 * Peerdermolen-gallery niet vol kamerfoto's komt.
 */
export const matchByPrefix = (ids: string[], locationId: string): string[] => {
  const target = cleanId(locationId);
  const prefix = `${target}-`;
  const SUB_UNIT_RE = /^(kamer-(?:b[1-5]|familie)|a[1-6])(?:-|$)/;

  return ids
    .map((raw) => ({ raw, clean: cleanId(raw) }))
    .filter(({ clean }) => {
      if (clean === target) return true;
      if (!clean.startsWith(prefix)) return false;
      const rest = clean.slice(prefix.length);
      return !SUB_UNIT_RE.test(rest);
    })
    .map(({ raw }) => raw)
    .sort((a, b) => {
      const ai = parseImageId(a).index;
      const bi = parseImageId(b).index;
      return ai - bi;
    });
};

/**
 * Hoofd-API: probeer een specifieke locationId, val terug op parent.
 *
 * Strategie (in volgorde):
 *  1. Exacte locationId-match (strikt 3-segment-meta regel)
 *  2. Brede prefix-match op zelfde locationId (vangt vrije naamgeving)
 *  3. Idem voor parentLocationId
 *
 * @param ids               alle bekende image-IDs
 * @param locationId        primaire match (sub-unit), bv. ".../kamer-b2"
 * @param parentLocationId  optionele fallback (parent unit), bv. ".../peerdermolen"
 */
export const matchImagesForUnit = (
  ids: string[],
  locationId: string,
  parentLocationId?: string
): { matches: string[]; usedFallback: boolean } => {
  const mergeMatches = (...groups: string[][]): string[] => {
    const seen = new Set<string>();
    const merged: string[] = [];
    for (const group of groups) {
      for (const id of group) {
        if (!seen.has(id)) {
          seen.add(id);
          merged.push(id);
        }
      }
    }
    return merged.sort((a, b) => parseImageId(a).index - parseImageId(b).index);
  };

  const direct = matchByLocationId(ids, locationId);
  const prefixDirect = matchByPrefix(ids, locationId);
  const primary = mergeMatches(prefixDirect, direct);
  if (primary.length > 0) {
    return { matches: primary, usedFallback: false };
  }

  if (parentLocationId) {
    const parent = matchByLocationId(ids, parentLocationId);
    const prefixParent = matchByPrefix(ids, parentLocationId);
    const fallback = mergeMatches(prefixParent, parent);
    if (fallback.length > 0) {
      return { matches: fallback, usedFallback: true };
    }
  }

  return { matches: [], usedFallback: false };
};
