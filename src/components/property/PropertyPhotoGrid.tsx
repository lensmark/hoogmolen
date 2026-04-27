/**
 * PropertyPhotoGrid — wireframe-layout (image-45):
 *   ┌──────────┬───────┬───────┐
 *   │          │ Foto2 │ Foto3 │
 *   │  Focus   ├───────┼───────┤
 *   │          │ Foto4 │ Foto5 │
 *   └──────────┴───────┴───────┘
 *
 * Bron-prioriteit (v3.1.0):
 *  1. expliciete `images` prop (vanuit property.galleryImages)
 *     - 1ste foto = grote focus links (col-span-2 row-span-2)
 *     - foto's 2-5 = vier thumbs rechts
 *     - ontbrekende posities = lege olijfgroene placeholder-tegel
 *  2. fallback naar `cfImagesForProperty(slug)` (slug-resolver)
 *  3. wireframe placeholder (geen slug)
 */
import { CFImage } from "@/components/CFImage";
import { CFSlider } from "@/components/CFSlider";
import { cfImagesForProperty } from "@/config/cloudflareImagesConfig";
import { resolveImageSrc, isAbsoluteUrl } from "@/lib/imageSource";
import { buildPropertyAlt } from "@/lib/seoAlt";

interface PropertyPhotoGridProps {
  slug?: string;
  /**
   * Geordende lijst beelden (CF-IDs of full URLs, auto-detect).
   * - [0] = grote focusfoto links (col-span-2 row-span-2)
   * - [1..4] = vier thumbs rechts
   * - posities zonder waarde = lege placeholder-tegel
   */
  images?: string[];
}

const PlaceholderTile = ({ label }: { label: string }) => (
  <div className="bg-gradient-to-br from-accent to-secondary aspect-[16/9] md:aspect-auto flex items-center justify-center">
    <span className="font-display italic text-primary-deep/70 text-sm">{label}</span>
  </div>
);

export const PropertyPhotoGrid = ({ slug, images }: PropertyPhotoGridProps) => {
  // ── Mode A: expliciete images uit config ────────────────────────────
  if (images && images.length > 0) {
    const focus = images[0];
    const thumbSlots = [images[1], images[2], images[3], images[4]];

    return (
      <section className="pb-8 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-auto md:h-[480px]">
            {/* Focus links — Tier-1 / above-the-fold: eager + high priority */}
            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-gradient-to-br from-accent to-secondary aspect-[4/3] md:aspect-auto h-full">
              {isAbsoluteUrl(focus) ? (
                <img
                  src={focus}
                  alt={buildPropertyAlt(slug, "focus")}
                  title={buildPropertyAlt(slug, "focus")}
                  width={1280}
                  height={960}
                  className="w-full h-full object-cover"
                  loading="eager"
                  // @ts-expect-error — fetchpriority is a valid HTML attribute
                  fetchpriority="high"
                />
              ) : (
                <CFImage
                  id={focus}
                  alt={buildPropertyAlt(slug, "focus", 0, focus)}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  sectionKey="gallery_focus"
                />
              )}
            </div>

            {/* 4 thumb-slots — below-the-fold: lazy */}
            {thumbSlots.map((value, i) => {
              if (!value) {
                return <PlaceholderTile key={`empty-${i}`} label={`Foto ${i + 2}`} />;
              }
              const altText = buildPropertyAlt(slug, `thumb_${i + 1}`, i + 1, isAbsoluteUrl(value) ? undefined : value);
              return (
                <div
                  key={`thumb-${i}`}
                  className="relative overflow-hidden bg-gradient-to-br from-accent to-secondary aspect-[16/9] md:aspect-auto"
                >
                  {isAbsoluteUrl(value) ? (
                    <img
                      src={resolveImageSrc(value)}
                      alt={altText}
                      title={altText}
                      width={640}
                      height={480}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <CFImage
                      id={value}
                      alt={altText}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 25vw"
                      sectionKey={`gallery_thumb_${i + 1}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // ── Mode B: geen slug → wireframe-placeholder ───────────────────────
  if (!slug) {
    return (
      <section className="pb-8 bg-background">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-accent to-secondary aspect-[4/3] md:aspect-auto flex items-center justify-center">
              <span className="font-display italic text-primary-deep text-sm">Foto 1</span>
            </div>
            {[2, 3, 4, 5].map((n) => (
              <PlaceholderTile key={n} label={`Foto ${n}`} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Mode C: slug-resolver (bestaand gedrag) ─────────────────────────
  const { overview, thumbs } = cfImagesForProperty(slug);

  return (
    <section className="pb-8 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-3 h-auto md:h-[480px]">
          <CFSlider
            ids={overview}
            alt={buildPropertyAlt(slug, "focus")}
            className="md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto h-full"
          />
          {thumbs.map((thumb, i) => (
            <div
              key={thumb.id}
              className="relative overflow-hidden bg-gradient-to-br from-accent to-secondary aspect-[16/9] md:aspect-auto"
            >
              <CFImage
                id={thumb.id}
                alt={buildPropertyAlt(slug, `thumb_${i + 1}`, i + 1, thumb.id)}
                className="w-full h-full object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 25vw"
                sectionKey={`gallery_thumb_${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
