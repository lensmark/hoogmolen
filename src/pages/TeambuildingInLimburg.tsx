/**
 * /teambuildings/in-limburg — Externe activiteiten op maat.
 * Layout uit wireframe image-12: 3 categorieën met 2-koloms kaart-grids.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { Button } from "@/components/ui/button";
import { POPULAR_ACTIVITIES } from "@/config/teambuildingConfig";

const SUB_NAV = [
  { label: "Teambuildings", to: "/teambuildings" },
  { label: "In Limburg", to: "/teambuildings/in-limburg" },
  { label: "Met overnachting", to: "/teambuildings/met-overnachting" },
  { label: "Op het domein", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
];

const CATEGORIES = [
  { key: "avontuur-sport", title: "Avontuur & sport" },
  { key: "familie-groepen", title: "Familie & groepen" },
  { key: "natuur-beleving", title: "Natuur & beleving" },
] as const;

const TeambuildingInLimburg = () => (
  <Layout transparentHeader>
    <SubNav items={SUB_NAV} />

    <PageHero
      eyebrow="Externe activiteiten op maat"
      title="Teambuilding activiteiten in Limburg"
      subtitle="De beste teambuilding-locaties op maat van uw groep · vanaf De Hoogmolen"
    />

    <section className="py-6 bg-accent/40">
      <div className="container-wide">
        <div className="border-l-4 border-primary-deep pl-4 py-2">
          <p className="text-sm text-primary-deep/80">
            Wij regelen de boekingen en het transport — u geniet van een zorgeloos programma.
          </p>
        </div>
      </div>
    </section>

    {CATEGORIES.map((cat, idx) => {
      const items = POPULAR_ACTIVITIES.filter((a) => a.category === cat.key);
      return (
        <section
          key={cat.key}
          className={`py-12 md:py-16 ${idx % 2 === 1 ? "bg-secondary/40" : ""}`}
        >
          <div className="container-wide">
            <h2 className="font-display text-2xl text-primary-deep mb-3">{cat.title}</h2>
            <div className="border-t border-border mb-8" />
            <div className="grid md:grid-cols-2 gap-6">
              {items.map((a) => (
                <article key={a.id} className="surface-card overflow-hidden bg-card flex flex-col">
                  <div className="h-24 bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center text-4xl">
                    {a.icon}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-lg text-primary-deep mb-1">{a.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                    <p className="text-xs text-muted-foreground mb-4">{a.meta}</p>
                    {a.url && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-primary hover:bg-primary-deep text-secondary self-start mt-auto"
                      >
                        {a.url.startsWith("http") ? (
                          <a href={a.url} target="_blank" rel="noopener noreferrer">Meer info</a>
                        ) : (
                          <a href={a.url}>Meer info</a>
                        )}
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    })}

    <section className="py-10">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 rounded-md p-5">
          <p className="text-sm text-primary-deep">
            Alle activiteiten zijn combineerbaar met verblijf en vergaderen op het domein. Prijs op aanvraag.
          </p>
        </div>
      </div>
    </section>

    <AvailabilityBar
      title="Stel uw programma samen"
      description="Wij nemen de regie — activiteiten, transport, catering en verblijf."
      ctaLabel="Stel uw programma samen"
      href="/contact"
    />
  </Layout>
);

export default TeambuildingInLimburg;
