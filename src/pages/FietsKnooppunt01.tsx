/**
 * FietsKnooppunt01 — detail /activiteiten/fietsen/knooppunt-01
 * Pixel-aligned met image-52: knooppunt direct aan de deur,
 * combineer met Ronde van Oudsbergen.
 */
import { Hash, MapPin, Infinity as InfinityIcon } from "lucide-react";
import { TemplateActivity } from "@/components/property/TemplateActivity";

const FietsKnooppunt01 = () => (
  <TemplateActivity
    eyebrow="Limburgse fietsnetwerk — startpunt aan De Hoogmolen"
    title="Knooppunt 01 — startpunt aan De Hoogmolen"
    subtitle="Het Limburgse knooppuntennetwerk start letterlijk aan de deur van het domein."
    intro="Knooppunt 01 ligt direct aan De Hoogmolen — een uniek startpunt waarvandaan u uw eigen route door heel Limburg kunt samenstellen."
    fastFacts={[
      { icon: <Hash className="w-6 h-6" />, value: "01", label: "Knooppunt" },
      { icon: <MapPin className="w-6 h-6" />, value: "Aan de deur", label: "Locatie" },
      { icon: <InfinityIcon className="w-6 h-6" />, value: "Vrij samen", label: "Route" },
    ]}
    description={
      <>
        <p>
          Knooppunt 01 van het <strong>Limburgse fietsnetwerk</strong> ligt direct aan
          De Hoogmolen. Vanuit dit startpunt kunt u zelf uw route samenstellen door
          het uitgebreide netwerk van Limburg. Combineer knooppunten naar keuze voor
          een route op maat van uw groep.
        </p>
        <p>
          Een populaire keuze is de <strong>Ronde van Oudsbergen</strong> — 35 km
          door de mooiste plekjes van de gemeente, met start en finish letterlijk
          aan de molen. Voor een langere tocht koppelt u eenvoudig door naar de
          watermolens-route of de Bosbeekvallei.
        </p>
        <p>
          Vraag aan de receptie naar onze <strong>fietsgids</strong> met routesuggesties
          voor verschillende afstanden en niveaus, of stel uw eigen lus samen via
          het officiële knooppuntenplatform.
        </p>
      </>
    }
    sideInfo={
      <>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Aanrader</div>
          <div className="text-sm text-foreground/85 font-medium">Ronde van Oudsbergen</div>
          <div className="text-sm text-foreground/85">35 km · halve dag</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Combineer met</div>
          <ul className="text-sm text-foreground/85 space-y-1 list-disc list-inside">
            <li>10 historische watermolens</li>
            <li>Bosbeekvallei lus</li>
            <li>Duinengordel route</li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Voor wie</div>
          <div className="text-sm text-foreground/85">Alle niveaus · ideaal voor groepen</div>
        </div>
      </>
    }
    externalLinks={[
      { label: "Limburgse fietsnetwerk", href: "https://www.fietsnetwerk.be", url: "fietsnetwerk.be" },
    ]}
    backHref="/activiteiten/fietsen"
    backLabel="Terug naar fietsen"
  />
);

export default FietsKnooppunt01;
