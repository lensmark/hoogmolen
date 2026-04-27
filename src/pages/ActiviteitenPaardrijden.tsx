/**
 * ActiviteitenPaardrijden — pixel-aligned met screenshot.
 * Route: /activiteiten/paardrijden
 *
 * Hero (gradient) → Ruiter- en menroutes 2-koloms cards → Paardenlogies highlight box
 * → Bekijk paardenlogies CTA → Combineer paardrijden met (4 buttons).
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import logo from "@/assets/hoogmolen-logo.png";

interface RouteCard {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  /** interne detailpagina */
  to: string;
}

const ROUTES: RouteCard[] = [
  {
    icon: "🐴",
    title: "Ruiterroutes Hoge Kempen",
    subtitle: "Diverse afstanden",
    description:
      "Ruiterroutes door Nationaal Park Hoge Kempen. Combinatie van heide, bos en waterrijke gebieden.",
    to: "/activiteiten/paardrijden/ruiterroutes-hoge-kempen",
  },
  {
    icon: "🐎",
    title: "Menroutes Oudsbergen",
    subtitle: "Karrenroutes",
    description:
      "Menroutes door de rustige landwegen en bosgebieden van Oudsbergen en omgeving.",
    to: "/activiteiten/paardrijden/menroutes-oudsbergen",
  },
];

interface CombineerLink {
  label: string;
  url: string;
  to: string;
}

const COMBINEER: CombineerLink[] = [
  { label: "Paardenlogies", url: "hoogmolen.be/paardenlogies/", to: "/paardenlogies" },
  { label: "Overnachten", url: "hoogmolen.be/overnachten/", to: "/overnachten" },
  { label: "Wandelen", url: "hoogmolen.be/activiteiten/wandelen/", to: "/activiteiten/wandelen" },
  { label: "Fietsen", url: "hoogmolen.be/activiteiten/fietsen/", to: "/activiteiten/fietsen" },
];

const FilledBtn = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link
    to={to}
    className="inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors"
  >
    {children}
  </Link>
);

const ActiviteitenPaardrijden = () => (
  <Layout>
    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-20 md:py-24">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Paardrijden in de omgeving van De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Ruiter- en menroutes · Nationaal Park Hoge Kempen · Ellikom · Oudsbergen
        </p>
      </div>
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 pointer-events-none select-none">
        <img
          src={logo}
          alt="Landgoed De Hoogmolen"
          className="h-10 md:h-14 lg:h-16 w-auto opacity-90 brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
          loading="lazy"
        />
      </div>
    </section>

    {/* RUITER- EN MENROUTES */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Ruiter- en menroutes</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-5">
          {ROUTES.map((r) => (
            <article key={r.title} className="border border-border bg-card p-5 flex gap-4 rounded-md">
              <div className="shrink-0 w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-2xl" aria-hidden>
                {r.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg text-primary-deep leading-snug">{r.title}</h3>
                <div className="text-sm text-muted-foreground mb-2">{r.subtitle}</div>
                <p className="text-sm text-foreground/80 mb-3">{r.description}</p>
                <Link
                  to={r.to}
                  className="text-sm text-primary hover:text-primary-deep underline underline-offset-4"
                >
                  Bekijk route →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* PAARDENLOGIES OP HET DOMEIN */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Paardenlogies op het domein</h2>
        <div className="border-t border-border pt-5">
          <div className="bg-accent/40 px-6 py-5 rounded-md mb-5">
            <h3 className="font-display text-lg text-primary-deep mb-2">
              Verblijf voor ruiter en paard op De Hoogmolen
            </h3>
            <p className="text-sm text-foreground/80">
              De Hoogmolen biedt uniek paardenlogies — stalling voor uw paard terwijl u verblijft in de duplexsuites of kamers op het 5-sterren domein. Uniek in de regio.
            </p>
          </div>
          <div className="space-y-1.5">
            <Link
              to="/paardenlogies"
              className="inline-block bg-primary-deep text-secondary hover:bg-primary px-5 py-2.5 text-sm font-medium transition-colors"
            >
              Bekijk paardenlogies
            </Link>
            <div className="text-xs text-muted-foreground">hoogmolen.be/paardenlogies/</div>
          </div>
        </div>
      </div>
    </section>

    {/* COMBINEER PAARDRIJDEN MET */}
    <section className="pb-14 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer paardrijden met</h2>
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

export default ActiviteitenPaardrijden;
