import { Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { getUnitBySlug } from "@/config/unitsConfig";
import { CFImage } from "@/components/CFImage";
import { CFSlider } from "@/components/CFSlider";
import { cfImagesForProperty } from "@/config/cloudflareImagesConfig";
import {
  Users, Bed, Bath, Check, ArrowRight, Wifi, Coffee, Car,
  Sparkles, Trees, Beer, Gamepad2, Utensils, Home, BedDouble,
} from "lucide-react";

/**
 * PEERDERMOLEN PLUS — pixel-aligned page
 * Bron: gids p.10 (configuratie & bedindeling) + p.21 (prijzen).
 * Pad: /accommodaties/peerdermolen-plus
 */
const PeerdermolenPlus = () => {
  const unit = getUnitBySlug("peerdermolen-plus");
  if (!unit) return <Navigate to="/overnachten" replace />;

  return (
    <Layout transparentHeader>
      {/* HERO */}
      <section className="relative min-h-[78vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-deep ken-burns" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary-deep/40 to-primary-deep/30" />
        <div className="relative container-wide pb-16 md:pb-24 pt-32 text-secondary">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/15 backdrop-blur border border-secondary/20 text-[11px] uppercase tracking-[0.2em] mb-6">
            <Sparkles className="w-3 h-3" /> Plus-formule · met Molenhuys
          </div>
          <h1 className="heading-display text-secondary mb-4 max-w-3xl">
            Peerdermolen Plus
          </h1>
          <p className="lead text-secondary/90 max-w-2xl mb-8">
            De volledige linkerwoning, de aangrenzende duplexsuite én exclusieve toegang tot het sfeervolle Molenhuys —
            voor groepen van 13 tot 20 gasten, in privacy en stijl.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { icon: Users, l: "tot 20 gasten" },
              { icon: Bed, l: "7 slaapkamers" },
              { icon: Bath, l: "7 badkamers" },
              { icon: Home, l: "1 woning + 2 suites" },
            ].map(({ icon: Icon, l }) => (
              <span key={l} className="inline-flex items-center gap-1.5 bg-secondary/15 backdrop-blur border border-secondary/20 px-3 py-1.5 rounded-full text-xs">
                <Icon className="w-3.5 h-3.5" /> {l}
              </span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-glow text-primary-foreground">
              <a href={unit.bookingUrl} target="_blank" rel="noopener noreferrer">
                Bekijk beschikbaarheid <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <a href="#prijzen">Bekijk tarieven</a>
            </Button>
          </div>
        </div>
      </section>

      {/* INTRO + KENGETALLEN */}
      <section className="py-20 md:py-28">
        <div className="container-narrow grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="eyebrow mb-4">Over deze formule</div>
            <h2 className="heading-section text-primary-deep mb-6">
              Privacy van een eigen woning,<br />
              de gezelligheid van een eigen ontmoetingsplek.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Vakantiewoning Peerdermolen Plus omvat de volledige linkerwoning, de daarnaast gelegen duplexsuite 5-6
                én ontspanningsruimte het Molenhuys — tot 20 personen. De accommodaties beschikken elk over een eigen
                privé-ingang, privé-tuin alsook een privé overdekt terras en zijn exclusief voor jouw gebruik.
              </p>
              <p>
                Op het overdekte terras serveert u 's avonds aperitieven terwijl de Abeek murmelend voorbij de molen
                stroomt. Wanneer het hele gezelschap samenkomt, wandelt u over naar het Molenhuys: een professioneel
                uitgeruste keuken, ingerichte bar met tap, ping-pong-, kicker- en darttafel.
              </p>
            </div>
          </div>
          <aside className="surface-card p-6 bg-accent/30 border-accent self-start">
            <div className="eyebrow mb-3">Configuratie</div>
            <ul className="space-y-3 text-sm text-primary-deep">
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Vakantiewoningen</span><strong>1</strong></li>
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Duplexsuites</span><strong>2 (nr. 5 + 6)</strong></li>
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Ontspanningsruimte</span><strong>Molenhuys</strong></li>
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Slaapkamers</span><strong>7 · elk eigen badkamer</strong></li>
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Tweepersoonsbedden</span><strong>5</strong></li>
              <li className="flex justify-between border-b border-primary-deep/10 pb-2"><span>Eenpersoonsbedden</span><strong>8</strong></li>
              <li className="flex justify-between"><span>Zetelbed (1m60)</span><strong>1</strong></li>
            </ul>
          </aside>
        </div>
      </section>

      {/* GALLERY — Cloudflare Images, dynamisch o.b.v. slug peerdermolen-plus */}
      <section className="pb-12 md:pb-16">
        <div className="container-wide">
          {(() => {
            const { overview, thumbs } = cfImagesForProperty("peerdermolen-plus");
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 h-[480px] md:h-[520px]">
                <CFSlider
                  ids={overview}
                  alt="Peerdermolen Plus — overzicht"
                  className="col-span-2 md:col-span-2 row-span-2 h-full"
                />
                {thumbs.map((thumb) => (
                  <div
                    key={thumb.id}
                    className="relative overflow-hidden rounded-md bg-gradient-soft"
                  >
                    <CFImage
                      id={thumb.id}
                      alt={thumb.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* SLAAPINDELING */}
      <section className="py-20 bg-secondary/40 border-y border-border">
        <div className="container-wide">
          <div className="text-center mb-12">
            <div className="eyebrow mb-3">Slaapindeling</div>
            <h2 className="heading-section text-primary-deep">7 kamers · 7 badkamers · maximale rust</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Vakantiewoning Peerdermolen", rooms: [
                "Slaapkamer 1 — 1 tweepersoonsbed",
                "Slaapkamer 2 — 1 tweepersoonsbed",
                "Slaapkamer 3 — 1 tweepersoonsbed",
                "Slaapkamer 4 — 1 tweepersoonsbed",
                "Slaapkamer 5 — 1 tweepersoonsbed",
                "Woonkamer 2 — 1 zetelbed (1m60)",
              ]},
              { title: "Duplexsuite 5", rooms: [
                "Slaapkamer 1 — 2 eenpersoonsbedden",
              ]},
              { title: "Duplexsuite 6", rooms: [
                "Slaapkamer 2 — 6 eenpersoonsbedden",
              ]},
            ].map((g) => (
              <article key={g.title} className="surface-card p-6">
                <div className="font-display text-xl text-primary-deep mb-4">{g.title}</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {g.rooms.map((r) => (
                    <li key={r} className="flex gap-2 items-start">
                      <Bed className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ONZE KAMERS IN DE PEERDERMOLEN — links naar B1-B5 sub-units */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide">
          <div className="text-center mb-10">
            <div className="eyebrow mb-3">Per kamer ontdekken</div>
            <h2 className="heading-section text-primary-deep">
              Onze Kamers in de Peerdermolen
            </h2>
            <p className="text-muted-foreground text-sm mt-3 max-w-2xl mx-auto">
              Elk van de vijf slaapkamers heeft een eigen karakter, eigen badkamer en eigen sfeer.
              Bekijk hieronder hoe elke kamer is ingericht.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { token: "b1", slug: "deluxe-kamer-b1", label: "Kamer B1", sub: "Deluxe · 2 pers." },
              { token: "b2", slug: "deluxe-kamer-b2", label: "Kamer B2", sub: "Deluxe · 2 pers." },
              { token: "b3", slug: "kamer-b3", label: "Kamer B3", sub: "Klassiek · 2 pers." },
              { token: "b4", slug: "kamer-b4", label: "Kamer B4", sub: "Klassiek · 2 pers." },
              { token: "b5", slug: "suite-b5", label: "Suite B5", sub: "Suite · 2-3 pers." },
            ].map((room) => (
              <Link
                key={room.slug}
                to={`/overnachten/suites-kamers/kamers/${room.slug}`}
                className="group surface-card overflow-hidden hover:shadow-elegant transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gradient-soft">
                  <CFImage
                    id={`hoogmolen-verblijf-peerdermolen-kamer-${room.token}-bed-01`}
                    alt={`${room.label} — slaapkamer in Peerdermolen`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <div className="font-display text-lg text-primary-deep">{room.label}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{room.sub}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                    Bekijk kamer <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* INBEGREPEN */}
      <section className="py-20 md:py-28">
        <div className="container-wide">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="eyebrow mb-3">In de woning & suites</div>
              <h2 className="heading-section text-primary-deep mb-6">Alle voorzieningen</h2>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm">
                {[
                  "Volledig ingerichte keuken",
                  "Gezellige eetkamer",
                  "Privé overdekte terrassen",
                  "Privé tuin",
                  "Privé-ingang per accommodatie",
                  "Bedlinnen & handdoeken inbegrepen",
                  "Verzorgingsproducten in badkamer",
                  "Airconditioning in alle kamers",
                  "High-speed wifi",
                  "Gratis parking",
                ].map((a) => (
                  <li key={a} className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-primary-deep/85">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-3">Exclusief: het Molenhuys</div>
              <h2 className="heading-section text-primary-deep mb-6">Uw eigen ontmoetingsruimte</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Een authentiek molengebouw, omgebouwd tot stijlvolle ontspanningsruimte. Hier komt het hele gezelschap
                samen — voor een aperitief, een kookavond of een gezellige spelavond.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Beer, l: "Ingerichte bar (selfservice)" },
                  { icon: Utensils, l: "Professionele keuken" },
                  { icon: Gamepad2, l: "Ping-pong, kicker, darts" },
                  { icon: Trees, l: "Speeltuin & springkussen" },
                ].map(({ icon: Icon, l }) => (
                  <div key={l} className="surface-card p-4 bg-accent/20">
                    <Icon className="w-5 h-5 text-primary mb-2" />
                    <div className="text-sm text-primary-deep font-medium">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRIJZEN — exact gids p.21 */}
      <section id="prijzen" className="py-20 bg-gradient-deep text-secondary">
        <div className="container-narrow">
          <div className="text-center mb-10">
            <div className="eyebrow text-secondary/70 mb-3">Tarieven · vanaf 13 personen</div>
            <h2 className="heading-section text-secondary">
              Transparante prijzen — geen verrassingen.
            </h2>
            <p className="text-secondary/70 text-sm mt-3">
              Inclusief beddengoed, badgoed en huishoudpakket. Standaard weekend = vrijdag 15u00 → zondag 10u00.
            </p>
          </div>
          <div className="bg-secondary/10 backdrop-blur border border-secondary/20 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/15">
                <tr>
                  <th className="text-left p-4 font-medium text-secondary">Tarief</th>
                  <th className="text-right p-4 font-medium text-secondary">Basisprijs (13 p.)</th>
                  <th className="text-right p-4 font-medium text-secondary">Extra p.p.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary/10">
                <tr>
                  <td className="p-4">Weekdag</td>
                  <td className="p-4 text-right font-display text-xl">€ 380</td>
                  <td className="p-4 text-right">€ 40</td>
                </tr>
                <tr className="bg-secondary/5">
                  <td className="p-4">Weekend</td>
                  <td className="p-4 text-right font-display text-xl">€ 700</td>
                  <td className="p-4 text-right">€ 40</td>
                </tr>
                <tr>
                  <td className="p-4">Cleaning fee</td>
                  <td className="p-4 text-right font-display text-xl">€ 450</td>
                  <td className="p-4 text-right text-secondary/60">eenmalig</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-3 text-xs text-secondary/75">
            <div className="bg-secondary/10 rounded-md p-3"><strong className="text-secondary">Paard / nacht</strong> · € 25 (eerste), € 10 daarna</div>
            <div className="bg-secondary/10 rounded-md p-3"><strong className="text-secondary">Kinderbedje</strong> · € 10 / verblijf</div>
          </div>
          <p className="text-xs text-secondary/60 mt-4 text-center italic">
            Prijzen kunnen variëren tijdens feestdagen, schoolvakanties, verlengde weekends en brugdagen.
          </p>
          <div className="mt-10 text-center">
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <a href={unit.bookingUrl} target="_blank" rel="noopener noreferrer">
                Reserveer Peerdermolen Plus <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* AMENITIES STRIP */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="container-wide">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Wifi, l: "High-speed wifi" },
              { icon: Car, l: "Gratis parking" },
              { icon: Coffee, l: "Nespresso & filterkoffie" },
              { icon: Sparkles, l: "Bedlinnen & verzorging" },
            ].map(({ icon: Icon, l }) => (
              <div key={l} className="flex flex-col items-center text-center p-5">
                <Icon className="w-7 h-7 text-primary mb-3" />
                <div className="text-sm font-medium text-primary-deep">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQAccordion context="overnachten" title="Veelgestelde vragen" />

      <StickyMobileCTA bookingUrl={unit.bookingUrl} label={`Boek Peerdermolen Plus`} />
    </Layout>
  );
};

export default PeerdermolenPlus;
