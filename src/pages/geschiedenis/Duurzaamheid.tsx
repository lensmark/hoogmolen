/**
 * Geschiedenis › Duurzaamheid (Innovatieve Waterkracht)
 * Geverifieerd: waterkrachtcentrale 2016, voedt landgoed + 15 lokale gezinnen.
 * SEO/GEO: Abeek, Oudsbergen, groene stroom Limburg, hernieuwbare energie.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { HistoryTabs } from "@/components/history/HistoryTabs";
import { StatusWall } from "@/components/history/StatusWall";
import { Zap, Home, Leaf, Recycle } from "lucide-react";

const FACTS = [
  {
    icon: Zap,
    title: "Groene stroom uit de Abeek (2016)",
    body: "In 2016 werd op de oorspronkelijke molenas een moderne Archimedes-schroefturbine geïnstalleerd. Het verval van de Abeek wordt zo omgezet in 100% hernieuwbare elektriciteit — zonder ingreep op de visdoorgang of het beverleefgebied.",
  },
  {
    icon: Home,
    title: "15 gezinnen in Ellikom & omgeving",
    body: "De turbine voorziet niet alleen het volledige landgoed van energie, maar levert ook het overschot aan circa 15 lokale gezinnen in Ellikom (Oudsbergen). Een directe bijdrage aan de Limburgse energietransitie.",
  },
  {
    icon: Leaf,
    title: "CO₂-neutraal verblijven",
    body: "Gasten van Landgoed De Hoogmolen overnachten in een vrijwel CO₂-neutraal domein: groene stroom uit eigen bron, warmtewinning uit de molenkelder en LED-verlichting in elke duplexsuite en kamer.",
  },
  {
    icon: Recycle,
    title: "Erfgoed × Toekomst",
    body: "De waterkrachtinstallatie respecteert integraal het beschermd monument-statuut: de historische sluiswerken bleven behouden, de turbine werd onzichtbaar geïntegreerd in de bestaande molenas. Een schoolvoorbeeld van adaptief erfgoedbeheer.",
  },
];

const Duurzaamheid = () => (
  <Layout>
    <PageHero
      eyebrow="Geschiedenis"
      title="Kracht uit de Bron"
      subtitle="Waterkrachtcentrale sinds 2016 — voedt het landgoed én 15 gezinnen."
      align="center"
      size="compact"
    />
    <HistoryTabs />

    <section className="py-10 md:py-14 bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="heading-section text-primary-deep mb-3">
            Innovatieve Waterkracht
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Wat in <strong>1500</strong> graan maalde voor de Heer van Peer,
            levert vandaag <strong>groene elektriciteit</strong> aan
            Landgoed De Hoogmolen én aan vijftien naburige gezinnen in
            Ellikom (Oudsbergen). Vijf eeuwen aan dezelfde Abeek — telkens
            opnieuw uitgevonden.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FACTS.map((f) => {
            const Icon = f.icon;
            return (
              <li
                key={f.title}
                className="rounded-lg bg-secondary/20 border border-border p-6 shadow-soft"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon
                      className="w-5 h-5 text-primary"
                      strokeWidth={1.4}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-primary-deep mb-1.5">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>

    <StatusWall />
  </Layout>
);

export default Duurzaamheid;
