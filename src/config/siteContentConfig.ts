/**
 * siteContentConfig.ts — Single Source of Truth voor unieke pagina-inhoud
 * (Fast Facts, Bijkomende FAQ's en SEO Schema.org type) per route.
 *
 * Data komt uit:
 *  - Informatiegids 2025 (prijzen p.21, B2B p.40)
 *  - Activiteitengids
 *  - kb_urls_deel1 / kb_urls_deel2 (77+ routes)
 *
 * Gebruik:
 *  - <FastFacts /> leest pathname → toont icon-grid onder PageHero
 *  - <FAQAccordion /> merget deze items met de generieke FAQ uit faqConfig
 *  - <SchemaInjector /> bouwt JSON-LD in de <head>
 *
 * Tone: warm, 5-sterren hospitality, 100% feitelijk accuraat.
 */

export interface FastFact {
  /** emoji of korte string */
  icon: string;
  label: string;
  value: string;
}

export interface PageFAQ {
  question: string;
  answer: string;
}

export type SchemaType =
  | "HotelRoom"
  | "LodgingBusiness"
  | "Event"
  | "MeetingRoom"
  | "TouristAttraction"
  | "LocalBusiness"
  | "WebPage"
  | "FAQPage";

export interface PageContent {
  /** menselijke pagina-naam voor in titels (bv. "Vakantiewoning Watermolen") */
  pageName?: string;
  facts?: FastFact[];
  faqs?: PageFAQ[];
  schemaType?: SchemaType;
}

