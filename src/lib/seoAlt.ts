/**
 * seoAlt.ts — genereert SEO + GEO-rijke alt-teksten voor accommodatie-foto's.
 *
 * Twee modi:
 *
 * 1. **Filename-conventie** (`buildAltFromFilename`) — afgeleid van de
 *    Cloudflare custom-ID conventie:
 *      hoogmolen-verblijf-<unit>[-kamer-<b#>]-<onderdeel>-<index>
 *    Voorbeeld:
 *      "hoogmolen-verblijf-watermolen-slaapkamer-01"
 *        → "Luxe Slaapkamer Watermolen in Oudsbergen"
 *      "hoogmolen-verblijf-peerdermolen-kamer-b3-bed-01"
 *        → "Bed in Kamer B3 · Peerdermolen in Oudsbergen"
 *
 *    Vrije bestandsnamen (admin-upload) zoals "terras-zonsondergang-02"
 *    worden Title-Cased en gesuffixeerd met " · Landgoed De Hoogmolen".
 *
 * 2. **Role-based fallback** (`buildPropertyAlt`) — wanneer enkel slug + rol
 *    bekend zijn (bv. PhotoGrid focus/thumb_1..4 zonder filename).
 *
 * Google-regel: alt-tekst moet inhoud + locatie + zoekwoord bevatten.
 *
 * Slecht: "watermolen-1.jpg"
 * Goed:   "Luxe Slaapkamer Watermolen Oudsbergen"
 */
import { getProperty } from "@/config/propertyConfig";

const TYPE_LABEL: Record<string, string> = {
  house: "Vakantiewoning",
  duplex: "Duplexsuite",
  suite: "Suite",
  room: "Kamer",
};

const ROLE_LABEL: Record<string, string> = {
  focus: "overzicht",
  thumb_1: "interieur",
  thumb_2: "slaapkamer",
  thumb_3: "badkamer of leefruimte",
  thumb_4: "terras of buitenzicht",
};

const LOCATION = "Oudsbergen";
const BRAND = "Landgoed De Hoogmolen";

/** Mapping unit-token → publieke property-naam (Title Case). */
const UNIT_DISPLAY: Record<string, string> = {
  watermolen: "Watermolen",
  peerdermolen: "Peerdermolen",
  volmolen: "Volmolen",
  landgoed: "Landgoed De Hoogmolen",
  duplexsuite: "Duplexsuite",
};

/**
 * Onderdelen-vocabulaire — vertaalt filename-tokens naar SEO-rijke labels.
 * Sleutel = lower-case token zoals het in de CF-ID staat.
 */
const PART_LABEL: Record<string, string> = {
  overzicht: "Overzicht",
  exterieur: "Exterieur",
  gevel: "Gevel",
  tuin: "Tuin",
  terras: "Terras",
  bbq: "BBQ-hoek",
  vijver: "Visvijver",

  keuken: "Keuken",
  leefruimte: "Leefruimte",
  woonkamer: "Woonkamer",
  eetkamer: "Eetkamer",
  zithoek: "Zithoek",
  haard: "Open haard",

  slaapkamer: "Luxe Slaapkamer",
  bed: "Bed",
  badkamer: "Badkamer",
  douche: "Inloopdouche",
  bad: "Vrijstaand bad",

  bar: "Bar",
  molenhuys: "Molenhuys",
  speeltuin: "Speeltuin",
  detail: "Sfeerdetail",
  faciliteiten: "Faciliteiten",
};

const TITLE_CASE = (s: string): string =>
  s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

/** Strip extensie (.jpg/.png/.webp) en lower-case. */
const cleanFilename = (raw: string): string =>
  raw.toLowerCase().replace(/\.[a-z0-9]+$/i, "");

/**
 * Parse een Cloudflare custom-ID / filename naar een rijke alt-tekst.
 *
 * Patroon: `hoogmolen-verblijf-<unit>[-kamer-<b#>]-<onderdeel>[-<index>]`
 * Vrije naam: alles wat niet matcht → Title Case + brand-suffix.
 */
export const buildAltFromFilename = (rawFilename: string): string => {
  const id = cleanFilename(rawFilename);

  // Patroon: hoogmolen-verblijf-<unit>(-kamer-<room>)?-<part>(-<index>)?
  const m = id.match(
    /^hoogmolen-verblijf-([a-z]+)(?:-kamer-([ab]\d+|familie))?-([a-z]+)(?:-(\d{1,3}))?$/,
  );

  if (m) {
    const [, unitToken, roomToken, partToken] = m;
    const unitName = UNIT_DISPLAY[unitToken] ?? TITLE_CASE(unitToken);
    const partLabel = PART_LABEL[partToken] ?? TITLE_CASE(partToken);

    if (roomToken) {
      const roomLabel =
        roomToken === "familie"
          ? "Familiekamer"
          : `Kamer ${roomToken.toUpperCase()}`;
      return `${partLabel} in ${roomLabel} · ${unitName} in ${LOCATION}`;
    }

    return `${partLabel} ${unitName} in ${LOCATION}`;
  }

  // Vrije bestandsnaam — strip trailing index, title-case rest
  const noIndex = id.replace(/-\d{1,3}$/, "");
  const partLabel =
    PART_LABEL[noIndex] ??
    PART_LABEL[noIndex.split("-")[0]] ??
    TITLE_CASE(noIndex);
  return `${partLabel} · ${BRAND} in ${LOCATION}`;
};

/**
 * Genereer een rijke alt-tekst voor een foto van een property.
 *
 * Wanneer `filename` is gegeven → primair pad via `buildAltFromFilename`
 * (filename-conventie wint, want die bevat het meest specifieke onderdeel).
 *
 * Anders → role-based fallback met property-naam, capaciteit en locatie.
 *
 * @param slug          - property slug (bv. "watermolen", "de-fries")
 * @param role          - "focus" | "thumb_1" .. "thumb_4"
 * @param fallbackIndex - 0-based positie wanneer slug onbekend is
 * @param filename      - optioneel: CF custom-ID of bestandsnaam
 */
export const buildPropertyAlt = (
  slug: string | undefined,
  role: keyof typeof ROLE_LABEL | string,
  fallbackIndex = 0,
  filename?: string,
): string => {
  if (filename) return buildAltFromFilename(filename);

  const property = slug ? getProperty(slug) : undefined;
  const roleSuffix = ROLE_LABEL[role] ?? `foto ${fallbackIndex + 1}`;

  if (!property) {
    return slug
      ? `Verblijf ${slug} in ${LOCATION} — ${roleSuffix}`
      : `${BRAND} in ${LOCATION} — ${roleSuffix}`;
  }

  const typeLabel = TYPE_LABEL[property.type] ?? "Verblijf";
  const capacity = property.capacity
    ? ` voor ${property.capacity} personen`
    : "";

  return `${typeLabel} ${property.name} in ${LOCATION}${capacity} — ${roleSuffix}`;
};
