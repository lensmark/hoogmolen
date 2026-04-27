/**
 * useCompositionCacheVersion — exposes the in-memory composition cache
 * version as React state, zodat hooks die `getExtraLocationIds()` (sync)
 * gebruiken automatisch her-renderen wanneer de DB-data later binnenkomt
 * of via realtime wijzigt.
 *
 * Dit is essentieel voor de Vakantiewoningen / DuplexsuitesOverview /
 * KamersOverview pagina's: zij mounten vóór `useUnitCompositions` z'n eerste
 * fetch heeft afgerond. Zonder deze versie-trigger zou een eerste render met
 * lege COMPOSITION_MAP-fallback nooit her-berekend worden.
 */
import { useEffect, useState } from "react";
import {
  getCompositionCacheVersion,
  subscribeCompositionCache,
} from "@/config/unitCompositionConfig";

export const useCompositionCacheVersion = (): number => {
  const [version, setVersion] = useState<number>(getCompositionCacheVersion());
  useEffect(() => subscribeCompositionCache(setVersion), []);
  return version;
};
