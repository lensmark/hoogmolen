/**
 * HorseBoardingCTA — prominente cross-sell banner voor /paardenlogies.
 * Specifiek voor paardrij-pagina's: visueel sterker dan AvailabilityBar
 * met paard-icoon, accent-achtergrond en duidelijke USP-bullets.
 */
import { Link } from "react-router-dom";

export const HorseBoardingCTA = () => (
  <section className="bg-gradient-to-br from-primary-deep to-primary text-secondary">
    <div className="container-wide py-10 md:py-14 grid md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 items-center">
      <div
        aria-hidden
        className="hidden md:flex w-20 h-20 rounded-full bg-secondary/15 border border-secondary/30 items-center justify-center text-4xl shrink-0"
      >
        🐴
      </div>
      <div className="space-y-2">
        <div className="eyebrow text-accent/90">Uniek aan De Hoogmolen</div>
        <h2 className="font-display text-2xl md:text-3xl text-secondary leading-tight">
          Uw paard is ook welkom bij De Hoogmolen
        </h2>
        <p className="text-sm md:text-base text-secondary/85 max-w-2xl">
          6 luxe stallen en wolfwerende weide beschikbaar — verblijf samen met uw paard
          op het 5-sterren domein, direct aan het Limburgse ruiternetwerk.
        </p>
        <ul className="text-sm text-secondary/80 flex flex-wrap gap-x-4 gap-y-1 pt-1">
          <li>· 6 boxen 3 m × 3,5 m</li>
          <li>· Wolfwerende weide</li>
          <li>· Gratis trailer-parking</li>
          <li>· €25 1ᵉ nacht · €10 volgende</li>
        </ul>
      </div>
      <Link
        to="/paardenlogies"
        className="shrink-0 inline-flex items-center justify-center bg-secondary text-primary-deep hover:bg-accent px-6 py-3 text-sm md:text-base font-medium transition-colors rounded-sm"
      >
        Bekijk paardenlogies →
      </Link>
    </div>
  </section>
);
