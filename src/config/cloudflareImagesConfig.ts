/**
 * Cloudflare Images — proxy-based delivery.
 *
 * Alle afbeeldingen worden geserveerd via de Worker-proxy:
 *   https://hoogmolen-images.mark-lens.workers.dev/<id>
 *
 * De proxy abstraheert account-hash + variant en handelt 404-fallbacks af.
 * Als fallback (bv. lokale dev zonder worker) is de directe Cloudflare
 * delivery-URL met huidige hash beschikbaar via `cfImageDirect()`.
 *
 * Naamconventies:
 *  - Slug-gebaseerd (units/kamers): hoogmolen-verblijf-<unit>[-kamer-<b#>]-<onderdeel>-<index>
 *  - Vrije bestandsnamen (admin upload): terras, kamer-1, faciliteiten-bar, ...
 */

// Centrale config — single source of truth voor hash + proxy base.
// Re-exports onder hun legacy namen zodat bestaande imports blijven werken.
import {
  CLOUDFLARE_ACCOUNT_HASH,
  CLOUDFLARE_PROXY_BASE,
  CLOUDFLARE_DELIVERY_BASE,
  CLOUDFLARE_DEFAULT_VARIANT,
} from "@/integrations/cloudinary-config";

/** Proxy base URL — primaire delivery-route voor alle img tags. */
export const CF_PROXY_BASE = CLOUDFLARE_PROXY_BASE;

/** Cloudflare Account hash (back-up / debug only). */
export const CF_ACCOUNT_HASH = CLOUDFLARE_ACCOUNT_HASH;

/** Directe delivery base + variant (alleen als fallback). */
export const CF_IMAGES_BASE = CLOUDFLARE_DELIVERY_BASE;
export const CF_VARIANT = CLOUDFLARE_DEFAULT_VARIANT;

/** Sanitize een vrije naam (bestandsnaam → custom ID). */
export const sanitizeImageId = (name: string): string =>
  name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "") // strip extension
    .replace(/[^a-z0-9-_]+/g, "-") // safe chars only
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/** Primaire URL-builder via worker-proxy. */
export const cfImage = (id: string): string =>
  `${CF_PROXY_BASE}/${encodeURIComponent(id)}`;

/**
 * Bouw een Cloudflare-variant URL voor een specifieke breedte.
 * De Worker-proxy accepteert `?w=<px>` en serveert een resized variant.
 */
export const cfImageAt = (id: string, width: number): string =>
  `${CF_PROXY_BASE}/${encodeURIComponent(id)}?w=${width}`;

/** Standaard responsive breedtes — voldoende voor mobile → 4K hero. */
export const CF_DEFAULT_WIDTHS = [480, 768, 1024, 1440, 1920] as const;

/** Bouw een complete srcset-string voor een CF custom-ID. */
export const cfImageSrcSet = (
  id: string,
  widths: readonly number[] = CF_DEFAULT_WIDTHS,
): string => widths.map((w) => `${cfImageAt(id, w)} ${w}w`).join(", ");

/** Optionele directe Cloudflare URL (debug / fallback). */
export const cfImageDirect = (id: string, variant: string = CF_VARIANT): string =>
  `${CF_IMAGES_BASE}/${id}/${variant}`;

/** Bouw een reeks ID's met 2-cijferige index, bv. (`prefix-`, 1, 12). */
export const cfImageSeries = (prefix: string, from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => {
    const n = String(from + i).padStart(2, "0");
    return `${prefix}${n}`;
  });

/**
 * Resolve een property-slug naar het CF-prefix-token + (optioneel) kamer-token.
 */
export const resolveCfTokens = (
  slug: string,
): { unit: string; room: string | null } => {
  const s = slug.toLowerCase();

  const bMatch = s.match(/b([1-5])\b/);
  if (bMatch) return { unit: "peerdermolen", room: `b${bMatch[1]}` };

  if (s.includes("familiekamer")) return { unit: "peerdermolen", room: "familie" };

  if (s.includes("watermolen")) return { unit: "watermolen", room: null };
  if (s.includes("peerdermolen")) return { unit: "peerdermolen", room: null };
  if (s.includes("volmolen")) return { unit: "volmolen", room: null };
  if (s.includes("landgoed")) return { unit: "landgoed", room: null };

  // Belangrijk: Cloudflare-uploads gebruiken prefix "suite-aN" (NIET "duplexsuite-aN").
  // De volledige slug-naar-letter mapping moet alle 6 A-units dekken, anders valt
  // de matcher terug op de raw slug (bv. "de-shetlander") en blijft de gallery leeg.
  const aMatch = s.match(/\ba([1-6])\b/) ||
    [null, ({
      "de-fries": "1", "de-fjord": "2", "de-brabander": "3",
      "de-draver": "4", "de-shetlander": "5", "de-jutlander": "6",
    } as Record<string, string>)[s.replace(/^duplexsuite\//, "")]];
  if (aMatch && aMatch[1]) return { unit: "suite", room: `a${aMatch[1]}` };

  return { unit: s, room: null };
};

export interface CfPropertyImages {
  overview: string[];
  thumbs: { id: string; alt: string }[];
}

export const cfImagesForProperty = (slug: string): CfPropertyImages => {
  const { unit, room } = resolveCfTokens(slug);

  if (room && room.startsWith("b")) {
    const base = `hoogmolen-verblijf-${unit}-kamer-${room}`;
    return {
      overview: cfImageSeries(`${base}-overzicht-`, 1, 12),
      thumbs: [
        { id: `${base}-bed-01`, alt: `Bed in kamer ${room.toUpperCase()}` },
        { id: `${base}-badkamer-01`, alt: `Badkamer kamer ${room.toUpperCase()}` },
        { id: `${base}-detail-01`, alt: `Detail kamer ${room.toUpperCase()}` },
        { id: `hoogmolen-verblijf-${unit}-overzicht-01`, alt: `Peerdermolen exterieur` },
      ],
    };
  }

  const base = `hoogmolen-verblijf-${unit}`;
  return {
    overview: cfImageSeries(`${base}-overzicht-`, 1, 12),
    thumbs: [
      { id: `${base}-keuken-01`, alt: `Keuken ${unit}` },
      { id: `${base}-leefruimte-01`, alt: `Leefruimte ${unit}` },
      { id: `${base}-kamer-b1-01`, alt: `Voorbeeldkamer ${unit}` },
      { id: `${base}-terras-01`, alt: `Terras ${unit}` },
    ],
  };
};
