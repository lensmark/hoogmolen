/**
 * imageSource.ts — auto-detect resolver voor heroImage / galleryImages / imageId.
 *
 * Strings die met "://" voorkomen worden behandeld als volledige URL en
 * onveranderd geretourneerd. Alle andere strings worden als Cloudflare
 * Images custom-ID beschouwd en via de centrale image-utils opgelost.
 *
 * Gebruikt door PropertyHero, PageHero, PropertyPhotoGrid, UnitCard,
 * UnitDetail en UnitSlider voor consistente beeld-resolutie.
 */
import {
  resolveImageUrl,
  isAbsoluteUrl as _isAbsoluteUrl,
} from "@/lib/image-utils";

/** True als de string een absolute URL is (http(s)://, data:, blob:, //). */
export const isAbsoluteUrl = _isAbsoluteUrl;

/** Resolve een config-veld (URL of CF-ID) naar een ladbare img src. */
export const resolveImageSrc = resolveImageUrl;

/** Resolve een lijst — handig voor galleryImages → CFSlider/PhotoGrid. */
export const resolveImageList = (values?: string[]): string[] =>
  (values ?? []).map(resolveImageSrc);

/**
 * Pick het juiste beeld-veld uit een config-object:
 *   imageId (nieuw) > heroImage (legacy) > undefined
 * Beide velden zijn equivalent — imageId wint bij conflict.
 */
export const pickImageId = (obj: {
  imageId?: string;
  heroImage?: string;
}): string | undefined => obj.imageId ?? obj.heroImage;
