/**
 * TemplateActivity — herbruikbaar detail-template voor activity-routes
 * (fietsen / wandelen / paardrijden). Pixel-aligned met image-52 referentie.
 *
 * Layout (top → bottom):
 *  1. Hero (groene gradient, eyebrow + H1 + subline)
 *  2. Accent-bar met intro highlight
 *  3. Fast Facts (3 koloms cards: knooppunt / locatie / route-type)
 *  4. Body — 2 koloms (description + side-data: knooppuntenketen, distance, links)
 *  5. Externe link buttons (outline)
 *  6. AvailabilityBar — overnachting cross-sell
 *  7. Footer-links: terug + overnachten
 */
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ExternalLink as ExternalLinkIcon } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { SubNav, type SubNavItem } from "@/components/SubNav";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AvailabilityBar } from "@/components/AvailabilityBar";

export interface FastFact {
  icon: ReactNode;
  value: string;
  label: string;
}

export interface ExternalLink {
  label: string;
  href: string;
  url: string;
}

export interface InternalLink {
  label: string;
  to: string;
  url: string;
}

export interface TemplateActivityProps {
  /** Subnav items voor Tier 2 (default: omgeving-tabs) */
  subNavItems?: SubNavItem[];
  eyebrow: string;
  title: string;
  subtitle: string;
  /** highlight-strip onder hero */
  intro: string;
  fastFacts: FastFact[];
  /** Hoofdbody (paragrafen) */
  description: ReactNode;
  /** Side-info: knooppuntenketen, distance, etc. */
  sideInfo?: ReactNode;
  /** Externe links (outline buttons) */
  externalLinks?: ExternalLink[];
  /** Cross-sell CTA bar tekst */
  ctaTitle?: string;
  ctaDescription?: string;
  /** Optioneel: vervang de default AvailabilityBar door een custom CTA-component */
  customCta?: ReactNode;
  /** Footer terug-link + naar overnachten */
  backHref: string;
  backLabel: string;
}

const DEFAULT_SUBNAV: SubNavItem[] = [
  { label: "Wandelen", to: "/activiteiten/wandelen", matchPrefix: true },
  { label: "Fietsen", to: "/activiteiten/fietsen", matchPrefix: true },
  { label: "Paardrijden", to: "/activiteiten/paardrijden", matchPrefix: true },
  { label: "In de omgeving", to: "/activiteiten/in-de-omgeving", matchPrefix: true },
];

export const TemplateActivity = ({
  subNavItems = DEFAULT_SUBNAV,
  eyebrow,
  title,
  subtitle,
  intro,
  fastFacts,
  description,
  sideInfo,
  externalLinks = [],
  ctaTitle = "Maak uw fietsweekend compleet",
  ctaDescription = "Combineer deze route met een overnachting op het landgoed.",
  customCta,
  backHref,
  backLabel,
}: TemplateActivityProps) => (
  <Layout>
    <SubNav items={subNavItems} />
    <Breadcrumbs />

    {/* HERO — groene gradient */}
    <section className="relative bg-gradient-to-br from-primary to-primary-deep text-secondary overflow-hidden">
      <div className="container-wide py-16 md:py-20">
        <div className="eyebrow text-secondary/70 mb-3">{eyebrow}</div>
        <h1 className="font-display text-3xl md:text-5xl font-semibold leading-[1.1] tracking-tight text-secondary mb-3">
          {title}
        </h1>
        <p className="text-sm md:text-base text-secondary/85 max-w-3xl">{subtitle}</p>
      </div>
    </section>

    {/* INTRO accent-bar */}
    <section className="pt-8 bg-background">
      <div className="container-wide">
        <div className="border-l-4 border-primary bg-accent/40 px-5 py-4">
          <p className="text-sm text-foreground/85">{intro}</p>
        </div>
      </div>
    </section>

    {/* FAST FACTS */}
    <section className="py-8 bg-background">
      <div className="container-wide grid grid-cols-1 md:grid-cols-3 gap-3">
        {fastFacts.map((f, i) => (
          <div key={i} className="border border-border bg-card rounded-md p-5 text-center">
            <div className="flex justify-center mb-2 text-primary-deep">{f.icon}</div>
            <div className="font-display text-lg text-primary-deep leading-tight">{f.value}</div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground mt-1">{f.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* BODY 2-koloms */}
    <section className="pb-10 bg-background">
      <div className="container-wide grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 prose-content space-y-4 text-foreground/85 text-sm md:text-base leading-relaxed">
          {description}
        </div>
        {sideInfo && (
          <aside className="md:col-span-1">
            <div className="border border-border bg-card rounded-md p-5 space-y-4">
              {sideInfo}
            </div>
          </aside>
        )}
      </div>
    </section>

    {/* EXTERNE LINKS */}
    {externalLinks.length > 0 && (
      <section className="pb-10 bg-background">
        <div className="container-wide">
          <h2 className="font-display text-xl text-primary-deep mb-1">Praktische Routebegeleiding</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Officiële kaarten, downloads en route-apps van onze partners.
          </p>
          <div className="border-t border-border pt-5 grid md:grid-cols-2 gap-x-8 gap-y-5">
            {externalLinks.map((l) => (
              <div key={l.href} className="space-y-1.5">
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-secondary hover:bg-primary-deep px-5 py-2.5 text-sm font-medium transition-colors rounded-sm"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  {l.label}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <div className="text-xs text-muted-foreground">{l.url}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* CTA — custom slot of default AvailabilityBar */}
    {customCta ?? (
      <AvailabilityBar
        title={ctaTitle}
        description={ctaDescription}
        ctaLabel="Bekijk onze kamers"
      />
    )}

    {/* FOOTER NAV */}
    <section className="py-10 bg-background">
      <div className="container-wide grid grid-cols-1 md:grid-cols-2 gap-3">
        <Link
          to={backHref}
          className="border border-border bg-card p-5 hover:border-primary transition-colors block rounded-md"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">{backLabel}</div>
          <div className="text-sm text-primary">← Terug naar overzicht</div>
        </Link>
        <Link
          to="/overnachten"
          className="border border-border bg-card p-5 hover:border-primary transition-colors block rounded-md"
        >
          <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
            Overnachten op het domein
          </div>
          <div className="text-sm text-primary">Naar overnachten →</div>
        </Link>
      </div>
    </section>
  </Layout>
);
