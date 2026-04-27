/**
 * unitCompositionConfig.ts — Single Source of Truth voor hoe samengestelde
 * formules zijn opgebouwd uit modules. Wordt gebruikt door useUnitGallery
 * om foto's van onderliggende modules automatisch te aggregeren in galleries
 * van Plus/Volmolen/Landgoed.
 *
 * Bron: project memory `mem://features/unit-composition` — bevestigd door
 * eigenaar 2026-04-24.
 *
 * Compositie-tabel:
 *   watermolen-plus       = Watermolen + A5 + A6 + Molenhuys
 *   peerdermolen-plus     = Peerdermolen + A5 + A6 + Molenhuys
 *   volmolen              = Watermolen + Peerdermolen
 *   volmolen-plus         = Watermolen + Peerdermolen + A5 + A6 + Molenhuys
 *   landgoed-de-hoogmolen = Watermolen + Peerdermolen + A1..A6 + Molenhuys
 *
 * Plus-formules krijgen het Molenhuys mee aggregeren (toegang inbegrepen).
 *
 * Uitbreiden:
 *   - Voeg een nieuwe module toe als named const (zelfde prefix-conventie).
 *   - Voeg een nieuwe samenstelling toe aan COMPOSITION_MAP met de slug als
 *     key en een lijst location-IDs als value.
 */

// ─────────────────────────────────────────────────────────────────────────
// Modules — atomaire bouwstenen (location-ID prefixes)
// ─────────────────────────────────────────────────────────────────────────

export const MODULE_WATERMOLEN = "hoogmolen-verblijf-watermolen";
export const MODULE_PEERDERMOLEN = "hoogmolen-verblijf-peerdermolen";
export const MODULE_MOLENHUYS = "hoogmolen-verblijf-molenhuys";

/** Duplexsuite A1..A6 — bouw het location-ID voor een specifieke A-suite. */
export const moduleDuplexA = (n: 1 | 2 | 3 | 4 | 5 | 6): string =>
  `hoogmolen-verblijf-duplexsuite-a${n}`;

// ─────────────────────────────────────────────────────────────────────────
// Compositie-tabel — slug → modules
// ─────────────────────────────────────────────────────────────────────────

/**
 * Map van slug → lijst extra location-IDs die bovenop de primaire match
 * meegenomen moeten worden bij gallery-resolutie.
 *
 * Belangrijk: de primaire `locationId` van de slug zelf wordt al apart
 * geresolved door useUnitGallery — deze lijst is *aanvullend*. Voor zuiver
 * samengestelde formules (zoals `volmolen` die geen eigen foto's heeft) is
 * deze lijst de enige bron.
 */
export const COMPOSITION_MAP: Record<string, string[]> = {
  // Plus-formules van enkele woningen
  "watermolen-plus": [
    MODULE_WATERMOLEN,
    moduleDuplexA(5),
    moduleDuplexA(6),
    MODULE_MOLENHUYS,
  ],
  "peerdermolen-plus": [
    MODULE_PEERDERMOLEN,
    moduleDuplexA(5),
    moduleDuplexA(6),
    MODULE_MOLENHUYS,
  ],

  // Volmolen = combinatie van beide woningen
  volmolen: [MODULE_WATERMOLEN, MODULE_PEERDERMOLEN],

  // Volmolen Plus = beide + A5/A6 + Molenhuys
  "volmolen-plus": [
    MODULE_WATERMOLEN,
    MODULE_PEERDERMOLEN,
    moduleDuplexA(5),
    moduleDuplexA(6),
    MODULE_MOLENHUYS,
  ],

  // Landgoed = alles samen
  "landgoed-de-hoogmolen": [
    MODULE_WATERMOLEN,
    MODULE_PEERDERMOLEN,
    moduleDuplexA(1),
    moduleDuplexA(2),
    moduleDuplexA(3),
    moduleDuplexA(4),
    moduleDuplexA(5),
    moduleDuplexA(6),
    MODULE_MOLENHUYS,
  ],
};

// ─────────────────────────────────────────────────────────────────────────
// DB-cache (overschrijft COMPOSITION_MAP wanneer aanwezig)
// ─────────────────────────────────────────────────────────────────────────

export type UnitType = "room" | "house" | "villa" | "composition";
export type SiteId = "hoogmolen" | "stayyousoon";

export interface CompositionRow {
  id: string;
  slug: string;
  display_name: string;
  module_location_ids: string[];
  description: string | null;
  sort_order: number;
  unit_type: UnitType;
  visible_on: SiteId[];
  country: string | null;
  city: string | null;
}

/**
 * In-memory cache van de DB-rijen. Wordt gevuld door `useUnitCompositions`
 * (één keer bij mount + bij realtime updates). Dit laat sync-helpers als
 * `getExtraLocationIds` toe om DB-data te lezen zonder async/await.
 */
let DB_CACHE: Map<string, string[]> | null = null;

/**
 * Versie-teller — wordt bij elke cache-update opgehoogd. Componenten kunnen
 * via `subscribeCompositionCache` reageren en hun gallery-resolutie opnieuw
 * berekenen wanneer de DB-data later binnenkomt of via realtime wijzigt.
 */
let CACHE_VERSION = 0;
const cacheListeners = new Set<(version: number) => void>();

export const setCompositionCache = (rows: CompositionRow[]): void => {
  const m = new Map<string, string[]>();
  rows.forEach((r) => {
    // Force lowercase op slug + module location IDs zodat ze altijd matchen
    // met de Cloudflare prefixes (die altijd lowercase zijn).
    const slug = (r.slug ?? "").toLowerCase().trim();
    const mods = (r.module_location_ids ?? [])
      .filter((id): id is string => Boolean(id))
      .map((id) => id.toLowerCase().trim());
    m.set(slug, mods);
  });
  DB_CACHE = m;
  CACHE_VERSION += 1;
  cacheListeners.forEach((cb) => cb(CACHE_VERSION));
};

/** Lees huidige cache-versie (0 = nog niet geladen). */
export const getCompositionCacheVersion = (): number => CACHE_VERSION;

/** Abonneer op cache-updates. Returns unsubscribe-functie. */
export const subscribeCompositionCache = (
  cb: (version: number) => void,
): (() => void) => {
  cacheListeners.add(cb);
  return () => cacheListeners.delete(cb);
};

export const getCompositionRows = (): CompositionRow[] | null => {
  if (!DB_CACHE) return null;
  return Array.from(DB_CACHE.entries()).map(([slug, mods]) => ({
    id: slug,
    slug,
    display_name: slug,
    module_location_ids: mods,
    description: null,
    sort_order: 0,
    unit_type: "composition" as UnitType,
    visible_on: ["hoogmolen"] as SiteId[],
    country: null,
    city: null,
  }));
};

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

/**
 * Geef de extra location-IDs voor een slug, of een lege lijst als deze slug
 * geen samengestelde formule is. Accepteert ook paden zoals
 * "/overnachten/vakantiewoningen/volmolen-plus".
 *
 * Bron-volgorde: DB-cache (vanuit `unit_compositions`) → COMPOSITION_MAP fallback.
 */
export const getExtraLocationIds = (slug: string): string[] => {
  const key =
    slug.toLowerCase().replace(/^\/+|\/+$/g, "").split("/").pop() ?? "";
  if (DB_CACHE && DB_CACHE.has(key)) return DB_CACHE.get(key) ?? [];
  return COMPOSITION_MAP[key] ?? [];
};

/** True als deze slug een samengestelde (multi-module) formule is. */
export const isCompositeSlug = (slug: string): boolean =>
  getExtraLocationIds(slug).length > 0;
