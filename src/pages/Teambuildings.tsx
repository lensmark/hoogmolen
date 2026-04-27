/**
 * /teambuildings — Hub-pagina zakelijke groepen.
 * v3.5.3 — Universal Full-Card Clickability: alle 3 secties (pijlers, populaire
 * activiteiten, combineer-blok) zijn nu volledig klikbare <Link>-containers met
 * hover-lift, ArrowRight signpost en aria-labels.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { Link } from "react-router-dom";
import {
  TEAMBUILDING_PILLARS,
  POPULAR_ACTIVITIES,
} from "@/config/teambuildingConfig";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const SUB_NAV = [
  { label: "Teambuildings", to: "/teambuildings" },
  { label: "In Limburg", to: "/teambuildings/in-limburg" },
  { label: "Met overnachting", to: "/teambuildings/met-overnachting" },
  { label: "Op het domein", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
];

const COMBINE_CARDS = [
  {
    title: "Vergaderen + teambuilding",
    desc: "Sessie overdag · activiteit achteraf · overnachting",
    link: "/vergaderen",
    cta: "Bekijk vergaderformules",
  },
  {
    title: "Groepsverblijf toevoegen",
    desc: "8 tot 53 personen · flexibele modules",
    link: "/groepsverblijf",
    cta: "Naar groepsverblijf",
  },
  {
    title: "Molenhuys entertainment",
    desc: "Pooltafel · biljart · kaarttafel · honesty bar",
    link: "/overnachten/molenhuys",
    cta: "Meer info Molenhuys",
  },
];

const cardBase =
  "group surface-card overflow-hidden flex flex-col bg-card border border-border transition-all hover:-translate-y-1 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";

const Teambuildings = () => (
  <Layout transparentHeader>
    <SubNav items={SUB_NAV} />

    <PageHero
      eyebrow="Zakelijk & groepen"
      title="Teambuilding op & rond Landgoed De Hoogmolen"
      subtitle="Avontuur, beweging en verbinding in Nationaal Park Hoge Kempen · Ellikom · Oudsbergen"
      heroSlug="teambuildings-hero"
      heroExtraIds={[
        "hoogmolen-verblijf-peerdermolen",
        "hoogmolen-verblijf-watermolen",
        "hoogmolen-verblijf-suite-a1",
        "hoogmolen-verblijf-suite-a2",
        "hoogmolen-verblijf-suite-a3",
        "hoogmolen-verblijf-suite-a4",
        "hoogmolen-verblijf-suite-a5",
        "hoogmolen-verblijf-suite-a6",
      ]}
    />

    <section className="py-6 bg-accent/40">
      <div className="container-wide">
        <div className="border-l-4 border-primary-deep pl-4 py-2">
          <p className="text-sm text-primary-deep/80">
            Eén locatie voor strategie en ontspanning — van vergadersessie tot diner bij lokale partners.
          </p>
        </div>
      </div>
    </section>

    {/* 3 Pijlers — full-card click */}
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <div className="grid md:grid-cols-3 gap-6">
          {TEAMBUILDING_PILLARS.map((p) => (
            <Link
              key={p.id}
              to={p.ctaUrl}
              className={cardBase}
              aria-label={`${p.ctaLabel} — ${p.title}`}
            >
              <div
                className={cn(
                  "h-24 flex items-center justify-center text-sm font-medium tracking-wide",
                  p.variant === "soft"
                    ? "bg-gradient-to-br from-accent to-primary/40 text-primary-deep"
                    : p.variant === "light"
                    ? "bg-accent text-primary-deep"
                    : "bg-gradient-to-br from-primary to-primary-deep text-secondary",
                )}
              >
                {p.id === "in-limburg" && "🌲 In Limburg"}
                {p.id === "op-domein" && "🍃 Op het domein"}
                {p.id === "met-overnachting" && "🏨 Met overnachting"}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-xl text-primary-deep mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{p.description}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
                  {p.ctaLabel}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* Populaire activiteiten — full-card click */}
    <section className="py-16 md:py-20 bg-secondary/40">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-primary-deep mb-3">
          Populaire teambuilding activiteiten
        </h2>
        <div className="border-t border-border mb-8" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_ACTIVITIES.map((a) => {
            const inner = (
              <>
                <div className="h-20 bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center text-3xl">
                  {a.icon}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display text-lg text-primary-deep mb-1">{a.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{a.description}</p>
                  <p className="text-xs text-muted-foreground mb-4">{a.meta}</p>
                  {a.url && (
                    <div className="mt-auto flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
                      Meer info
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  )}
                </div>
              </>
            );

            if (!a.url) {
              return (
                <article key={a.id} className={cn(cardBase, "cursor-default hover:translate-y-0 hover:shadow-none")}>
                  {inner}
                </article>
              );
            }

            return a.url.startsWith("http") ? (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardBase}
                aria-label={`Meer info — ${a.name}`}
              >
                {inner}
              </a>
            ) : (
              <Link
                key={a.id}
                to={a.url}
                className={cardBase}
                aria-label={`Meer info — ${a.name}`}
              >
                {inner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>

    {/* Combineer teambuilding met — full-card click */}
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-primary-deep mb-3">
          Combineer teambuilding met
        </h2>
        <div className="border-t border-border mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {COMBINE_CARDS.map((c) => (
            <Link
              key={c.title}
              to={c.link}
              className={cn(cardBase, "p-6")}
              aria-label={`${c.cta} — ${c.title}`}
            >
              <h3 className="font-display text-lg text-primary-deep mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 flex-1">{c.desc}</p>
              <div className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors">
                {c.cta}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    <AvailabilityBar
      title="Plan uw teambuilding op De Hoogmolen"
      description="Stel uw eigen programma samen — wij nemen contact op binnen 24u."
      ctaLabel="Plan uw teambuilding"
      href="/contact"
    />
  </Layout>
);

export default Teambuildings;
