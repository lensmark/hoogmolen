/**
 * UnitSlider — herbruikbare image-slider met arrows + dots.
 * Lazy-loaded images, keyboard-accessible, geen externe deps.
 *
 * v3.1.0: ondersteunt nu zowel volledige URLs als Cloudflare custom-IDs
 * (auto-detect via resolveImageSrc). Lege/ongedefinieerde lijst toont
 * een olijfgroene gradient-placeholder met optioneel label.
 *
 * v4.3.0 — Slider-vs-Link UX fix:
 *   • Pijlen + dots stoppen click + pointer events (stopPropagation +
 *     preventDefault) zodat ze nooit per ongeluk de omliggende kaart-Link
 *     activeren.
 *   • Touch/mouse-drag boven een dragthreshold telt als swipe (slider
 *     navigeert) en wordt onderdrukt als click op de Link, terwijl een
 *     korte tap zijn link-gedrag behoudt.
 *   • Pijlen + dots krijgen een hogere stacking + cursor:pointer hint.
 */
import { useRef, useState, useCallback, KeyboardEvent, MouseEvent, PointerEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { resolveImageSrc } from "@/lib/imageSource";

interface UnitSliderProps {
  /** lijst van beeld-bronnen (URL of CF-ID); leeg = placeholders */
  images?: string[];
  /** alt-prefix, bv. "Peerdermolen" */
  alt: string;
  /** label dat op placeholder-tegels verschijnt (bv. "Peerdermolen") */
  placeholderLabel?: string;
  /** aspect-ratio class, default 16/10 */
  aspectClass?: string;
  /** aantal placeholders bij lege images */
  placeholderCount?: number;
}

export const UnitSlider = ({
  images,
  alt,
  placeholderLabel,
  aspectClass = "aspect-[16/10]",
  placeholderCount = 3,
}: UnitSliderProps) => {
  const slides =
    images && images.length > 0
      ? images.map((src, i) => ({ src: resolveImageSrc(src), key: i }))
      : Array.from({ length: placeholderCount }, (_, i) => ({ src: "", key: i }));

  const [index, setIndex] = useState(0);
  const total = slides.length;

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + total) % total),
    [total]
  );

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  // ── Drag/swipe-detectie — onderscheidt tap (link) van swipe (slider) ──
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const DRAG_THRESHOLD = 8; // px

  const stopAll = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      state.moved = true;
    }
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const horizontal = Math.abs(dx) > Math.abs(dy);
    if (state.moved && horizontal && Math.abs(dx) > DRAG_THRESHOLD * 2 && total > 1) {
      go(dx < 0 ? 1 : -1);
    }
    dragStateRef.current = null;
  };

  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    // Een geslaagde swipe mag de omliggende <Link> niet triggeren.
    if (dragStateRef.current === null) return;
    if (dragStateRef.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`relative ${aspectClass} overflow-hidden bg-accent/40 touch-pan-y select-none`}
      role="region"
      aria-roledescription="carousel"
      aria-label={alt}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (dragStateRef.current = null)}
      onClickCapture={onClickCapture}
    >
      {slides.map((s, i) => (
        <div
          key={s.key}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== index}
        >
          {s.src ? (
            <img
              src={s.src}
              alt={`${alt} — foto ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/60 to-accent/30">
              <span className="font-display italic text-primary-deep/80 text-base">
                {placeholderLabel ?? alt}
              </span>
            </div>
          )}
        </div>
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              stopAll(e);
              go(-1);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/85 hover:bg-surface text-primary-deep shadow-soft flex items-center justify-center transition-colors z-10 cursor-pointer"
            aria-label="Vorige foto"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              stopAll(e);
              go(1);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/85 hover:bg-surface text-primary-deep shadow-soft flex items-center justify-center transition-colors z-10 cursor-pointer"
            aria-label="Volgende foto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  stopAll(e);
                  setIndex(i);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${
                  i === index ? "bg-primary-deep w-4" : "bg-primary-deep/40"
                }`}
                aria-label={`Ga naar foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
