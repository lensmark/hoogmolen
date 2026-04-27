/**
 * libraryMatchStatus — bepaalt voor een geüploade filename of (en hoe goed)
 * deze koppelt aan een unit volgens de naamconventie.
 *
 * Conventie: hoogmolen-verblijf-<unit>[-kamer-<bN>|-<aN>]-<seo>-<seo>-<index>
 *
 * Output:
 *  - status: "match"   → past op een bekende unit; zal op pagina verschijnen
 *  - status: "loose"   → begint met "hoogmolen-verblijf-" maar onbekende unit
 *  - status: "off"     → voldoet niet aan conventie
 *  - locationId: voor matches/loose → de afgeleide unique location ID
 *  - suggestedRename: voorstel voor "off" gevallen (best-effort)
 */
import { parseImageId } from "@/lib/imageMatcher";
import { EXEMPT_TAGS } from "@/hooks/useUniqueTags";

export type LibraryMatchStatus = "match" | "loose" | "off" | "exempt";

const KNOWN_UNITS = new Set([
  "watermolen",
  "peerdermolen",
  "volmolen",
  "landgoed",
  "duplexsuite",
  "molenhuys",
]);

export interface MatchInfo {
  status: LibraryMatchStatus;
  locationId?: string;
  unit?: string;
  reason?: string;
  suggestedRename?: string;
}

const cleanFilename = (name: string): string =>
  name.toLowerCase().replace(/\.[a-z0-9]+$/i, "");

/**
 * Best-effort suggestie voor off-convention IDs: probeer "hoogmolen-..." om
 * te zetten naar "hoogmolen-verblijf-..." als er een bekende unit in de naam
 * staat. Geeft `undefined` terug als geen veilige suggestie mogelijk is —
 * de UI verbergt dan de "Suggestie toepassen" knop. Nooit placeholders met
 * `<` of `>` retourneren (die zijn ongeldig in Cloudflare-IDs).
 */
const deriveSuggestion = (id: string): string | undefined => {
  // Zoek bekende unit-token ergens in de string
  const unit = [...KNOWN_UNITS].find((u) => id.includes(`-${u}-`) || id.includes(`-${u}`));
  if (!unit) return undefined;

  // Behoud staartcijfer als die bestaat (-NN), anders -01
  const tailMatch = id.match(/-(\d{2})$/);
  const tail = tailMatch ? tailMatch[1] : "01";

  // Pak alles tussen unit en de eind-index als 'detail'-segmenten
  const afterUnit = id.split(`-${unit}-`)[1] ?? "";
  const detail = afterUnit
    .replace(/-\d{2}$/, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const base = detail
    ? `hoogmolen-verblijf-${unit}-${detail}-${tail}`
    : `hoogmolen-verblijf-${unit}-${tail}`;
  return base.slice(0, 128);
};

export const analyseLibraryFilename = (
  filename: string,
  tags: string[] = [],
): MatchInfo => {
  const id = cleanFilename(filename);

  // Vrijstelling: foto's met sfeer/omgeving tag (en minstens één geldige tag)
  // hoeven niet aan de unit-naamconventie te voldoen.
  const hasExemptTag = tags.some((t) => EXEMPT_TAGS.has(t.toLowerCase()));
  if (hasExemptTag && tags.length >= 1) {
    return {
      status: "exempt",
      reason: `Vrijgesteld via tag(s): ${tags.filter((t) => EXEMPT_TAGS.has(t.toLowerCase())).join(", ")}`,
    };
  }

  if (!id.startsWith("hoogmolen-verblijf-")) {
    return {
      status: "off",
      reason: "Mist het verplichte prefix 'hoogmolen-verblijf-'.",
      suggestedRename: deriveSuggestion(id),
    };
  }

  const parsed = parseImageId(id);
  // parseImageId vult locationId zelfs zonder geldige meta — controleer
  // op aanwezigheid van een unit-token na het prefix.
  const afterPrefix = id.slice("hoogmolen-verblijf-".length);
  const firstSegment = afterPrefix.split("-")[0];

  if (!firstSegment) {
    return {
      status: "off",
      reason: "Geen unit-naam na het prefix.",
    };
  }

  if (!KNOWN_UNITS.has(firstSegment)) {
    return {
      status: "loose",
      locationId: parsed.locationId,
      unit: firstSegment,
      reason: `Onbekende unit "${firstSegment}". Bekend: ${[...KNOWN_UNITS].join(", ")}.`,
    };
  }

  if (!parsed.meta) {
    return {
      status: "loose",
      locationId: parsed.locationId,
      unit: firstSegment,
      reason: "Mist een 2-cijferige index aan het einde (bv. -01).",
    };
  }

  return {
    status: "match",
    locationId: parsed.locationId,
    unit: firstSegment,
  };
};
