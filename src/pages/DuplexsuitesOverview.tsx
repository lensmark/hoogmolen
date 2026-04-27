/**
 * /overnachten/suites-kamers/duplexsuites — overzicht 6 duplexsuites (A1-A6).
 * Tier 3 SubNav, hero, vergelijkingstabel, 6 unit-kaarten, faciliteiten-pills,
 * highlight callout en availability bar.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { propertiesByType, PROPERTIES } from "@/config/propertyConfig";
import { Check, ArrowRight } from "lucide-react";

const SUB = [
  { label: "Suites & kamers", to: "/overnachten/suites-kamers" },
  { label: "Duplexsuites A1-A6", to: "/overnachten/suites-kamers/duplexsuites", matchPrefix: true },
  { label: "Kamers B1-B5", to: "/overnachten/suites-kamers/kamers", matchPrefix: true },
];

const FACILITEITEN = [
  "Privéterras",
  "Eigen badkamer",
  "Boxspringbed",
  "WiFi",
  "Koffie & thee",
  "Gratis parking",
  "Ontbijt mogelijk",
  "Online boekbaar",
];

// A1-A6: A5 is type 'room', rest is 'duplex'. Hier groeperen we ze samen op A-prefix.
const A_SUITES = PROPERTIES.filter((p) =>
  ["de-fries", "de-fjord", "de-brabander", "de-draver", "de-shetlander", "de-jutlander"].includes(p.slug)
);

const codeOf = (name: string) => name.split("—")[0].trim(); // "A1 — De Fries" -> "A1"
const shortName = (name: string) => name.split("—")[1]?.trim() ?? name;

const DuplexsuitesOverview = () => (
  <Layout>
    <SubNav items={SUB} />

    {/* HERO */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-14 md:py-16">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          Duplexsuites op Landgoed De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/85">
          6 suites · privéterras · eigen badkamer, toilet &amp; TV · 1 tot 6 personen
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* INTRO */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-5 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Zes karaktervolle duplexsuites in de A-vleugel. Op de begane grond
            een zithoek met zetelbed, eigen badkamer en directe doorgang naar het
            overdekte privéterras. Op de bovenverdieping comfortabele
            boxsprings — een ware split-level beleving.
          </p>
        </div>
      </div>
    </section>

    {/* VERGELIJKINGSTABEL */}
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
              {A_SUITES.map((p) => (
                <tr key={p.slug} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-primary-deep whitespace-nowrap">
                    {codeOf(p.name)} - {shortName(p.name)}
                  </td>
                  <td className="px-4 py-3 text-primary">{p.capacity} personen</td>
                  <td className="px-4 py-3 text-primary-deep/85">{p.location}</td>
                  <td className="px-4 py-3 text-primary-deep/85">
                    {p.type === "duplex" ? "Slaapkamer boven" : "Gelijkvloers"}
                  </td>
                  <td className="px-4 py-3 text-primary-deep/85">
                    €{p.startingPrice}/nacht
                    {p.highlights?.find((h) => /score/i.test(h)) && (
                      <> · ★ {p.highlights.find((h) => /score/i.test(h))?.replace(/[^\d.]/g, "")}</>
                    )}
                    {p.slug === "de-shetlander" && <> · 1 slaapkamer</>}
                    {p.slug === "de-jutlander" && <> · grootste suite</>}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/overnachten/suites-kamers/duplexsuites/${p.slug}`}
                      className="text-primary hover:text-primary-deep inline-flex items-center gap-1 font-medium"
                    >
                      Bekijk <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* 6 KAARTEN */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {A_SUITES.map((p) => (
            <article
              key={p.slug}
              className="border border-border bg-card flex flex-col overflow-hidden"
            >
              <UnitGallerySlider
                slug={p.slug}
                configImages={p.galleryImages}
                alt={p.name}
                placeholderLabel={`Suite ${codeOf(p.name)}`}
              />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <h2 className="font-display text-lg text-primary-deep">
                    Suite {codeOf(p.name)}
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
                  <Link to={`/overnachten/suites-kamers/duplexsuites/${p.slug}`}>
                    Bekijk {codeOf(p.name)}
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* FACILITEITEN */}
    <section className="py-8 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-2">
          Faciliteiten alle duplexsuites
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

    {/* BIJZONDERHEID CALLOUT */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 px-6 py-4">
          <p className="text-sm md:text-base text-primary-deep">
            <span className="font-medium">Suite A5</span> is voor 1-2 personen.{" "}
            <span className="font-medium">Suite A6</span> is de grootste suite (1-6 personen).
          </p>
        </div>
      </div>
    </section>

    <FAQAccordion context="kamer" title="Veelgestelde vragen" />
    <AvailabilityBar />
  </Layout>
);

export default DuplexsuitesOverview;
