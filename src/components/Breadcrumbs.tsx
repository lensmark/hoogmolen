/**
 * Breadcrumbs — visueel zichtbaar broodkruimelpad voor SEO + UX.
 *
 * Gebruikt `buildBreadcrumbs()` (zelfde bron als BreadcrumbList JSON-LD in SEO.tsx)
 * → garandeert 1-op-1 consistentie tussen wat de bot ziet en wat de gebruiker ziet.
 *
 * Echte <Link> elementen renderen als <a href> in HTML — crawlbaar zonder JS.
 * Laatste crumb = current page (geen link, aria-current="page").
 */
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { buildBreadcrumbs } from "@/config/breadcrumbConfig";

interface BreadcrumbsProps {
  /** Compact (kleinere padding) voor onder hero op detailpagina's */
  compact?: boolean;
  className?: string;
}

export const Breadcrumbs = ({ compact = false, className = "" }: BreadcrumbsProps) => {
  const { pathname } = useLocation();
  const crumbs = buildBreadcrumbs(pathname);

  // Geen breadcrumbs op de homepage (alleen "Home")
  if (crumbs.length <= 1) return null;

  const py = compact ? "py-2" : "py-3";

  return (
    <nav
      aria-label="Kruimelpad"
      className={`bg-secondary/40 border-b border-border ${py} ${className}`}
    >
      <div className="container-wide">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            // crumb.url is absoluut (https://...) — voor interne navigatie path uit URL extraheren
            const path = crumb.url.replace("https://hoogmolen.be", "") || "/";

            return (
              <li key={crumb.url} className="inline-flex items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight className="w-3 h-3 text-muted-foreground/60 shrink-0" aria-hidden="true" />
                )}
                {isLast ? (
                  <span
                    className="font-medium text-primary-deep"
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={path}
                    className="hover:text-primary hover:underline underline-offset-2 transition-colors inline-flex items-center gap-1"
                  >
                    {i === 0 && <Home className="w-3 h-3" aria-hidden="true" />}
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
