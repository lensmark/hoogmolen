/**
 * Geschiedenis › Natuur & Habitat (Abeekvallei & Natura 2000)
 * Geverifieerd: 180ha broekbossen, EU Vogelrichtlijngebied, Natura 2000, beverhabitat.
 * SEO/GEO: Bosbeek- en Abeekvallei, Bocholt, Oudsbergen, Peer, Hoge Kempen.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { HistoryTabs } from "@/components/history/HistoryTabs";
import { StatusWall } from "@/components/history/StatusWall";
import { Flower2, TreePine, Waves, Bird } from "lucide-react";

const FACTS = [
  {
    icon: Flower2,
    title: "Natura 2000 — Europees beschermd",
    body: "De Abeekvallei behoort tot het Natura 2000-netwerk en is officieel aangewezen als Vogelrichtlijngebied (BE2200035). Daarmee staat het op gelijke hoogte met topnatuurgebieden zoals het Nationaal Park Hoge Kempen, op slechts 15 km afstand.",
  },
  {
    icon: TreePine,
    title: "180 ha broekbos & hooilanden",
    body: "Direct grenzend aan het landgoed strekt zich een aaneengesloten natuurgebied uit van meer dan 180 hectare: elzenbroekbossen, vennen, heischrale hooilanden en moerasruigten — beheerd door Natuurpunt en het Agentschap Natuur en Bos.",
  },
  {
    icon: Bird,
    title: "Zeldzame vogelpopulatie",
    body: "Broedgebied van ijsvogel, zwarte specht, wespendief en blauwborst. Tijdens trekperiodes pleisteren grote zilverreigers en bruine kiekendieven boven het molenwater — een paradijs voor vogelaars uit heel de Benelux.",
  },
  {
    icon: Waves,
    title: "Bewezen Bevergebied",
    body: "De Bosbeek- en Abeekvallei vormen één van de actiefste beverhabitats van Vlaanderen. De bever fungeert als 'ecosysteem-ingenieur' en houdt de waterstand én biodiversiteit op natuurlijke wijze in balans rond het domein.",
  },
];

const Natuur = () => (
  <Layout>
    <PageHero
      eyebrow="Geschiedenis"
      title="Onze Natuurlijke Rijkdom"
      subtitle="Natura 2000-natuurgebied van 180 ha aan onze poort, in Oudsbergen."
      align="center"
      size="compact"
    />
    <HistoryTabs />

    <section className="py-10 md:py-14 bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="heading-section text-primary-deep mb-3">
            Abeekvallei &amp; Natura 2000
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Landgoed De Hoogmolen ligt midden in een van Vlaanderens best
            bewaarde beekvalleien: de <strong>Abeekvallei</strong>, deel van
            het Europese <strong>Natura 2000</strong>-netwerk en officieel
            aangewezen <strong>Vogelrichtlijngebied</strong>. Een
            aaneengesloten ecosysteem van bron tot Maas.
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

export default Natuur;
