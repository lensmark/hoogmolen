/**
 * PropertyPriceBar — vanafprijs-strook met "Beschikbaarheid" + "Boek nu" CTA.
 * Inline (niet sticky) variant — geplaatst direct onder de USP-grid.
 *
 * v3.13.0: Guesty-ready
 *  - Prijs + bookingUrl komen via `resolveListing(property)` zodat een latere
 *    live `GET /listings/{_id}` payload zonder template-wijziging kan worden
 *    binnengerold.
 *  - Tijdens (toekomstig) loaden van Guesty-data toont `<PriceSkeleton />`.
 *  - 'Boek nu' CTA gebruikt `guestyListingId` om naar de juiste check-out op
 *    hoogmolen.com te linken.
 *  - "Niet beschikbaar"-state wanneer `availability.isAvailable === false`.
 */
import { Button } from "@/components/ui/button";
import type { Property } from "@/config/propertyConfig";
import { resolveListing } from "@/lib/guestyMapping";
import { PriceSkeleton } from "@/components/property/PriceSkeleton";

interface PropertyPriceBarProps {
  property: Property;
  /** True wanneer een live Guesty-fetch nog loopt. Toont skeleton. */
  isLoading?: boolean;
}

export const PropertyPriceBar = ({ property, isLoading = false }: PropertyPriceBarProps) => {
  const listing = resolveListing(property);

  return (
    <section className="pb-6 bg-background">
      <div className="container-wide">
        <div className="border border-accent bg-secondary/40 px-5 md:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            {isLoading ? (
              <PriceSkeleton />
            ) : (
              <>
                <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  Vanaf per nacht
                </div>
                <div className="font-display text-3xl text-primary-deep">
                  €{listing.basePrice}
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {listing.isAvailable
                    ? listing.isLive
                      ? "Live beschikbaarheid · prijs incl. btw"
                      : "Vanafprijs · check live beschikbaarheid"
                    : "Momenteel volgeboekt — kies andere datums"}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              asChild
              variant="outline"
              className="border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary"
              disabled={isLoading}
            >
              <a href={listing.bookingUrl} target="_blank" rel="noopener noreferrer">
                Beschikbaarheid
              </a>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary-deep text-secondary"
              disabled={isLoading || !listing.isAvailable}
            >
              <a
                href={listing.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Boek ${property.name} op hoogmolen.com`}
              >
                Boek nu
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
