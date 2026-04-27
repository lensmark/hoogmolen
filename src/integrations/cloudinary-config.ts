/**
 * cloudinary-config.ts — centrale configuratie voor Cloudflare Images.
 *
 * Naam "cloudinary-config" is bewust generiek gehouden zodat we later
 * eenvoudig naar Cloudinary, imgix of een andere CDN kunnen migreren
 * zonder import-paden door het hele project aan te passen.
 *
 * Bron-prioriteit voor de account-hash:
 *   1. import.meta.env.VITE_CLOUDFLARE_HASH  (per-environment override)
 *   2. fallback default (productie account)
 *
 * Wordt gebruikt door:
 *   - src/lib/image-utils.ts          (centrale URL-builder)
 *   - src/config/cloudflareImagesConfig.ts (legacy alias, blijft werken)
 */

const DEFAULT_CLOUDFLARE_HASH = "QMQ3XlUZJRDdvp6mt-4NIQ";

export const CLOUDFLARE_ACCOUNT_HASH: string =
  (import.meta.env.VITE_CLOUDFLARE_HASH as string | undefined) ??
  DEFAULT_CLOUDFLARE_HASH;

/** Worker-proxy base — primaire delivery-route (handelt 404-fallbacks af). */
export const CLOUDFLARE_PROXY_BASE =
  "https://hoogmolen-images.mark-lens.workers.dev";

/** Directe Cloudflare delivery base (back-up / debug). */
export const CLOUDFLARE_DELIVERY_BASE = `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_HASH}`;

/** Default variant bij directe delivery. */
export const CLOUDFLARE_DEFAULT_VARIANT = "public";

/** Responsive breedtes voor srcset (mobile → 4K). */
export const CLOUDFLARE_RESPONSIVE_WIDTHS = [480, 768, 1024, 1440, 1920] as const;

/** Lage-resolutie placeholder (LCP boost — wordt ingewisseld na load). */
export const CLOUDFLARE_BLUR_WIDTH = 32;
