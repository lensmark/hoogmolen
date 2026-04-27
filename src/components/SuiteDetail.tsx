import { Link, useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { getSuiteBySlug, SUITES } from "@/config/suitesConfig";
import {
  Users, Bed, Bath, Wifi, Check, ArrowRight, MapPin,
  Star, ImageIcon, ChevronRight, Coffee, ParkingSquare,
} from "lucide-react";

/**
 * SuiteDetail — T01 "Verblijf detail" template.
 * 1-on-1 transpilatie van de wireframe-DOM:
 *  • Tier-3 contextcrumb (parent: Suites & kamers › Duplexsuites)
 *  • HERO band met titel + tagline
 *  • 4 stat tiles (Personen | Type | Slaapkamers | Comfort)
 *  • Pricing rail (sticky aside) met externe Boekingsknop
 *  • Kenmerken (highlights) + Faciliteiten (amenities)
 *  • Galerij placeholder (foto + plattegrond)
 *  • FAQ accordion (context: kamer)
 *  • CTA-strip "Boek Suite Ax"
 */
const SuiteDetail = () => {
  const { suite } = useParams();
  const data = getSuiteBySlug(suite ?? "");
  if (!data) return <Navigate to="/overnachten/suites-kamers/duplexsuites" replace />;

  // Sibling-nav voor Tier-3 (alle 6 suites)
  const siblings = SUITES;

  return (
    <Layout>
      {/* ─── TIER-3 CRUMB / SIBLING NAV ─── */}
      <nav aria-label="Suite navigatie" className="border-b border-border bg-surface">
        <div className="container-wide flex items-center gap-1 overflow-x-auto scrollbar-none py-2 text-xs">
          <Link to="/overnachten" className="text-muted-foreground hover:text-primary-deep whitespace-nowrap">Overnachten</Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <Link to="/overnachten/suites-kamers" className="text-muted-foreground hover:text-primary-deep whitespace-nowrap">Suites &amp; kamers</Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <Link to="/overnachten/suites-kamers/duplexsuites" className="text-muted-foreground hover:text-primary-deep whitespace-nowrap">Duplexsuites</Link>
          <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="font-medium text-primary-deep whitespace-nowrap">{data.code} — {data.name}</span>
          <span className="mx-3 h-4 w-px bg-border shrink-0" />
          {siblings.map((s) => (
            <Link
              key={s.id}
              to={`/overnachten/suites-kamers/duplexsuites/${s.slug}`}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                s.slug === data.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary-deep"
              }`}
            >
              {s.code}
            </Link>
          ))}
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative bg-gradient-deep text-secondary py-14 md:py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent))_0%,transparent_55%)]" />
        <div className="relative container-wide">
          <div className="eyebrow text-secondary/70 mb-3">Duplexsuite {data.code}</div>
          <h1 className="heading-display text-secondary mb-4 max-w-4xl">{data.name}</h1>
          <p className="lead text-secondary/85 max-w-2xl">{data.tagline}</p>

          {/* 4 stat tiles — wireframe T01 */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
            <StatTile icon={<Users className="w-4 h-4" />} label="Personen" value={`tot ${data.capacity}`} />
            <StatTile icon={<Bed className="w-4 h-4" />} label="Type" value={data.type} />
            <StatTile icon={<Bath className="w-4 h-4" />} label="Slaapkamers" value={`${data.bedrooms} k. / ${data.bathrooms} bad`} />
            <StatTile icon={<Wifi className="w-4 h-4" />} label="Comfort" value="Wifi • A/C" />
          </div>
        </div>
      </section>

      {/* ─── HOOFDCONTENT ─── */}
      <section className="py-14 md:py-20">
        <div className="container-wide grid lg:grid-cols-3 gap-10 lg:gap-14">
          {/* LEFT — verhaal + kenmerken */}
          <div className="lg:col-span-2 space-y-12">
            {/* Beschrijving */}
            <div>
              <div className="eyebrow mb-3">De suite</div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-5">
                Eeuwenoud comfort, hedendaags geherinterpreteerd
              </h2>
              <div className="space-y-4">
                {data.description.map((p, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{p}</p>
                ))}
              </div>
            </div>

            {/* Slaapindeling */}
            <div>
              <div className="eyebrow mb-3">Slaapindeling</div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-5">
                {data.bedrooms} {data.bedrooms === 1 ? "slaapkamer" : "slaapkamers"}, {data.bathrooms} {data.bathrooms === 1 ? "badkamer" : "badkamers"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.beds.map((b, i) => (
                  <div key={i} className="bg-card border border-border rounded-md p-4 shadow-soft">
                    <div className="text-sm font-medium text-primary-deep">{b.room}</div>
                    <div className="text-xs text-muted-foreground mt-1">{b.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kenmerken (highlights) */}
            <div>
              <div className="eyebrow mb-3">Kenmerken</div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-5">
                Wat deze suite uniek maakt
              </h2>
              <ul className="space-y-3">
                {data.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-foreground">
                    <span className="text-primary mt-1.5 shrink-0">◆</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Faciliteiten */}
            <div>
              <div className="eyebrow mb-3">Faciliteiten</div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-5">
                Inbegrepen in uw verblijf
              </h2>
              <div className="grid sm:grid-cols-2 gap-y-2.5 gap-x-6">
                {data.amenities.map((a) => (
                  <div key={a} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Galerij placeholder (foto + plattegrond) */}
            <div>
              <div className="eyebrow mb-3">Galerij</div>
              <h2 className="heading-section text-2xl md:text-3xl text-primary-deep mb-5">
                Foto&apos;s en plattegrond
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="aspect-[4/3] rounded-md bg-gradient-soft border border-border flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-primary/50" />
                </div>
                <div className="aspect-[4/3] rounded-md bg-secondary border border-border flex items-center justify-center">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Plattegrond</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — pricing rail */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 bg-card border border-border rounded-lg shadow-card p-6 space-y-5">
              {data.guestScore && (
                <div className="flex items-center gap-2 pb-4 border-b border-border">
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium text-primary-deep">{data.guestScore.toFixed(2)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">/ 5 ({data.reviewCount} reviews)</span>
                </div>
              )}

              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">vanaf</div>
                <div className="font-display text-4xl text-primary-deep leading-tight">€{data.pricePerNight}</div>
                <div className="text-xs text-muted-foreground">per nacht • basis 2 personen</div>
              </div>

              <div className="space-y-2 text-xs">
                <Row icon={<Users className="w-3.5 h-3.5" />} label="Capaciteit" value={`tot ${data.capacity} pers.`} />
                <Row icon={<Bed className="w-3.5 h-3.5" />} label="Type" value={data.type} />
                <Row icon={<Coffee className="w-3.5 h-3.5" />} label="Ontbijt" value="Op aanvraag" />
                <Row icon={<Wifi className="w-3.5 h-3.5" />} label="Wifi" value="Inbegrepen" />
                <Row icon={<ParkingSquare className="w-3.5 h-3.5" />} label="Parking" value="Gratis" />
              </div>

              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary-deep text-primary-foreground">
                <a href={data.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Boek Suite {data.code} <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full border-primary-deep text-primary-deep">
                <Link to="/contact">Stel een vraag</Link>
              </Button>

              <div className="pt-4 border-t border-border text-xs text-muted-foreground flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" />
                Hoogmolenweg 15, 3670 Oudsbergen (Ellikom)
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <FAQAccordion context="kamer" title={`Veelgestelde vragen over Suite ${data.code}`} />

      {/* ─── CONFIDENCE / CROSS-SELL ─── */}
      <section className="py-14 md:py-20 bg-secondary/40 border-t border-border">
        <div className="container-wide text-center">
          <div className="eyebrow mb-3">Met groter gezelschap?</div>
          <h2 className="heading-section text-3xl md:text-4xl text-primary-deep mb-4">
            Combineer meerdere suites of boek een vakantiewoning
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-7">
            De zes duplexsuites zijn ook combineerbaar met onze vakantiewoningen Peerdermolen en Watermolen — voor groepen tot 53 gasten op het volledige landgoed.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-deep text-primary-foreground">
              <Link to="/groepsverblijf">Groepsverblijven bekijken</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-deep text-primary-deep">
              <Link to="/overnachten/suites-kamers/duplexsuites">Alle duplexsuites</Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyMobileCTA bookingUrl={data.bookingUrl} label={`Boek Suite ${data.code}`} />
    </Layout>
  );
};

/* ─── Subcomponents ─── */

const StatTile = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="bg-secondary/15 backdrop-blur border border-secondary/25 rounded-md px-4 py-3">
    <div className="flex items-center gap-1.5 text-secondary/70 text-[10px] uppercase tracking-[0.18em]">
      {icon} {label}
    </div>
    <div className="mt-1 text-secondary font-medium text-sm">{value}</div>
  </div>
);

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
    <span className="flex items-center gap-2 text-muted-foreground">{icon} {label}</span>
    <span className="font-medium text-primary-deep">{value}</span>
  </div>
);

export default SuiteDetail;
