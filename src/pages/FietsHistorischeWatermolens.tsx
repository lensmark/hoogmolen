/**
 * FietsHistorischeWatermolens — detail /activiteiten/fietsen/10-historische-watermolens
 * Bron: Activiteitengids — 44,5 km langs Abeek- & Bosbeekvallei.
 */
import { Bike, MapPin, Hash } from "lucide-react";
import { TemplateActivity } from "@/components/property/TemplateActivity";

const KNOOPPUNTEN = "02 → 32 → 33 → 70 → 527 → 59 → 38 → 37 → 35 → 570 → 571 → 31 → 23 → 524 → 02";

const FietsHistorischeWatermolens = () => (
  <TemplateActivity
    eyebrow="Fietsroute · Vertrek aan De Hoogmolen"
    title="10 historische watermolens"
    subtitle="Een 44,5 km lus langs de Abeek- en Bosbeekvallei, met tien eeuwenoude watermolens als ankerpunten."
    intro="Een van de meest karakteristieke routes van Limburg — van de stilte van het beekdal naar de keuken van Slagmolen, één van België's sterrenrestaurants."
    fastFacts={[
      { icon: <Bike className="w-6 h-6" />, value: "44,5 km", label: "Lus" },
      { icon: <MapPin className="w-6 h-6" />, value: "Aan de deur", label: "Vertrek" },
      { icon: <Hash className="w-6 h-6" />, value: "Knooppunt 02", label: "Startpunt" },
    ]}
    description={
      <>
        <p>
          Deze 44,5 kilometer lange route brengt u langs tien historische watermolens
          in de valleien van de <strong>Abeek</strong> en <strong>Bosbeek</strong> —
          beide ontspringend in de Kempense bodem en sinds eeuwen het levensritme van
          deze streek.
        </p>
        <p>
          Onderweg passeert u de <strong>Slagmolen</strong>, vandaag een Michelin-sterrenrestaurant
          gevestigd in een prachtig gerestaureerde watermolen. Pauzeer hier voor lunch,
          of houd het bij een terras langs één van de andere molens.
        </p>
        <p>
          De route loopt afwisselend door bossen, heidegebieden en open landbouwgrond,
          met regelmatig een blik op het zachte stromende water naast u.
        </p>
      </>
    }
    sideInfo={
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Knooppuntenketen</div>
          <div className="text-sm text-foreground/85 font-mono leading-relaxed">{KNOOPPUNTEN}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Highlights</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>Slagmolen — sterrenrestaurant</li>
            <li>Abeekvallei — natuurgebied</li>
            <li>Bosbeekvallei — bossen &amp; vennen</li>
            <li>Tien gerestaureerde molens</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Geschikt voor</div>
          <div className="text-sm text-foreground/85">Recreatieve fietsers · halve dag tot dagtocht</div>
        </div>
      </>
    }
    externalLinks={[
      { label: "Watermolens Oudsbergen", href: "https://www.oudsbergen.be/watermolens", url: "oudsbergen.be/watermolens" },
      { label: "Limburgs fietsnetwerk", href: "https://www.fietsnetwerk.be", url: "fietsnetwerk.be" },
    ]}
    backHref="/activiteiten/fietsen"
    backLabel="Alle fietsroutes"
  />
);

export default FietsHistorischeWatermolens;
