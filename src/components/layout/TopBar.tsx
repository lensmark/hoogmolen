/**
 * TopBar — globale 'Triple Trust' social proof balk boven de hoofdheader.
 *
 * Toont permanent de 3 belangrijkste platform-scores:
 *  - Airbnb 4.97 (571+ reviews, Superhost)
 *  - Booking.com 9.3
 *  - Google 4.9
 *
 * Hoogte h-8, text-xs, gecentreerd, subtiele fade-in bij mount.
 * Gebruikt semantische tokens (primary-deep / secondary).
 */
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ITEMS = [
  { platform: "Google", score: "5.0", suffix: "Gastenwaardering 2026" },
  { platform: "Airbnb", score: "4.97", suffix: "(571+ reviews · Superhost)" },
  { platform: "Booking.com", score: "9.7", suffix: "(171 reviews)" },
];

export const TopBar = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setMounted(true), 50);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      role="complementary"
      aria-label="Waarderingen op externe platformen — bekijk alle ervaringen"
      className={`bg-primary-deep text-secondary h-8 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Link
        to="/ervaringen"
        className="container-wide flex items-center justify-center text-[11px] md:text-xs tracking-wide hover:text-accent transition-colors group"
      >
        <span className="hidden md:inline font-medium mr-2 text-secondary/90 group-hover:text-accent">
          Status 2026:
        </span>
        <ul className="flex items-center gap-3 md:gap-5">
          {ITEMS.map((it, idx) => (
            <li key={it.platform} className="flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-secondary text-secondary group-hover:fill-accent group-hover:text-accent" aria-hidden />
              <span className="font-semibold">{it.score}</span>
              <span className="text-secondary/85 group-hover:text-accent/85">op {it.platform}</span>
              {it.suffix && (
                <span className="hidden sm:inline text-secondary/70 group-hover:text-accent/70">{it.suffix}</span>
              )}
              {idx < ITEMS.length - 1 && (
                <span className="ml-1 text-secondary/40" aria-hidden>|</span>
              )}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
};
