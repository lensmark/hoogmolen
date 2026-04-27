/**
 * /teambuildings/activiteiten-op-en-rond-het-domein — Eigen routes & activiteiten.
 * Layout uit wireframe image-14: 2x2 grid met domein-activiteiten + USP-strook.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DOMAIN_ACTIVITIES } from "@/config/teambuildingConfig";
import { Check } from "lucide-react";

const SUB_NAV = [
  { label: "Teambuildings", to: "/teambuildings" },
  { label: "In Limburg", to: "/teambuildings/in-limburg" },
  { label: "Met overnachting", to: "/teambuildings/met-overnachting" },
  { label: "Op het domein", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
];

const TeambuildingOpDomein = () => (
  <Layout transparentHeader>
    <SubNav items={SUB_NAV} />

    <PageHero
      eyebrow="Wandelen · fietsen · paardrijden · Molenhuys · direct vanuit De Hoogmolen"
      title="Op en rond het domein — activiteiten vanuit De Hoogmolen"
      subtitle="Natuur start letterlijk aan de deur · Abeekvallei · Knooppunt 01 · Hoge Kempen"
    />

    {/* Eigen routes & activiteiten */}
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-primary-deep mb-3">Eigen routes & activiteiten</h2>
        <div className="border-t border-border mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          {DOMAIN_ACTIVITIES.map((d) => (
            <article key={d.id} className="surface-card overflow-hidden bg-card flex flex-col">
              <div
                className={`h-24 flex items-center justify-center text-sm font-medium tracking-wide ${
                  d.variant === "soft"
                    ? "bg-gradient-to-br from-accent to-primary/40 text-primary-deep"
                    : "bg-gradient-to-br from-primary to-primary-deep text-secondary"
                }`}
              >
                <span className="text-2xl mr-2">{d.icon}</span>
                {d.id === "wandelen-domein" && "Wandelen"}
                {d.id === "fietsen-domein" && "Fietsen"}
                {d.id === "paardrijden-domein" && "Paardrijden"}
                {d.id === "molenhuys" && "Molenhuys"}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-display text-lg text-primary-deep mb-1">{d.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{d.description}</p>
                {d.features.length > 0 && (
                  <ul className="grid grid-cols-2 gap-2 mb-5">
                    {d.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 border border-accent/60 rounded-md px-3 py-1.5 bg-accent/20 text-xs text-primary-deep"
                      >
                        <Check className="w-3 h-3 mt-0.5 text-primary shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  asChild
                  variant={d.id === "molenhuys" ? "outline" : "default"}
                  size="sm"
                  className={
                    d.id === "molenhuys"
                      ? "border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary self-start mt-auto"
                      : "bg-primary hover:bg-primary-deep text-secondary self-start mt-auto"
                  }
                >
                  <Link to={d.ctaUrl}>{d.ctaLabel}</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-10">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 rounded-md p-5">
          <p className="text-sm text-primary-deep">
            Natuur start letterlijk aan de deur — gasten stappen vanuit de vergaderruimte zo een wandelroute in langs de Abeek en het omliggende bos.
          </p>
        </div>
      </div>
    </section>

    <AvailabilityBar
      title="Plan uw teambuildingdag op het domein"
      description="Wij combineren routes, vergaderen en Molenhuys-toegang in één arrangement."
      ctaLabel="Plan uw teambuildingdag"
      href="/contact"
    />
  </Layout>
);

export default TeambuildingOpDomein;
