/**
 * propertyConfig.ts — Single Source of Truth voor alle 17 boekbare units.
 * Mapt slug → name, type, capacity, prijs, hoogmolen.com bookingUrl.
 *
 * type bepaalt welk template gebruikt wordt:
 *  - "duplex" → TemplateDuplex (split-level: living beneden, slapen boven)
 *  - "room"   → TemplateRoom   (intieme kamer/suite, comfort-focus)
 *  - "suite"  → TemplateRoom
 *  - "house"  → TemplateHouse  (vakantiewoning of groepslocatie)
 *
 * hasMolenhuys → toont de exclusieve "Molenhuys"-USP sectie (Plus / Volmolen / Landgoed).
 */

export type PropertyType = "duplex" | "room" | "suite" | "house";

export interface Property {
  slug: string;
  name: string;
  type: PropertyType;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  /** vanafprijs per nacht in euro */
  startingPrice: number;
  bookingUrl: string;
  hasMolenhuys: boolean;
  /** korte tagline in hero subline */
  tagline?: string;
  /** SEO-marketing samenvatting (1–3 alinea's) */
  summary?: string[];
  /** badges / highlight-strings naast titel */
  highlights?: string[];
  /** voorzieningen-grid */
  amenities?: string[];
  /** locatie ligging (kort: "Eerste verdieping", "Gelijkvloers") */
  location?: string;
  /** beddenconfiguratie — toont in USP-balk i.p.v. enkel "X+ slaapkamers" (bv. "17 eenpersoons", "5 tweepersoons + zetelbed") */
  bedConfig?: string;
  /**
   * Achtergrond-beeld voor PropertyHero.
   * Accepteert: Cloudflare custom-ID (bv. "hoogmolen-verblijf-peerdermolen-overzicht-01")
   * óf volledige URL (bv. "https://images.unsplash.com/..."). Auto-detect via resolveImageUrl().
   * Wanneer leeg → fallback naar olijfgroene gradient (huidig gedrag).
   */
  heroImage?: string;
  /**
   * Alias voor `heroImage` — Cloudflare custom-ID conventie.
   * Beide velden worden gelezen; `imageId` wint als beide gezet zijn.
   */
  imageId?: string;
  /**
   * Geordende lijst beelden voor PropertyPhotoGrid (1 grote focus-foto + 4 thumbs)
   * en eventuele sliders. Idem auto-detect: CF-ID óf volledige URL.
   * Lege/korte lijst → ontbrekende posities renderen als gradient-placeholder.
   */
  galleryImages?: string[];
  /**
   * Guesty Open API listing-ID (`_id` veld uit GET /listings).
   * Wanneer gezet → 'Boek nu' linkt naar `${HOOGMOLEN_BOOKING_BASE}/${guestyListingId}`
   * en kan een live `prices.basePrice` + `availability.isAvailable` payload
   * (later) `bookingUrl` + `startingPrice` overschrijven via `resolveListing()`.
   */
  guestyListingId?: string;
}

const COMMON_ROOM_AMENITIES = [
  "Eigen badkamer",
  "Boxspringbed",
  "WiFi",
  "Koffie & thee",
  "Gratis parking",
  "Ontbijt mogelijk",
  "Online boekbaar",
];

const COMMON_DUPLEX_AMENITIES = [
  "Privéterras",
  "Eigen badkamer",
  "Boxspringbed",
  "WiFi",
  "Koffie & thee",
  "Gratis parking",
  "Ontbijt mogelijk",
  "Online boekbaar",
];

const COMMON_HOUSE_AMENITIES = [
  "Volledige keuken",
  "WiFi",
  "Gratis parking",
  "Terras/tuin",
  "BBQ",
  "Wasmachine",
  "Vaatwasmachine",
  "Ontbijt mogelijk",
];

