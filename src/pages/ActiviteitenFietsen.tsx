/**
 * ActiviteitenFietsen — pixel-aligned met image-51.
 * Route: /activiteiten/fietsen
 *
 * Layout (top → bottom):
 *  1. Groene gradient hero (titel + meta-divider)
 *  2. Accent-bar "Knooppunt 01 aan de deur" (border-l primary, accent/30 bg)
 *  3. "Fietsroutes in de omgeving" — 2-koloms cards met cirkel-icoon, titel,
 *     ondertitel, beschrijving en groene url-link onderaan.
 *  4. "Gidsen & externe links" — outline + filled buttons, 2 koloms, met
 *     domein-onderschrift.
 *  5. "Combineer fietsen met" — 4 filled buttons in 2 koloms met url-onderschrift.
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
  linkLabel: string;
  /** interne detailpagina route */
  to: string;
}

const ROUTES: RouteCard[] = [
  {
    icon: "🏺",
    iconBg: "bg-secondary",
    title: "10 historische watermolens",
    subtitle: "44,5 km",
    description:
      "Langs kletterende watermolens in de valleien van de Abeek, Bosbeek en Itterbeek. Bossen, vennen en zandduinen. Pauzeer voor lunch of bierdegustatie bij lokale horeca.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/10-historische-watermolens",
  },
  {
    icon: "🌳",
    iconBg: "bg-secondary",
    title: "Fietsen door de Bomen",
    subtitle: "Pijnven · Bosland",
    description:
      "Spiraalvormig pad van 700 m dat opstijgt tot 10 m hoogte tussen de dennenkruinen. Een wereldberoemde architecturale fietservaring.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/fietsen-door-de-bomen",
  },
  {
    icon: "💧",
    iconBg: "bg-secondary",
    title: "Fietsen door het Water",
    subtitle: "Bokrijk · 212 m",
    description:
      "Fiets letterlijk dóór het water — het wateroppervlak ligt op ooghoogte aan beide zijden van het pad in De Wijers.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/fietsen-door-het-water",
  },
  {
    icon: "🎨",
    iconBg: "bg-secondary",
    title: "Bruegelfietsroute",
    subtitle: "Panoramaroute Haspengouw",
    description:
      "Fiets door het Haspengouwse landschap dat Bruegel inspireerde. Fruitboomgaarden en glooiende heuvels.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/bruegelfietsroute",
  },
  {
    icon: "🔢",
    iconBg: "bg-secondary",
    title: "Knooppunt 01",
    subtitle: "Startpunt aan de deur",
    description:
      "Knooppunt 01 ligt direct aan De Hoogmolen — stel uw eigen route samen via het Limburgse netwerk of fiets de Ronde van Oudsbergen.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/knooppunt-01",
  },
  {
    icon: "⛵",
    iconBg: "bg-secondary",
    title: "Duinengordel fietsroute",
    subtitle: "Zandduinen",
    description:
      "Fiets door unieke binnenlandse zandduinen. Bijzondere natuur en rustige paden.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/duinengordel",
  },
  {
    icon: "🚜",
    iconBg: "bg-secondary",
    title: "Hoeveweelde",
    subtitle: "Culinaire fietsroute",
    description:
      "Fiets langs hoeven, streekproducten en lokale producenten. Combineer fietsen met de smaken van de streek.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/hoeveweelde",
  },
  {
    icon: "🔁",
    iconBg: "bg-secondary",
    title: "Ronde van Oudsbergen",
    subtitle: "35 km",
    description:
      "De klassieker: volledige ronde door de mooiste plekjes van Oudsbergen. Start en finish aan De Hoogmolen.",
    linkLabel: "Bekijk route",
    to: "/activiteiten/fietsen/ronde-van-oudsbergen",
  },
];

interface ActionLink {
  label: string;
  url: string;
  to?: string;
  href?: string;
  external?: boolean;
}

const GIDSEN: ActionLink[] = [
  {
    label: "Download fietsgids",
    url: "hoogmolen.be/praktisch/download-gidsen/",
    to: "/praktisch/download-gidsen",
  },
  {
    label: "Knooppunt 01 info",
    url: "hoogmolen.be/over-ons/knooppunt-01/",
    to: "/over-ons",
  },
];

