/**
 * image-utils.ts — centrale image-URL helpers.
 *
 * Alle CF-Images URL-bouw loopt via deze module zodat de account-hash
 * en proxy-base op exact één plek geconfigureerd zijn (zie
 * src/integrations/cloudinary-config.ts).
 *
 * Publieke API:
 *   - getCloudflareUrl(id, opts?)  → enkele URL met optionele width/blur
 *   - getCloudflareSrcSet(id)      → responsive srcset string
 *   - getCloudflareBlurUrl(id)     → low-res LCP placeholder
 *   - resolveImageUrl(value)       → URL of CF-ID auto-detect
 *
 * Legacy aliassen in src/config/cloudflareImagesConfig.ts blijven werken.
 */
import {
  CLOUDFLARE_PROXY_BASE,
  CLOUDFLARE_RESPONSIVE_WIDTHS,
  CLOUDFLARE_BLUR_WIDTH,
} from "@/integrations/cloudinary-config";

export interface CloudflareUrlOptions {
  /** Resize-breedte in px. Wordt als ?w=<n> doorgegeven aan de Worker-proxy. */
  width?: number;
  /** Vraag een lage-resolutie blur-variant op (LCP placeholder). */
  blur?: boolean;
}

/** True als de string al een absolute URL of data/blob URI is. */
export const isAbsoluteUrl = (s: string): boolean =>
  /^(https?:)?\/\//i.test(s) || s.startsWith("data:") || s.startsWith("blob:");

/**
 * Bouw een Cloudflare Images URL via de worker-proxy.
 * Gebruikt de centraal geconfigureerde account-hash (via cloudinary-config).
 */
export const getCloudflareUrl = (
  id: string,
  opts: CloudflareUrlOptions = {},
): string => {
  const params = new URLSearchParams();
  if (opts.blur) {
    params.set("w", String(CLOUDFLARE_BLUR_WIDTH));
    params.set("blur", "60");
  } else if (opts.width) {
    params.set("w", String(opts.width));
  }
  // v4.17.8: AVIF→WebP→JPEG content-negotiation via worker-proxy.
  // De worker leest deze hint en kiest het modernste formaat dat de
  // Accept-header van de client (browser of bot zoals SEMrush) ondersteunt.
  params.set("format", "auto");
  const qs = params.toString();
  const base = `${CLOUDFLARE_PROXY_BASE}/${encodeURIComponent(id)}`;
  return qs ? `${base}?${qs}` : base;
};

/**
 * Bouw een complete responsive srcset voor een CF custom-ID.
 * Bevat alle breakpoints uit CLOUDFLARE_RESPONSIVE_WIDTHS.
 */
export const getCloudflareSrcSet = (
  id: string,
  widths: readonly number[] = CLOUDFLARE_RESPONSIVE_WIDTHS,
): string =>
  widths
    .map((w) => `${getCloudflareUrl(id, { width: w })} ${w}w`)
    .join(", ");

/**
 * Lage-resolutie blur-placeholder voor LCP boost.
 * Gebruik in `style={{ backgroundImage: \`url(${getCloudflareBlurUrl(id)})\` }}`
 * of als initial src vóór de full-res variant binnen is.
 */
export const getCloudflareBlurUrl = (id: string): string =>
  getCloudflareUrl(id, { blur: true });

/**
 * Auto-detect resolver: full URL → ongewijzigd, anders behandeld als CF-ID.
 * Vervangt de oudere helper in @/lib/imageSource.ts (blijft als alias bestaan).
 */
export const resolveImageUrl = (value: string): string =>
  isAbsoluteUrl(value) ? value : getCloudflareUrl(value);
