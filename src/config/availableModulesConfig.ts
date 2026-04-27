/**
 * availableModulesConfig.ts — Vaste lijst van atomaire bouwstenen die in de
 * admin "Samenstellingen"-beheerder als checkboxes verschijnen.
 *
 * Een module = een location-ID prefix in image_library waarvan foto's
 * automatisch geaggregeerd kunnen worden in een samengestelde formule.
 *
 * Uitbreiden:
 *   - Voeg een nieuw object toe aan AVAILABLE_MODULES met een unieke
 *     `locationId` (volgens de bestaande hoogmolen-verblijf-* conventie) en
 *     een leesbare `label`. Optioneel: groepeer via `group`.
 */

export interface ModuleDefinition {
  locationId: string;
  label: string;
  group: "Vakantiewoningen" | "Duplexsuites" | "Kamers" | "Gemeenschappelijk";
}

export const AVAILABLE_MODULES: ModuleDefinition[] = [
  // Vakantiewoningen (basis-modules voor Volmolen / Plus / Landgoed)
  { locationId: "hoogmolen-verblijf-watermolen", label: "Watermolen", group: "Vakantiewoningen" },
  { locationId: "hoogmolen-verblijf-peerdermolen", label: "Peerdermolen", group: "Vakantiewoningen" },

  // Duplexsuites A1-A6
  { locationId: "hoogmolen-verblijf-duplexsuite-a1", label: "A1 — De Fries", group: "Duplexsuites" },
  { locationId: "hoogmolen-verblijf-duplexsuite-a2", label: "A2 — De Fjord", group: "Duplexsuites" },
  { locationId: "hoogmolen-verblijf-duplexsuite-a3", label: "A3 — De Brabander", group: "Duplexsuites" },
  { locationId: "hoogmolen-verblijf-duplexsuite-a4", label: "A4 — De Draver", group: "Duplexsuites" },
  { locationId: "hoogmolen-verblijf-duplexsuite-a5", label: "A5 — De Shetlander", group: "Duplexsuites" },
  { locationId: "hoogmolen-verblijf-duplexsuite-a6", label: "A6 — De Jutlander", group: "Duplexsuites" },

  // Kamers B1-B5
  { locationId: "hoogmolen-verblijf-kamer-b1", label: "B1 — Kamer", group: "Kamers" },
  { locationId: "hoogmolen-verblijf-kamer-b2", label: "B2 — Kamer", group: "Kamers" },
  { locationId: "hoogmolen-verblijf-kamer-b3", label: "B3 — Kamer", group: "Kamers" },
  { locationId: "hoogmolen-verblijf-kamer-b4", label: "B4 — Kamer", group: "Kamers" },
  { locationId: "hoogmolen-verblijf-kamer-b5", label: "B5 — Kamer", group: "Kamers" },

  // Gemeenschappelijk
  { locationId: "hoogmolen-verblijf-molenhuys", label: "Molenhuys", group: "Gemeenschappelijk" },
];

/** Vind de leesbare label voor een location-ID (of de ID zelf als fallback). */
export const getModuleLabel = (locationId: string): string =>
  AVAILABLE_MODULES.find((m) => m.locationId === locationId)?.label ?? locationId;

export const MODULE_GROUPS: ModuleDefinition["group"][] = [
  "Vakantiewoningen",
  "Duplexsuites",
  "Kamers",
  "Gemeenschappelijk",
];
