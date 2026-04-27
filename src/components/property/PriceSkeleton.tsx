/**
 * PriceSkeleton — placeholder voor de prijs-sectie zolang Guesty live data
 * nog niet binnen is. Toont een puls-skelet ter grootte van het echte prijs-
 * blok in PropertyPriceBar zodat er geen layout-shift ontstaat.
 */
import { Skeleton } from "@/components/ui/skeleton";

export const PriceSkeleton = () => (
  <div className="flex flex-col gap-2" aria-busy="true" aria-live="polite">
    <Skeleton className="h-3 w-24 bg-accent/60" />
    <Skeleton className="h-9 w-32 bg-accent/60" />
    <Skeleton className="h-3 w-40 bg-accent/60" />
  </div>
);