export const SITE_CONTENT_MAP: Record<string, PageContent> = {
  /* ───────────────── HOME ───────────────── */
  "/": {
    pageName: "Landgoed De Hoogmolen",
    facts: [
      { icon: "🏛️", label: "Erfgoed", value: "Anno 1500" },
      { icon: "👥", label: "Capaciteit", value: "1 tot 53 gasten" },
      { icon: "🛏️", label: "Accommodaties", value: "17 unieke units" },
      { icon: "🌳", label: "Domein", value: "Abeekvallei, Limburg" },
      { icon: "📶", label: "Comfort", value: "High-speed Wifi · Airco" },
      { icon: "🅿️", label: "Toegang", value: "Self check-in · Gratis parking" },
    ],
    schemaType: "LodgingBusiness",
  },

  /* ───────────────── OVERNACHTEN — VAKANTIEWONINGEN ───────────────── */
  "/overnachten/vakantiewoningen/watermolen": {
    pageName: "Vakantiewoning Watermolen",
    facts: [
      { icon: "🏠", label: "Formule", value: "Vakantiewoning 17 personen" },
      { icon: "🛌", label: "Bedden", value: "17 eenpersoons boxsprings" },
      { icon: "🛁", label: "Sanitair", value: "5 slaapkamers · eigen badkamer" },
      { icon: "🔥", label: "Luxe", value: "Open haard & privétuin" },
      { icon: "⚡", label: "Energie", value: "Eigen waterkrachtcentrale" },
      { icon: "❄️", label: "Comfort", value: "Airco in alle kamers" },
    ],
    faqs: [
      { question: "Hoe is de exacte slaapindeling?", answer: "5 slaapkamers met respectievelijk 5, 2, 3, 4 en 3 bedden — alle eenpersoons boxsprings die op aanvraag tot tweepersoonsbedden gekoppeld worden." },
      { question: "Zijn honden welkom?", answer: "Helaas niet. Huisdieren zijn nergens op het domein toegelaten." },
      { question: "Is er een eigen tuin?", answer: "Ja — een afgesloten privétuin met BBQ, terras en zicht op het waterrad van de molen." },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/vakantiewoningen/peerdermolen": {
    pageName: "Vakantiewoning Peerdermolen",
    facts: [
      { icon: "🏠", label: "Formule", value: "Vakantiewoning 12 personen" },
      { icon: "🛌", label: "Bedden", value: "6 tweepersoons boxsprings" },
      { icon: "🛁", label: "Sanitair", value: "6 slaapkamers · eigen badkamer" },
      { icon: "🍽️", label: "Keuken", value: "Volledig uitgerust" },
      { icon: "❄️", label: "Comfort", value: "Airco · WiFi · ontbijt mogelijk" },
      { icon: "🌳", label: "Buiten", value: "Privéterras & tuin" },
    ],
    faqs: [
      { question: "Wat is het verschil met de Plus-formule?", answer: "Bij de Plus-formule krijgt u exclusief gebruik van het Molenhuys (selfservice bar, ping-pong, darts, tafelvoetbal) inbegrepen." },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/vakantiewoningen/peerdermolen-plus": {
    pageName: "Peerdermolen Plus",
    facts: [
      { icon: "🏠", label: "Formule", value: "Peerdermolen + Molenhuys" },
      { icon: "👥", label: "Capaciteit", value: "Tot 12 personen" },
      { icon: "🎱", label: "Inbegrepen", value: "Exclusief Molenhuys" },
      { icon: "🍳", label: "Keuken", value: "2 volwaardige keukens" },
      { icon: "❄️", label: "Comfort", value: "Airco · High-speed WiFi" },
      { icon: "🅿️", label: "Toegang", value: "Self check-in vanaf 15u" },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/vakantiewoningen/watermolen-plus": {
    pageName: "Watermolen Plus",
    facts: [
      { icon: "🏠", label: "Formule", value: "Watermolen + Molenhuys" },
      { icon: "👥", label: "Capaciteit", value: "Tot 17 personen" },
      { icon: "🎱", label: "Inbegrepen", value: "Exclusief Molenhuys" },
      { icon: "🔥", label: "Luxe", value: "Open haard & privétuin" },
      { icon: "⚡", label: "Uniek", value: "Eigen waterkrachtcentrale" },
      { icon: "🚫", label: "Huisdieren", value: "Niet toegelaten op het domein" },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/vakantiewoningen/volmolen": {
    pageName: "Vakantiewoning Volmolen",
    facts: [
      { icon: "🏠", label: "Formule", value: "Vakantiewoning 8 personen" },
      { icon: "🛌", label: "Slaapkamers", value: "4 ruime slaapkamers" },
      { icon: "🛁", label: "Sanitair", value: "Eigen badkamers" },
      { icon: "🍽️", label: "Keuken", value: "Volledig uitgerust" },
      { icon: "❄️", label: "Comfort", value: "Airco · WiFi · gratis parking" },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/vakantiewoningen/volmolen-plus": {
    pageName: "Volmolen Plus",
    facts: [
      { icon: "🏠", label: "Formule", value: "Volmolen + Molenhuys" },
      { icon: "👥", label: "Capaciteit", value: "Tot 8 personen" },
      { icon: "🎱", label: "Inbegrepen", value: "Exclusief Molenhuys" },
      { icon: "❄️", label: "Comfort", value: "Airco · High-speed WiFi" },
    ],
    schemaType: "HotelRoom",
  },

  /* ───────────────── OVERNACHTEN — SUITES & KAMERS ───────────────── */
  "/overnachten/suites-kamers": {
    pageName: "Suites & kamers",
    facts: [
      { icon: "🏛️", label: "Erfgoed", value: "B-vleugel Peerdermolen" },
      { icon: "👥", label: "Capaciteit", value: "1 tot 4 personen per unit" },
      { icon: "🛏️", label: "Aantal", value: "6 duplexsuites + 5 kamers" },
      { icon: "🛁", label: "Standaard", value: "Eigen badkamer · boxspring" },
      { icon: "❄️", label: "Comfort", value: "Airco · WiFi · koffie/thee" },
      { icon: "🅿️", label: "Toegang", value: "Self check-in vanaf 15u" },
    ],
    schemaType: "LodgingBusiness",
  },
  "/overnachten/suites-kamers/duplexsuites": {
    pageName: "Duplexsuites",
    facts: [
      { icon: "🏛️", label: "Setting", value: "A-vleugel · split-level" },
      { icon: "👥", label: "Capaciteit", value: "2 tot 4 personen" },
      { icon: "🛏️", label: "Indeling", value: "Living beneden · slapen boven" },
      { icon: "🛁", label: "Sanitair", value: "Eigen badkamer met regendouche" },
      { icon: "☕", label: "Inbegrepen", value: "Koffie · thee · WiFi" },
      { icon: "🅿️", label: "Parking", value: "Gratis op het domein" },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/suites-kamers/kamers": {
    pageName: "Kamers",
    facts: [
      { icon: "🏛️", label: "Setting", value: "B-vleugel · gelijkvloers/1e verdiep" },
      { icon: "👥", label: "Capaciteit", value: "2 tot 4 personen" },
      { icon: "🛏️", label: "Bed", value: "Boxspring 180×200" },
      { icon: "🛁", label: "Sanitair", value: "Eigen badkamer" },
      { icon: "☕", label: "Inbegrepen", value: "Koffie · thee · WiFi" },
      { icon: "🍳", label: "Ontbijt", value: "Op aanvraag mogelijk" },
    ],
    schemaType: "HotelRoom",
  },
  "/overnachten/boekingsinformatie": {
    pageName: "Boekingsinformatie",
    facts: [
      { icon: "📅", label: "Check-in", value: "Vanaf 15u00" },
      { icon: "🕙", label: "Check-out", value: "Voor 10u00" },
      { icon: "🔑", label: "Toegang", value: "Self check-in met pincode" },
      { icon: "💳", label: "Boeken", value: "hoogmolen.com · direct boekbaar" },
      { icon: "🚫", label: "Huisdieren", value: "Niet toegelaten op het domein" },
      { icon: "🛏️", label: "Babybed", value: "€10 per verblijf" },
    ],
    schemaType: "WebPage",
  },

  /* ───────────────── GROEPSVERBLIJF ───────────────── */
  "/groepsverblijf": {
    pageName: "Groepsverblijf",
    facts: [
      { icon: "👥", label: "Capaciteit", value: "10 tot 53 personen" },
      { icon: "🏠", label: "Combinaties", value: "Vakantiewoningen + Molenhuys" },
      { icon: "🎱", label: "Ontspanning", value: "Exclusief Molenhuys inbegrepen" },
      { icon: "🍳", label: "Keukens", value: "Meerdere volwaardige keukens" },
      { icon: "🌳", label: "Domein", value: "Privé landgoed Anno 1500" },
      { icon: "🅿️", label: "Parking", value: "Gratis voor alle gasten" },
    ],
    schemaType: "LodgingBusiness",
  },
  "/groepsverblijf/10-20-personen": {
    pageName: "Groepsverblijf 10-20 personen",
    facts: [
      { icon: "👥", label: "Capaciteit", value: "10 tot 20 personen" },
      { icon: "🏠", label: "Setup", value: "Peerdermolen of Watermolen + Molenhuys" },
      { icon: "🍳", label: "Catering", value: "Brainfood-formule mogelijk" },
    ],
    schemaType: "LodgingBusiness",
  },
  "/groepsverblijf/20-30-personen": {
    pageName: "Groepsverblijf 20-30 personen",
    facts: [
      { icon: "👥", label: "Capaciteit", value: "20 tot 30 personen" },
      { icon: "🏠", label: "Setup", value: "Combinatie 2 vakantiewoningen + Molenhuys" },
    ],
    schemaType: "LodgingBusiness",
  },
  "/groepsverblijf/30-53-personen": {
    pageName: "Groepsverblijf 30-53 personen",
    facts: [
      { icon: "👥", label: "Capaciteit", value: "30 tot 53 personen" },
      { icon: "🏛️", label: "Exclusief", value: "Volledig landgoed afhuren" },
      { icon: "🎱", label: "Inbegrepen", value: "Molenhuys & alle faciliteiten" },
    ],
    schemaType: "LodgingBusiness",
  },

  /* ───────────────── VERGADEREN ───────────────── */
  "/vergaderen": {
    pageName: "Vergaderen",
    facts: [
      { icon: "👥", label: "Capaciteit", value: "Tot 16 personen" },
      { icon: "🍏", label: "Catering", value: "Brainfood concept" },
      { icon: "🖥️", label: "Techniek", value: "Yealink Meetingboard" },
      { icon: "📶", label: "Connectiviteit", value: "High-speed WiFi" },
      { icon: "☕", label: "Pauzes", value: "All-in koffie · thee · water" },
      { icon: "🌳", label: "Setting", value: "Erfgoeddomein · stilte" },
    ],
    faqs: [
      { question: "Wat is 'Brainfood'?", answer: "Gezonde voeding van ontbijtmand tot 3-gangen diner bij lokale partners — afgestemd op concentratie en welzijn tijdens een werkdag." },
      { question: "Kan ik vergaderen combineren met overnachten?", answer: "Absoluut. Verblijf in een duplexsuite, kamer of vakantiewoning en vergader de dag erna in alle rust op het domein." },
    ],
    schemaType: "Event",
  },
  "/vergaderen/vergaderformules": {
    pageName: "Vergaderformules",
    facts: [
      { icon: "📋", label: "Formules", value: "Halve dag · volledige dag · meerdaags" },
      { icon: "🍏", label: "All-in", value: "Brainfood inbegrepen" },
      { icon: "🖥️", label: "Techniek", value: "Yealink Meetingboard standaard" },
    ],
    schemaType: "Event",
  },
  "/vergaderen/faciliteiten": {
    pageName: "Vergaderfaciliteiten",
    facts: [
      { icon: "🖥️", label: "Display", value: "Yealink Meetingboard 65\"" },
      { icon: "📶", label: "Internet", value: "High-speed glasvezel WiFi" },
      { icon: "🪑", label: "Setup", value: "Tot 16 personen · flexibele opstelling" },
      { icon: "🌳", label: "Setting", value: "Daglicht · zicht op landgoed" },
    ],
    schemaType: "MeetingRoom",
  },
  "/vergaderen/vergaderen-met-overnachting": {
    pageName: "Vergaderen met overnachting",
    facts: [
      { icon: "🛏️", label: "Verblijf", value: "Suites, kamers of vakantiewoningen" },
      { icon: "🍏", label: "Brainfood", value: "Ontbijt tot 3-gangen diner" },
      { icon: "👥", label: "Capaciteit", value: "Vergaderen tot 16 · slapen tot 53" },
    ],
    schemaType: "Event",
  },

  /* ───────────────── TEAMBUILDINGS ───────────────── */
  "/teambuildings": {
    pageName: "Teambuildings",
    facts: [
      { icon: "🏞️", label: "Locatie", value: "Op het domein of in Limburg" },
      { icon: "👥", label: "Groepen", value: "Vanaf 10 tot 53 personen" },
      { icon: "🎯", label: "Activiteiten", value: "Outdoor, culinair & creatief" },
      { icon: "🛏️", label: "Optie", value: "Met of zonder overnachting" },
      { icon: "🍏", label: "Catering", value: "Brainfood & lokale partners" },
    ],
    schemaType: "Event",
  },
  "/teambuildings/in-limburg": {
    pageName: "Teambuilding in Limburg",
    facts: [
      { icon: "🚴", label: "Fietsen", value: "Door het water · door de bomen" },
      { icon: "🥾", label: "Wandelen", value: "Abeekvallei · Duinengordel" },
      { icon: "🍷", label: "Culinair", value: "Lokale streekproducten" },
    ],
    schemaType: "Event",
  },
  "/teambuildings/met-overnachting": {
    pageName: "Teambuilding met overnachting",
    facts: [
      { icon: "🛏️", label: "Verblijf", value: "Tot 53 personen op het domein" },
      { icon: "🎯", label: "Programma", value: "Multi-day mogelijk" },
      { icon: "🍏", label: "All-in", value: "Brainfood inbegrepen" },
    ],
    schemaType: "Event",
  },
  "/teambuildings/activiteiten-op-en-rond-het-domein": {
    pageName: "Teambuilding op het domein",
    facts: [
      { icon: "🏛️", label: "Setting", value: "Privé erfgoeddomein Anno 1500" },
      { icon: "🎯", label: "Activiteiten", value: "Op maat samen te stellen" },
      { icon: "🌳", label: "Faciliteiten", value: "Molenhuys · tuin · paardenweide" },
    ],
    schemaType: "Event",
  },

  /* ───────────────── PAARDENLOGIES ───────────────── */
  "/paardenlogies": {
    pageName: "Paardenlogies",
    facts: [
      { icon: "🐴", label: "Boxen", value: "6 paardenboxen · 3m × 3,5m" },
      { icon: "🌾", label: "Weide", value: "Wolfwerende omheining" },
      { icon: "💶", label: "Tarief 1e nacht", value: "€25/box (incl. hooi, stro, water)" },
      { icon: "💶", label: "Volgende nachten", value: "€10/box" },
      { icon: "📅", label: "Reservatie", value: "Steeds op aanvraag" },
      { icon: "🥾", label: "Buitenrijden", value: "Direct vanuit domein" },
    ],
    faqs: [
      { question: "Wat is bij de eerste nacht inbegrepen?", answer: "De eerste nacht (€25/box) is inclusief hooi, stro en vers water. Vanaf de tweede nacht is het tarief €10/box." },
      { question: "Hoe groot zijn de boxen?", answer: "Elke paardenbox meet 3 meter × 3,5 meter — ruim genoeg voor groot en klein." },
      { question: "Is er een buitenweide?", answer: "Ja, met een professionele wolfwerende omheining — uw paard staat veilig dag en nacht." },
    ],
    schemaType: "LocalBusiness",
  },

  /* ───────────────── ACTIVITEITEN ───────────────── */
  "/activiteiten": {
    pageName: "Activiteiten",
    facts: [
      { icon: "🚴", label: "Fietsen", value: "Door water · bomen · molens" },
      { icon: "🥾", label: "Wandelen", value: "Abeekvallei · Duinengordel" },
      { icon: "🐴", label: "Paardrijden", value: "Manege & buitenroutes" },
      { icon: "👨‍👩‍👧", label: "Familie", value: "Speeltuinen · Plopsa · Cosmodrome" },
      { icon: "🍷", label: "Culinair", value: "Streekproducten & restaurants" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/fietsen": {
    pageName: "Fietsen in de omgeving",
    facts: [
      { icon: "💧", label: "Highlight", value: "Fietsen door het water (Bokrijk)" },
      { icon: "🌳", label: "Highlight", value: "Fietsen door de bomen (Pijnven)" },
      { icon: "🏛️", label: "Route", value: "10 historische watermolens" },
      { icon: "📍", label: "Vertrek", value: "Direct vanaf het domein" },
      { icon: "🚲", label: "Verhuur", value: "Op aanvraag mogelijk" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/wandelen": {
    pageName: "Wandelen in de omgeving",
    facts: [
      { icon: "🌿", label: "Abeekvallei", value: "Direct vanaf het domein" },
      { icon: "🏖️", label: "Duinengordel", value: "Uniek landduinenlandschap" },
      { icon: "🌳", label: "Bosbeekvallei", value: "Stilte & natuurpracht" },
      { icon: "📍", label: "Vertrek", value: "Wandelknooppunten aan de poort" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/paardrijden": {
    pageName: "Paardrijden",
    facts: [
      { icon: "🐴", label: "Eigen paard", value: "Welkom in onze 6 boxen" },
      { icon: "🥾", label: "Buitenrijden", value: "Direct vanuit het domein" },
      { icon: "📍", label: "Manèges", value: "Meerdere in de omgeving" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/in-de-omgeving": {
    pageName: "In de omgeving",
    facts: [
      { icon: "🎢", label: "Plopsa Indoor", value: "Hasselt · op 25 min." },
      { icon: "🚀", label: "Cosmodrome", value: "Genk · planetarium" },
      { icon: "❄️", label: "Snow Valley", value: "Indoor skipiste · Peer" },
      { icon: "🏛️", label: "Bokrijk", value: "Openluchtmuseum" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/familie": {
    pageName: "Familie-uitjes",
    facts: [
      { icon: "🎢", label: "Pretparken", value: "Plopsa · Bobbejaanland" },
      { icon: "🦒", label: "Dieren", value: "ZOO Antwerpen · Planckendael" },
      { icon: "🎨", label: "Creatief", value: "Workshops op het domein" },
    ],
    schemaType: "TouristAttraction",
  },
  "/activiteiten/culinair": {
    pageName: "Culinair",
    facts: [
      { icon: "🍷", label: "Streek", value: "Limburgse wijnen & jenever" },
      { icon: "🧀", label: "Hoeveproducten", value: "Lokale partners" },
      { icon: "👨‍🍳", label: "Restaurants", value: "Op wandel- of fietsafstand" },
    ],
    schemaType: "TouristAttraction",
  },

  /* ───────────────── PRAKTISCH & OVER ONS ───────────────── */
  "/praktisch": {
    pageName: "Praktisch",
    facts: [
      { icon: "📅", label: "Check-in", value: "Vanaf 15u00 (self check-in)" },
      { icon: "🕙", label: "Check-out", value: "Voor 10u00" },
      { icon: "📶", label: "WiFi", value: "Gratis high-speed" },
      { icon: "🅿️", label: "Parking", value: "Gratis op het domein" },
      { icon: "🚫", label: "Huisdieren", value: "Niet toegelaten op het domein" },
      { icon: "🐴", label: "Paarden", value: "6 boxen · op aanvraag" },
    ],
    schemaType: "WebPage",
  },
  "/over-ons": {
    pageName: "Over ons",
    facts: [
      { icon: "🏛️", label: "Erfgoed", value: "Anno 1500 · waterleenmolens" },
      { icon: "🌍", label: "Locatie", value: "Hoogmolenweg 15, Oudsbergen" },
      { icon: "♻️", label: "Duurzaam", value: "Eigen waterkrachtcentrale" },
    ],
    schemaType: "LocalBusiness",
  },
  "/contact": {
    pageName: "Contact",
    facts: [
      { icon: "📞", label: "Telefoon", value: "+32 (0)11 90 11 00" },
      { icon: "✉️", label: "E-mail", value: "info@hoogmolen.be" },
      { icon: "💬", label: "WhatsApp", value: "+32 475 95 03 35" },
      { icon: "📍", label: "Adres", value: "Hoogmolenweg 15, 3670 Oudsbergen" },
    ],
    schemaType: "LocalBusiness",
  },
  "/faq": {
    pageName: "Veelgestelde vragen",
    schemaType: "FAQPage",
  },
};

/** Helper — facts ophalen voor een gegeven pathname */
export const getFacts = (pathname: string): FastFact[] =>
  SITE_CONTENT_MAP[pathname]?.facts ?? [];

/** Helper — page-specifieke FAQ's */
export const getPageFAQs = (pathname: string): PageFAQ[] =>
  SITE_CONTENT_MAP[pathname]?.faqs ?? [];

/** Helper — schemaType (default WebPage) */
export const getSchemaType = (pathname: string): SchemaType =>
  SITE_CONTENT_MAP[pathname]?.schemaType ?? "WebPage";

/** Helper — leesbare paginanaam */
export const getPageName = (pathname: string): string | undefined =>
  SITE_CONTENT_MAP[pathname]?.pageName;
