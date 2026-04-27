/**
 * FietsenDoorHetWater — detail /activiteiten/fietsen/fietsen-door-het-water
 * Bron: Bokrijk — 212 m fietspad door de vijver, knooppunt 91.
 */
import { Bike, MapPin, Hash } from "lucide-react";
import { TemplateActivity } from "@/components/property/TemplateActivity";

const FietsenDoorHetWater = () => (
  <TemplateActivity
    eyebrow="Fietsroute · 30 minuten van De Hoogmolen"
    title="Fietsen door het Water"
    subtitle="212 meter fietspad waarbij het wateroppervlak letterlijk op ooghoogte ligt — een wereldwijd unieke ervaring in Bokrijk."
    intro="De wereldberoemde fietsbrug door de vijver in Bokrijk — sinds 2016 één van Vlaanderens iconische belevenissen."
    fastFacts={[
      { icon: <Bike className="w-6 h-6" />, value: "212 m", label: "Fietspad door water" },
      { icon: <MapPin className="w-6 h-6" />, value: "Bokrijk", label: "30 min vanaf domein" },
      { icon: <Hash className="w-6 h-6" />, value: "Knooppunt 91", label: "Startpunt" },
    ]}
    description={
      <>
        <p>
          In het natuurgebied <strong>De Wijers</strong> bij Bokrijk fietst u over een
          212 meter lang pad waarbij het water aan beide zijden tot exact ooghoogte komt.
          Een perspectiefwissel die u nergens anders ter wereld op deze schaal vindt.
        </p>
        <p>
          De route is onderdeel van het Limburgse knooppuntennetwerk — start bij
          <strong> knooppunt 91</strong> en stel uw eigen lus samen langs domein Bokrijk,
          het openluchtmuseum en de omliggende vijvers.
        </p>
        <p>
          Combineer perfect met een bezoek aan het <strong>Openluchtmuseum Bokrijk </strong>
          of een lunch op één van de terrassen langs de route.
        </p>
      </>
    }
    sideInfo={
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Locatie</div>
          <div className="text-sm text-foreground/85">Domein Bokrijk · Genk</div>
          <div className="text-sm text-foreground/85">Afstand: 30 min met de auto</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>Wateroppervlak op ooghoogte</li>
            <li>212 meter doorvaart</li>
            <li>Onderdeel knooppuntennetwerk</li>
            <li>Combineer met Bokrijk &amp; Bomen</li>
          </ul>
        </div>
      </>
    }
    externalLinks={[
      { label: "Visit Limburg — door het water", href: "https://www.visitlimburg.be/nl/fietsen-door-het-water", url: "visitlimburg.be" },
      { label: "Limburgs fietsnetwerk", href: "https://www.fietsnetwerk.be", url: "fietsnetwerk.be" },
    ]}
    backHref="/activiteiten/fietsen"
    backLabel="Alle fietsroutes"
  />
);

export default FietsenDoorHetWater;
