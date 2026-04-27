/**
 * teambuildingConfig — zakelijke proposities, populaire activiteiten,
 * domein-activiteiten en arrangementen. Voedt /teambuildings + sub-pagina's.
 */

export interface TeambuildingOption {
  id: string;
  title: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  variant?: "soft" | "deep" | "light";
}

export const TEAMBUILDING_PILLARS: TeambuildingOption[] = [
  {
    id: "in-limburg",
    title: "Activiteiten in Limburg",
    description:
      "Terhills · Snow Valley · Center Parcs · Zelfpluk · en meer. Op maat van uw groep, georganiseerd vanuit De Hoogmolen.",
    features: ["Externe locatie", "Op maat", "Begeleiding mogelijk", "20 min van domein"],
    ctaLabel: "Ontdek activiteiten",
    ctaUrl: "/teambuildings/in-limburg",
    variant: "soft",
  },
  {
    id: "op-domein",
    title: "Op en rond het domein",
    description:
      "Wandelen · fietsen · paardrijden · Molenhuys entertainment. Natuur en ontspanning starten letterlijk aan de deur.",
    features: ["Geen verplaatsing", "Direct vanuit verblijf", "Eigen routes", "Molenhuys"],
    ctaLabel: "Bekijk activiteiten",
    ctaUrl: "/teambuildings/activiteiten-op-en-rond-het-domein",
    variant: "deep",
  },
  {
    id: "met-overnachting",
    title: "Teambuilding + overnachting",
    description:
      "Volledig verzorgd arrangement — activiteit, verblijf, diner en ontbijt op een 5-sterren domein.",
    features: ["1 of 2 nachten", "Diner inclusief", "Molenhuys-toegang", "Tot 53 personen"],
    ctaLabel: "Bekijk formule",
    ctaUrl: "/teambuildings/met-overnachting",
    variant: "deep",
  },
];

export interface TeambuildingActivity {
  id: string;
  name: string;
  icon: string;
  description: string;
  meta: string;
  url?: string;
  category: "avontuur-sport" | "familie-groepen" | "natuur-beleving";
}

export const POPULAR_ACTIVITIES: TeambuildingActivity[] = [
  {
    id: "terhills",
    name: "Terhills Cablepark",
    icon: "🏄",
    description: "Waterskiën & wakeboarden · begeleide instructeurs",
    meta: "Maasmechelen · op 20 min van het domein",
    url: "https://terhillscablepark.be",
    category: "avontuur-sport",
  },
  {
    id: "snowvalley",
    name: "Snow Valley Peer",
    icon: "⛷️",
    description: "Indoor skiën & snowboarden",
    meta: "Peer · op 15 min van het domein",
    url: "https://snowvalleypeer.be",
    category: "avontuur-sport",
  },
  {
    id: "centerparcs",
    name: "Center Parcs Erperheide",
    icon: "🏊",
    description: "Subtropisch zwemparadijs & activiteiten",
    meta: "Op 20 min · 20% toerisme Limburg",
    url: "https://centerparcs.be",
    category: "familie-groepen",
  },
  {
    id: "zelfpluk",
    name: "Zelfpluk Blauwe Bessen",
    icon: "🫐",
    description: "Familie Schrijnwerkers · vanaf juli · za 10–17u · zo 13–17u",
    meta: "Reserveren niet nodig · eigen doos meebrengen",
    url: "https://blauwebessen.be",
    category: "familie-groepen",
  },
  {
    id: "wandelen",
    name: "Wandelen Abeekvallei",
    icon: "🥾",
    description: "Eigen wandelroutes vanuit het domein",
    meta: "Direct aan de deur · bevers · natuur",
    url: "/activiteiten/wandelen",
    category: "natuur-beleving",
  },
  {
    id: "fietsen",
    name: "Fietsen Knooppunt 01",
    icon: "🚴",
    description: "Fietsnetwerk Limburg · knooppunt 01 aan de deur",
    meta: "Hoge Kempen · iconische routes",
    url: "/activiteiten/fietsen",
    category: "natuur-beleving",
  },
  {
    id: "paardrijden",
    name: "Paardrijden Ellikom",
    icon: "🐴",
    description: "Ruiter- en menroutes in de omgeving",
    meta: "Nationaal Park Hoge Kempen",
    url: "/activiteiten/paardrijden",
    category: "natuur-beleving",
  },
];

