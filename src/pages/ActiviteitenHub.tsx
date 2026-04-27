/**
 * ActiviteitenHub — "Categorie Huis" voor een activiteit-categorie.
 * Eén component bedient: /activiteiten/fietsen · /wandelen · /in-de-omgeving · /familie
 *
 * Toont de sub-routes uit de Informatiegids als gestructureerde kaartlijst.
 * Vervangt de oude platte <Omgeving /> render voor deze routes.
 */
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ChevronRight } from "lucide-react";

interface SubItem {
  label: string;
  to: string;
  meta?: string;
}

interface CategoryConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: SubItem[];
}

const CATEGORIES: Record<string, CategoryConfig> = {
  "/activiteiten/fietsen": {
    eyebrow: "Fietsen vanuit De Hoogmolen",
    title: "Fietsroutes door Limburg",
    subtitle:
      "Knooppunt 01 ligt aan de deur. Acht uitgewerkte routes — van historische watermolens tot fietsen door het water en door de bomen.",
    items: [
      { label: "10 historische watermolens", to: "/activiteiten/fietsen/10-historische-watermolens", meta: "Themaroute · cultureel erfgoed" },
      { label: "Fietsen door het water", to: "/activiteiten/fietsen/fietsen-door-het-water", meta: "Iconisch · Bokrijk" },
      { label: "Fietsen door de bomen", to: "/activiteiten/fietsen/fietsen-door-de-bomen", meta: "Pijnven · Hechtel-Eksel" },
      { label: "Bruegelfietsroute", to: "/activiteiten/fietsen/bruegelfietsroute", meta: "Schilderachtig Limburg" },
      { label: "Duinengordel", to: "/activiteiten/fietsen/duinengordel", meta: "Stuifduinen · heide" },
      { label: "Hoeveweelde", to: "/activiteiten/fietsen/hoeveweelde", meta: "Hoeves · platteland" },
      { label: "Ronde van Oudsbergen", to: "/activiteiten/fietsen/ronde-van-oudsbergen", meta: "Lokale lus" },
      { label: "Knooppunt 01", to: "/activiteiten/fietsen/knooppunt-01", meta: "Vertrekpunt aan het domein" },
    ],
  },
  "/activiteiten/wandelen": {
    eyebrow: "Wandelen vanuit De Hoogmolen",
    title: "Wandelroutes in en rond de Abeekvallei",
    subtitle:
      "Eigen routes vertrekken aan de deur — bevers in de vallei, heide op Resterheide, stuifduinen in de Duinengordel.",
    items: [
      { label: "Abeekvallei", to: "/activiteiten/wandelen/abeekvallei", meta: "Direct aan het domein · bevers" },
      { label: "Resterheide", to: "/activiteiten/wandelen/resterheide", meta: "Heidelandschap" },
      { label: "Duinengordel", to: "/activiteiten/wandelen/duinengordel", meta: "Stuifduinen · pijnboomen" },
      { label: "Wandel op water", to: "/activiteiten/wandelen/wandel-op-water", meta: "Drijvende paden" },
      { label: "Abeekvallei Zwart", to: "/activiteiten/wandelen/abeekvallei-zwart", meta: "Lange variant" },
      { label: "Abeekvallei Blauw", to: "/activiteiten/wandelen/abeekvallei-blauw", meta: "Korte variant" },
    ],
  },
  "/activiteiten/in-de-omgeving": {
    eyebrow: "In de omgeving",
    title: "Avontuur, sport en ontspanning binnen 30 minuten",
    subtitle: "Terhills, Snow Valley, Center Parcs en Zelfpluk Blauwe Bessen — allemaal binnen handbereik.",
    items: [
      { label: "Terhills Cablepark", to: "/activiteiten/in-de-omgeving/terhills-cablepark", meta: "Maasmechelen · waterski & wakeboard" },
      { label: "Snow Valley", to: "/activiteiten/in-de-omgeving/snow-valley", meta: "Peer · indoor skiën" },
      { label: "Center Parcs", to: "/activiteiten/in-de-omgeving/center-parcs", meta: "Erperheide · subtropisch zwemparadijs" },
      { label: "Zelfpluk Blauwe Bessen", to: "/activiteiten/in-de-omgeving/zelfpluk-blauwe-bessen", meta: "Familie Schrijnwerkers · vanaf juli" },
    ],
  },
  "/activiteiten/familie": {
    eyebrow: "Familie",
    title: "Activiteiten voor het hele gezin",
    subtitle: "Center Parcs, Park Molenheide en Tarzan & Jane — kindvriendelijke parken op korte rijafstand.",
    items: [
      { label: "Center Parcs", to: "/activiteiten/familie/center-parcs", meta: "Erperheide · subtropisch zwemparadijs" },
      { label: "Park Molenheide", to: "/activiteiten/familie/park-molenheide", meta: "Helchteren · subtropisch & buitenrecreatie" },
      { label: "Tarzan & Jane", to: "/activiteiten/familie/tarzan-en-jane", meta: "Klimpark · avontuur in de bomen" },
    ],
  },
};

const ActiviteitenHub = () => {
  const { pathname } = useLocation();
  const cfg = CATEGORIES[pathname];

  if (!cfg) {
    return (
      <Layout>
        <section className="container-wide py-20">
          <p className="text-muted-foreground">Categorie niet gevonden.</p>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero — groene gradient */}
      <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
        <div className="container-wide py-16 md:py-20">
          <div className="text-[11px] uppercase tracking-[0.2em] text-secondary/80 mb-3">
            {cfg.eyebrow}
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
            {cfg.title}
          </h1>
          <p className="text-sm md:text-base text-secondary/85 max-w-3xl">
            {cfg.subtitle}
          </p>
        </div>
      </section>

      {/* Sub-items grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container-wide grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cfg.items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              aria-label={`${item.label}${item.meta ? ` — ${item.meta}` : ""}`}
              className="group border border-border bg-card p-5 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
            >
              <h3 className="font-display text-lg text-primary-deep mb-1 group-hover:text-primary transition-colors">
                {item.label}
              </h3>
              {item.meta && (
                <p className="text-sm text-muted-foreground mb-4 flex-1">{item.meta}</p>
              )}
              <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-auto group-hover:gap-2 transition-all">
                Ontdek <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Combineer met verblijf */}
      <section className="pb-12 bg-background">
        <div className="container-wide">
          <h2 className="font-display text-xl text-primary-deep mb-3">Combineer met verblijf</h2>
          <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
            {[
              { label: "Overnachten op het domein", to: "/overnachten" },
              { label: "Groepsverblijf aanvragen", to: "/groepsverblijf" },
              { label: "Teambuilding plannen", to: "/teambuildings" },
              { label: "Paardenlogies", to: "/paardenlogies" },
            ].map((c) => (
              <Link
                key={c.to}
                to={c.to}
                aria-label={c.label}
                className="group border border-border bg-card p-4 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-primary"
              >
                <span className="text-sm font-medium text-primary-deep group-hover:text-primary transition-colors">
                  {c.label}
                </span>
                <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ActiviteitenHub;
