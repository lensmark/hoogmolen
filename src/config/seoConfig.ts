/**
 * seoConfig.ts — per-route SEO-metadata (title + description) volgens
 * SEO_GEO_Handleiding_Hoogmolen.pdf §12.2.
 *
 * Regels:
 *  - title ≤ 60 tekens, eindigt op " | Hoogmolen".
 *  - description ≤ 155 tekens, focus op luxe/hospitality keywords
 *    (vakantiewoning, kasteelhotel-feeling, Limburg, groepen, erfgoed).
 *
 * Fallback: SEO-component bouwt zelf een titel uit pageName als pad ontbreekt.
 */

export interface RouteSEO {
  title: string;
  description: string;
}

const t = (s: string) => {
  if (s.length > 60) {
    // eslint-disable-next-line no-console
    console.warn(`[seoConfig] title >60 chars: "${s}" (${s.length})`);
  }
  return s;
};

const d = (s: string) => {
  if (s.length > 155) {
    // eslint-disable-next-line no-console
    console.warn(`[seoConfig] desc >155 chars: "${s}" (${s.length})`);
  }
  return s;
};

export const SEO_MAP: Record<string, RouteSEO> = {
  "/": {
    title: t("Landgoed De Hoogmolen — Erfgoed in Limburg | Hoogmolen"),
    description: d(
      "Exclusief landgoed in de Abeekvallei (Oudsbergen). 17 luxe accommodaties voor 1-53 gasten — vakantiewoningen, suites en groepsverblijf met 5★ comfort.",
    ),
  },
  "/overnachten": {
    title: t("Overnachten in Limburg — Luxe verblijf | Hoogmolen"),
    description: d(
      "Boek uw verblijf op Landgoed De Hoogmolen: vakantiewoningen, duplexsuites en kamers met self check-in, ontbijt en gratis parking in de Abeekvallei.",
    ),
  },
  "/overnachten/vakantiewoningen": {
    title: t("Vakantiewoningen Limburg — 12 tot 53p | Hoogmolen"),
    description: d(
      "Zes statige vakantiewoningen voor 12 tot 53 gasten. Privétuin, BBQ, eigen badkamers en exclusief gebruik van het Molenhuys voor groepen.",
    ),
  },
  "/overnachten/vakantiewoningen/watermolen": {
    title: t("Vakantiewoning Watermolen Oudsbergen 17p | Hoogmolen"),
    description: d(
      "Statige vakantiewoning voor 17 personen in de Abeekvallei. 5 slaapkamers met eigen badkamer, open haard, privétuin en BBQ aan de molen.",
    ),
  },
  "/overnachten/vakantiewoningen/peerdermolen": {
    title: t("Vakantiewoning Peerdermolen 12p Limburg | Hoogmolen"),
    description: d(
      "Karaktervolle vakantiewoning voor 12 personen met 5 ensuite slaapkamers, privétuin, overdekt terras en BBQ in het hart van het landgoed.",
    ),
  },
  "/overnachten/vakantiewoningen/peerdermolen-plus": {
    title: t("Peerdermolen Plus 20p + Molenhuys | Hoogmolen"),
    description: d(
      "Peerdermolen mét aangrenzende duplexsuite en exclusief Molenhuys (bar, ping-pong, darts). Tot 20 gasten in 5★ comfort — Oudsbergen.",
    ),
  },
  "/overnachten/vakantiewoningen/watermolen-plus": {
    title: t("Watermolen Plus 25p + Molenhuys | Hoogmolen"),
    description: d(
      "Watermolen + duplexsuite + Molenhuys voor groepen tot 25 gasten. Open haard, privétuin, ontspanningsruimte met bar en spelletjes.",
    ),
  },
  "/overnachten/vakantiewoningen/volmolen": {
    title: t("Volmolen 29p — Beide molens + Molenhuys | Hoogmolen"),
    description: d(
      "Watermolen + Peerdermolen + Molenhuys vormen de Volmolen-formule voor 29 gasten. 10 slaapkamers, 2 keukens en exclusieve groepsruimte.",
    ),
  },
  "/overnachten/vakantiewoningen/volmolen-plus": {
    title: t("Volmolen Plus 37p — Beide molens + 2 duplex | Hoogmolen"),
    description: d(
      "De Volmolen-formule uitgebreid met 2 duplexsuites en het Molenhuys — tot 37 gasten op het volledige landgoed in Oudsbergen.",
    ),
  },
  "/overnachten/vakantiewoningen/landgoed-de-hoogmolen": {
    title: t("Landgoed exclusief 53p — Volledig privé | Hoogmolen"),
    description: d(
      "Het complete erfgoeddomein voor uw groep tot 53 gasten: 16 slaapkamers, Molenhuys, visvijver, speeltuin en privétuinen — exclusief uw verblijf.",
    ),
  },
  "/overnachten/suites-kamers": {
    title: t("Suites & kamers — Limburg luxe | Hoogmolen"),
    description: d(
      "11 verfijnde duplexsuites en kamers in een historisch molendomein. Boxsprings, eigen badkamer, Nespresso en privéterras vanaf €125/nacht.",
    ),
  },
  "/groepsverblijf": {
    title: t("Groepsverblijf Limburg 10-53p | Hoogmolen"),
    description: d(
      "Exclusief groepsverblijf op een erfgoeddomein voor 10 tot 53 gasten. Privacy, eigen badkamers, Molenhuys, BBQ en self check-in inbegrepen.",
    ),
  },
  "/vergaderen": {
    title: t("Vergaderen in Limburg — Inspirerend | Hoogmolen"),
    description: d(
      "Vergaderen in een erfgoedpand met dagvergaderingen, 12u, 24u en 48u arrangementen. Wifi, ontbijt, lunch en overnachting inbegrepen.",
    ),
  },
  "/teambuildings": {
    title: t("Teambuilding Limburg op het landgoed | Hoogmolen"),
    description: d(
      "Teambuildings in en rond De Hoogmolen: actieve programma's, culinaire belevingen en overnachting in een erfgoedlandgoed in Oudsbergen.",
    ),
  },
  "/paardenlogies": {
    title: t("Paardenlogies Oudsbergen — 6 boxen | Hoogmolen"),
    description: d(
      "Paardenlogies aan de Hoge Kempen: 6 boxen (3×3,5m), wolfwerende weide, hooi & water inbegrepen. Eerste nacht €25/box, vervolg €10.",
    ),
  },
  "/activiteiten": {
    title: t("Activiteiten & omgeving Hoogmolen | Hoogmolen"),
    description: d(
      "Wandelen in de Abeekvallei, fietsknooppunt 01 aan de deur, ruiterroutes Hoge Kempen en topattracties als Terhills, Snow Valley en Bokrijk.",
    ),
  },
  "/praktisch": {
    title: t("Praktische info & FAQ | Hoogmolen"),
    description: d(
      "Inchecken vanaf 15u00, uitchecken om 10u00, self check-in met pincode, gratis parking, high-speed wifi en alle praktische info op één plaats.",
    ),
  },
  "/contact": {
    title: t("Contact Landgoed De Hoogmolen | Hoogmolen"),
    description: d(
      "Hoogmolenweg 15, 3670 Oudsbergen. Bel +32 (0)11 90 11 00 of mail info@hoogmolen.be — onze gastvrouwen helpen u graag persoonlijk verder.",
    ),
  },
};

export const getRouteSEO = (pathname: string): RouteSEO | undefined =>
  SEO_MAP[pathname];
