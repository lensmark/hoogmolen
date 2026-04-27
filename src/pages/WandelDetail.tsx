/**
 * WandelDetail — generieke detailpagina voor /activiteiten/wandelen/:slug
 * Bevat de 6 routes uit ActiviteitenWandelen + extra "gele-lus-itterbeek".
 * Elke entry levert content voor het herbruikbare TemplateActivity-component.
 */
import { useParams } from "react-router-dom";
import { Footprints, MapPin, Mountain, Trees, Droplets, Sun } from "lucide-react";
import { TemplateActivity, type FastFact, type ExternalLink } from "@/components/property/TemplateActivity";
import NotFound from "@/pages/NotFound";

interface WandelData {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  fastFacts: FastFact[];
  description: React.ReactNode;
  sideInfo?: React.ReactNode;
  externalLinks: ExternalLink[];
}

const ROUTES: Record<string, WandelData> = {
  abeekvallei: {
    eyebrow: "Wandelroute · 0 min — vanaf het landgoed",
    title: "Abeekvallei wandelroute",
    subtitle: "Idyllisch decor van broekbossen, vijvers en hooilanden — 180 ha natuur.",
    intro: "Laat u verrassen door het idyllisch decor van broekbossen, vijvers en hooilanden in een natuurgebied van 180 hectare.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "Diverse varianten", label: "Afstand" },
      { icon: <Trees className="w-6 h-6" />, value: "Natuur", label: "Type" },
      { icon: <Mountain className="w-6 h-6" />, value: "Makkelijk", label: "Niveau" },
    ],
    description: (
      <>
        <p>
          Laat u verrassen door het idyllisch decor van broekbossen, vijvers en hooilanden in een
          natuurgebied van <strong>180 hectare</strong>. De gele dotterbloemen en witte klaverzuring maken
          het moerasplaatje compleet, terwijl een iglo van groeiend wilgenvlechtwerk een natuurlijke rustplaats biedt.
        </p>
        <p>
          De Abeek ontspringt vlakbij De Hoogmolen en kronkelt door dit beschermd Natura 2000-gebied.
          Stap rechtstreeks vanaf het domein de vallei in — geen auto nodig.
        </p>
      </>
    ),
    sideInfo: (
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Startpunt</div>
          <div className="text-sm text-foreground/85">Aan De Hoogmolen — direct vanaf het domein</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>180 ha Natura 2000</li>
            <li>Wilgenvlechtwerk-iglo</li>
            <li>Dotterbloemen in lente</li>
          </ul>
        </div>
      </>
    ),
    externalLinks: [
      { label: "Meer info oudsbergen.be", href: "https://www.oudsbergen.be/producten/detail/956/abeekvallei", url: "oudsbergen.be/producten/detail/956/abeekvallei" },
    ],
  },
  resterheide: {
    eyebrow: "Wandelroute · Nationaal Park Hoge Kempen",
    title: "Resterheide wandelroute",
    subtitle: "Uitgestrekte heidegebieden en vennen in het hart van het nationaal park.",
    intro: "Typische Kempense natuur met paarse heide, stille vennen en zeldzame flora.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "5–12 km", label: "Lussen" },
      { icon: <Sun className="w-6 h-6" />, value: "Heide & ven", label: "Landschap" },
      { icon: <Mountain className="w-6 h-6" />, value: "Makkelijk", label: "Niveau" },
    ],
    description: (
      <>
        <p>
          De Resterheide vormt één van de stilste plekken in <strong>Nationaal Park Hoge Kempen</strong>.
          Uitgestrekte heidevelden wisselen af met vennen waar libellen boven cirkelen.
        </p>
        <p>
          Vanaf eind juli tot eind augustus kleurt het landschap paars — een van de mooiste momenten
          om hier te wandelen.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Visit Limburg — Resterheide", href: "https://www.visitlimburg.be", url: "visitlimburg.be" },
    ],
  },
  duinengordel: {
    eyebrow: "Wandelroute · Uniek in België",
    title: "Duinengordel",
    subtitle: "Binnenlandse zandduinen — een landschap dat u nergens anders in België vindt.",
    intro: "Uniek binnenlands stuifzandgebied met zeldzame flora en fauna.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "6–15 km", label: "Lussen" },
      { icon: <Sun className="w-6 h-6" />, value: "Stuifzand", label: "Landschap" },
      { icon: <Mountain className="w-6 h-6" />, value: "Gemiddeld", label: "Niveau" },
    ],
    description: (
      <>
        <p>
          De <strong>Duinengordel</strong> verbindt de gemeenten Oudsbergen, Maaseik en Opglabbeek
          in een zeldzaam landschap van binnenlandse zandduinen — uniek in België.
        </p>
        <p>
          De zachte heuvels, dennenbossen en stuifzandvlaktes maken elke wandeling tot een ontdekking.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Wandelen in Limburg — Duinengordel", href: "https://www.wandeleninlimburg.be", url: "wandeleninlimburg.be" },
    ],
  },
  "wandel-op-water": {
    eyebrow: "Wandelroute · Waterbeleving",
    title: "Wandel op water",
    subtitle: "Wandelpad over en langs het water — een unieke perspectiefwissel.",
    intro: "Wandel over knuppelpaden en bruggen door het natte hart van de Abeekvallei.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "Korte lus", label: "Afstand" },
      { icon: <Droplets className="w-6 h-6" />, value: "Water", label: "Landschap" },
      { icon: <Mountain className="w-6 h-6" />, value: "Makkelijk", label: "Niveau" },
    ],
    description: (
      <p>
        Een idyllische korte route langs en over het water in de Abeekvallei. Knuppelpaden brengen u
        droog door het moeras — een unieke beleving die direct vanaf De Hoogmolen begint.
      </p>
    ),
    externalLinks: [
      { label: "Meer info oudsbergen.be", href: "https://www.oudsbergen.be", url: "oudsbergen.be" },
    ],
  },
  "abeekvallei-zwart": {
    eyebrow: "Wandelroute · Lange variant",
    title: "Abeekvallei — Zwarte lus",
    subtitle: "Langere variant voor ervaren wandelaars langs de volledige Abeek.",
    intro: "De zwarte lus volgt de Abeek over de volledige lengte door het beschermd natuurgebied.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "12+ km", label: "Lange lus" },
      { icon: <Trees className="w-6 h-6" />, value: "Bos & moeras", label: "Landschap" },
      { icon: <Mountain className="w-6 h-6" />, value: "Gemiddeld", label: "Niveau" },
    ],
    description: (
      <p>
        De <strong>zwarte lus</strong> is de langste variant van de Abeekvallei-routes. Geschikt voor
        ervaren wandelaars die de volledige diversiteit van het gebied willen ontdekken.
      </p>
    ),
    externalLinks: [
      { label: "Meer info oudsbergen.be", href: "https://www.oudsbergen.be", url: "oudsbergen.be" },
    ],
  },
  "abeekvallei-blauw": {
    eyebrow: "Wandelroute · Middellange variant",
    title: "Abeekvallei — Blauwe lus",
    subtitle: "Middellange route door het hart van de Abeekvallei.",
    intro: "De blauwe lus is de populairste — perfect afgestemde lengte met alle highlights van de vallei.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "6–8 km", label: "Middellange lus" },
      { icon: <Trees className="w-6 h-6" />, value: "Afwisselend", label: "Landschap" },
      { icon: <Mountain className="w-6 h-6" />, value: "Makkelijk", label: "Niveau" },
    ],
    description: (
      <p>
        De <strong>blauwe lus</strong> brengt u in 6 tot 8 km langs alle highlights van de vallei:
        broekbos, vijvers, hooilanden en de wilgenvlechtwerk-iglo.
      </p>
    ),
    externalLinks: [
      { label: "Meer info oudsbergen.be", href: "https://www.oudsbergen.be", url: "oudsbergen.be" },
    ],
  },
  "gele-lus-itterbeek": {
    eyebrow: "Wandelroute · Itterbeekvallei",
    title: "Gele lus — Itterbeekvallei",
    subtitle: "Sereen wandelpad langs de Itterbeek door bossen, hooilanden en oude molenrestanten.",
    intro: "De gele lus volgt de meanderende Itterbeek door één van de mooiste beekvalleien van Limburg.",
    fastFacts: [
      { icon: <Footprints className="w-6 h-6" />, value: "7,2 km", label: "Gele lus" },
      { icon: <MapPin className="w-6 h-6" />, value: "10 min", label: "Vanaf domein" },
      { icon: <Mountain className="w-6 h-6" />, value: "Makkelijk", label: "Niveau" },
    ],
    description: (
      <>
        <p>
          De <strong>gele lus</strong> brengt u in 7,2 kilometer langs de meanderende Itterbeek door
          een afwisselend landschap van loofbossen, hooilanden en historische molenrestanten.
        </p>
        <p>
          Een serene route, perfect na het ontbijt op het landgoed. De Itterbeek is één van de
          schoonste beken van Vlaanderen — kraakhelder en rijk aan vis.
        </p>
      </>
    ),
    sideInfo: (
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Startpunt</div>
          <div className="text-sm text-foreground/85">10 minuten vanaf De Hoogmolen</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>Itterbeek — kraakhelder water</li>
            <li>Historische molenrestanten</li>
            <li>Loofbossen en hooilanden</li>
          </ul>
        </div>
      </>
    ),
    externalLinks: [
      { label: "Wandelen in Limburg — Itterbeekvallei", href: "https://www.wandeleninlimburg.be/nl/wandelroutes", url: "wandeleninlimburg.be/nl/wandelroutes" },
    ],
  },
};

const WandelDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const data = ROUTES[slug];

  if (!data) return <NotFound />;

  return (
    <TemplateActivity
      eyebrow={data.eyebrow}
      title={data.title}
      subtitle={data.subtitle}
      intro={data.intro}
      fastFacts={data.fastFacts}
      description={data.description}
      sideInfo={data.sideInfo}
      externalLinks={data.externalLinks}
      ctaTitle="Maak uw wandelweekend compleet"
      ctaDescription="Combineer deze route met een overnachting op het landgoed."
      backHref="/activiteiten/wandelen"
      backLabel="Terug naar wandelen"
    />
  );
};

export default WandelDetail;
