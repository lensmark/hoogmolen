/**
 * FamilieDetail — dynamische detailpagina voor /activiteiten/familie/:slug
 *
 * Drie parken (Center Parcs Erperheide, Park Molenheide, Tarzan & Jane).
 * Herbruikt TemplateActivity volgens de batch-4 blauwdruk.
 *
 * Bron: Informatiegids De Hoogmolen (2025).
 */
import { useParams, Navigate, Link } from "react-router-dom";
import { MapPin, Users, Waves, TreePine, Mountain } from "lucide-react";
import { TemplateActivity, type FastFact, type ExternalLink as TActExtLink } from "@/components/property/TemplateActivity";

interface FamilieDetailData {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  fastFacts: FastFact[];
  description: React.ReactNode;
  highlights: string[];
  externalLinks: TActExtLink[];
  groepsverblijf: { label: string; to: string };
}

const DATA: Record<string, FamilieDetailData> = {
  "center-parcs-erperheide": {
    slug: "center-parcs-erperheide",
    eyebrow: "Familie · op 20 minuten van De Hoogmolen",
    title: "Center Parcs Erperheide",
    subtitle:
      "Het iconische Limburgse vakantiepark met subtropisch zwemparadijs Aqua Mundo, bungalows en activiteiten voor het hele gezin.",
    intro:
      "Goed voor 20% van alle toeristische verblijven in Limburg — Erperheide is dé referentie voor familieplezier in de Kempen.",
    fastFacts: [
      { icon: <MapPin className="w-6 h-6" />, value: "Erperheide", label: "20 min · Peer" },
      { icon: <Waves className="w-6 h-6" />, value: "Aqua Mundo", label: "Zwemparadijs" },
      { icon: <Users className="w-6 h-6" />, value: "Families", label: "Alle leeftijden" },
    ],
    description: (
      <>
        <p>
          Center Parcs Erperheide is goed voor <strong>ongeveer 20% van alle toeristische
          verblijven in Limburg</strong> — daarmee is het verreweg het bekendste familiepark
          van de provincie en een vaste waarde voor wie wilt combineren met een verblijf op
          De Hoogmolen.
        </p>
        <p>
          Het park draait rond <strong>Aqua Mundo</strong>, een subtropisch zwemparadijs met
          glijbanen, golfslagbad en wildwaterbaan. Daarnaast vindt u <strong>bungalows,
          fietsroutes door het bos, indoor speelhallen, bowling en talloze sportactiviteiten</strong>.
        </p>
        <p>
          U hoeft niet te overnachten in het park: <strong>dagtickets</strong> voor Aqua
          Mundo en het animatieaanbod zijn beschikbaar. Combineer perfect met een gezellige
          avond terug in uw eigen vakantiewoning op De Hoogmolen.
        </p>
      </>
    ),
    highlights: [
      "Subtropisch zwemparadijs Aqua Mundo",
      "Bungalows · fietsroutes · speelhallen",
      "Dagtickets beschikbaar",
      "20% van Limburgse verblijven",
    ],
    externalLinks: [
      {
        label: "Meer info Center Parcs Erperheide",
        href: "https://www.centerparcs.be/be-vl/belgie/fp_EP_vakantiepark-erperheide",
        url: "centerparcs.be",
      },
    ],
    groepsverblijf: { label: "Groepsverblijf 10–20 personen", to: "/groepsverblijf/10-20-personen" },
  },

  "park-molenheide": {
    slug: "park-molenheide",
    eyebrow: "Familie · op 20 minuten van De Hoogmolen",
    title: "Park Molenheide",
    subtitle:
      "Overdekt zwemparadijs, een van de grootste indoor speeltuinen van België, minigolf in de natuur en bowling — alles op één domein.",
    intro:
      "Een complete familie-uitstap onder één dak: zwemmen, klimmen, bowlen en buitenspelen op een uitgestrekt natuurpark in Helchteren.",
    fastFacts: [
      { icon: <MapPin className="w-6 h-6" />, value: "Helchteren", label: "20 min" },
      { icon: <Waves className="w-6 h-6" />, value: "Indoor zwembad", label: "+ Speelparadijs" },
      { icon: <Users className="w-6 h-6" />, value: "Families", label: "Kinderen 0–12" },
    ],
    description: (
      <>
        <p>
          Park Molenheide is een uitgestrekt natuurpark in Helchteren met een
          <strong> overdekt zwemparadijs</strong>, een van de grootste
          <strong> indoor speeltuinen van België</strong> en talrijke buitenactiviteiten.
        </p>
        <p>
          Op het domein vindt u <strong>minigolf in de natuur, bowling, klimwanden,
          trampolines</strong> en uitgestrekte wandelpaden. Ideaal weer of geen weer — er is
          altijd iets te beleven.
        </p>
        <p>
          De combinatie van indoor en outdoor faciliteiten maakt Molenheide tot een veilige
          keuze voor een dagje uit met kinderen, ongeacht het seizoen.
        </p>
      </>
    ),
    highlights: [
      "Overdekt zwemparadijs",
      "Enorme binnenspeeltuin",
      "Minigolf in de natuur",
      "Bowling op het domein",
    ],
    externalLinks: [
      {
        label: "Meer info Park Molenheide",
        href: "https://www.molenheide.be",
        url: "molenheide.be",
      },
    ],
    groepsverblijf: { label: "Groepsverblijf 10–20 personen", to: "/groepsverblijf/10-20-personen" },
  },

  "tarzan-en-jane": {
    slug: "tarzan-en-jane",
    eyebrow: "Familie · op 15 minuten van De Hoogmolen",
    title: "Tarzan & Jane",
    subtitle:
      "4.000 m² indoor speelparadijs verdeeld over vier verdiepingen, blacklight minigolf en een ruime buitenspeeltuin.",
    intro:
      "Het grootste binnenspeelparadijs in de regio — vier verdiepingen avontuur, ongeacht het weer.",
    fastFacts: [
      { icon: <MapPin className="w-6 h-6" />, value: "Op 15 min", label: "Bree" },
      { icon: <Mountain className="w-6 h-6" />, value: "4.000 m²", label: "4 verdiepingen" },
      { icon: <Users className="w-6 h-6" />, value: "Families", label: "Kinderen 1–12" },
    ],
    description: (
      <>
        <p>
          Tarzan & Jane is een <strong>indoor speelparadijs van 4.000 m²</strong> verdeeld
          over <strong>vier verdiepingen</strong> vol klim-, klauter- en glijdtoestellen.
        </p>
        <p>
          Naast het binnenparadijs vindt u er <strong>blacklight minigolf</strong> in een
          spectaculaire neondecor en een <strong>ruime buitenspeeltuin</strong> voor wanneer
          het weer meezit.
        </p>
        <p>
          Een vaste waarde voor regenweekends én zonnige dagen — kinderen vermaken zich
          uren, ouders genieten op het terras.
        </p>
      </>
    ),
    highlights: [
      "4.000 m² indoor over 4 verdiepingen",
      "Blacklight minigolf",
      "Ruime buitenspeeltuin",
      "Ideaal bij elk weer",
    ],
    externalLinks: [
      {
        label: "Meer info Tarzan & Jane",
        href: "https://www.tarzanenjane.be",
        url: "tarzanenjane.be",
      },
    ],
    groepsverblijf: { label: "Groepsverblijf 10–20 personen", to: "/groepsverblijf/10-20-personen" },
  },
};

const FamilieDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? DATA[slug] : undefined;

  if (!data) return <Navigate to="/activiteiten/familie" replace />;

  const sideInfo = (
    <>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
        <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
          {data.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
          Combineer met verblijf
        </div>
        <Link
          to={data.groepsverblijf.to}
          className="inline-block bg-primary text-secondary hover:bg-primary-deep px-4 py-2 text-sm font-medium transition-colors rounded-sm mt-1"
        >
          {data.groepsverblijf.label}
        </Link>
      </div>
    </>
  );

  return (
    <TemplateActivity
      eyebrow={data.eyebrow}
      title={data.title}
      subtitle={data.subtitle}
      intro={data.intro}
      fastFacts={data.fastFacts}
      description={data.description}
      sideInfo={sideInfo}
      externalLinks={data.externalLinks}
      ctaTitle="Maak er een familieweekend van"
      ctaDescription="Combineer dit dagje uit met een overnachting op het landgoed."
      backHref="/activiteiten/familie"
      backLabel="Alle familie-uitstappen"
    />
  );
};

export default FamilieDetail;
