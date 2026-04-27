export interface Activity {
  id: string;
  slug: string;
  name: string;
  category: "natuur" | "avontuur" | "familie" | "culinair" | "winter" | "fietsen" | "wandelen";
  shortDescription: string;
  description: string;
  distance?: string;
  rating?: number;
  icon: string;
  featured: boolean;
}

export const ACTIVITIES: Activity[] = [
  {
    id: "hoge-kempen", slug: "nationaal-park-hoge-kempen", name: "Nationaal Park Hoge Kempen",
    category: "natuur", icon: "🌲", featured: true, rating: 4.7, distance: "20 min",
    shortDescription: "12.000 hectare ongerept natuurgebied met 450 km wandel- en fietspaden.",
    description: "België's eerste nationaal park strekt zich uit over 12.000 hectare ruige heide, dennenbossen en kristalheldere vennen. Zes toegangspoorten, eindeloze paden en uitkijktorens met panoramisch zicht — een natuurervaring zonder weerga.",
  },
  {
    id: "fietsen-bomen", slug: "fietsen-door-de-bomen", name: "Fietsen door de Bomen",
    category: "fietsen", icon: "🚴", featured: true, rating: 4.6, distance: "25 min",
    shortDescription: "De wereldberoemde fietservaring tussen de boomtoppen in Bosland.",
    description: "Een spiraalvormig fietspad van 700 meter dat opstijgt tot tien meter hoogte, omringd door dennenbomen. Een unieke perspectiefwissel die u nergens anders ter wereld vindt.",
  },
  {
    id: "fietsen-water", slug: "fietsen-door-het-water", name: "Fietsen door het Water",
    category: "fietsen", icon: "🚴‍♀️", featured: true, rating: 4.7, distance: "30 min",
    shortDescription: "Fiets met de wateroppervlakte op ooghoogte door een Limburgse vijver.",
    description: "Een onvergetelijke 200 meter waarbij u letterlijk dóór het water fietst — het wateroppervlak ligt op ooghoogte aan beide zijden van het pad in Bokrijk.",
  },
  {
    id: "snow-valley", slug: "snow-valley-peer", name: "Snow Valley Peer",
    category: "winter", icon: "⛷️", featured: true, rating: 4.2, distance: "15 min",
    shortDescription: "Het hele jaar door wintersport op echte sneeuw.",
    description: "Indoor ski- en snowboardcentrum met pistes voor alle niveaus, snowpark, après-ski bar en restaurant. Uniek in België.",
  },
  {
    id: "racelandkart", slug: "racelandkart-oudsbergen", name: "Racelandkart Oudsbergen",
    category: "avontuur", icon: "🏎️", featured: true, rating: 4.4, distance: "5 min",
    shortDescription: "De ultieme adrenalinekick — karting, lasergame en meer.",
    description: "Indoor karting op enkele minuten van het landgoed, plus lasergame, kidskarting en pitbikes. Ideaal voor groepen en bedrijfsuitjes.",
  },
  {
    id: "center-parcs", slug: "center-parcs-erperheide", name: "Aqua Mundo Erperheide",
    category: "familie", icon: "🏊", featured: true, rating: 4.0, distance: "20 min",
    shortDescription: "Subtropisch zwemparadijs voor het hele gezin.",
    description: "Een tropisch binnenklimaat met glijbanen, golfslagbad, wildwaterbaan en speeltuinen — perfect voor een dagje uit met de kinderen.",
  },
  {
    id: "blauwe-bessen", slug: "blauwe-bessen-schrijnwerkers", name: "Blauwe Bessen Schrijnwerkers",
    category: "familie", icon: "🫐", featured: false, rating: 4.5, distance: "15 min",
    shortDescription: "Pluk uw eigen biologische blauwe bessen.",
    description: "Een unieke blauwebessenboerderij waar u in het seizoen zelf kunt plukken — een geliefd ritueel onder onze gasten.",
  },
  {
    id: "ter-dolen", slug: "kasteelbrouwerij-ter-dolen", name: "Kasteelbrouwerij Ter Dolen",
    category: "culinair", icon: "🍺", featured: false, rating: 4.5, distance: "20 min",
    shortDescription: "Authentieke Belgische bieren in een 17e-eeuws kasteel.",
    description: "Rondleidingen door de brouwerij met proeverij van hun karakteristieke bieren in een sprookjesachtig kasteeldecor.",
  },
  {
    id: "abeekvallei", slug: "wandel-abeekvallei", name: "Abeekvallei wandeling",
    category: "wandelen", icon: "🥾", featured: true, distance: "0 min — vanaf het landgoed",
    shortDescription: "Stap rechtstreeks vanaf de molen de Abeekvallei in.",
    description: "Een schilderachtige wandelroute langs de Abeek die direct vanaf De Hoogmolen vertrekt — bossen, heide en het zachte ruisen van het water.",
  },
  {
    id: "tarzan-jane", slug: "tarzan-en-jane", name: "Tarzan & Jane",
    category: "familie", icon: "🧗", featured: false, rating: 4.3, distance: "25 min",
    shortDescription: "4000 m² indoor speelparadijs op 4 verdiepingen.",
    description: "Een avontuurlijke binnenspeeltuin met klimstructuren, glijbanen en spelinstallaties voor kinderen van alle leeftijden.",
  },
  {
    id: "bokrijk", slug: "openluchtmuseum-bokrijk", name: "Openluchtmuseum Bokrijk",
    category: "familie", icon: "🏘️", featured: false, distance: "30 min",
    shortDescription: "Stap binnen in een levend Vlaams verleden.",
    description: "Eén van Europa's grootste openluchtmusea met historische gebouwen, ambachten en het vermaarde 'Fietsen door het Water'.",
  },
  {
    id: "terhills", slug: "terhills-cablepark", name: "Terhills Cablepark",
    category: "avontuur", icon: "🌊", featured: false, distance: "30 min",
    shortDescription: "Wakeboarden en waterskiën op een cablepark.",
    description: "Eén van België's mooiste cableparken aan de Connecterra in het Nationaal Park Hoge Kempen.",
  },
];

export const getActivitiesByCategory = (cat: Activity["category"]) =>
  ACTIVITIES.filter((a) => a.category === cat);

export const getFeaturedActivities = () => ACTIVITIES.filter((a) => a.featured);