const EXTERN: ActionLink[] = [
  {
    label: "Fietsnetwerk Limburg",
    url: "fietsnetwerk.be",
    href: "https://www.fietsnetwerk.be",
    external: true,
  },
  {
    label: "Oudsbergen fietsroutes",
    url: "oudsbergen.be/watermolens",
    href: "https://www.oudsbergen.be/watermolens",
    external: true,
  },
];

const COMBINEER: ActionLink[] = [
  { label: "Overnachten op het domein", url: "hoogmolen.be/overnachten/", to: "/overnachten" },
  { label: "Paardenlogies", url: "hoogmolen.be/paardenlogies/", to: "/paardenlogies" },
  { label: "Wandelen in de omgeving", url: "hoogmolen.be/activiteiten/wandelen/", to: "/activiteiten/wandelen" },
  {
    label: "Teambuilding fietstocht",
    url: "hoogmolen.be/teambuildings/activiteiten-op-en-rond-het-domein/",
    to: "/teambuildings/activiteiten-op-en-rond-het-domein",
  },
];

const FilledBtn = ({ to, href, external, children }: { to?: string; href?: string; external?: boolean; children: React.ReactNode }) => {
  const cls = "inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors";
  if (href) return <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={cls}>{children}</a>;
  return <Link to={to!} className={cls}>{children}</Link>;
};

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

const ActiviteitenFietsen = () => (
  <Layout>
    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-20 md:py-24">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Fietsroutes in de omgeving van De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Knooppunt 01 aan de deur · watermolens · Abeek · Bosbeek · Itterbeek
        </p>
      </div>
    </section>

    {/* ACCENT-BAR */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/40 px-5 py-4">
          <h2 className="font-display text-lg text-primary-deep mb-1">Knooppunt 01 aan de deur</h2>
          <p className="text-sm text-foreground/80">
            De Hoogmolen ligt direct aan knooppunt 01 van het Limburgse fietsnetwerk. Ideaal vertrekpunt voor alle routes in de regio.
          </p>
        </div>
      </div>
    </section>

    {/* FIETSROUTES GRID */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Fietsroutes in de omgeving</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-5">
          {ROUTES.map((r) => (
            <article key={r.title} className="border border-border bg-card p-5 flex gap-4 rounded-md">
              <div className={`shrink-0 w-12 h-12 rounded-full ${r.iconBg} border border-border flex items-center justify-center text-2xl`} aria-hidden>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-primary-deep leading-snug">{r.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{r.subtitle}</div>
                <p className="text-sm text-foreground/80 mb-3">{r.description}</p>
                <Link
                  to={r.to}
                  className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-deep underline underline-offset-4"
                >
                  {r.linkLabel} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
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
            <FilledBtn to={GIDSEN[0].to}>{GIDSEN[0].label}</FilledBtn>
            <div className="text-xs text-muted-foreground">{GIDSEN[0].url}</div>
          </div>
          <div className="space-y-1.5">
            <OutlineBtn href={EXTERN[0].href!}>{EXTERN[0].label}</OutlineBtn>
            <div className="text-xs text-muted-foreground">{EXTERN[0].url}</div>
          </div>
          <div className="space-y-1.5">
            <FilledBtn to={GIDSEN[1].to}>{GIDSEN[1].label}</FilledBtn>
            <div className="text-xs text-muted-foreground">{GIDSEN[1].url}</div>
          </div>
          <div className="space-y-1.5">
            <OutlineBtn href={EXTERN[1].href!}>{EXTERN[1].label}</OutlineBtn>
            <div className="text-xs text-muted-foreground">{EXTERN[1].url}</div>
          </div>
        </div>
      </div>
    </section>

    {/* COMBINEER FIETSEN MET */}
    <section className="pb-14 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer fietsen met</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          {COMBINEER.map((c) => (
            <div key={c.label} className="space-y-1.5">
              <FilledBtn to={c.to}>{c.label}</FilledBtn>
              <div className="text-xs text-muted-foreground">{c.url}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default ActiviteitenFietsen;