export interface DomainActivity {
  id: string;
  title: string;
  icon: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaUrl: string;
  variant: "soft" | "deep";
}

export const DOMAIN_ACTIVITIES: DomainActivity[] = [
  {
    id: "wandelen-domein",
    title: "Wandelen langs de Abeek",
    icon: "🥾",
    description:
      "Meerdere eigen routes · direct aan de deur · bevers · vogels · natuur",
    features: [
      "Hoogmolen wandelroute 1",
      "Hoogmolen wandelroute 2",
      "Abeekvallei routes",
      "Gratis wandelgids beschikbaar",
    ],
    ctaLabel: "Bekijk wandelroutes",
    ctaUrl: "/activiteiten/wandelen",
    variant: "deep",
  },
  {
    id: "fietsen-domein",
    title: "Fietsen via Knooppunt 01",
    icon: "🚴",
    description:
      "Knooppunt 01 aan de deur · 8 iconische fietsroutes · Bruegelfietsroute · Ronde van Oudsbergen",
    features: [
      "Knooppunt 01 aan de deur",
      "8 fietsroutes beschikbaar",
      "Gratis fietsgids",
      "Ronde van Oudsbergen",
    ],
    ctaLabel: "Bekijk fietsroutes",
    ctaUrl: "/activiteiten/fietsen",
    variant: "soft",
  },
  {
    id: "paardrijden-domein",
    title: "Paardrijden in de omgeving",
    icon: "🐴",
    description:
      "Ruiter- en menroutes · Nationaal Park Hoge Kempen · Ellikom en omgeving",
    features: [],
    ctaLabel: "Meer info",
    ctaUrl: "/activiteiten/paardrijden",
    variant: "deep",
  },
  {
    id: "molenhuys",
    title: "Molenhuys entertainment",
    icon: "🎱",
    description:
      "Gratis bij Plus/Volmolen/exclusief domein · tot 53 personen",
    features: [
      "Honesty bar",
      "Pooltafel / biljart",
      "Pingpongtafel",
      "Kaarttafel",
      "Flipperkast",
    ],
    ctaLabel: "Meer info Molenhuys",
    ctaUrl: "/overnachten/molenhuys",
    variant: "soft",
  },
];

export interface ProgramStep {
  time: string;
  activity: string;
}

export const SAMPLE_DAY_PROGRAM: ProgramStep[] = [
  { time: "14:00", activity: "Aankomst & inchecken op het domein" },
  { time: "15:00", activity: "Teambuilding activiteit (bv. Terhills, wandeling, fietsen)" },
  { time: "18:00", activity: "Terugkeer & ontspanning · Molenhuys met honesty bar" },
  { time: "19:30", activity: "Diner bij De Dorpermolen of 't Pleintje" },
  { time: "Nacht", activity: "Overnachting in vakantiewoning, suites of kamers" },
  { time: "08:30", activity: "Ontbijtmand op het domein" },
  { time: "10:00", activity: "Uitchecken" },
];

export const ARRANGEMENTS = [
  {
    id: "1-nacht",
    title: "1 nacht arrangement",
    subtitle: "Teambuilding activiteit naar keuze",
    items: [
      "Overnachting op het domein",
      "Diner bij lokale partner",
      "Ontbijtmand",
      "Molenhuys entertainment",
      "Gratis parking",
    ],
    ctaLabel: "Vraag offerte aan",
    ctaUrl: "/contact",
    variant: "soft" as const,
  },
  {
    id: "2-nachten",
    title: "2 nachten arrangement",
    subtitle: "Meerdere activiteiten gecombineerd",
    items: [
      "2 overnachtingen op het domein",
      "2x diner bij lokale partner",
      "2x ontbijtmand",
      "Molenhuys entertainment",
      "Optioneel vergaderen",
      "Gratis parking",
    ],
    ctaLabel: "Vraag offerte aan",
    ctaUrl: "/contact",
    variant: "deep" as const,
  },
];

export const STAY_OPTIONS = [
  { title: "Vakantiewoningen", badge: "12–17p", url: "/overnachten/vakantiewoningen", ctaLabel: "Bekijk woningen" },
  { title: "Duplexsuites A1–A6", badge: "1–6p", url: "/overnachten/suites-kamers/duplexsuites", ctaLabel: "Bekijk suites" },
  { title: "Kamers B1–B5", badge: "1–4p", url: "/overnachten/suites-kamers/kamers", ctaLabel: "Bekijk kamers" },
];
