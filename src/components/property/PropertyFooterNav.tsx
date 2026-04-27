/**
 * PropertyFooterNav — onderaan elke detailpagina:
 * twee volledig klikbare kaarten "← Terug naar overzicht" en
 * "Naar groepsverblijf →" met hover-lift + shadow-card.
 *
 * v3.4.2 — Universal Full-Card Clickability:
 *  • Eén <Link> per kaart, geen onafhankelijke knop-styling.
 *  • Subtiele lift (-translate-y-1) + shadow-card op hover.
 *  • Dynamische aria-label voor screenreaders.
 */
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  /** terug-link, default afhankelijk van type */
  backHref: string;
  backLabel: string;
}

export const PropertyFooterNav = ({ backHref, backLabel }: Props) => (
  <section className="pb-10 bg-background">
    <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-3">
      <Link
        to={backHref}
        aria-label={`Terug naar overzicht: ${backLabel}`}
        className="group border border-border bg-card p-5 block transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
      >
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          {backLabel}
        </div>
        <div className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
          <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
        </div>
      </Link>
      <Link
        to="/groepsverblijf/aanvragen"
        aria-label="Groepsverblijf aanvragen — naar offerte-formulier"
        className="group border border-border bg-card p-5 block transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
      >
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Groepsverblijf aanvragen
        </div>
        <div className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
          Naar groepsverblijf <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    </div>
  </section>
);
