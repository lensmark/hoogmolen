/**
 * /teambuildings/met-overnachting — Volledig verzorgd arrangement.
 * Layout uit wireframe image-13: dagprogramma-tabel + 2 arrangementen + 3 verblijf-opties.
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { SubNav } from "@/components/SubNav";
import { AvailabilityBar } from "@/components/AvailabilityBar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  SAMPLE_DAY_PROGRAM,
  ARRANGEMENTS,
  STAY_OPTIONS,
} from "@/config/teambuildingConfig";
import { Check } from "lucide-react";

const SUB_NAV = [
  { label: "Teambuildings", to: "/teambuildings" },
  { label: "In Limburg", to: "/teambuildings/in-limburg" },
  { label: "Met overnachting", to: "/teambuildings/met-overnachting" },
  { label: "Op het domein", to: "/teambuildings/activiteiten-op-en-rond-het-domein" },
];

const TeambuildingMetOvernachting = () => (
  <Layout transparentHeader>
    <SubNav items={SUB_NAV} />

    <PageHero
      eyebrow="Volledig verzorgd arrangement · activiteit + verblijf + diner + ontbijt"
      title="Teambuilding met overnachting op De Hoogmolen"
      subtitle="Van activiteit tot ontbijt — volledig ontzorgd op 5-sterren domein"
    />

    {/* Voorbeeld dagprogramma */}
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <div className="border border-accent rounded-lg overflow-hidden bg-accent/20">
          <div className="px-6 py-4 border-b border-accent bg-accent/40">
            <h2 className="font-display text-xl text-primary-deep">Voorbeeld dagprogramma</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-primary-deep/70 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-3 w-32">Tijdstip</th>
                <th className="text-left px-6 py-3">Activiteit</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_DAY_PROGRAM.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-card/50" : ""}>
                  <td className="px-6 py-3 font-medium text-primary-deep">{s.time}</td>
                  <td className="px-6 py-3 text-muted-foreground">{s.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    {/* Arrangementen */}
    <section className="py-16 md:py-20 bg-secondary/40">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-primary-deep mb-3">Wat is inbegrepen?</h2>
        <div className="border-t border-border mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          {ARRANGEMENTS.map((a) => (
            <article
              key={a.id}
              className={`surface-card p-6 ${
                a.variant === "deep" ? "bg-primary-deep/5 border-primary-deep/40" : "bg-card"
              }`}
            >
              <h3 className="font-display text-xl text-primary-deep mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{a.subtitle}</p>
              <ul className="grid sm:grid-cols-2 gap-2 mb-6">
                {a.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2 border border-accent/60 rounded-md px-3 py-2 bg-accent/20 text-xs text-primary-deep"
                  >
                    <Check className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={
                  a.variant === "deep"
                    ? "bg-primary-deep hover:bg-primary text-secondary"
                    : "bg-primary hover:bg-primary-deep text-secondary"
                }
              >
                <Link to={a.ctaUrl}>Vraag offerte aan</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Verblijf-opties */}
    <section className="py-16 md:py-20">
      <div className="container-wide">
        <h2 className="font-display text-2xl text-primary-deep mb-3">Verblijf tijdens uw teambuilding</h2>
        <div className="border-t border-border mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          {STAY_OPTIONS.map((s) => (
            <article key={s.title} className="surface-card p-6 bg-card">
              <div className="flex items-baseline justify-between mb-3">
                <h3 className="font-display text-lg text-primary-deep">{s.title}</h3>
                <span className="text-[11px] font-medium text-primary-deep bg-accent px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
              </div>
              <div className="border-t border-border my-3" />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary-deep text-primary-deep hover:bg-primary-deep hover:text-secondary"
              >
                <Link to={s.url}>{s.ctaLabel}</Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="py-10">
      <div className="container-wide">
        <div className="border border-accent bg-accent/30 rounded-md p-5">
          <p className="text-sm text-primary-deep">
            Programma volledig op maat samenstelbaar. Prijs afhankelijk van groepsgrootte en gekozen activiteiten.
          </p>
        </div>
      </div>
    </section>

    <AvailabilityBar
      title="Vraag uw arrangement op maat aan"
      description="Wij stellen een offerte voor u samen — afgestemd op groep, datum en activiteiten."
      ctaLabel="Vraag offerte op maat aan"
      href="/contact"
    />
  </Layout>
);

export default TeambuildingMetOvernachting;
