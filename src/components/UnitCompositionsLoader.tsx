/**
 * UnitCompositionsLoader — vult de in-memory composition cache vanaf mount.
 *
 * Render dit één keer hoog in de tree (binnen AdminModeProvider) zodat alle
 * publieke pagina's via `getExtraLocationIds` (sync) de DB-data zien zonder
 * elke pagina los te moeten queryen. Gebruikt realtime updates.
 *
 * Geeft niets terug — puur side-effect. Faalt stilletjes (config-fallback
 * blijft werken).
 */
import { useUnitCompositions } from "@/hooks/useUnitCompositions";

export const UnitCompositionsLoader = () => {
  useUnitCompositions();
  return null;
};

export default UnitCompositionsLoader;
