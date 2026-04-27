/**
 * /overnachten/suites-kamers/kamers — overzicht 5 kamers (B1-B5) + familiekamer.
 * Tier 3 SubNav, hero, tabel, kaartengrid, faciliteiten en availability bar.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { PROPERTIES } from "@/config/propertyConfig";
import { Check, ArrowRight } from "lucide-react";

const SUB = [
  { label: "Suites & kamers", to: "/overnachten/suites-kamers" },
  { label: "Duplexsuites A1-A6", to: "/overnachten/suites-kamers/duplexsuites", matchPrefix: true },
  { label: "Kamers B1-B5", to: "/overnachten/suites-kamers/kamers", matchPrefix: true },
];

const FACILITEITEN = [
  "Eigen ingang",
  "Eigen badkamer",
  "Boxspringbed",
  "Nespresso",
  "WiFi",
  "Gratis parking",
  "Ontbijt mogelijk",
  "Online boekbaar",
];

const B_ROOMS = PROPERTIES.filter((p) =>
  ["deluxe-kamer-b1", "deluxe-kamer-b2", "kamer-b3", "kamer-b4", "suite-b5"].includes(p.slug)
);

const FAMILIE = PROPERTIES.find((p) => p.slug === "familiekamer-b3-b4")!;

const codeFromSlug = (slug: string) => {
  if (slug === "deluxe-kamer-b1") return "B1";
  if (slug === "deluxe-kamer-b2") return "B2";
  if (slug === "kamer-b3") return "B3";
  if (slug === "kamer-b4") return "B4";
  if (slug === "suite-b5") return "B5";
  return slug;
};

const KamersOverview = () => (
  <Layout>
    <SubNav items={SUB} />

    {/* HERO */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-14 md:py-16">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Kamers op Landgoed De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          5 kamers · eigen ingang · privéterras · badkamer, toilet &amp; TV · 1 tot 4 personen
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* INTRO */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-5 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Karaktervolle kamers in het hoofdgebouw — elk met eigen badkamer en
            Nespresso-koffiemachine. Kamers B3 en B4 zijn via een tussendeur
            verbonden en kunnen samen als familiekamer geboekt worden.
          </p>
        </div>
      </div>
    </section>

    {/* TABEL */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-primary-deep">
              <tr>
                <th className="text-left font-medium px-4 py-3">Suite/Kamer</th>
                <th className="text-left font-medium px-4 py-3">Personen</th>
                <th className="text-left font-medium px-4 py-3">Ligging</th>
                <th className="text-left font-medium px-4 py-3">Terras/kenmerk</th>
                <th className="text-left font-medium px-4 py-3">Bijzonderheid</th>
                <th className="text-left font-medium px-4 py-3">Boek</th>
              </tr>
            </thead>
            <tbody>
              {B_ROOMS.map((p) => {
                const code = codeFromSlug(p.slug);
                const labelPrefix =
                  p.type === "suite" ? "Suite" : p.slug.startsWith("deluxe") ? "Deluxe Kamer" : "Kamer";
                const terras =
                  p.slug === "deluxe-kamer-b1" || p.slug === "deluxe-kamer-b2"
                    ? "2 boxsprings + topper"
                    : p.slug === "kamer-b3"
                    ? "Tussendeur naar B4"
                    : p.slug === "kamer-b4"
                    ? "Tussendeur naar B3"
                    : "Studio · 2 slaapkamers";
                const bijzonderheid =
                  p.slug === "deluxe-kamer-b1"
                    ? `€${p.startingPrice}/nacht · koppels of 2 gasten`
                    : p.slug === "deluxe-kamer-b2"
                    ? `€${p.startingPrice}/nacht · samen met B1 voor groepjes`
                    : p.slug === "kamer-b3" || p.slug === "kamer-b4"
                    ? "Ook afzonderlijk boekbaar"
                    : `€${p.startingPrice}/nacht · ruimste B-kamer`;
                return (
                  <tr key={p.slug} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-primary-deep whitespace-nowrap">
                      {labelPrefix} {code}
                    </td>
                    <td className="px-4 py-3 text-primary">{p.capacity} personen</td>
                    <td className="px-4 py-3 text-primary-deep/85">{p.location}</td>
                    <td className="px-4 py-3 text-primary-deep/85">{terras}</td>
                    <td className="px-4 py-3 text-primary-deep/85">{bijzonderheid}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/overnachten/suites-kamers/kamers/${p.slug}`}
                        className="text-primary hover:text-primary-deep inline-flex items-center gap-1 font-medium"
                      >
                        Bekijk <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
              <tr className="border-t border-border bg-accent/20">
                <td className="px-4 py-3 font-medium text-primary-deep whitespace-nowrap">
                  Familiekamer B3+B4
                </td>
                <td className="px-4 py-3 text-primary">{FAMILIE.capacity} personen</td>
                <td className="px-4 py-3 text-primary-deep/85">{FAMILIE.location}</td>
                <td className="px-4 py-3 text-primary-deep/85">Tussendeur · 2 badkamers</td>
                <td className="px-4 py-3 text-primary-deep/85">
                  €{FAMILIE.startingPrice}/nacht · ideaal voor gezin
                </td>
                <td className="px-4 py-3">
                  <Link
                    to="/overnachten/suites-kamers/kamers/familiekamer-b3-b4"
                    className="text-primary hover:text-primary-deep inline-flex items-center gap-1 font-medium"
                  >
                    Bekijk <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* KAARTEN — 6 (B1-B5 + Familiekamer) */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...B_ROOMS, FAMILIE].map((p) => {
            const isFamily = p.slug === "familiekamer-b3-b4";
            const code = isFamily ? "Familiekamer" : codeFromSlug(p.slug);
            const cardLabel = isFamily ? `Familiekamer B3+B4` : `Kamer ${code}`;
            const btnLabel = isFamily ? "Bekijk familiekamer" : `Bekijk ${code}`;
            return (
              <article
                key={p.slug}
                className="border border-border bg-card flex flex-col overflow-hidden"
              >
                <UnitGallerySlider
                  slug={p.slug}
                  configImages={p.galleryImages}
                  alt={p.name}
                  placeholderLabel={code}
                />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h2 className="font-display text-lg text-primary-deep">
                      {cardLabel}
                    </h2>
                    <span className="inline-flex text-[11px] uppercase tracking-wide text-primary bg-secondary/60 px-2 py-0.5 rounded">
                      1-{p.capacity}p
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                    {p.tagline}
                  </p>
                  <Button
                    asChild
                    size="sm"
                    className="bg-primary hover:bg-primary-deep text-secondary self-start"
                  >
                    <Link to={`/overnachten/suites-kamers/kamers/${p.slug}`}>
                      {btnLabel}
                    </Link>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>


    {/* FACILITEITEN */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-2">
          Faciliteiten alle kamers
        </h2>
        <div className="border-t border-border mb-5" />
        <div className="flex flex-wrap gap-2">
          {FACILITEITEN.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1.5 text-sm text-primary-deep border border-accent bg-secondary/40 px-3 py-1.5 rounded-md"
            >
              <Check className="w-3.5 h-3.5 text-primary" /> {f}
            </span>
          ))}
        </div>
      </div>
    </section>

    {/* FAMILIEKAMER CALLOUT */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 px-6 py-4">
          <p className="text-sm md:text-base text-primary-deep">
            Kamers B3 en B4 kunnen gecombineerd worden als{" "}
            <Link
              to="/overnachten/suites-kamers/kamers/familiekamer-b3-b4"
              className="underline underline-offset-2 hover:text-primary font-medium"
            >
              familiekamer voor 1-4 personen
            </Link>
            .
          </p>
        </div>
      </div>
    </section>

    <FAQAccordion context="kamer" title="Veelgestelde vragen" />
    <AvailabilityBar />
  </Layout>
);

export default KamersOverview;
