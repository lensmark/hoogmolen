/**
 * UnitCard — full-clickable accommodatie-preview (grids op overzichts-pagina's).
 *
 * v3.4.0 — Universal Full-Card Clickability:
 *  • Eén <Link> wikkelt de hele kaart (image + body).
 *  • "Ontdek →" is enkel tekst + ArrowRight (geen Button-styling).
 *  • Hover-lift (-translate-y-1) + shadow → kaart leest als één klikvlak.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Users, Bed, Bath } from "lucide-react";
import type { Unit } from "@/config/unitsConfig";

const iconHints: Record<Unit["iconHint"], string> = {
  house: "bg-gradient-soft",
  water: "bg-gradient-deep",
  estate: "bg-gradient-hero",
  suite: "bg-gradient-soft",
  room: "bg-secondary",
  horse: "bg-gradient-soft",
};

export const UnitCard = ({ unit }: { unit: Unit }) => (
  <Link
    to={`/overnachten/vakantiewoningen/${unit.slug}`}
    className="group flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-soft transition-all duration-500 hover:shadow-card hover:-translate-y-1"
  >
    <div className="block aspect-[4/3] relative overflow-hidden">
      <div
        className={`absolute inset-0 ${iconHints[unit.iconHint]} transition-transform duration-700 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-overlay" />
      <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-surface/90 backdrop-blur px-3 py-1 rounded-full text-[11px] font-medium text-primary-deep">
        <Users className="w-3 h-3" /> tot {unit.capacity.max}
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-[10px] uppercase tracking-[0.2em] text-secondary mb-1 opacity-90">
          {unit.category}
        </div>
        <h3 className="font-display text-2xl text-secondary leading-tight">{unit.name}</h3>
      </div>
    </div>
    <div className="flex-1 flex flex-col p-5">
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{unit.tagline}</p>
      <div className="flex items-center gap-4 text-xs text-primary-deep mb-5">
        <span className="flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5" />
          {unit.bedrooms} kamers
        </span>
        <span className="flex items-center gap-1.5">
          <Bath className="w-3.5 h-3.5" />
          {unit.bathrooms} bad
        </span>
      </div>
      <div className="mt-auto flex items-end justify-between pt-4 border-t border-border">
        <div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">vanaf</div>
          <div className="font-display text-2xl text-primary-deep">€{unit.pricing.weekdayBase}</div>
          <div className="text-[10px] text-muted-foreground">/ nacht</div>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all">
          Ontdek <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  </Link>
);
