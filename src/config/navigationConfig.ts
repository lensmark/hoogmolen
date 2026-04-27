export interface NavItem {
  label: string;
  to: string;
  children?: NavItem[];
}

/**
 * MAIN_NAV — Spiegelt de authoritative 77-URL kb (kb_urls_deel1 + deel2).
 * Top-level items zijn de 7 hoofdrubrieken + Praktisch + Over ons.
 */
export const MAIN_NAV: NavItem[] = [
  {
    label: "Overnachten", to: "/overnachten",
    children: [
      { label: "Vakantiewoningen", to: "/overnachten/vakantiewoningen" },
      { label: "Suites & kamers", to: "/overnachten/suites-kamers" },
      { label: "Boekingsinformatie", to: "/overnachten/boekingsinformatie" },
    ],
  },
  {
    label: "Groepsverblijf", to: "/groepsverblijf",
    children: [
      { label: "10–20 personen", to: "/groepsverblijf/10-20-personen" },
      { label: "20–30 personen", to: "/groepsverblijf/20-30-personen" },
      { label: "30–53 personen", to: "/groepsverblijf/30-53-personen" },
    ],
  },
  {
    label: "Vergaderen", to: "/vergaderen",
    children: [
      { label: "Vergaderformules", to: "/vergaderen/vergaderformules" },
      { label: "Faciliteiten", to: "/vergaderen/faciliteiten" },
      { label: "Met overnachting", to: "/vergaderen/vergaderen-met-overnachting" },
    ],
  },
  {
    label: "Teambuildings", to: "/teambuildings",
    children: [
      { label: "In Limburg", to: "/teambuildings/in-limburg" },
      { label: "Met overnachting", to: "/teambuildings/met-overnachting" },
      { label: "Op het domein", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
    ],
  },
  {
    label: "Paardenlogies", to: "/paardenlogies",
  },
  {
    label: "Activiteiten", to: "/activiteiten",
    children: [
      { label: "Fietsen", to: "/activiteiten/fietsen" },
      { label: "Wandelen", to: "/activiteiten/wandelen" },
      { label: "Paardrijden", to: "/activiteiten/paardrijden" },
      { label: "In de omgeving", to: "/activiteiten/in-de-omgeving" },
      { label: "Familie", to: "/activiteiten/familie" },
      { label: "Culinair", to: "/activiteiten/culinair" },
    ],
  },
  { label: "Praktisch", to: "/praktisch" },
  {
    label: "Wall of Love", to: "/wall-of-love",
    children: [
      { label: "Reviews", to: "/wall-of-love" },
      { label: "Over ons", to: "/over-ons" },
      { label: "Ons team", to: "/over-ons/team" },
      { label: "Molengeschiedenis", to: "/over-ons/geschiedenis" },
    ],
  },
];

/**
 * FOOTER_NAV — 5 kolommen exact uit wireframe homepage `<div class="footer">`.
 */
export const FOOTER_NAV = [
  {
    title: "Overnachten",
    links: [
      { label: "Vakantiewoningen", to: "/overnachten/vakantiewoningen" },
      { label: "Duplexsuites", to: "/overnachten/suites-kamers/duplexsuites" },
      { label: "Kamers", to: "/overnachten/suites-kamers/kamers" },
    ],
  },
  {
    title: "Groepsverblijf",
    links: [
      { label: "10-20 personen", to: "/groepsverblijf/10-20-personen" },
      { label: "20-30 personen", to: "/groepsverblijf/20-30-personen" },
      { label: "30-53 personen", to: "/groepsverblijf/30-53-personen" },
    ],
  },
  {
    title: "Zakelijk",
    links: [
      { label: "Vergaderen", to: "/vergaderen" },
      { label: "Teambuildings", to: "/teambuildings" },
    ],
  },
  {
    title: "Activiteiten",
    links: [
      { label: "Fietsen", to: "/activiteiten/fietsen" },
      { label: "Wandelen", to: "/activiteiten/wandelen" },
      { label: "In de omgeving", to: "/activiteiten/in-de-omgeving" },
    ],
  },
  {
    title: "Gidsen",
    links: [
      { label: "Download gidsen", to: "/praktisch/download-gidsen" },
      { label: "FAQ", to: "/faq" },
      { label: "Ervaringen", to: "/ervaringen" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Contacteer ons", to: "/contact" },
      { label: "Boekingsinformatie", to: "/boekingsinformatie" },
    ],
  },
];

export const CONTACT = {
  name: "Landgoed De Hoogmolen",
  address: "Hoogmolenweg 15, 3670 Oudsbergen (Ellikom)",
  phone: "+32 (0)11 90 11 00",
  email: "info@hoogmolen.be",
  bookingUrl: "https://www.hoogmolen.com",
  whatsapp: "32475950335",
};
