/**
 * UNITS — Single Source of Truth voor alle accommodaties
 * Veldnamen alvast Guesty Open API-compatibel (id, price, availability, etc.)
 * voor toekomstige live-integratie.
 */

export type UnitCategory = "vakantiewoning" | "duplexsuite" | "groepsverblijf" | "kamer";

export interface UnitPrice {
  /** Guesty: basePrice (weekend) */
  weekendBase: number;
  weekdayBase: number;
  weekBase?: number;
  midweekBase?: number;
  /** Guesty: extraGuestFee */
  extraPerPerson: number;
  /** Guesty: cleaningFee */
  cleaningFee: number;
  /** Guesty: occupancy */
  baseOccupancy: number;
}

export interface Unit {
  /** Guesty: _id */
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: UnitCategory;
  /** Guesty: title */
  title: string;
  tagline: string;
  /** marketing description, "5-star copy" */
  description: string[];
  /** Guesty: accommodates */
  capacity: { min: number; max: number };
  /** Guesty: bedrooms */
  bedrooms: number;
  /** Guesty: bathrooms */
  bathrooms: number;
  /** sleeping arrangements detail */
  beds: { room: string; description: string }[];
  /** amenities (Guesty: amenities) */
  amenities: string[];
  /** unique selling points */
  highlights: string[];
  /** Guesty: prices */
  pricing: UnitPrice;
  /** booking external URL (legacy hoogmolen.com) */
  bookingUrl: string;
  /** featured on homepage */
  featured: boolean;
  /**
   * Hero-achtergrond voor UnitDetail-pagina + (optioneel) UnitCard.
   * Accepteert Cloudflare custom-ID óf volledige URL (auto-detect).
   * Leeg → fallback naar gradient via iconHint.
   */
  heroImage?: string;
  /**
   * Alias voor `heroImage` — Cloudflare custom-ID conventie.
   * Beide velden worden gelezen; `imageId` wint als beide gezet zijn.
   */
  imageId?: string;
  /**
   * Geordende beeld-lijst voor sliders en thumbnail-grids op overzichtspagina's
   * (DuplexsuitesOverview, KamersOverview, Vakantiewoningen) en de unit-detailpagina.
   * Auto-detect: CF-ID óf full URL. Lege lijst → gradient-placeholder via UnitSlider.
   */
  galleryImages?: string[];
  /** semantic icon for placeholder gradients */
  iconHint: "house" | "horse" | "water" | "estate" | "suite" | "room";
}

/**
 * Booking URLs — single source of truth: propertyConfig.ts (Guesty property IDs).
 * Mapping slug → exacte hoogmolen.com/nl/properties/<id> URL.
 */
import { PROPERTIES } from "./propertyConfig";

const BOOKING_URL = (slug: string): string => {
  const p = PROPERTIES.find((x) => x.slug === slug);
  if (!p) {
    console.warn(`[unitsConfig] No bookingUrl found for slug "${slug}"`);
    return "https://www.hoogmolen.com";
  }
  return p.bookingUrl;
};