export const PROPERTIES: Property[] = [
  /* ───────── KAMERS & SUITE — B-vleugel (Peerdermolen) ───────── */
  {
    slug: "deluxe-kamer-b1",
    name: "Deluxe kamer B1",
    type: "room",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 125,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab7570b2bfa200115e1423",
    hasMolenhuys: false,
    tagline: "Klassieke deluxe kamer · ideaal voor koppels of 2 gasten",
    location: "Eerste verdieping",
    highlights: ["2 eenpersoonsboxsprings + dubbele topper", "Nespresso-koffiemachine", "Klassieke deluxe kamer"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Deluxe kamer B1 ligt op de eerste verdieping van het hoofdgebouw en biedt twee eenpersoonsboxsprings met dubbele topper — naar wens als één royaal bed of twee aparte slapen.",
      "Karaktervolle eikenhouten balken, een eigen badkamer en een Nespresso-machine maken er een verfijnd verblijf van voor koppels of zakelijke gasten.",
    ],
  },
  {
    slug: "deluxe-kamer-b2",
    name: "Deluxe kamer B2",
    type: "room",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 125,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab75b1a1d4f3000dac0881",
    hasMolenhuys: false,
    tagline: "Deluxe kamer · samen met B1 ideaal voor groepjes",
    location: "Eerste verdieping",
    highlights: ["2 eenpersoonsboxsprings + topper", "Combineerbaar met B1", "Eigen badkamer"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Deluxe kamer B2 spiegelt B1 in stijl en comfort — twee eenpersoonsboxsprings met dubbele topper, een eigen badkamer en alle voorzieningen voor een rustig verblijf.",
      "Combineerbaar met B1 voor reisgezelschappen die graag dichtbij elkaar slapen.",
    ],
  },
  {
    slug: "kamer-b3",
    name: "Kamer B3",
    type: "room",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 125,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab758f3901920011bb845d",
    hasMolenhuys: false,
    tagline: "Kamer met tussendeur naar B4 · ook afzonderlijk boekbaar",
    location: "Eerste verdieping",
    highlights: ["Tussendeur naar B4", "Eigen badkamer", "Afzonderlijk boekbaar"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Kamer B3 heeft een tussendeur naar B4 — perfect voor families of groepjes die samen willen logeren met behoud van privacy. Afzonderlijk boekbaar als eenvoudige tweepersoonskamer.",
    ],
  },
  {
    slug: "kamer-b4",
    name: "Kamer B4",
    type: "room",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 125,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab758f3901920011bb845d",
    hasMolenhuys: false,
    tagline: "Kamer met tussendeur naar B3 · ook afzonderlijk boekbaar",
    location: "Eerste verdieping",
    highlights: ["Tussendeur naar B3", "Eigen badkamer", "Afzonderlijk boekbaar"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Kamer B4 sluit via een tussendeur aan op kamer B3. Samen vormen ze de familiekamer B3+B4; afzonderlijk een rustige tweepersoonskamer met eigen badkamer.",
    ],
  },
  {
    slug: "familiekamer-b3-b4",
    name: "Familiekamer B3+B4",
    type: "room",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    startingPrice: 180,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab758f3901920011bb845d",
    hasMolenhuys: false,
    tagline: "Twee kamers met tussendeur · ideaal voor gezin tot 4p",
    location: "Eerste verdieping",
    highlights: ["2 badkamers", "Tussendeur tussen kamers", "Ideaal voor gezin"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Familiekamer B3+B4 combineert twee tweepersoonskamers via een tussendeur tot een gezinsverblijf voor maximaal 4 personen — met twee aparte badkamers en eigen ingang.",
    ],
  },
  {
    slug: "suite-b5",
    name: "Suite B5",
    type: "suite",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ab7532edb6630010ca645b",
    hasMolenhuys: false,
    tagline: "Studio-suite gelijkvloers · 2 slaapkamers · tot 4 personen",
    location: "Gelijkvloers",
    highlights: ["Ruimste B-kamer", "2 slaapkamers", "Studio-opzet"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Suite B5 ligt gelijkvloers en is de ruimste eenheid in de B-vleugel. Met twee slaapkamers, een eigen badkamer en een studio-opzet biedt ze plaats aan maximaal 4 personen.",
    ],
  },

  /* ───────── DUPLEXSUITES MET TERRAS — A-vleugel ───────── */
  {
    slug: "de-fries",
    name: "A1 — De Fries",
    type: "duplex",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65dd9fbd660e4e00124a9889",
    hasMolenhuys: false,
    tagline: "Duplexsuite met terras · slaapkamer boven · 4 personen",
    location: "Duplex · terras",
    highlights: ["Eigen overdekt terras", "Badkamer gelijkvloers", "Slaapkamer boven", "Score 4.15"],
    amenities: COMMON_DUPLEX_AMENITIES,
    summary: [
      "De Fries is de eerste duplexsuite — een split-level verblijf met beneden een zithoek met zetelbed en eigen badkamer, en boven twee comfortabele éénpersoonsboxsprings.",
      "Direct vanuit de zithoek stapt u op uw overdekte privéterras met zicht op de tuin.",
    ],
  },
  {
    slug: "de-fjord",
    name: "A2 — De Fjord",
    type: "duplex",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ddd58b8736c60072daa833",
    hasMolenhuys: false,
    tagline: "Duplexsuite met terras · slaapkamer boven · 4 personen",
    location: "Duplex · terras",
    highlights: ["Bureau/werkplek", "Privé terras", "Slaapkamer boven", "Score 4.70"],
    amenities: COMMON_DUPLEX_AMENITIES,
    summary: [
      "De Fjord biedt beneden een gezellige zithoek met zetelbed, bureau en eigen badkamer — boven slapen twee gasten in éénpersoonsboxsprings onder schuine dakpartijen.",
    ],
  },
  {
    slug: "de-brabander",
    name: "A3 — De Brabander",
    type: "duplex",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65d33c91fde75600136417f4",
    hasMolenhuys: false,
    tagline: "Duplexsuite met terras · slaapkamer boven · 4 personen",
    location: "Duplex · terras",
    highlights: ["Eikenhouten balken", "Privé terras", "Slaapkamer boven", "Score 4.75"],
    amenities: COMMON_DUPLEX_AMENITIES,
    summary: [
      "De Brabander combineert eikenhouten balken met moderne afwerking. Beneden zithoek met zetelbed en badkamer, boven twee éénpersoonsboxsprings — alles direct verbonden met het overdekte terras.",
    ],
  },
  {
    slug: "de-draver",
    name: "A4 — De Draver",
    type: "duplex",
    capacity: 4,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ddd598215286000ff33478",
    hasMolenhuys: false,
    tagline: "Duplexsuite met terras · slaapkamer boven · 4 personen",
    location: "Duplex · terras",
    highlights: ["Authentieke duplex", "Privé terras", "Slaapkamer boven", "Score 4.55"],
    amenities: COMMON_DUPLEX_AMENITIES,
    summary: [
      "De Draver is een klassieke duplexsuite met beneden een zithoek met zetelbed (1m40), een eigen badkamer en directe doorgang naar het overdekte privéterras.",
    ],
  },
  {
    slug: "de-shetlander",
    name: "A5 — De Shetlander",
    type: "room",
    capacity: 2,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ddd5b1215286000ff33785",
    hasMolenhuys: false,
    tagline: "Deluxe gelijkvloers · 1 slaapkamer · tot 2 personen",
    location: "Deluxe · terras",
    highlights: ["Volledig gelijkvloers", "Privé terras", "1 slaapkamer"],
    amenities: COMMON_ROOM_AMENITIES,
    summary: [
      "Suite A5 — De Shetlander — is volledig gelijkvloers, ideaal voor koppels die comfort zoeken zonder trappen. Met privéterras, eigen badkamer en luxe boxspring.",
    ],
  },
  {
    slug: "de-jutlander",
    name: "A6 — De Jutlander",
    type: "duplex",
    capacity: 6,
    bedrooms: 1,
    bathrooms: 1,
    startingPrice: 180,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/65ddd630db79c20070103e63",
    hasMolenhuys: false,
    tagline: "Grootste duplexsuite met terras · slaapkamer boven · tot 6 personen",
    location: "Groepsduplex · terras",
    highlights: ["Grootste suite", "Geschikt tot 6p", "Slaapkamer boven", "Privé terras"],
    amenities: COMMON_DUPLEX_AMENITIES,
    summary: [
      "De Jutlander is de grootste duplexsuite — geschikt voor families of groepjes tot 6 personen. Beneden een ruime woonkamer met zetelbed en badkamer, boven extra slaapplaatsen onder de schuine daken.",
    ],
  },

  /* ───────── GROTE VAKANTIEWONINGEN ───────── */
  {
    slug: "peerdermolen",
    name: "Peerdermolen",
    type: "house",
    capacity: 12,
    bedrooms: 5,
    bathrooms: 5,
    startingPrice: 200,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/66f0f4b52021960012341b3c",
    hasMolenhuys: false,
    tagline: "Vakantiewoning voor 12 personen · 5 slaapkamers met eigen badkamer",
    location: "Linkervleugel landgoed",
    bedConfig: "5 twpers. + zetelbed",
    highlights: ["5 slaapkamers met eigen badkamer", "Privé tuin & overdekt terras", "BBQ"],
    amenities: COMMON_HOUSE_AMENITIES,
    summary: [
      "Peerdermolen is een statige vakantiewoning waar erfgoed en verfijnd comfort elkaar ontmoeten. Vijf elegante slaapkamers — elk met eigen badkamer — vormen het hart van een woning die volledig de uwe is tijdens uw verblijf.",
      "Open de privé-ingang, betreed de gezellige eetkamer en laat de tijd vertragen. Op het overdekte terras serveert u 's avonds aperitieven terwijl de Abeek voorbij de molen stroomt.",
    ],
  },
  {
    slug: "peerdermolen-plus",
    name: "Peerdermolen Plus",
    type: "house",
    capacity: 20,
    bedrooms: 7,
    bathrooms: 7,
    startingPrice: 380,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a1aacd1d03e0011788941",
    hasMolenhuys: true,
    tagline: "Peerdermolen + duplexsuite + Molenhuys · tot 20 personen",
    location: "Linkervleugel + duplex + Molenhuys",
    bedConfig: "7 slpk · mix bedden",
    highlights: ["Inclusief Molenhuys", "7 slaapkamers", "Tot 20 gasten", "Bar met tap"],
    amenities: ["Exclusieve toegang Molenhuys", ...COMMON_HOUSE_AMENITIES],
    summary: [
      "Peerdermolen Plus voegt aan de vakantiewoning de aangrenzende duplexsuite én exclusieve toegang tot het Molenhuys toe — een sfeervolle ontspanningsruimte met professionele keuken, ingerichte bar met tap, ping-pong, darts en kicker.",
      "Ideaal voor families en vriendengroepen die privacy willen combineren met een sociale ruimte waar het hele gezelschap samenkomt.",
    ],
  },
  {
    slug: "watermolen",
    name: "Watermolen",
    type: "house",
    capacity: 17,
    bedrooms: 5,
    bathrooms: 5,
    startingPrice: 350,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a1c707ec4af001191c0c5",
    hasMolenhuys: false,
    tagline: "Vakantiewoning voor 17 personen aan de Abeekvallei",
    location: "Rechtervleugel landgoed",
    bedConfig: "17 eenpersoonsbedden",
    highlights: ["17 éénpersoonsbedden", "Open haard", "Eigen privétuin"],
    amenities: [...COMMON_HOUSE_AMENITIES, "Open haard"],
    summary: [
      "Watermolen is een ode aan de geschiedenis van het landgoed: bakstenen muren, eikenhouten balken en een open haard die kraakt bij het vallen van de avond. Vijf ruime slaapkamers met zeventien éénpersoonsbedden bieden plaats aan grote vriendengroepen, sportteams of families.",
      "Open de deur naar het overdekte terras, en uw privétuin ligt klaar — een stille uitnodiging om te ontspannen aan de oever van de Abeek.",
    ],
  },
  {
    slug: "watermolen-plus",
    name: "Watermolen Plus",
    type: "house",
    capacity: 25,
    bedrooms: 7,
    bathrooms: 7,
    startingPrice: 500,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a1e3a607c3b0012d02b06",
    hasMolenhuys: true,
    tagline: "Watermolen + duplexsuite + Molenhuys · tot 25 personen",
    location: "Rechtervleugel + duplex + Molenhuys",
    bedConfig: "7 slpk · 25 slaapplaatsen",
    highlights: ["Inclusief Molenhuys", "Tot 25 gasten", "Eigen ontspanningsruimte"],
    amenities: ["Exclusieve toegang Molenhuys", ...COMMON_HOUSE_AMENITIES, "Open haard"],
    summary: [
      "Watermolen Plus combineert de complete Watermolen met een duplexsuite en exclusief gebruik van het Molenhuys. Tot 25 gasten kunnen samen verblijven met behoud van privacy.",
    ],
  },
  {
    slug: "volmolen",
    name: "Volmolen",
    type: "house",
    capacity: 29,
    bedrooms: 10,
    bathrooms: 10,
    startingPrice: 650,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a1f61af4404001069e78d",
    hasMolenhuys: true,
    tagline: "Watermolen + Peerdermolen + Molenhuys · tot 29 personen",
    location: "Beide vakantiewoningen + Molenhuys",
    bedConfig: "10 slpk · 29 slaapplaatsen",
    highlights: ["2 keukens", "10 slaapkamers", "Molenhuys exclusief"],
    amenities: ["Exclusieve toegang Molenhuys", ...COMMON_HOUSE_AMENITIES],
    summary: [
      "Volmolen verenigt beide vakantiewoningen tot één weids domein voor 29 gasten. Twee complete keukens, tien slaapkamers met eigen badkamer, twee gezellige eetkamers en exclusieve toegang tot het Molenhuys.",
    ],
  },
  {
    slug: "volmolen-plus",
    name: "Volmolen Plus",
    type: "house",
    capacity: 37,
    bedrooms: 12,
    bathrooms: 12,
    startingPrice: 850,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a20d612bb5d00106d3554",
    hasMolenhuys: true,
    tagline: "Beide woningen + 2 duplexsuites + Molenhuys · tot 37 personen",
    location: "Beide woningen + 2 duplexen + Molenhuys",
    bedConfig: "12 slpk · 37 slaapplaatsen",
    highlights: ["12 slaapkamers", "Tot 37 gasten", "Molenhuys exclusief"],
    amenities: ["Exclusieve toegang Molenhuys", ...COMMON_HOUSE_AMENITIES],
    summary: [
      "De grootste formule vóór het volledige landgoed. Beide vakantiewoningen, twee aanvullende duplexsuites en het Molenhuys — voor groepen tot 37 personen die alles uit De Hoogmolen willen halen.",
    ],
  },
  {
    slug: "landgoed-de-hoogmolen",
    name: "Landgoed De Hoogmolen",
    type: "house",
    capacity: 53,
    bedrooms: 16,
    bathrooms: 16,
    startingPrice: 1150,
    bookingUrl: "https://www.hoogmolen.com/nl/properties/678a22941d3f3d00103a8384",
    hasMolenhuys: true,
    tagline: "Het complete erfgoeddomein · tot 53 personen exclusief",
    location: "Volledig landgoed",
    highlights: ["16 slaapkamers", "Tot 53 gasten", "Volledig privé domein", "Molenhuys exclusief"],
    amenities: [...COMMON_HOUSE_AMENITIES, "Molenhuys exclusief", "Visvijver", "Speeltuin"],
    summary: [
      "Wanneer u het volledige Landgoed De Hoogmolen boekt, sluit u even de poort achter u — en is het hele eeuwenoude domein van u. Twee vakantiewoningen, zes duplexsuites, het Molenhuys, de privétuinen en het klaterende geluid van het water langs de molen: alles, exclusief voor uw gezelschap van maximaal 53 gasten.",
      "De ultieme keuze voor familiereünies, bruiloften, bedrijfsretraites of uitzonderlijke vieringen die om méér ruimte, méér privacy en méér karakter vragen.",
    ],
  },
];

export const getProperty = (slug: string): Property | undefined =>
  PROPERTIES.find((p) => p.slug === slug);

export const propertiesByType = (type: PropertyType): Property[] =>
  PROPERTIES.filter((p) => p.type === type);
