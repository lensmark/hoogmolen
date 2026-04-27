/**
 * PaardrijdenDetail — generieke detailpagina voor /activiteiten/paardrijden/:slug
 * Bevat 2 routes: ruiterroutes-hoge-kempen + menroutes-oudsbergen.
 * Gebruikt TemplateActivity met HorseBoardingCTA als prominent cross-sell.
 */
import { useParams } from "react-router-dom";
import { Compass, MapPin, TreeDeciduous } from "lucide-react";
import { TemplateActivity, type FastFact, type ExternalLink } from "@/components/property/TemplateActivity";
import { HorseBoardingCTA } from "@/components/HorseBoardingCTA";
import NotFound from "@/pages/NotFound";

interface PaardData {
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  fastFacts: FastFact[];
  description: React.ReactNode;
  sideInfo: React.ReactNode;
  externalLinks: ExternalLink[];
}

const SIDE_NETWORK = (
  <>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Netwerk</div>
      <div className="text-sm text-foreground/85">650 km ruiter- en mennetwerk in Limburg</div>
      <div className="text-xs text-muted-foreground mt-1">≈ afstand Hasselt → Berlijn</div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Ondergrond</div>
      <div className="text-sm text-foreground/85">
        Bijna alles door de natuur — onverharde paden door bos, zandgronden, duinen en heide
      </div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Trailer-parking</div>
      <div className="text-sm text-foreground/85">
        Gratis ruime parking aan het begin van het domein — ideaal voor paardentrailers
      </div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Stalling op het domein</div>
      <div className="text-sm text-foreground/85">
        6 boxen 3 m × 3,5 m · wolfwerende weide
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        €25 eerste nacht (incl. hooi, stro &amp; water) · €10 volgende nachten
      </div>
    </div>
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Vertrek</div>
      <div className="text-sm text-foreground/85">Direct vanaf de stallen op De Hoogmolen</div>
    </div>
  </>
);

const ROUTES: Record<string, PaardData> = {
  "ruiterroutes-hoge-kempen": {
    eyebrow: "650 km ruiter- en mennetwerk",
    title: "Ruiterroutes Hoge Kempen",
    subtitle: "Ruitertochten door België's eerste nationaal park — heide, dennenbossen en stuifzand.",
    intro: "Ruiterroutes door Nationaal Park Hoge Kempen — bossen, heide en stille vennen, vrijwel volledig over onverharde paden.",
    fastFacts: [
      { icon: <Compass className="w-6 h-6" />, value: "650 km", label: "Mennetwerk Limburg" },
      { icon: <TreeDeciduous className="w-6 h-6" />, value: "Onverhard", label: "Ondergrond" },
      { icon: <MapPin className="w-6 h-6" />, value: "Vanaf de stal", label: "Vertrek" },
    ],
    description: (
      <>
        <p>
          Het <strong>Limburgse ruiter- en mennetwerk</strong> telt 650 kilometer aan
          uitgestippelde paden — een netwerk vergelijkbaar met de afstand van Hasselt
          tot Berlijn. Bijna alles loopt door de natuur, over onverharde paden door
          bos, heide en zandgronden.
        </p>
        <p>
          Vanuit De Hoogmolen rijdt u zo de <strong>Hoge Kempen</strong> in: België's
          eerste nationaal park, met paarse heidevelden, eeuwenoude dennenbossen en
          waterrijke vennen. Talloze geschikte rustpunten met drinkbakken voor uw paard.
        </p>
        <p>
          De routes zijn vrij combineerbaar — een korte ochtendrit van twee uur of een
          volledige dagtocht door het hart van het park, beide zijn perfect haalbaar.
        </p>
      </>
    ),
    sideInfo: SIDE_NETWORK,
    externalLinks: [
      {
        label: "Bekijk routes op Nationaal Park Hoge Kempen",
        href: "https://www.nationaalparkhogekempen.be",
        url: "nationaalparkhogekempen.be",
      },
    ],
  },
  "menroutes-oudsbergen": {
    eyebrow: "650 km ruiter- en mennetwerk",
    title: "Menroutes Oudsbergen",
    subtitle: "Karrenroutes door de rustige landwegen, dennenbossen en duinen van Oudsbergen.",
    intro: "Menroutes door de stille landwegen en bosgebieden van Oudsbergen — ideaal voor menners op zoek naar een breed en zacht parcours.",
    fastFacts: [
      { icon: <Compass className="w-6 h-6" />, value: "650 km", label: "Limburgs netwerk" },
      { icon: <TreeDeciduous className="w-6 h-6" />, value: "Bos & duin", label: "Landschap" },
      { icon: <MapPin className="w-6 h-6" />, value: "Vanaf de stal", label: "Vertrek" },
    ],
    description: (
      <>
        <p>
          De <strong>menroutes van Oudsbergen</strong> volgen brede, rustige landwegen
          en bospaden — ideaal voor karren en aanspanningen. Het Limburgse mennetwerk
          telt in totaal 650 kilometer aan paden, grotendeels onverhard.
        </p>
        <p>
          De wisseling tussen <strong>dennenbossen, zandgronden, binnenlandse duinen
          en heide</strong> maakt elke menrit visueel gevarieerd. Het reliëf is zacht
          en geschikt voor zowel ervaren menners als beginners.
        </p>
        <p>
          U vertrekt rechtstreeks vanaf de stallen op De Hoogmolen — geen voortransport
          nodig.
        </p>
      </>
    ),
    sideInfo: SIDE_NETWORK,
    externalLinks: [
      {
        label: "Ontdek Menroutes op oudsbergen.be",
        href: "https://www.oudsbergen.be",
        url: "oudsbergen.be",
      },
    ],
  },
};

const PaardrijdenDetail = () => {
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
      customCta={<HorseBoardingCTA />}
      backHref="/activiteiten/paardrijden"
      backLabel="Terug naar paardrijden"
    />
  );
};

export default PaardrijdenDetail;
