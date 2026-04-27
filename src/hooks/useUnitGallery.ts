/**
 * useUnitGallery — resolves de gallery-bronnen voor een unit/property.
 *
 * Bron-prioriteit:
 *   1. expliciete `configImages` (unit.galleryImages of property.galleryImages)
 *      → blijft override / single source of truth wanneer aanwezig
 *   2. longest-prefix match in image_library voor `locationId`
 *   3. fallback op parent locationId (bv. kamer-b2 → peerdermolen)
 *   4. `extraLocationIds` (samengestelde formules zoals Volmolen, Plus,
 *      Landgoed) — foto's van alle onderliggende modules worden geaggregeerd
 *      en gededupliceerd bovenop het primaire resultaat.
 *   5. lege lijst → caller toont placeholders
 *
 * Hoofdfoto-pin (v4.12.0):
 *   Als er voor `unit:<unitKey>` (of de afgeleide unit-slug uit locationId)
 *   een hoofdfoto in `main_photos` staat, wordt die ALTIJD vooraan in de
 *   gallery geplaatst — ongeacht volgorde uit longest-prefix match.
 *   Geldt zowel voor de gematchte als de config-override variant.
 *
 * Hero wordt apart afgeleid: eerste matched image of expliciete config-hero.
 */
import { useMemo } from "react";
import { useImageLibrary } from "./useImageLibrary";
import { useMainPhotos } from "./useMainPhotos";
import { useUnitGallerySettings } from "./useUnitGallerySettings";
import { matchImagesForUnit } from "@/lib/imageMatcher";

export interface UseUnitGalleryArgs {
  /** Unique location id volgens conventie, bv. "hoogmolen-verblijf-peerdermolen-kamer-b2". */
  locationId: string;
  /** Fallback location id (parent unit) — alleen gebruikt als primary leeg blijft. */
  parentLocationId?: string;
  /**
   * Extra location-IDs voor samengestelde formules (Plus/Volmolen/Landgoed).
   * Foto's van deze IDs worden ALTIJD toegevoegd (gededupliceerd, in volgorde).
   */
  extraLocationIds?: string[];
  /** Override-lijst uit config (heeft voorrang). */
  configImages?: string[];
  /**
   * Optionele unit-key voor de main_photos lookup. Default: de slug afgeleid
   * uit `locationId` (deel achter "hoogmolen-verblijf-", eerste segment).
   * Bv. "hoogmolen-verblijf-watermolen" → "watermolen".
   */
  unitKey?: string;
}

export interface UseUnitGalleryResult {
  /** Te tonen image-bronnen (CF-ID's of full URLs). */
  images: string[];
  /** True als we de parent-foto's tonen i.p.v. de specifieke unit. */
  usedParentFallback: boolean;
  /** True als bron == config-override (hoogste prioriteit). */
  fromConfig: boolean;
  /** True zolang library nog laadt. */
  loading: boolean;
  /** True als de bron geaggregeerd is uit meerdere modules (composite). */
  aggregated: boolean;
  /** True als een hoofdfoto-pin werd toegepast. */
  mainPinned: boolean;
}

/** Leid unit-slug af uit een locationId. */
const deriveUnitKey = (locationId: string): string => {
  const after = locationId.toLowerCase().replace(/^hoogmolen-verblijf-/, "");
  return after.split("-")[0] ?? "";
};

export const useUnitGallery = ({
  locationId,
  parentLocationId,
  extraLocationIds,
  configImages,
  unitKey,
}: UseUnitGalleryArgs): UseUnitGalleryResult => {
  const { images: lib, loading } = useImageLibrary();
  const { getMainImageId } = useMainPhotos();
  const { getSettingsForContext } = useUnitGallerySettings();

  return useMemo(() => {
    // Bouw lookups: image_library.id ↔ cloudflareId
    const idToCfId = new Map<string, string>();
    const cfIdToId = new Map<string, string>();
    for (const r of lib) {
      idToCfId.set(r.id, r.cloudflareId);
      cfIdToId.set(r.cloudflareId, r.id);
    }

    // Hoofdfoto-pin lookup
    const candidateKeys = [
      unitKey,
      deriveUnitKey(locationId),
      locationId,
    ].filter((k): k is string => !!k && k.length > 0);

    let pinnedCfId: string | null = null;
    let activeContextKey: string | null = null;
    for (const k of candidateKeys) {
      const mainId = getMainImageId("unit", k);
      if (mainId) {
        const cf = idToCfId.get(mainId);
        if (cf) {
          pinnedCfId = cf;
          activeContextKey = k;
          break;
        }
      }
    }
    // Voor settings (hide/order) gebruiken we de eerste niet-lege candidate
    if (!activeContextKey) activeContextKey = candidateKeys[0] ?? null;

    /** Filter hidden images (per context-key) en pas custom sort_order toe. */
    const applySettings = (list: string[]): string[] => {
      if (!activeContextKey) return list;
      const settings = getSettingsForContext("unit", activeContextKey);
      if (settings.length === 0) return list;
      const settingsByImageId = new Map(settings.map((s) => [s.imageId, s]));

      // 1. Filter verborgen
      const visible = list.filter((cfId) => {
        const imgId = cfIdToId.get(cfId);
        if (!imgId) return true;
        return !settingsByImageId.get(imgId)?.hidden;
      });

      // 2. Sorteer: foto's mét sort_order eerst (op nummer), dan rest in
      //    originele volgorde. Stable.
      const indexed = visible.map((cfId, originalIdx) => {
        const imgId = cfIdToId.get(cfId);
        const so = imgId ? settingsByImageId.get(imgId)?.sortOrder : undefined;
        return {
          cfId,
          originalIdx,
          sort: so ?? null,
        };
      });
      indexed.sort((a, b) => {
        if (a.sort !== null && b.sort !== null) return a.sort - b.sort;
        if (a.sort !== null) return -1;
        if (b.sort !== null) return 1;
        return a.originalIdx - b.originalIdx;
      });
      return indexed.map((x) => x.cfId);
    };

    /** Helper: zet pinnedCfId vooraan in een lijst (insert of move). */
    const applyPin = (list: string[]): string[] => {
      if (!pinnedCfId) return list;
      const without = list.filter((x) => x !== pinnedCfId);
      return [pinnedCfId, ...without];
    };

    if (configImages && configImages.length > 0) {
      return {
        images: applyPin(applySettings(configImages)),
        usedParentFallback: false,
        fromConfig: true,
        loading: false,
        aggregated: false,
        mainPinned: !!pinnedCfId,
      };
    }

    const ids = lib.map((r) => r.cloudflareId);
    const { matches: primary, usedFallback } = matchImagesForUnit(
      ids,
      locationId,
      parentLocationId,
    );

    const extras = (extraLocationIds ?? []).flatMap((loc) => {
      const { matches } = matchImagesForUnit(ids, loc);
      return matches;
    });

    const seen = new Set<string>();
    const merged: string[] = [];
    for (const id of [...primary, ...extras]) {
      if (!seen.has(id)) {
        seen.add(id);
        merged.push(id);
      }
    }

    return {
      images: applyPin(applySettings(merged)),
      usedParentFallback: usedFallback,
      fromConfig: false,
      loading,
      aggregated: extras.length > 0,
      mainPinned: !!pinnedCfId,
    };
  }, [lib, loading, locationId, parentLocationId, extraLocationIds, configImages, unitKey, getMainImageId, getSettingsForContext]);
};