export const UNITS: Unit[] = [
  {
    id: "peerdermolen",
    slug: "peerdermolen",
    name: "Peerdermolen",
    shortName: "Peerdermolen",
    category: "vakantiewoning",
    title: "Vakantiewoning Peerdermolen",
    tagline: "De volledige linkerwoning, voor 8 tot 12 gasten",
    description: [
      "Achter een eeuwenoude bakstenen gevel ontvouwt zich Peerdermolen — een statige vakantiewoning waar erfgoed en verfijnd comfort elkaar in stilte ontmoeten. Vijf elegante slaapkamers, elk met eigen badkamer, vormen het hart van een woning die volledig de uwe is tijdens uw verblijf.",
      "Open de privé-ingang, betreed de gezellige eetkamer en laat de tijd vertragen. Op het overdekte terras serveert u 's avonds aperitieven terwijl de Abeek murmelend voorbij de molen stroomt. De omsloten privétuin ligt klaar voor lange ontbijten in de zon.",
    ],
    capacity: { min: 1, max: 12 },
    bedrooms: 5,
    bathrooms: 5,
    beds: [
      { room: "Slaapkamer 1", description: "1 tweepersoonsbed" },
      { room: "Slaapkamer 2", description: "1 tweepersoonsbed" },
      { room: "Slaapkamer 3", description: "1 tweepersoonsbed" },
      { room: "Slaapkamer 4", description: "1 tweepersoonsbed" },
      { room: "Slaapkamer 5", description: "1 tweepersoonsbed" },
      { room: "Woonkamer 2", description: "1 zetelbed (1m60)" },
    ],
    amenities: [
      "Volledig ingerichte keuken",
      "Nespresso, Senseo & filterkoffie",
      "BBQ op terras",
      "Vaatwasser",
      "Gezellige eetkamer",
      "Privé overdekt terras",
      "Privé tuin",
      "Privé-ingang",
      "Bedlinnen & handdoeken inbegrepen",
      "Verzorgingsproducten in badkamer",
      "Airconditioning in alle kamers",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "5 slaapkamers, elk met eigen badkamer",
      "Privé tuin & overdekt terras",
      "Tot 12 gasten in volledige privacy",
      "Authentieke molengeschiedenis",
    ],
    pricing: {
      weekendBase: 450,
      weekdayBase: 200,
      weekBase: 1250,
      midweekBase: 1150,
      extraPerPerson: 40,
      cleaningFee: 350,
      baseOccupancy: 8,
    },
    bookingUrl: BOOKING_URL("peerdermolen"),
    featured: true,
    iconHint: "house",
  },
  {
    id: "peerdermolen-plus",
    slug: "peerdermolen-plus",
    name: "Peerdermolen Plus",
    shortName: "Peerdermolen +",
    category: "vakantiewoning",
    title: "Peerdermolen Plus — met Molenhuys",
    tagline: "Peerdermolen + duplexsuite 5-6 + Molenhuys, tot 20 gasten",
    description: [
      "De Plus-formule voegt aan Peerdermolen de aangrenzende duplexsuite én exclusieve toegang tot het sfeervolle Molenhuys toe — een authentieke ontspanningsruimte met professioneel uitgeruste keuken, ingerichte bar met tap, ping-pong, darts en kicker.",
      "Ideaal voor families en vriendengroepen die het beste van twee werelden willen: de privacy van een eigen vakantiewoning, gecombineerd met een sociale ruimte waar het hele gezelschap samenkomt.",
    ],
    capacity: { min: 1, max: 20 },
    bedrooms: 7,
    bathrooms: 7,
    beds: [
      { room: "Peerdermolen", description: "5 tweepersoonsbedden + 1 zetelbed" },
      { room: "Duplexsuite 5", description: "2 eenpersoonsbedden" },
      { room: "Duplexsuite 6", description: "6 eenpersoonsbedden" },
    ],
    amenities: [
      "Alles van Peerdermolen",
      "Exclusieve toegang Molenhuys",
      "Professionele keuken in Molenhuys",
      "Selfservice bar met tap",
      "Pingpong, darts, kicker",
      "Speeltuin met springkussen",
    ],
    highlights: [
      "Privacy én een sociale ontmoetingsplek",
      "Tot 20 gasten",
      "Molenhuys exclusief voor uw groep",
    ],
    pricing: { weekendBase: 700, weekdayBase: 380, weekBase: 1850, midweekBase: 1970, extraPerPerson: 40, cleaningFee: 450, baseOccupancy: 13 },
    bookingUrl: BOOKING_URL("peerdermolen-plus"),
    featured: false,
    iconHint: "house",
  },
  {
    id: "watermolen",
    slug: "watermolen",
    name: "Watermolen",
    shortName: "Watermolen",
    category: "vakantiewoning",
    title: "Vakantiewoning Watermolen",
    tagline: "De rechterwoning, voor 8 tot 17 gasten aan de Abeekvallei",
    description: [
      "Watermolen is een ode aan de geschiedenis van het landgoed: bakstenen muren, eikenhouten balken en een open haard die kraakt bij het vallen van de avond. Vijf ruime slaapkamers met zeventien éénpersoonsbedden bieden plaats aan grote vriendengroepen, sportteams of families.",
      "Open de deur naar het overdekte terras, en uw privétuin ligt klaar — een stille uitnodiging om te ontspannen aan de oever van de Abeek.",
    ],
    capacity: { min: 1, max: 17 },
    bedrooms: 5,
    bathrooms: 5,
    beds: [
      { room: "Slaapkamer 1", description: "5 eenpersoonsbedden" },
      { room: "Slaapkamer 2", description: "2 eenpersoonsbedden" },
      { room: "Slaapkamer 3", description: "3 eenpersoonsbedden" },
      { room: "Slaapkamer 4", description: "4 eenpersoonsbedden" },
      { room: "Slaapkamer 5", description: "3 eenpersoonsbedden" },
    ],
    amenities: [
      "Volledig ingerichte keuken",
      "Open haard",
      "Ruime woonkamer",
      "BBQ op terras",
      "Vaatwasser",
      "Privé overdekt terras",
      "Privé tuin",
      "Airconditioning",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "17 éénpersoonsbedden — perfect voor groepen",
      "Open haard en historische details",
      "Privé tuin met overdekt terras",
    ],
    pricing: { weekendBase: 750, weekdayBase: 350, weekBase: 1950, midweekBase: 1850, extraPerPerson: 40, cleaningFee: 450, baseOccupancy: 8 },
    bookingUrl: BOOKING_URL("watermolen"),
    featured: true,
    iconHint: "water",
  },
  {
    id: "watermolen-plus",
    slug: "watermolen-plus",
    name: "Watermolen Plus",
    shortName: "Watermolen +",
    category: "vakantiewoning",
    title: "Watermolen Plus — met Molenhuys",
    tagline: "Watermolen + duplexsuite + Molenhuys, tot 25 gasten",
    description: [
      "Watermolen Plus combineert de complete Watermolen met duplexsuite 5-6 en exclusief gebruik van het Molenhuys. Tot 25 gasten kunnen samen verblijven met behoud van privacy, en samenkomen in een professioneel uitgeruste ontspanningsruimte.",
    ],
    capacity: { min: 1, max: 25 },
    bedrooms: 7,
    bathrooms: 7,
    beds: [{ room: "Totaal", description: "25 éénpersoonsbedden verdeeld over 7 kamers" }],
    amenities: ["Alles van Watermolen", "Molenhuys exclusief", "Professionele keuken", "Bar met tap", "Spelruimte"],
    highlights: ["Tot 25 gasten", "Eigen ontspanningsruimte", "Inclusief Molenhuys"],
    pricing: { weekendBase: 950, weekdayBase: 500, weekBase: 2400, midweekBase: 2500, extraPerPerson: 40, cleaningFee: 500, baseOccupancy: 18 },
    bookingUrl: BOOKING_URL("watermolen-plus"),
    featured: false,
    iconHint: "water",
  },
  {
    id: "volmolen",
    slug: "volmolen",
    name: "Volmolen",
    shortName: "Volmolen",
    category: "groepsverblijf",
    title: "Vakantiewoning Volmolen",
    tagline: "Watermolen + Peerdermolen + Molenhuys, tot 29 gasten",
    description: [
      "Volmolen verenigt beide vakantiewoningen tot één weids domein voor 29 gasten. Twee complete keukens, tien slaapkamers met eigen badkamer, twee gezellige eetkamers en de exclusieve toegang tot het Molenhuys.",
    ],
    capacity: { min: 1, max: 29 },
    bedrooms: 10,
    bathrooms: 10,
    beds: [{ room: "Totaal", description: "5 tweepersoonsbedden, 17 éénpersoonsbedden, 1 zetelbed" }],
    amenities: ["2 volledig ingerichte keukens", "2 eetkamers", "Molenhuys", "Privé tuinen & terrassen"],
    highlights: ["Twee woningen verbonden", "Tot 29 gasten", "Exclusief Molenhuys"],
    pricing: { weekendBase: 1175, weekdayBase: 650, weekBase: 2850, midweekBase: 3100, extraPerPerson: 40, cleaningFee: 500, baseOccupancy: 23 },
    bookingUrl: BOOKING_URL("volmolen"),
    featured: false,
    iconHint: "estate",
  },
  {
    id: "volmolen-plus",
    slug: "volmolen-plus",
    name: "Volmolen Plus",
    shortName: "Volmolen +",
    category: "groepsverblijf",
    title: "Volmolen Plus",
    tagline: "Beide woningen + 2 duplexsuites + Molenhuys, tot 37 gasten",
    description: [
      "De grootste formule vóór het volledige landgoed. Beide vakantiewoningen, twee aanvullende duplexsuites en het Molenhuys — voor groepen tot 37 personen die alles uit De Hoogmolen willen halen.",
    ],
    capacity: { min: 1, max: 37 },
    bedrooms: 12,
    bathrooms: 12,
    beds: [{ room: "Totaal", description: "5 tweepersoonsbedden, 25 éénpersoonsbedden, 1 zetelbed" }],
    amenities: ["2 keukens", "12 badkamers", "Molenhuys", "2 duplexsuites extra"],
    highlights: ["Tot 37 gasten", "Maximaal comfort"],
    pricing: { weekendBase: 1600, weekdayBase: 850, weekBase: 3700, midweekBase: 3900, extraPerPerson: 40, cleaningFee: 500, baseOccupancy: 30 },
    bookingUrl: BOOKING_URL("volmolen-plus"),
    featured: false,
    iconHint: "estate",
  },
  {
    id: "landgoed-volledig",
    slug: "landgoed-de-hoogmolen",
    name: "Landgoed De Hoogmolen",
    shortName: "Volledig Landgoed",
    category: "groepsverblijf",
    title: "Het volledige Landgoed De Hoogmolen",
    tagline: "Het complete erfgoeddomein, tot 53 gasten",
    description: [
      "Wanneer u het volledige Landgoed De Hoogmolen boekt, sluit u even de poort achter u — en is het hele eeuwenoude domein van u. Twee vakantiewoningen, zes duplexsuites, het Molenhuys, de privétuinen en het klaterende geluid van het water langs de molen: alles, exclusief voor uw gezelschap van maximaal 53 gasten.",
      "De ultieme keuze voor familiereünies, bruiloften, bedrijfsretraites of uitzonderlijke vieringen die om méér ruimte, méér privacy en méér karakter vragen.",
    ],
    capacity: { min: 30, max: 53 },
    bedrooms: 16,
    bathrooms: 16,
    beds: [{ room: "Totaal", description: "5 tweepersoonsbedden, 33 éénpersoonsbedden, 5 zetelbedden" }],
    amenities: [
      "2 volledig ingerichte keukens",
      "16 badkamers",
      "Molenhuys exclusief",
      "Bar met tap, professionele keuken",
      "Pingpong, darts, kicker",
      "Speeltuin met springkussen",
      "Visvijver",
      "Paardenstallen (op aanvraag)",
      "Privé tuinen & terrassen",
      "Gratis parking",
    ],
    highlights: [
      "Het hele domein, exclusief van u",
      "Tot 53 gasten",
      "16 slaapkamers, elk met eigen badkamer",
      "Geschikt voor reünies, bruiloften, retraites",
    ],
    pricing: { weekendBase: 2100, weekdayBase: 1150, weekBase: 4800, midweekBase: 5200, extraPerPerson: 40, cleaningFee: 600, baseOccupancy: 40 },
    bookingUrl: BOOKING_URL("landgoed-de-hoogmolen"),
    featured: true,
    iconHint: "estate",
  },
  // Duplexsuites
  {
    id: "de-fries",
    slug: "duplexsuite/de-fries",
    name: "De Fries",
    shortName: "A1 — De Fries",
    category: "duplexsuite",
    title: "Duplexsuite A1 — De Fries",
    tagline: "Uiterst linkse duplexsuite, tot 4 gasten",
    description: [
      "De Fries — de eerste van zes intieme duplexsuites — verwelkomt u over twee verdiepingen. Op de begane grond een sfeervolle zithoek met zetelbed, een eigen badkamer en directe toegang tot uw overdekte privéterras. Boven wachten twee comfortabele éénpersoonsboxsprings onder schuine dakpartijen.",
    ],
    capacity: { min: 1, max: 4 },
    bedrooms: 1,
    bathrooms: 1,
    beds: [{ room: "Beneden", description: "1 zetelbed (1m40)" }, { room: "Boven", description: "2 éénpersoonsboxsprings" }],
    amenities: ["Privé-ingang", "Privé overdekt terras", "Nespresso", "Eigen badkamer", "Bedlinnen & handdoeken", "Verzorgingsproducten", "Wifi"],
    highlights: ["Authentieke duplex over 2 verdiepingen", "Eigen overdekt terras", "Tot 4 gasten"],
    pricing: { weekendBase: 180, weekdayBase: 120, extraPerPerson: 30, cleaningFee: 75, baseOccupancy: 2 },
    bookingUrl: BOOKING_URL("de-fries"),
    featured: true,
    iconHint: "suite",
  },
  {
    id: "de-fjord",
    slug: "duplexsuite/de-fjord",
    name: "De Fjord",
    shortName: "A2 — De Fjord",
    category: "duplexsuite",
    title: "Duplexsuite A2 — De Fjord",
    tagline: "De tweede duplexsuite, tot 4 gasten",
    description: ["De Fjord biedt op de begane grond een gezellige zitruimte met zetelbed, bureau/tafel, eigen badkamer en directe toegang tot het overdekte terras. Boven slapen twee gasten in comfortabele éénpersoonsboxsprings."],
    capacity: { min: 1, max: 4 },
    bedrooms: 1, bathrooms: 1,
    beds: [{ room: "Beneden", description: "1 zetelbed (1m40)" }, { room: "Boven", description: "2 éénpersoonsboxsprings" }],
    amenities: ["Privé-ingang", "Bureau/werkplek", "Privé terras", "Eigen badkamer", "Nespresso", "Wifi"],
    highlights: ["Met werkplek", "Privé terras", "Tot 4 gasten"],
    pricing: { weekendBase: 180, weekdayBase: 120, extraPerPerson: 30, cleaningFee: 75, baseOccupancy: 2 },
    bookingUrl: BOOKING_URL("de-fjord"),
    featured: false,
    iconHint: "suite",
  },
  {
    id: "de-brabander",
    slug: "duplexsuite/de-brabander",
    name: "De Brabander",
    shortName: "A3 — De Brabander",
    category: "duplexsuite",
    title: "Duplexsuite A3 — De Brabander",
    tagline: "De derde duplexsuite, tot 4 gasten",
    description: ["De Brabander combineert beneden een knusse zithoek met zetelbed, bureau, eigen badkamer en privéterras. Boven twee comfortabele éénpersoonsboxsprings onder eikenhouten balken."],
    capacity: { min: 1, max: 4 },
    bedrooms: 1, bathrooms: 1,
    beds: [{ room: "Beneden", description: "1 zetelbed (1m40)" }, { room: "Boven", description: "2 éénpersoonsboxsprings" }],
    amenities: ["Privé-ingang", "Bureau", "Privé terras", "Eigen badkamer", "Nespresso", "Wifi"],
    highlights: ["Eikenhouten balken", "Privé terras", "Tot 4 gasten"],
    pricing: { weekendBase: 180, weekdayBase: 120, extraPerPerson: 30, cleaningFee: 75, baseOccupancy: 2 },
    bookingUrl: BOOKING_URL("de-brabander"),
    featured: false,
    iconHint: "suite",
  },
  {
    id: "de-draver",
    slug: "duplexsuite/de-draver",
    name: "De Draver",
    shortName: "A4 — De Draver",
    category: "duplexsuite",
    title: "Duplexsuite A4 — De Draver",
    tagline: "De vierde duplexsuite, tot 4 gasten",
    description: ["De Draver biedt beneden een gezellige zitruimte met zetelbed en eigen badkamer, met directe doorgang naar het overdekte terras. Op de bovenverdieping rusten twee gasten in comfortabele éénpersoonsboxsprings."],
    capacity: { min: 1, max: 4 },
    bedrooms: 1, bathrooms: 1,
    beds: [{ room: "Beneden", description: "1 zetelbed (1m40)" }, { room: "Boven", description: "2 éénpersoonsboxsprings" }],
    amenities: ["Privé-ingang", "Privé terras", "Eigen badkamer", "Nespresso", "Wifi"],
    highlights: ["Authentieke duplex", "Privé terras", "Tot 4 gasten"],
    pricing: { weekendBase: 180, weekdayBase: 120, extraPerPerson: 30, cleaningFee: 75, baseOccupancy: 2 },
    bookingUrl: BOOKING_URL("de-draver"),
    featured: false,
    iconHint: "suite",
  },
];

export const getUnitBySlug = (slug: string): Unit | undefined =>
  UNITS.find((u) => u.slug === slug || u.id === slug);

export const getUnitsByCategory = (cat: UnitCategory): Unit[] =>
  UNITS.filter((u) => u.category === cat);

export const getFeaturedUnits = (): Unit[] => UNITS.filter((u) => u.featured);

export const getGroupUnits = (): Unit[] =>
  UNITS.filter((u) => u.capacity.max >= 12).sort((a, b) => a.capacity.max - b.capacity.max);
