/**
 * OmgevingDetail — generieke detailpagina voor /activiteiten/in-de-omgeving/:slug
 * Externe attracties (Snow Valley, Bokrijk, Bosland, Racelandkart, etc.) krijgen
 * een interne 5-sterren introductie, gevolgd door een External Bridge naar de
 * officiële website.
 */
import { useParams } from "react-router-dom";
import { MapPin, Clock, Sparkles } from "lucide-react";
import { TemplateActivity, type FastFact, type ExternalLink } from "@/components/property/TemplateActivity";
import NotFound from "@/pages/NotFound";

interface SpotData {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  fastFacts: FastFact[];
  description: React.ReactNode;
  externalLinks: ExternalLink[];
}

const facts = (afstand: string, type: string, hoogtepunt: string): FastFact[] => [
  { icon: <MapPin className="w-6 h-6" />, value: afstand, label: "Vanaf domein" },
  { icon: <Sparkles className="w-6 h-6" />, value: type, label: "Type" },
  { icon: <Clock className="w-6 h-6" />, value: hoogtepunt, label: "Highlight" },
];

const SPOTS: Record<string, SpotData> = {
  "snow-valley": {
    eyebrow: "Indoor wintersport · het hele jaar door",
    title: "Snow Valley Peer",
    subtitle: "Skiën en snowboarden op echte sneeuw — uniek in België, op 15 minuten van het domein.",
    intro: "Het hele jaar door wintersport op echte sneeuw — pistes voor alle niveaus, snowpark, après-ski bar en restaurant.",
    fastFacts: facts("15 min", "Wintersport", "Echte sneeuw"),
    description: (
      <>
        <p>
          <strong>Snow Valley Peer</strong> is België's enige indoor skicentrum met
          echte sneeuw. Pistes voor beginners en gevorderden, een snowpark voor
          freestylers en lessen voor zowel kinderen als volwassenen.
        </p>
        <p>
          Op slechts 15 minuten van De Hoogmolen — combineer perfect met een
          weekend op het landgoed.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Plan uw bezoek op snowvalley.be", href: "https://www.snowvalley.be", url: "snowvalley.be" },
    ],
  },
  bokrijk: {
    eyebrow: "Openluchtmuseum & Fietsen door het Water",
    title: "Bokrijk",
    subtitle: "Eén van Europa's grootste openluchtmusea — historisch dorp, ambachten en de iconische fietsbrug door het water.",
    intro: "Stap binnen in een levend Vlaams verleden — historische gebouwen, ambachten, en de wereldberoemde fietsbrug door de vijver.",
    fastFacts: facts("30 min", "Cultuur & natuur", "Iconisch museum"),
    description: (
      <>
        <p>
          <strong>Bokrijk</strong> herbergt één van Europa's grootste openluchtmusea
          met meer dan 100 historische gebouwen, levende ambachten en seizoensactiviteiten
          voor het hele gezin.
        </p>
        <p>
          Het domein is ook de thuisbasis van <strong>Fietsen door het Water</strong> —
          een 212 meter lang fietspad waarbij het wateroppervlak op ooghoogte ligt.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Bezoek bokrijk.be", href: "https://www.bokrijk.be", url: "bokrijk.be" },
    ],
  },
  bosland: {
    eyebrow: "Grootste aaneengesloten bosgebied van Vlaanderen",
    title: "Nationaal Park Bosland",
    subtitle: "5.000 hectare bos, heide en duinen — thuis van Fietsen door de Bomen.",
    intro: "Het grootste bosgebied van Vlaanderen — 5.000 hectare wilde natuur met de iconische spiraal Fietsen door de Bomen.",
    fastFacts: facts("25 min", "Bos & duinen", "Boomkruintoren"),
    description: (
      <>
        <p>
          <strong>Bosland</strong> bestrijkt 5.000 hectare bos, heide en stuifduinen
          in Noord-Limburg — een speeltuin voor wandelaars, fietsers en gezinnen
          met een breed netwerk aan paden en speelzones.
        </p>
        <p>
          De spiraal <strong>Fietsen door de Bomen</strong> in Pijnven is wereldberoemd:
          een 700 meter lang pad dat opstijgt tot tien meter hoogte tussen de dennenkruinen.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Ontdek bosland.be", href: "https://www.bosland.be", url: "bosland.be" },
    ],
  },
  "blauwe-bessen-schrijnwerkers": {
    eyebrow: "Familie Schrijnwerkers · zelfpluk vanaf juli",
    title: "Blauwe Bessen Schrijnwerkers",
    subtitle: "Plukweide met biologische blauwe bessen — een geliefd zomerritueel.",
    intro: "Pluk uw eigen biologische blauwe bessen op de bessenboerderij van familie Schrijnwerkers — vanaf begin juli.",
    fastFacts: facts("15 min", "Zelfpluk", "Vanaf juli"),
    description: (
      <>
        <p>
          De <strong>familie Schrijnwerkers</strong> teelt biologische blauwe bessen
          op een idyllische plukweide — open vanaf begin juli, zaterdag van 10–17u en
          zondag van 13–17u.
        </p>
        <p>
          Reserveren is niet nodig. Breng een eigen doos mee. Een geliefd ritueel onder
          onze gasten — en het meest natuurlijke souvenir denkbaar.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Bezoek blauwebessen.be", href: "https://www.blauwebessen.be", url: "blauwebessen.be" },
    ],
  },
  racelandkart: {
    eyebrow: "Karting · lasergame · pitbikes",
    title: "Racelandkart Oudsbergen",
    subtitle: "De ultieme adrenalinekick op enkele minuten van het domein — perfect voor groepen en bedrijfsuitjes.",
    intro: "Indoor karting, lasergame, kidskarting en pitbikes — alles op 5 minuten rijden van De Hoogmolen.",
    fastFacts: facts("5 min", "Karting", "Voor groepen"),
    description: (
      <>
        <p>
          <strong>Racelandkart</strong> ligt letterlijk om de hoek bij De Hoogmolen.
          Indoor karting voor alle niveaus, lasergame voor groepen, en aparte
          kidskarting voor de jongste piloten.
        </p>
        <p>
          Een vaste favoriet voor bedrijfsuitjes en teambuildings — wij zorgen
          voor de boekingsafspraken vanuit het landgoed.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Plan op racelandkart.be", href: "https://www.racelandkart.be", url: "racelandkart.be" },
    ],
  },
  "terhills-cablepark": {
    eyebrow: "Wakeboarden · waterskiën · aquapark",
    title: "Terhills Cablepark & Aquapark",
    subtitle: "Eén van België's mooiste cableparken — op de Connecterra in Nationaal Park Hoge Kempen.",
    intro: "Wakeboarden en waterskiën met top instructeurs, plus een drijvende hindernisbaan voor het hele gezin.",
    fastFacts: facts("30 min", "Watersport", "Alle niveaus"),
    description: (
      <>
        <p>
          <strong>Terhills Cablepark</strong> ligt aan de spectaculaire Connecterra in
          het Nationaal Park Hoge Kempen — wakeboarden en waterskiën in één van de
          mooiste decors van België.
        </p>
        <p>
          Het bijhorende <strong>Aquapark</strong> met drijvende hindernisbaan is
          toegankelijk voor alle leeftijden en niveaus.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Boek op terhillscablepark.be", href: "https://terhillscablepark.be", url: "terhillscablepark.be" },
    ],
  },
  "center-parcs": {
    eyebrow: "Subtropisch zwemparadijs · Aqua Mundo",
    title: "Center Parcs Erperheide",
    subtitle: "Tropisch binnenklimaat met glijbanen, golfslagbad en wildwaterbaan — perfect voor gezinnen.",
    intro: "Aqua Mundo Erperheide — het beroemdste zwemparadijs van Limburg, op 20 minuten van het domein.",
    fastFacts: facts("20 min", "Zwemparadijs", "Hele gezin"),
    description: (
      <>
        <p>
          <strong>Aqua Mundo Erperheide</strong> biedt een tropisch binnenklimaat met
          glijbanen, een golfslagbad, een wildwaterbaan en speeltuinen — de perfecte
          dag-uitstap met kinderen.
        </p>
        <p>
          Dagtickets zijn beschikbaar voor niet-gasten van Center Parcs.
        </p>
      </>
    ),
    externalLinks: [
      { label: "Reserveer op centerparcs.be", href: "https://www.centerparcs.be/be-vl/belgie/fp_EP_vakantiepark-erperheide", url: "centerparcs.be" },
    ],
  },
  "zelfpluk-blauwe-bessen": {
    // alias voor blauwe-bessen-schrijnwerkers
    eyebrow: "Familie Schrijnwerkers · zelfpluk vanaf juli",
    title: "Zelfpluk Blauwe Bessen",
    subtitle: "Pluk uw eigen biologische blauwe bessen op de plukweide van familie Schrijnwerkers.",
    intro: "Een geliefd zomerritueel: zelf bessen plukken aan aantrekkelijke prijs — vanaf begin juli.",
    fastFacts: facts("15 min", "Zelfpluk", "Vanaf juli"),
    description: (
      <p>
        Open zaterdag 10–17u en zondag 13–17u. Reserveren niet nodig — eigen doos meebrengen.
      </p>
    ),
    externalLinks: [
      { label: "Bezoek blauwebessen.be", href: "https://www.blauwebessen.be", url: "blauwebessen.be" },
    ],
  },
};

const OmgevingDetail = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const data = SPOTS[slug];

  if (!data) return <NotFound />;

  return (
    <TemplateActivity
      eyebrow={data.eyebrow}
      title={data.title}
      subtitle={data.subtitle}
      intro={data.intro}
      fastFacts={data.fastFacts}
      description={data.description}
      externalLinks={data.externalLinks}
      ctaTitle="Maak er een verblijf van"
      ctaDescription="Combineer deze attractie met een overnachting op het 5-sterren landgoed."
      backHref="/activiteiten/in-de-omgeving"
      backLabel="Terug naar in de omgeving"
    />
  );
};

export default OmgevingDetail;
