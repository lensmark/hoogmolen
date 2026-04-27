/**
 * guestyMapping.ts — Guesty Open API alias-laag.
 *
 * Bron: https://open-api-docs.guesty.com (listings endpoint).
 *
 * Doel: één plaats waar Lovable Property-velden naar Guesty-naamgeving worden
 * vertaald. Zo kunnen we straks een live `GET /listings/{_id}` response
 * `mergeGuestyListing(property, listing)` plug-and-play binnenrollen zonder
 * de pagina-templates aan te passen.
 *
 * Mapping:
 *   property.guestyListingId ↔ Guesty `_id`
 *   property.startingPrice   ↔ Guesty `prices.basePrice`   (fallback)
 *   property.isAvailable     ↔ Guesty `availability.isAvailable` (fallback true)
 *
 * Build-CTA-URL:
 *   `${HOOGMOLEN_BOOKING_BASE}/${guestyListingId}` zodat 'Boek nu' direct naar
 *   de juiste check-out op hoogmolen.com routeert zodra een listing-ID is gezet.
 */
import type { Property } from "@/config/propertyConfig";

export const HOOGMOLEN_BOOKING_BASE =
  "https://www.hoogmolen.com/nl/properties";

/** Subset van Guesty listing-velden die we vandaag gebruiken. */
export interface GuestyListingResponse {
  _id: string;
  prices?: { basePrice?: number; currency?: string };
  availability?: { isAvailable?: boolean };
}

/** Resultaat van een merge — strikt typed voor templates. */
export interface ResolvedListingState {
  /** Live? Anders fallback naar config. */
  isLive: boolean;
  /** Effectieve vanafprijs per nacht (Guesty live óf config-fallback). */
  basePrice: number;
  /** ISO-currency. Standaard EUR. */
  currency: string;
  /** Beschikbaarheid; standaard true wanneer geen Guesty-payload. */
  isAvailable: boolean;
  /** Guesty `_id` indien gekend, anders null. */
  listingId: string | null;
  /** CTA-URL — listing-ID > property.bookingUrl > /overnachten. */
  bookingUrl: string;
}

/** Pak de Guesty listing-ID uit property (alias of huidige bookingUrl-tail). */
export const extractListingId = (property: Property): string | null => {
  if (property.guestyListingId) return property.guestyListingId;
  // Fallback: huidige bookingUrl bevat al het Guesty-ID als laatste segment.
  const tail = property.bookingUrl?.split("/").pop();
  return tail && /^[a-f0-9]{20,}$/i.test(tail) ? tail : null;
};

/** Bouw definitieve booking-URL voor 'Book Now'. */
export const buildBookingUrl = (
  property: Property,
  listingId: string | null,
): string => {
  if (listingId) return `${HOOGMOLEN_BOOKING_BASE}/${listingId}`;
  return property.bookingUrl ?? "/overnachten";
};

/** Merge config-fallback met (optionele) live Guesty-payload. */
export const resolveListing = (
  property: Property,
  live?: GuestyListingResponse | null,
): ResolvedListingState => {
  const listingId = live?._id ?? extractListingId(property);
  return {
    isLive: Boolean(live),
    basePrice: live?.prices?.basePrice ?? property.startingPrice,
    currency: live?.prices?.currency ?? "EUR",
    isAvailable: live?.availability?.isAvailable ?? true,
    listingId,
    bookingUrl: buildBookingUrl(property, listingId),
  };
};
