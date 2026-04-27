/**
 * ActiviteitenFamilie — pixel-aligned met screenshot.
 * Route: /activiteiten/familie
 *
 * Hero-titel → 3-koloms cards met gradient-headerbalk + label-bordtje + CTA.
 * Onderaan accent-bar met "Groepsverblijf 10-20p" CTA.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import logo from "@/assets/hoogmolen-logo.png";

interface FamilieCard {
  badge: string;
  title: string;
  description: string;
  to: string;
  /** Tailwind gradient-classes voor de headerbalk */
  gradient: string;
}

const CARDS: FamilieCard[] = [
  {
    badge: "Center Parcs",
    title: "Center Parcs",
    description:
      "Erperheide · subtropisch zwemparadijs Aqua Mundo, indoor en outdoor activiteiten voor het hele gezin.",
    to: "/activiteiten/familie/center-parcs-erperheide",
    gradient: "from-accent via-accent to-primary/60",
  },
  {
    badge: "Molenheide",
    title: "Park Molenheide",
    description:
      "Helchteren · subtropisch zwembad, speeltuinen, midgetgolf en natuurpaden.",
    to: "/activiteiten/familie/park-molenheide",
    gradient: "from-primary/40 via-primary/60 to-primary",
  },
  {
    badge: "Klimbos",
    title: "Tarzan & Jane",
    description:
      "Klimpark · avontuur in de bomen met touwbruggen, ziplines en parcours voor jong en oud.",
    to: "/activiteiten/familie/tarzan-en-jane",
    gradient: "from-primary via-primary-deep to-primary-deep",
  },
];

const ActiviteitenFamilie = () => (
  <Layout>
    {/* HERO */}
    <section className="bg-background border-b border-border relative">
      <div className="container-wide py-12 md:py-16">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-primary-deep mb-2">
          Familie
        </h1>
        <p className="text-sm md:text-base text-primary">Familie-uitstappen</p>
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-none select-none">
        <img
          src={logo}
          alt="Landgoed De Hoogmolen"
          className="h-10 md:h-12 lg:h-14 w-auto opacity-80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.15)]"
          loading="lazy"
        />
      </div>
    </section>

    {/* INTRO accent-bar */}
    <section className="pt-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/40 px-5 py-4">
          <p className="text-sm text-foreground/80">
            Drie kindvriendelijke parken op korte rijafstand van De Hoogmolen — perfect voor een dag uit met het hele gezin.
          </p>
        </div>
      </div>
    </section>

    {/* CARDS */}
    <section className="py-10 bg-background">
      <div className="container-wide grid md:grid-cols-3 gap-5">
        {CARDS.map((c) => (
          <article key={c.title} className="border border-border bg-card rounded-md overflow-hidden flex flex-col">
            {/* Header met gradient + badge */}
            <div className={`relative h-28 bg-gradient-to-br ${c.gradient} flex items-center justify-center`}>
              <span className="font-display italic text-secondary/95 text-base">{c.badge}</span>
            </div>
            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display text-lg text-primary-deep mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/75 mb-5 flex-1">{c.description}</p>
              <Link
                to={c.to}
                className="inline-block self-start bg-primary text-secondary hover:bg-primary-deep px-4 py-2 text-sm font-medium transition-colors"
              >
                Meer info
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* GROEPSVERBLIJF CTA-BAR */}
    <section className="pb-14 bg-background">
      <div className="container-wide">
        <div className="bg-accent/40 px-6 py-5 rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-foreground/80">
            Plan een familieweekend met overnachting op het domein.
          </p>
          <Link
            to="/groepsverblijf/10-20-personen"
            className="inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors self-start md:self-auto"
          >
            Groepsverblijf 10-20p
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiviteitenFamilie;
