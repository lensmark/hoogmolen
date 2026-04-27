/**
 * CFSlider — eenvoudige slider voor Cloudflare Images.
 *
 * Toont een reeks images (op basis van ID's) met prev/next-navigatie
 * en dot-indicators. Eerste image wordt eager geladen, de rest lazy.
 * Niet-bestaande ID's vallen terug op een neutrale ambient-shot.
 */
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CFImage } from "./CFImage";

interface CFSliderProps {
  ids: string[];
  alt: string;
  className?: string;
}

export const CFSlider = ({ ids, alt, className = "" }: CFSliderProps) => {
  const [index, setIndex] = useState(0);
  const total = ids.length;

  if (total === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gradient-deep group ${className}`}
    >
      {ids.map((id, i) => (
        <div
          key={id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            i === index ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          aria-hidden={i !== index}
        >
          <CFImage
            id={id}
            alt={`${alt} — afbeelding ${i + 1} van ${total}`}
            className="w-full h-full object-cover"
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
          />
        </div>
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Vorige foto"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-primary-deep opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Volgende foto"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center text-primary-deep opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {ids.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ga naar foto ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-secondary"
                    : "w-1.5 bg-secondary/50 hover:bg-secondary/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
