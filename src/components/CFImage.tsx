/**
 * CFImage — Cloudflare Images via worker-proxy met fallback + srcset.
 *
 * v3.13.0: emit `srcSet` + `sizes` voor responsive delivery (480→1920w).
 * `title` valt terug op `alt` (rich snippet-vriendelijk hover-tooltip).
 *
 * Probeert het opgegeven ID te laden via de proxy; bij 404/laad-fout valt
 * het terug op een neutrale ambient-shot (hero-estate).
 *
 * Admin-override: als `sectionKey` is gegeven én er bestaat een record in
 * `image_overrides` voor (currentPath, sectionKey), dan wordt de override-URL
 * getoond i.p.v. de standaard CF-ID. In adminMode wrap-en we het geheel in
 * een EditableImage zodat de foto klikbaar wordt.
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { cfImage, cfImageSrcSet } from "@/config/cloudflareImagesConfig";
import { getCloudflareBlurUrl } from "@/lib/image-utils";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { useImageAliases, primeAliasCache } from "@/hooks/useImageAliases";
import EditableImage from "@/components/admin/EditableImage";
import fallbackImg from "@/assets/hero-estate.jpg";

interface CFImageProps {
  id: string;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  /** SEO/UX hover tooltip; default = alt. */
  title?: string;
  /** Responsive `sizes` attribute; default vult een typische grid-tegel. */
  sizes?: string;
  /** Indien gegeven: zoekt override op (currentPath, sectionKey). */
  sectionKey?: string;
  /** Override de page-path die wordt gebruikt voor lookup/override. */
  pagePath?: string;
  /** Intrinsic width hint (CLS-prevention). Defaults: 1280. */
  width?: number;
  /** Intrinsic height hint (CLS-prevention). Defaults: 960. */
  height?: number;
}

export const CFImage = ({
  id,
  alt,
  className,
  loading = "lazy",
  fetchPriority = "auto",
  title,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw",
  sectionKey,
  pagePath,
  width = 1280,
  height = 960,
}: CFImageProps) => {
  const [errored, setErrored] = useState(false);
  const { isAdminMode, getOverride } = useAdminMode();
  const location = useLocation();
  const { resolve } = useImageAliases();

  // Prime cache (idempotent) — zorgt dat aliassen ook beschikbaar zijn buiten render.
  useEffect(() => {
    void primeAliasCache();
  }, []);

  const path = pagePath ?? location.pathname;
  const overrideUrl = sectionKey ? getOverride(path, sectionKey) : null;

  // Smart Resolver: als `id` een actieve alias heeft → vervang door new_id.
  // Hierdoor verschijnt de nieuwe SEO-naam direct in de <img src>.
  const resolvedId = resolve(id);

  const baseSrc = overrideUrl ?? cfImage(resolvedId);
  const src = errored ? fallbackImg : baseSrc;

  // srcset alleen voor het standaard CF-pad (niet bij admin-override URL of fallback)
  const srcSet = !errored && !overrideUrl ? cfImageSrcSet(resolvedId) : undefined;

  // Lage-resolutie blur-placeholder als CSS background → LCP-boost.
  const blurStyle =
    !errored && !overrideUrl
      ? {
          backgroundImage: `url(${getCloudflareBlurUrl(resolvedId)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined;

  const img = (
    <img
      src={src}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      title={title ?? alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      style={blurStyle}
      // @ts-expect-error — fetchpriority is a valid HTML attribute
      fetchpriority={fetchPriority}
      onError={() => {
        if (!errored) setErrored(true);
      }}
    />
  );

  if (sectionKey && isAdminMode) {
    return (
      <EditableImage
        sectionKey={sectionKey}
        pagePath={path}
        contextHint={id}
        className={className?.includes("absolute") ? undefined : "block w-full h-full"}
      >
        {img}
      </EditableImage>
    );
  }

  return img;
};
