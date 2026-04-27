/**
 * Activiteiten — SEO-hub pagina (image-48).
 * Route: /activiteiten
 *
 * Volgorde EXACT zoals screenshot:
 *   SubNav (Wandelen / Fietsen / Paardrijden / In de omgeving) →
 *   Groene hero (Activiteiten & omgeving rond De Hoogmolen) →
 *   Intro-bar (accent) →
 *   2x2 grid met 4 categorie-cards (Wandelen / Fietsen / Paardrijden / In de omgeving) →
 *   Gidsen downloaden (2 CTA's) →
 *   Combineer met verblijf (4 CTA's met url-onderschrift)
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumbs } from "@/components/Breadcrumbs";

interface CategoryCard {
  eyebrow: string;
  title: string;
  meta: string;
  cta: string;
  to: string;
  url: string;
  /** "soft" = accent gradient, "deep" = primary→primary-deep gradient */
  tone: "soft" | "mid" | "deep" | "softer";
}

const CATEGORIES: CategoryCard[] = [
  {
    eyebrow: "Wandelen",
    title: "Wandelen",
    meta: "Abeekvalei · eigen routes · Resterheide · 180ha natuur",
    cta: "Bekijk wandelroutes",
    to: "/activiteiten/wandelen",
    url: "hoogmolen.be/activiteiten/wandelen/",
    tone: "mid",
  },
  {
    eyebrow: "Fietsen",
    title: "Fietsen",
    meta: "Knooppunt 01 aan de deur · 10 watermolens · Bruegelroute",
    cta: "Bekijk fietsroutes",
    to: "/activiteiten/fietsen",
    url: "hoogmolen.be/activiteiten/fietsen/",
    tone: "mid",
  },
  {
    eyebrow: "Paardrijden",
    title: "Paardrijden",
    meta: "Ruiter- en menroutes · Hoge Kempen · paardenlogies",
    cta: "Bekijk ruiterroutes",
    to: "/activiteiten/paardrijden",
    url: "hoogmolen.be/activiteiten/paardrijden/",
    tone: "deep",
  },
  {
    eyebrow: "In de omgeving",
    title: "In de omgeving",
    meta: "Terhills · Snow Valley · Center Parcs · Blauwe Bessen",
    cta: "Bekijk omgeving",
    to: "/activiteiten/in-de-omgeving",
    url: "hoogmolen.be/activiteiten/in-de-omgeving/",
    tone: "softer",
  },
];

const GIDSEN = [
  {
    label: "Download wandelgids",
    url: "hoogmolen.be/praktisch/download-gidsen/",
    to: "/praktisch/download-gidsen",
  },
  {
    label: "Download fietsgids",
    url: "hoogmolen.be/praktisch/download-gidsen/",
    to: "/praktisch/download-gidsen",
  },
];

const COMBINEER = [
  { label: "Overnachten op het domein", url: "hoogmolen.be/overnachten/", to: "/overnachten" },
  { label: "Groepsverblijf aanvragen", url: "hoogmolen.be/groepsverblijf/", to: "/groepsverblijf" },
  { label: "Teambuilding plannen", url: "hoogmolen.be/teambuildings/", to: "/teambuildings" },
  { label: "Paardenlogies", url: "hoogmolen.be/paardenlogies/", to: "/paardenlogies" },
];

const toneClass = (tone: CategoryCard["tone"]) => {
  switch (tone) {
    case "deep":
      return "bg-gradient-to-br from-primary-deep to-primary-deep/80 text-secondary";
    case "mid":
      return "bg-gradient-to-br from-primary/80 to-primary text-secondary";
    case "softer":
      return "bg-gradient-to-br from-accent/60 to-accent text-primary-deep";
    case "soft":
    default:
      return "bg-accent/40 text-primary-deep";
  }
};

const Activiteiten = () => (
  <Layout>
    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-16 md:py-20">
        <div className="text-[11px] uppercase tracking-[0.2em] text-secondary/80 mb-3">
          Natuur start letterlijk aan de deur
        </div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Activiteiten &amp; omgeving rond De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Nationaal Park Hoge Kempen — Ellikom — Oudsbergen — Abeekvalei
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* INTRO-bar (accent) */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/30 px-5 py-4 space-y-2">
          <div className="h-2 bg-primary-deep/15 rounded w-11/12 max-w-3xl" />
          <div className="h-2 bg-primary-deep/10 rounded w-2/3 max-w-2xl" />
        </div>
      </div>
    </section>

    {/* 2x2 CATEGORIE-CARDS */}
    <section className="pb-10 bg-background">
      <div className="container-wide grid md:grid-cols-2 gap-5">
        {CATEGORIES.map((c) => (
          <article key={c.title} className="border border-border bg-card flex flex-col">
            <div className={`px-5 py-8 text-center ${toneClass(c.tone)}`}>
              <span className="font-display italic text-sm">{c.eyebrow}</span>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-display text-lg text-primary-deep mb-2">{c.title}</h3>
              <p className="text-sm text-foreground/80 mb-4">{c.meta}</p>
              <Link
                to={c.to}
                className="self-start bg-primary text-secondary hover:bg-primary-deep px-4 py-2 text-sm font-medium transition-colors mb-3"
              >
                {c.cta}
              </Link>
              <div className="text-xs text-muted-foreground">{c.url}</div>
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* GIDSEN DOWNLOADEN */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Gidsen downloaden</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          {GIDSEN.map((g) => (
            <div key={g.label} className="space-y-1.5">
              <Link
                to={g.to}
                className="inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors"
              >
                {g.label}
              </Link>
              <div className="text-xs text-muted-foreground">{g.url}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* COMBINEER MET VERBLIJF */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">Combineer met verblijf</h2>
        <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
          {COMBINEER.map((c) => (
            <div key={c.label} className="space-y-1.5">
              <Link
                to={c.to}
                className="inline-block bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors"
              >
                {c.label}
              </Link>
              <div className="text-xs text-muted-foreground">{c.url}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Activiteiten;
