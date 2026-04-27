/** FAQ — geëxtraheerd uit de gids, ingedeeld per topic */

export interface FAQItem {
  question: string;
  answer: string;
  category: "boeken" | "verblijf" | "praktisch" | "huisdieren" | "faciliteiten";
  /** show on which page slugs (for contextual FAQ blocks) */
  contexts: string[];
}

export const FAQ: FAQItem[] = [
  {
    category: "boeken",
    question: "Hoe kan ik reserveren?",
    answer: "Via onze eigen boekingssite www.hoogmolen.com kunt u uw vakantiewoning, duplexsuite of favoriete kamer rechtstreeks boeken. Liever dat wij dit voor u regelen? Mail info@hoogmolen.be of bel +32 (0)11 90 11 00.",
    contexts: ["home", "praktisch", "faq"],
  },
  {
    category: "praktisch",
    question: "Is er een receptie?",
    answer: "Landgoed De Hoogmolen werkt met een self-hosting concept — geen fysieke receptie, geen tijdverlies met papierwerk. Alles wordt vooraf geregeld. Hulp nodig? Wij zijn altijd bereikbaar via WhatsApp, het boekingsplatform, e-mail of telefoon.",
    contexts: ["home", "praktisch", "faq", "kamer", "verblijf"],
  },
  {
    category: "faciliteiten",
    question: "Is er een ontspanningsruimte?",
    answer: "Het sfeervolle Molenhuys wordt gratis aangeboden bij een Plus-formule of wanneer u meer dan één vakantiewoning boekt. U vindt er een professioneel uitgeruste keuken, een gezellig ingerichte selfservice bar én ping-pong, darts en tafelvoetbal.",
    contexts: ["home", "groepsverblijf", "faq", "verblijf"],
  },
  {
    category: "praktisch",
    question: "Wat zijn de in- en uitchecktijden?",
    answer: "Inchecken vanaf 15u00, uitchecken om 10u00. Dankzij ons flexibele self check-in systeem ontvangt u vooraf een persoonlijke pincode — u hoeft uw aankomsttijd niet door te geven.",
    contexts: ["home", "praktisch", "faq", "kamer", "verblijf", "watermolen", "peerdermolen"],
  },
  {
    category: "praktisch",
    question: "Hoe laat kan ik in- en uitchecken?",
    answer: "Inchecken vanaf 15u00, uitchecken om 10u00. Dankzij ons flexibele self check-in systeem hoeft u uw aankomsttijd niet door te geven — met uw persoonlijke pincode opent u eenvoudig zelf uw verblijf.",
    contexts: ["home", "praktisch", "faq", "kamer", "verblijf"],
  },
  {
    category: "verblijf",
    question: "Hoeveel personen kunnen overnachten in de Watermolen?",
    answer: "De Watermolen biedt plaats aan maximaal 17 personen, verdeeld over 5 ruime slaapkamers met elk een eigen badkamer en in totaal 17 éénpersoonsbedden. Ideaal voor families, vriendengroepen of sportteams.",
    contexts: ["faq", "watermolen", "verblijf", "groepsverblijf"],
  },
  {
    category: "verblijf",
    question: "Met hoeveel personen kan ik komen overnachten?",
    answer: "Bij De Hoogmolen overnacht u vanaf 1 tot 53 personen. Er zijn duplexsuites voor 1 tot 4 personen, ruimere accommodaties voor 12, 17, 20, 25, 29, 37, tot 53 personen. Bij 53 personen huurt u het volledige landgoed exclusief.",
    contexts: ["home", "groepsverblijf", "faq", "verblijf"],
  },
  {
    category: "verblijf",
    question: "Wat neem ik mee?",
    answer: "Enkel uw goede humeur, ontspanningsmodus en persoonlijke spullen. Bad- en beddengoed, douchegel, shampoo, conditioner, handzeep, bodylotion en het huishoudpakket (theedoeken, afwasmiddel, sponsje) zijn allemaal aan boord.",
    contexts: ["faq", "praktisch", "verblijf"],
  },
  {
    category: "faciliteiten",
    question: "Is er wifi?",
    answer: "Yes! Surf gratis op high-speed wifi tijdens uw verblijf. De logincodes vindt u terug in uw accommodatie.",
    contexts: ["faq", "praktisch"],
  },
  {
    category: "huisdieren",
    question: "Zijn huisdieren toegelaten?",
    answer: "Honden zijn welkom in de vakantiewoning Watermolen op aanvraag — graag vooraf vermelden bij uw boeking. In de overige accommodaties zijn huisdieren niet toegelaten met het oog op de andere gasten en het wildleven in de Abeekvallei.",
    contexts: ["faq", "watermolen", "kamer", "praktisch", "verblijf"],
  },
  {
    category: "huisdieren",
    question: "Zijn paarden welkom?",
    answer: "Zeker! Wij beschikken over 6 paardenboxen (3m × 3,5m) en een paardenweide met wolfwerende omheining. Steeds mits reservering. Eerste nacht €25/box (incl. hooi, stro & water), volgende nachten €10/box.",
    contexts: ["faq", "praktisch"],
  },
  {
    category: "verblijf",
    question: "Is het mogelijk om een reisbedje bij te plaatsen?",
    answer: "Vanzelfsprekend voorzien we ook graag geschikte slaapplaatsen voor onze kleinste gasten. Laat het op voorhand weten zodat we de nodige voorbereidingen kunnen treffen. Kinderbedje: €10 per verblijf.",
    contexts: ["faq", "praktisch"],
  },
  {
    category: "praktisch",
    question: "Wie kan ik bereiken in geval van nood?",
    answer: "Omdat er zich geen receptie op het domein bevindt, creëren we steeds een WhatsApp-groep met u en onze teamleden. Zo zijn we altijd vlot bereikbaar.",
    contexts: ["faq", "praktisch"],
  },
];

export const getFAQByContext = (ctx: string): FAQItem[] =>
  FAQ.filter((f) => f.contexts.includes(ctx));
