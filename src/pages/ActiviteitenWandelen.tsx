/**
 * ActiviteitenWandelen — pixel-aligned met screenshot.
 * Route: /activiteiten/wandelen
 *
 * Layout: hero (groene gradient) → outline-link rechts (Alle wandelroutes Limburg)
 * → 2-koloms route-cards met cirkel-icoon → Gidsen & externe links → Combineer wandelen met.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowUpRight } from "lucide-react";

interface RouteCard {
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  description: string;
  /** interne detailpagina */
  to: string;
}

const ROUTES: RouteCard[] = [
  {
    icon: "🌞",
    iconBg: "bg-secondary",
    title: "Abeekvallei",
    subtitle: "180 ha — meerdere varianten",
    description:
      "Broekbossen, vijvers en hooilanden. Gele dotterbloemen en witte klaverzuring. Iglo van groeiend wilgenvlechtwerk als rustplaats.",
    to: "/activiteiten/wandelen/abeekvallei",
  },
  {
    icon: "🌲",
    iconBg: "bg-secondary",
    title: "Resterheide",
    subtitle: "Heide en vennen",
    description:
      "Uitgestrekte heidegebieden en vennen in Nationaal Park Hoge Kempen. Typische Kempense natuur met zeldzame flora.",
    to: "/activiteiten/wandelen/resterheide",
  },
  {
    icon: "⛱️",
    iconBg: "bg-secondary",
    title: "Duinengordel",
    subtitle: "Zandduinen — uniek in België",
    description:
      "Unieke binnenlandse zandduinen. Zeldzame flora en fauna typisch voor stuifzandgebieden.",
    to: "/activiteiten/wandelen/duinengordel",
  },
  {
    icon: "💧",
    iconBg: "bg-secondary",
    title: "Wandel op water",
    subtitle: "Waterroute",
    description:
      "Wandelroute langs waterlopen, vijvers en natte gebieden in de Abeekvallei en omgeving.",
    to: "/activiteiten/wandelen/wandel-op-water",
  },
  {
    icon: "⬛",
    iconBg: "bg-secondary",
    title: "Abeekvallei Zwart",
    subtitle: "Uitdagende lange route",
    description:
      "Langere versie langs de Abeek, ideaal voor ervaren wandelaars.",
    to: "/activiteiten/wandelen/abeekvallei-zwart",
  },
  {
    icon: "🔵",
    iconBg: "bg-secondary",
    title: "Abeekvallei Blauw",
    subtitle: "Middellange route",
    description:
      "Middelste variant van de Abeekvallei-routes. Afwisselend landschap.",
    to: "/activiteiten/wandelen/abeekvallei-blauw",
  },
  {
    icon: "🟡",
    iconBg: "bg-secondary",
    title: "Gele lus — Itterbeekvallei",
    subtitle: "7,2 km · 10 min",
    description:
      "Sereen wandelpad langs de meanderende Itterbeek door bossen en historische molenrestanten.",
    to: "/activiteiten/wandelen/gele-lus-itterbeek",
  },
];

interface ActionLink {
  label: string;
  url: string;
  to?: string;
  href?: string;
  external?: boolean;
}

const COMBINEER: ActionLink[] = [
  { label: "Overnachten op het domein", url: "hoogmolen.be/overnachten/", to: "/overnachten" },
  { label: "Paardenlogies", url: "hoogmolen.be/paardenlogies/", to: "/paardenlogies" },
  { label: "Fietsen in de omgeving", url: "hoogmolen.be/activiteiten/fietsen/", to: "/activiteiten/fietsen" },
  {
    label: "Teambuilding met wandeling",
    url: "hoogmolen.be/teambuildings/activiteiten-op-en-rond-het-domein/",
    to: "/teambuildings/activiteiten-op-en-rond-het-domein",
  },
];

const FilledBtn = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const OutlineBtn = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1.5 border border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary px-5 py-2.5 text-sm font-medium transition-colors"
  >
    {children} <ArrowUpRight className="w-3.5 h-3.5" />
  </a>
);

const ActiviteitenWandelen = () => (
  <Layout>
    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-20 md:py-24">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Wandelroutes in de omgeving van De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Abeekvallei · 180ha natuurgebied · broekbossen · vijvers · hooilanden
        </p>
      </div>
    </section>

    {/* Outline-link rechts */}
    <section className="py-8 bg-background">
      <div className="container-wide flex justify-end">
        <div className="text-right space-y-1.5">
          <OutlineBtn href="https://www.wandeleninlimburg.be">Alle wandelroutes Limburg</OutlineBtn>
          <div className="text-xs text-muted-foreground">wandeleninlimburg.be</div>
        </div>
      </div>
    </section>

    {/* WANDELROUTES GRID */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Wandelroutes in de omgeving</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-5">
          {ROUTES.map((r) => (
            <Link
              key={r.title}
              to={r.to}
              className="group border border-border bg-card p-5 flex gap-4 rounded-md transition-all duration-300 hover:shadow-card hover:-translate-y-1 hover:border-primary"
            >
              <div className={`shrink-0 w-12 h-12 rounded-full ${r.iconBg} border border-border flex items-center justify-center text-2xl`} aria-hidden>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-primary-deep leading-snug">{r.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{r.subtitle}</div>
                <p className="text-sm text-foreground/80 mb-3">{r.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary group-hover:text-primary-deep group-hover:gap-2 transition-all">
                  Bekijk route <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* GIDSEN & EXTERNE LINKS */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Gidsen &amp; externe links</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-1.5">
            <FilledBtn to="/praktisch/download-gidsen">Download wandelgids</FilledBtn>
            <div className="text-xs text-muted-foreground">hoogmolen.be/praktisch/download-gidsen/</div>
          </div>
          <div className="space-y-1.5">
            <OutlineBtn href="https://www.wandeleninlimburg.be/nl/wandelroutes/">wandeleninlimburg.be</OutlineBtn>
            <div className="text-xs text-muted-foreground">wandeleninlimburg.be/nl/wandelroutes/</div>
          </div>
        </div>
      </div>
    </section>

    {/* COMBINEER WANDELEN MET */}
    <section className="pb-14 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer wandelen met</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          {COMBINEER.map((c) => (
            <div key={c.label} className="space-y-1.5">
              <FilledBtn to={c.to!}>{c.label}</FilledBtn>
              <div className="text-xs text-muted-foreground">{c.url}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiviteitenWandelen;
