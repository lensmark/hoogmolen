/**
 * usePropertyImages — convenience-hook die een Property → resolved gallery
 * (incl. hero) omzet via longest-prefix match in image_library.
 *
 * - hero  = property.heroImage (config) of eerste matched image
 * - images = property.galleryImages (config-override) of matched lijst,
 *           gevolgd door parent-fallback indien leeg.
 */
import { useUnitGallery } from "./useUnitGallery";
import { locationIdsForSlug } from "@/lib/locationId";
import { getExtraLocationIds } from "@/config/unitCompositionConfig";
import type { Property } from "@/config/propertyConfig";

export const usePropertyImages = (
  property: Pick<Property, "slug" | "heroImage" | "galleryImages">
) => {
  const locIds = locationIdsForSlug(property.slug);
  const gallery = useUnitGallery({
    locationId: locIds.primary,
    parentLocationId: locIds.parent,
    extraLocationIds: getExtraLocationIds(property.slug),
    configImages: property.galleryImages,
  });
  return {
    hero: property.heroImage ?? gallery.images[0],
    images: gallery.images,
    usedParentFallback: gallery.usedParentFallback,
    fromConfig: gallery.fromConfig,
  };
};
