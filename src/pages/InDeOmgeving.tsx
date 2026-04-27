/**
 * InDeOmgeving — strikte wireframe-implementatie (image-47).
 * Route: /activiteiten/in-de-omgeving
 *
 * Volgorde EXACT zoals screenshot:
 *   SubNav (Wandelen / Fietsen / Paardrijden / In de omgeving) →
 *   Groene hero ("In de omgeving van De Hoogmolen") →
 *   3 secties (Avontuur & sport / Familie & ontspanning / Culinair in de buurt) — elk 2-koloms cards →
 *   Combineer met-blok: 4 CTA-knoppen met url-onderschrift
 */
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";

interface Spot {
  icon: string;
  title: string;
  meta: string;
  description: string;
  /** interne detailpagina (verplicht voor in-de-omgeving) */
  to?: string;
  /** externe domein (optioneel — getoond onder de interne CTA) */
  domain?: string;
  href?: string;
}

const AVONTUUR: Spot[] = [
  {
    icon: "🏄",
    title: "Terhills Cablepark & Aquapark",
    meta: "Maasmechelen · 30 min",
    description:
      "Waterskiën en wakeboarden met top instructeurs. Aquapark met drijvende hindernisbaan voor iedereen. Alle niveaus welkom.",
    to: "/activiteiten/in-de-omgeving/terhills-cablepark",
    domain: "terhillscablepark.be",
    href: "https://terhillscablepark.be",
  },
  {
    icon: "⛷",
    title: "Snow Valley Peer",
    meta: "Peer — 15 min",
    description:
      "Indoor skiën en snowboarden het hele jaar door. Instructeurs voor beginners en gevorderden.",
    to: "/activiteiten/in-de-omgeving/snow-valley",
    domain: "snowvalley.be",
    href: "https://www.snowvalley.be",
  },
  {
    icon: "🏎",
    title: "Racelandkart Oudsbergen",
    meta: "5 min van het domein",
    description:
      "Indoor karting, lasergame, kidskarting en pitbikes. Adrenalinekick op enkele minuten van De Hoogmolen.",
    to: "/activiteiten/in-de-omgeving/racelandkart",
    domain: "racelandkart.be",
    href: "https://www.racelandkart.be",
  },
];

const FAMILIE: Spot[] = [
  {
    icon: "🏊",
    title: "Center Parcs Erperheide",
    meta: "20 min",
    description:
      "Subtropisch zwemparadijs, bungalows en activiteiten. Goed voor 20% van de toeristische verblijven in Limburg. Dagtickets mogelijk.",
    to: "/activiteiten/in-de-omgeving/center-parcs",
    domain: "centerparcs.be",
    href: "https://www.centerparcs.be/be-vl/belgie/fp_EP_vakantiepark-erperheide",
  },
  {
    icon: "🫐",
    title: "Zelfpluk Blauwe Bessen",
    meta: "Familie Schrijnwerkers — vanaf juli",
    description:
      "Zelf bessen plukken aan aantrekkelijke prijs. Zaterdag 10-17u, zondag 13-17u. Reserveren niet nodig. Eigen doos meebrengen.",
    to: "/activiteiten/in-de-omgeving/blauwe-bessen-schrijnwerkers",
    domain: "blauwebessen.be",
    href: "https://www.blauwebessen.be",
  },
  {
    icon: "🏘",
    title: "Openluchtmuseum Bokrijk",
    meta: "30 min",
    description:
      "Levend Vlaams verleden in een van Europa's grootste openluchtmusea. Thuis van Fietsen door het Water.",
    to: "/activiteiten/in-de-omgeving/bokrijk",
    domain: "bokrijk.be",
    href: "https://www.bokrijk.be",
  },
  {
    icon: "🌲",
    title: "Nationaal Park Bosland",
    meta: "25 min",
    description:
      "5.000 hectare bos, heide en duinen — thuisbasis van Fietsen door de Bomen in Pijnven.",
    to: "/activiteiten/in-de-omgeving/bosland",
    domain: "bosland.be",
    href: "https://www.bosland.be",
  },
];

const CULINAIR: Spot[] = [
  {
    icon: "🍽",
    title: "Restaurant De Dorpermolen",
    meta: "Op enkele minuten van het domein",
    description:
      "Lokale Limburgse keuken. Vaste partner voor diner bij vergaderarrangementen 12u, 24u en 48u.",
    domain: "",
    href: "#",
  },
  {
    icon: "🍺",
    title: "Restaurant 't Pleintje",
    meta: "Op enkele minuten van het domein",
    description:
      "Sfeervolle brasserie. Vaste partner voor diner bij vergaderarrangementen.",
    domain: "",
    href: "#",
  },
];

const COMBINEER = [
  { label: "Overnachten op het domein", url: "hoogmolen.be/overnachten/", to: "/overnachten" },
  { label: "Groepsverblijf aanvragen", url: "hoogmolen.be/groepsverblijf/", to: "/groepsverblijf" },
  { label: "Teambuilding plannen", url: "hoogmolen.be/teambuildings/", to: "/teambuildings" },
  {
    label: "Vergaderen met overnachting",
    url: "hoogmolen.be/vergaderen/vergaderen-met-overnachting/",
    to: "/vergaderen/vergaderen-met-overnachting",
  },
];

const SpotCard = ({ spot }: { spot: Spot }) => {
  const inner = (
    <>
      <div className="shrink-0 w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center text-2xl">
        <span aria-hidden>{spot.icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg text-primary-deep leading-tight m-0 group-hover:text-primary transition-colors">
          {spot.title}
        </h3>
        <div className="text-xs text-muted-foreground mt-0.5 mb-2">{spot.meta}</div>
        <p className="text-sm text-foreground/80 leading-relaxed mb-3">{spot.description}</p>
        {spot.to && (
          <span className="inline-flex items-center gap-1 text-sm text-primary group-hover:text-primary-deep group-hover:gap-2 underline underline-offset-2 font-medium transition-all">
            Lees meer →
          </span>
        )}
      </div>
    </>
  );

  if (spot.to) {
    return (
      <Link
        to={spot.to}
        className="group border border-border bg-card p-5 flex gap-4 rounded-md hover:shadow-card hover:-translate-y-1 hover:border-primary transition-all duration-200"
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className="border border-border bg-card p-5 flex gap-4 rounded-md">
      {inner}
    </article>
  );
};

const Section = ({ title, items }: { title: string; items: Spot[] }) => (
  <section className="pb-8 bg-background">
    <div className="container-wide">
      <h2 className="font-display text-xl text-primary-deep mb-3">{title}</h2>
      <div className="border-t border-border pt-4 grid md:grid-cols-2 gap-5">
        {items.map((s) => (
          <SpotCard key={s.title} spot={s} />
        ))}
      </div>
    </div>
  </section>
);

const InDeOmgeving = () => (
  <Layout>
    {/* Groene hero */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-16 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          In de omgeving van De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          Terhills · Snow Valley · Center Parcs · Zelfpluk Blauwe Bessen · lokale restaurants
        </p>
      </div>
    </section>

    <div className="pt-8 bg-background" />

    <Section title="Avontuur & sport" items={AVONTUUR} />
    <Section title="Familie & ontspanning" items={FAMILIE} />
    <Section title="Culinair in de buurt" items={CULINAIR} />

    {/* Combineer met verblijf op het domein */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-3">
          Combineer met verblijf op het domein
        </h2>
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

export default InDeOmgeving;
