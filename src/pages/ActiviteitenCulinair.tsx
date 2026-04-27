/**
 * ActiviteitenCulinair — pixel-aligned met screenshot.
 * Route: /activiteiten/culinair
 *
 * Hero (gradient) → 3 culinaire cards (gradient-header + body) → 2 lokale restaurants
 * → 3 "Combineer culinair met" cards → onderste CTA-bar.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

interface GradientCard {
  badge: string;
  title: string;
  meta: string;
  description: string;
  gradient: string;
  cta?: { label: string; to: string; variant?: "filled" | "outline" };
}

const CULINAIR_OP_DOMEIN: GradientCard[] = [
  {
    badge: "Ontbijt",
    title: "Ontbijtmand",
    meta: "Vers · lokale lekkernijen · inbegrepen bij 24u en 48u vergaderarrangement",
    description:
      "Verse broodjes, koffie, thee, sap en lokale lekkernijen — direct aan de deur geleverd.",
    gradient: "from-accent via-accent to-primary/50",
  },
  {
    badge: "Catering",
    title: "Catering op maat",
    meta: "Broodjeslunch · lunchbuffet · groepsdiner",
    description:
      "Volledig verzorgde catering voor meetings, teambuildings en groepsverblijven.",
    gradient: "from-accent via-primary/40 to-primary/60",
  },
  {
    badge: "Diner",
    title: "Diner bij lokale partners",
    meta: "Restaurant De Dorpermolen · Restaurant 't Pleintje",
    description:
      "Reserveer een tafel bij onze vaste partner-restaurants op enkele minuten van het domein.",
    gradient: "from-primary/60 via-primary to-primary-deep",
  },
];

interface RestaurantCard {
  title: string;
  meta1: string;
  meta2: string;
  meta3: string;
}

const RESTAURANTS: RestaurantCard[] = [
  {
    title: "Restaurant De Dorpermolen",
    meta1: "Op enkele minuten van het domein",
    meta2: "Partner voor diner bij vergaderarrangementen",
    meta3: "Lokale Limburgse keuken",
  },
  {
    title: "Restaurant 't Pleintje",
    meta1: "Op enkele minuten van het domein",
    meta2: "Partner voor diner bij vergaderarrangementen",
    meta3: "Sfeervolle brasserie",
  },
];

const COMBINEER: GradientCard[] = [
  {
    badge: "Vergaderen",
    title: "Vergaderen",
    meta: "Brainfood concept · ontbijtmand inbegrepen",
    description: "",
    gradient: "from-primary/60 via-primary to-primary-deep",
    cta: { label: "Bekijk formules", to: "/vergaderen", variant: "filled" },
  },
  {
    badge: "Groepen",
    title: "Groepsverblijf",
    meta: "Catering voor 10 tot 53 personen",
    description: "",
    gradient: "from-accent via-accent to-primary/40",
    cta: { label: "Bekijk verblijven", to: "/groepsverblijf", variant: "filled" },
  },
  {
    badge: "Teams",
    title: "Teambuilding",
    meta: "Diner bij lokale partners",
    description: "",
    gradient: "from-primary via-primary-deep to-primary-deep",
    cta: { label: "Meer info", to: "/teambuildings", variant: "outline" },
  },
];

const GradientCardComp = ({ c }: { c: GradientCard }) => (
  <article className="border border-border bg-card rounded-md overflow-hidden flex flex-col">
    <div className={`relative h-24 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
      <span className="font-display italic text-secondary/95 text-base">{c.badge}</span>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="font-display text-lg text-primary-deep mb-1">{c.title}</h3>
      <p className="text-xs text-muted-foreground mb-3">{c.meta}</p>
      {c.description && <p className="text-sm text-foreground/75 mb-4 flex-1">{c.description}</p>}
      {c.cta && (
        <Link
          to={c.cta.to}
          className={
            c.cta.variant === "outline"
              ? "inline-block self-start border border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary px-4 py-2 text-sm font-medium transition-colors mt-auto"
              : "inline-block self-start bg-primary-deep text-secondary hover:bg-primary px-4 py-2 text-sm font-medium transition-colors mt-auto"
          }
        >
          {c.cta.label}
        </Link>
      )}
    </div>
  </article>
);

const ActiviteitenCulinair = () => (
  <Layout>
    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-20 md:py-24">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Culinaire belevenissen bij De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Van ontbijtmand tot diner — lokale smaken in het hart van Limburg
        </p>
      </div>
    </section>

    {/* INTRO accent-bar */}
    <section className="pt-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/40 px-5 py-4">
          <p className="text-sm text-foreground/80">
            Brainfood-concept voor vergaderingen, ontbijtmand bij overnachtingen en samenwerking met lokale restaurants voor diner.
          </p>
        </div>
      </div>
    </section>

    {/* CULINAIR OP HET DOMEIN */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Culinair op het domein</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-3 gap-5">
          {CULINAIR_OP_DOMEIN.map((c) => (
            <GradientCardComp key={c.title} c={c} />
          ))}
        </div>
      </div>
    </section>

    {/* LOKALE RESTAURANTS */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Lokale restaurants</h2>
        <div className="border-t border-border pt-5">
          <div className="bg-accent/40 rounded-md p-6 grid md:grid-cols-2 gap-x-10 gap-y-5">
            {RESTAURANTS.map((r) => (
              <div key={r.title}>
                <h3 className="font-display text-base text-primary-deep mb-1">{r.title}</h3>
                <p className="text-sm text-foreground/75">{r.meta1}</p>
                <p className="text-sm text-foreground/75">{r.meta2}</p>
                <p className="text-sm text-primary">{r.meta3}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* COMBINEER CULINAIR MET */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer culinair met</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-3 gap-5">
          {COMBINEER.map((c) => (
            <GradientCardComp key={c.title} c={c} />
          ))}
        </div>
      </div>
    </section>

    {/* CTA-BAR */}
    <section className="pb-14 bg-background">
      <div className="container-wide">
        <div className="bg-primary-deep text-secondary px-6 py-5 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-secondary/85">
            Vraag een culinair voorstel op maat aan voor uw verblijf, vergadering of groepsweekend.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-secondary text-primary-deep hover:bg-accent px-5 py-2.5 text-sm font-medium transition-colors self-start md:self-auto"
          >
            Meer info aanvragen
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiviteitenCulinair;
