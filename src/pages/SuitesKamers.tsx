/**
 * /overnachten/suites-kamers — overzicht hub.
 * Twee kaarten (Duplexsuites A1-A6 en Kamers B1-B5), faciliteiten-pills,
 * familiekamer-info, FAQ accordion en availability bar.
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SubNav } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Check } from "lucide-react";

const SUB = [
  { label: "Suites & kamers", to: "/overnachten/suites-kamers" },
  { label: "Duplexsuites A1-A6", to: "/overnachten/suites-kamers/duplexsuites", matchPrefix: true },
  { label: "Kamers B1-B5", to: "/overnachten/suites-kamers/kamers", matchPrefix: true },
];

const FACILITEITEN = [
  "Eigen badkamer",
  "Boxspringbed",
  "WiFi",
  "Gratis parking",
  "Ontbijt mogelijk",
  "Online boekbaar per nacht",
];

const DUPLEX_OVERVIEW_IDS = [
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
  "hoogmolen-verblijf-suite-a5",
  "hoogmolen-verblijf-suite-a6",
];

const KAMERS_OVERVIEW_IDS = [
  "hoogmolen-verblijf-peerdermolen-kamer-b1",
  "hoogmolen-verblijf-peerdermolen-kamer-b2",
  "hoogmolen-verblijf-peerdermolen-kamer-b3",
  "hoogmolen-verblijf-peerdermolen-kamer-b4",
  "hoogmolen-verblijf-peerdermolen-kamer-b5",
];

const SuitesKamers = () => (
  <Layout>
    <SubNav items={SUB} />
    {/* HERO met dynamische foto-achtergrond */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="absolute inset-0">
        <UnitGallerySlider
          slug="suites-kamers-hero"
          extraLocationIds={[...DUPLEX_OVERVIEW_IDS, ...KAMERS_OVERVIEW_IDS]}
          alt="Suites en kamers op Landgoed De Hoogmolen"
          placeholderLabel=""
          aspectClass="h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent pointer-events-none" aria-hidden="true" />
      <div className="relative container-wide py-16 md:py-20">
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          Suites &amp; kamers op Landgoed De Hoogmolen
        </h1>
        <p className="text-sm md:text-base text-secondary/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
          6 duplexsuites en 5 kamers — elk met eigen ingang, privéterras,
          badkamer, toilet en TV
        </p>
      </div>
    </section>

    <Breadcrumbs />

    {/* INTRO PLACEHOLDER */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-secondary/40 px-6 py-6 max-w-5xl">
          <p className="text-sm md:text-base text-primary-deep leading-relaxed">
            Onze duplexsuites en kamers zijn ideaal voor koppels, kleine families
            of zakelijke bezoekers — comfortabel, karaktervol en online per
            nacht boekbaar.
          </p>
        </div>
      </div>
    </section>

    {/* 2 KAARTEN */}
    <section className="pb-10 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DUPLEXSUITES */}
          <article className="border border-border bg-card flex flex-col overflow-hidden">
            <UnitGallerySlider
              slug="duplexsuites-overview"
              extraLocationIds={DUPLEX_OVERVIEW_IDS}
              alt="Duplexsuites"
              placeholderLabel="6 duplexsuites"
            />
            <div className="p-5 md:p-6 flex flex-col flex-1">
              <h2 className="font-display text-xl text-primary-deep mb-1">
                Duplexsuites A1–A6
              </h2>
              <p className="text-sm text-primary leading-relaxed mb-4">
                1–6 personen · privéterras · eigen badkamer, toilet &amp; TV
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Zes intieme suites over twee verdiepingen. Op de begane grond een
                zithoek met zetelbed (1m40), badkamer en privéterras; boven
                comfortabele boxsprings.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary-deep text-secondary self-start"
              >
                <Link to="/overnachten/suites-kamers/duplexsuites">
                  Bekijk alle duplexsuites
                </Link>
              </Button>
            </div>
          </article>

          {/* KAMERS */}
          <article className="border border-border bg-card flex flex-col overflow-hidden">
            <UnitGallerySlider
              slug="kamers-overview"
              extraLocationIds={KAMERS_OVERVIEW_IDS}
              alt="Kamers"
              placeholderLabel="5 kamers"
            />
            <div className="p-5 md:p-6 flex flex-col flex-1">
              <h2 className="font-display text-xl text-primary-deep mb-1">
                Kamers B1–B5
              </h2>
              <p className="text-sm text-primary leading-relaxed mb-4">
                1–4 personen · eigen ingang · privéterras · badkamer, toilet &amp; TV
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                Karaktervolle kamers in het hoofdgebouw, elk met eigen badkamer
                en Nespresso-koffiemachine. Kamers B3 en B4 kunnen samen als
                familiekamer geboekt worden.
              </p>
              <Button
                asChild
                className="bg-primary hover:bg-primary-deep text-secondary self-start"
              >
                <Link to="/overnachten/suites-kamers/kamers">
                  Bekijk alle kamers
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </section>

    {/* FACILITEITEN PILLS */}
    <section className="py-10 bg-background">
      <div className="container-wide">
        <h2 className="font-display text-xl text-primary-deep mb-2">
          Faciliteiten — alle suites en kamers
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

    {/* FAMILIEKAMER NOTE */}
    <section className="pb-12 bg-background">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 px-6 py-5">
          <p className="text-sm md:text-base text-primary-deep">
            Kamers B3 en B4 kunnen gecombineerd worden als{" "}
            <Link
              to="/overnachten/suites-kamers/kamers/familiekamer-b3-b4"
              className="underline underline-offset-2 hover:text-primary"
            >
              familiekamer voor 1–4 personen
            </Link>
            .
          </p>
        </div>
      </div>
    </section>

    {/* FAQ */}
    <FAQAccordion context="kamer" title="Veelgestelde vragen" />

    <AvailabilityBar />
  </Layout>
);

export default SuitesKamers;
