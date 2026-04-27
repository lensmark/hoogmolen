/**
 * StatusWall — gedeelde 5-punt grid met thin Lucide-iconen in --primary.
 * Gebruikt op alle Geschiedenis-sub-pagina's.
 */
import { Shield, Castle, Bird, Flower2, Waves } from "lucide-react";

const ITEMS = [
  {
    icon: Shield,
    title: "Beschermd Monument",
    body: "Statutaire bescherming van molen + sluiswerk sinds 5 december 1995.",
  },
  {
    icon: Castle,
    title: "Beschermd Dorpsgezicht",
    body: "Historische harmonie van het volledige molenerf — uitgebreid in 2005.",
  },
  {
    icon: Bird,
    title: "Europees Vogelrichtlijngebied",
    body: "Officieel aangewezen vogelhabitat in de Abeekvallei.",
  },
  {
    icon: Flower2,
    title: "Natura 2000",
    body: "Onderdeel van het prestigieuze Europese ecologische netwerk.",
  },
  {
    icon: Waves,
    title: "Actief Bevergebied",
    body: "Bewezen beverhabitat — symbool voor de zuiverheid van onze waterloop.",
  },
];

export const StatusWall = () => (
  <section className="py-20 md:py-24 bg-secondary/40 border-t border-border">
    <div className="container-wide">
      <div className="text-center mb-12">
        <div className="eyebrow text-primary-deep/70 mb-3">Erkenningen</div>
        <h2 className="heading-section text-primary-deep">
          Onze Natuurlijke &amp; Historische Erfenis
        </h2>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {ITEMS.map((s) => {
          const Icon = s.icon;
          return (
            <li
              key={s.title}
              className="rounded-lg bg-card border border-border p-5 shadow-soft text-center"
            >
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon
                  className="w-6 h-6 text-primary"
                  strokeWidth={1.4}
                  aria-hidden
                />
              </div>
              <h3 className="font-serif text-base text-primary-deep mb-1.5">
                {s.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {s.body}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  </section>
);
