/**
 * breadcrumbConfig.ts — labels per URL-segment voor BreadcrumbList JSON-LD.
 * Werkt voor alle 77 routes via segmentwise opbouw + slug-fallback naar
 * propertyConfig (zodat bv. /overnachten/vakantiewoningen/watermolen → "Watermolen").
 */
import { getProperty } from "@/config/propertyConfig";

const SEGMENT_LABELS: Record<string, string> = {
  overnachten: "Overnachten",
  vakantiewoningen: "Vakantiewoningen",
  "suites-kamers": "Suites & kamers",
  duplexsuites: "Duplexsuites",
  kamers: "Kamers",
  boekingsinformatie: "Boekingsinformatie",
  groepsverblijf: "Groepsverblijf",
  "10-20-personen": "10–20 personen",
  "20-30-personen": "20–30 personen",
  "30-53-personen": "30–53 personen",
  aanvragen: "Aanvragen",
  vergaderen: "Vergaderen",
  vergaderformules: "Vergaderformules",
  faciliteiten: "Faciliteiten",
  "vergaderen-met-overnachting": "Met overnachting",
  teambuildings: "Teambuildings",
  "in-limburg": "In Limburg",
  "met-overnachting": "Met overnachting",
  "activiteiten-op-en-rond-het-domein": "Op het domein",
  paardenlogies: "Paardenlogies",
  activiteiten: "Activiteiten",
  fietsen: "Fietsen",
  wandelen: "Wandelen",
  paardrijden: "Paardrijden",
  "in-de-omgeving": "In de omgeving",
  familie: "Familie",
  culinair: "Culinair",
  praktisch: "Praktisch",
  "wall-of-love": "Wall of Love",
  ervaringen: "Ervaringen",
  geschiedenis: "Geschiedenis",
  erfgoed: "Erfgoed",
  natuur: "Natuur",
  duurzaamheid: "Duurzaamheid",
  "over-ons": "Over ons",
  team: "Team",
  contact: "Contact",
  faq: "FAQ",
  watermolen: "De Watermolen",
  omgeving: "Omgeving",
};

const humanize = (slug: string): string =>
  slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const labelForSegment = (segment: string, isLast: boolean): string => {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (isLast) {
    const property = getProperty(segment);
    if (property) return property.name;
  }
  return humanize(segment);
};

export interface Crumb {
  name: string;
  url: string;
}

export const buildBreadcrumbs = (
  pathname: string,
  origin = "https://hoogmolen.be",
): Crumb[] => {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ name: "Home", url: `${origin}/` }];
  let acc = "";
  segments.forEach((segment, i) => {
    acc += `/${segment}`;
    crumbs.push({
      name: labelForSegment(segment, i === segments.length - 1),
      url: `${origin}${acc}`,
    });
  });
  return crumbs;
};
