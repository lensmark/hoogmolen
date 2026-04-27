/**
 * SUITES — T01 data (6 duplexsuites A1–A6)
 * Single source of truth for suite detail pages.
 * Velden Guesty Open API-compatibel (id, accommodates, basePrice, etc.)
 */

export interface SuiteData {
  /** Guesty: _id  •  Wireframe page-id */
  id: string;
  /** URL slug (relative to /overnachten/duplexsuites/) */
  slug: string;
  /** Suite code A1..A6 */
  code: string;
  /** Bv. "De Fries" */
  name: string;
  /** Hero ondertitel */
  tagline: string;
  /** Beschrijvende paragrafen (5-star copy) */
  description: string[];
  /** Guesty: accommodates */
  capacity: number;
  /** Guesty: bedrooms */
  bedrooms: number;
  /** Guesty: bathrooms */
  bathrooms: number;
  /** Slaapindeling */
  beds: { room: string; description: string }[];
  /** Type comfort: bv. "Duplex 2 verdiepingen" */
  type: string;
  /** Vanaf-prijs per nacht */
  pricePerNight: number;
  /** Externe boekings-URL (legacy hoogmolen.com) */
  bookingUrl: string;
  /** Faciliteiten */
  amenities: string[];
  /** Unique selling points */
  highlights: string[];
  /** Optionele gastreview-score (0-5) */
  guestScore?: number;
  /** Aantal reviews */
  reviewCount?: number;
}

const BOOKING_BASE = "https://www.hoogmolen.com";

