/**
 * Geschiedenis › Erfgoed (Monument & Dorpsgezicht)
 * Geverifieerd: bescherming 5 dec 1995, uitbreiding 2005, muurankers 1828.
 * SEO/GEO: Oudsbergen, Ellikom, Limburg, Vlaams Agentschap Onroerend Erfgoed.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { HistoryTabs } from "@/components/history/HistoryTabs";
import { StatusWall } from "@/components/history/StatusWall";
import { Shield, ScrollText, Building2, MapPin } from "lucide-react";

const FACTS = [
  {
    icon: Shield,
    title: "Statutaire bescherming (1995)",
    body: "Bij Ministerieel Besluit van 5 december 1995 erkende het Vlaams Agentschap Onroerend Erfgoed de watermolen op de Abeek met bijbehorend sluiswerk en de onmiddellijke omgeving als beschermd monument én dorpsgezicht. Een uitzonderlijke dubbele kwalificatie binnen Limburg.",
  },
  {
    icon: Building2,
    title: "Architecturale evolutie (1828)",
    body: "De smeedijzeren muurankers met het jaartal 1828 markeren de overgang van een houten naar de huidige bakstenen molenconstructie. Typerend voor de 19de-eeuwse industriële heropleving van het Limburgse Maasland.",
  },
  {
    icon: ScrollText,
    title: "Uitbreiding ensemble (2005)",
    body: "In 2005 werd de bescherming uitgebreid naar het volledige molenensemble: de molenhoeve, het bijhorende erf en de waterloopinfrastructuur. Daarmee behoort Landgoed De Hoogmolen tot de meest integraal beschermde watermolensites van Vlaanderen.",
  },
  {
    icon: MapPin,
    title: "Geografische context",
    body: "Gelegen in Ellikom, deelgemeente van Oudsbergen (Provincie Limburg, België), aan de oever van de Abeek — een van de zes erkende beekvalleien die het noordoosten van Limburg ecologisch met de Maas verbinden.",
  },
];

const Erfgoed = () => (
  <Layout>
    <PageHero
      eyebrow="Geschiedenis"
      title="Een Monumentale Erfenis"
      subtitle="Beschermd monument én dorpsgezicht in Oudsbergen, sinds 1995."
      align="center"
      size="compact"
    />
    <HistoryTabs />

    <section className="py-10 md:py-14 bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="heading-section text-primary-deep mb-3">
            Beschermd Monument &amp; Dorpsgezicht
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            De Hoogmolen in Ellikom (Oudsbergen) is een van de weinige
            Limburgse watermolens die zowel als <strong>monument</strong> als
            als <strong>dorpsgezicht</strong> beschermd zijn. Een dubbele
            erkenning die de architecturale én landschappelijke waarde van het
            volledige molenerf verankert in het Vlaamse erfgoedregister.
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

export default Erfgoed;
