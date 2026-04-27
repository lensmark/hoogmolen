/**
 * FietsenDoorDeBomen — detail /activiteiten/fietsen/fietsen-door-de-bomen
 * Bron: Bosland Pijnven — spiraal tot 10m, knooppunt 272.
 */
import { Bike, MapPin, Hash } from "lucide-react";
import { TemplateActivity } from "@/components/property/TemplateActivity";

const FietsenDoorDeBomen = () => (
  <TemplateActivity
    eyebrow="Fietsroute · 25 minuten van De Hoogmolen"
    title="Fietsen door de Bomen"
    subtitle="Een spiraalvormig fietspad van 700 meter dat opstijgt tot tien meter hoogte tussen de dennenkruinen van Bosland."
    intro="Sinds 2019 dé iconische fietservaring van Limburg — twee dubbele cirkels die u langzaam de boomtoppen in tillen."
    fastFacts={[
      { icon: <Bike className="w-6 h-6" />, value: "700 m / 10 m hoog", label: "Spiraal" },
      { icon: <MapPin className="w-6 h-6" />, value: "Pijnven · Bosland", label: "25 min vanaf domein" },
      { icon: <Hash className="w-6 h-6" />, value: "Knooppunt 272", label: "Startpunt" },
    ]}
    description={
      <>
        <p>
          In het hart van <strong>Bosland</strong>, bij Hechtel-Eksel, ontvouwt zich
          een dubbele cirkel van staal en beton: het <strong>Cycling Through The Trees</strong>-pad.
          Twee aaneengesloten ringen tillen u in een zachte spiraal van bodemniveau tot
          tien meter boven de grond.
        </p>
        <p>
          Vanaf de top kijkt u uit over een eindeloos dennenwoud — een perspectief dat
          fietsers nooit eerder hebben kunnen ervaren. Een architecturaal hoogstandje
          dat in een naadloze lus terug naar beneden buigt.
        </p>
        <p>
          Start bij <strong>knooppunt 272</strong> en combineer eventueel met
          <em> Fietsen door de Heide</em> en <em>Fietsen door het Water</em> voor de
          complete <strong>Limburgse Wonderlus</strong>.
        </p>
      </>
    }
    sideInfo={
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Locatie</div>
          <div className="text-sm text-foreground/85">Pijnven · Bosland · Hechtel-Eksel</div>
          <div className="text-sm text-foreground/85">Afstand: 25 min met de auto</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>Spiraal van 700 m</li>
            <li>10 meter boven de grond</li>
            <li>Architectuurprijs 2019</li>
            <li>Ideaal voor families</li>
          </ul>
        </div>
      </>
    }
    externalLinks={[
      { label: "Bosland — Cycling Through The Trees", href: "https://www.bosland.be/fietsen-door-de-bomen", url: "bosland.be" },
      { label: "Limburgs fietsnetwerk", href: "https://www.fietsnetwerk.be", url: "fietsnetwerk.be" },
    ]}
    backHref="/activiteiten/fietsen"
    backLabel="Alle fietsroutes"
  />
);

export default FietsenDoorDeBomen;