export const SUITES: SuiteData[] = [
  {
    id: "ds-a1",
    slug: "suite-a1",
    code: "A1",
    name: "De Fries",
    tagline: "Uiterst linkse duplexsuite — voor 4 gasten over twee verdiepingen",
    description: [
      "De Fries — de eerste van zes intieme duplexsuites — verwelkomt u over twee verdiepingen achter een eigen voordeur. Op de begane grond een sfeervolle zithoek met zetelbed, een eigen badkamer en directe toegang tot uw overdekte privéterras.",
      "Boven wachten twee comfortabele éénpersoonsboxsprings onder schuine dakpartijen — een rustige slaapkamer waar u 's ochtends ontwaakt bij het zachte ruisen van de Abeek.",
    ],
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { room: "Beneden", description: "1 zetelbed (1m40)" },
      { room: "Boven", description: "2 éénpersoonsboxsprings" },
    ],
    type: "Duplex • 2 verdiepingen",
    pricePerNight: 150,
    bookingUrl: `${BOOKING_BASE}/de-fries`,
    amenities: [
      "Privé-ingang",
      "Privé overdekt terras",
      "Eigen badkamer met douche",
      "Nespresso-koffiemachine",
      "Bedlinnen & handdoeken",
      "Verzorgingsproducten",
      "Gratis high-speed wifi",
      "Gratis parking",
      "Airconditioning",
    ],
    highlights: [
      "Authentieke duplex over 2 verdiepingen",
      "Eigen overdekt terras aan de tuinzijde",
      "Volledig privé voor maximaal 4 gasten",
    ],
  },
  {
    id: "ds-a2",
    slug: "suite-a2",
    code: "A2",
    name: "De Fjord",
    tagline: "De tweede duplexsuite — werkplek inbegrepen, voor 4 gasten",
    description: [
      "De Fjord biedt op de begane grond een gezellige zitruimte met zetelbed, een handige bureau-werkplek, een eigen badkamer en directe toegang tot het overdekte terras.",
      "Boven slapen twee gasten in comfortabele éénpersoonsboxsprings — perfect voor wie werk en verblijf wil combineren.",
    ],
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { room: "Beneden", description: "1 zetelbed (1m40)" },
      { room: "Boven", description: "2 éénpersoonsboxsprings" },
    ],
    type: "Duplex • met werkplek",
    pricePerNight: 150,
    bookingUrl: `${BOOKING_BASE}/de-fjord`,
    amenities: [
      "Privé-ingang",
      "Bureau / werkplek",
      "Privé overdekt terras",
      "Eigen badkamer",
      "Nespresso-koffiemachine",
      "Bedlinnen & handdoeken",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "Inclusief volwaardige werkplek",
      "Privé terras met zicht op de tuin",
      "Ideaal voor business+leisure",
    ],
  },
  {
    id: "ds-a3",
    slug: "suite-a3",
    code: "A3",
    name: "De Brabander",
    tagline: "De derde duplexsuite — eikenhouten balken, voor 4 gasten",
    description: [
      "De Brabander combineert beneden een knusse zithoek met zetelbed, bureau, eigen badkamer en privéterras. Boven twee comfortabele éénpersoonsboxsprings onder authentieke eikenhouten balken.",
      "Hooggewaardeerd door onze gasten — een persoonlijke favoriet voor wie karakter zoekt.",
    ],
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { room: "Beneden", description: "1 zetelbed (1m40)" },
      { room: "Boven", description: "2 éénpersoonsboxsprings" },
    ],
    type: "Duplex • eikenhouten balken",
    pricePerNight: 150,
    bookingUrl: `${BOOKING_BASE}/de-brabander`,
    amenities: [
      "Privé-ingang",
      "Bureau / werkplek",
      "Privé overdekt terras",
      "Eigen badkamer",
      "Authentieke eikenhouten balken",
      "Nespresso-koffiemachine",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "Authentieke eikenhouten balken",
      "Eigen overdekt terras",
      "Hoog gewaardeerd door gasten (4.75/5)",
    ],
    guestScore: 4.75,
    reviewCount: 28,
  },
  {
    id: "ds-a4",
    slug: "suite-a4",
    code: "A4",
    name: "De Draver",
    tagline: "De vierde duplexsuite — klassieke charme, voor 4 gasten",
    description: [
      "De Draver biedt beneden een gezellige zitruimte met zetelbed en eigen badkamer, met directe doorgang naar het overdekte terras.",
      "Op de bovenverdieping rusten twee gasten in comfortabele éénpersoonsboxsprings, in een kamer waar de stilte van het landgoed merkbaar is.",
    ],
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { room: "Beneden", description: "1 zetelbed (1m40)" },
      { room: "Boven", description: "2 éénpersoonsboxsprings" },
    ],
    type: "Duplex • klassiek",
    pricePerNight: 150,
    bookingUrl: `${BOOKING_BASE}/de-draver`,
    amenities: [
      "Privé-ingang",
      "Privé overdekt terras",
      "Eigen badkamer",
      "Nespresso-koffiemachine",
      "Bedlinnen & handdoeken",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "Klassieke duplex-indeling",
      "Privé terras",
      "Rustige slaapkamer boven",
    ],
  },
  {
    id: "ds-a5",
    slug: "suite-a5",
    code: "A5",
    name: "De Shetlander",
    tagline: "De compacte duplexsuite — intiem, voor 2 gasten",
    description: [
      "De Shetlander is de meest intieme van de zes suites: speciaal ontworpen voor twee gasten die samen even op adem willen komen.",
      "Een knusse zithoek beneden, eigen badkamer, privéterras — en boven een comfortabele slaapruimte. Klein van formaat, groot in karakter.",
    ],
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    beds: [
      { room: "Boven", description: "1 tweepersoonsbed (of 2 éénpersoonsboxsprings)" },
    ],
    type: "Duplex • intiem voor 2",
    pricePerNight: 150,
    bookingUrl: `${BOOKING_BASE}/de-shetlander`,
    amenities: [
      "Privé-ingang",
      "Privé overdekt terras",
      "Eigen badkamer",
      "Nespresso-koffiemachine",
      "Bedlinnen & handdoeken",
      "Gratis high-speed wifi",
      "Gratis parking",
    ],
    highlights: [
      "Speciaal voor koppels — intiem en privé",
      "Eigen overdekt terras",
      "Voordeligste duplexsuite van het landgoed",
    ],
  },
  {
    id: "ds-a6",
    slug: "suite-a6",
    code: "A6",
    name: "De Jutlander",
    tagline: "De ruimste duplexsuite — voor families tot 6 gasten",
    description: [
      "De Jutlander is de grootste van de zes suites en biedt comfortabel plaats aan zes gasten — ideaal voor families of vriendengroepjes die samen willen verblijven met behoud van eigen privacy.",
      "Beneden een ruime woonkamer met zetelbed, eigen badkamer en privéterras. Boven een uitgebreide slaapindeling met meerdere bedden onder schuine dakpartijen.",
    ],
    capacity: 6,
    bedrooms: 2,
    bathrooms: 1,
    beds: [
      { room: "Beneden", description: "1 zetelbed (1m60)" },
      { room: "Boven", description: "4 éénpersoonsboxsprings" },
    ],
    type: "Duplex • familie / 6 pers.",
    pricePerNight: 180,
    bookingUrl: `${BOOKING_BASE}/de-jutlander`,
    amenities: [
      "Privé-ingang",
      "Ruime woonkamer beneden",
      "Privé overdekt terras",
      "Eigen badkamer",
      "Nespresso-koffiemachine",
      "Bedlinnen & handdoeken",
      "Gratis high-speed wifi",
      "Gratis parking",
      "Airconditioning",
    ],
    highlights: [
      "Ruimste duplexsuite — tot 6 gasten",
      "Geschikt voor families",
      "Privé terras en eigen badkamer",
    ],
  },
];

export const getSuiteBySlug = (slug: string): SuiteData | undefined =>
  SUITES.find((s) => s.slug === slug || s.id === slug);
