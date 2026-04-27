import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Wifi, ScreenShare, Coffee, Camera, Presentation, Car, Pencil, Droplet, Brain, Trees,
  ArrowRight, Check,
} from "lucide-react";
import { CONTACT } from "@/config/navigationConfig";
import { FastFacts } from "@/components/FastFacts";
import { FAQAccordion } from "@/components/FAQAccordion";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";

const VERGADEREN_HERO_IDS = [
  "hoogmolen-verblijf-peerdermolen",
  "hoogmolen-verblijf-watermolen",
  "hoogmolen-verblijf-suite-a1",
  "hoogmolen-verblijf-suite-a2",
  "hoogmolen-verblijf-suite-a3",
  "hoogmolen-verblijf-suite-a4",
];

/**
 * VERGADEREN — pixel-aligned op wireframe-sectie #vergaderen
 * Content: gids p.40-43 ("Brainfood", 5 arrangementen 4u→48u).
 * Bron: De_Hoogmolen_Informatiegids_2025_06_29 + hoogmolen-volledig_2.html
 */

const ARRANGEMENTS = [
  {
    id: "4u",
    title: "4-uurs vergaderarrangement",
    duration: "4 uur",
    price: "€31,50",
    teaser: "Alles wat je nodig hebt voor een korte meeting. Onbeperkt koffie, thee en mineraalwater.",
    catering: "Koffie/thee · water · mints",
    includes: [
      "Vergaderzaal, opstelling naar keuze",
      "Flip-over met stiften en papier",
      "Green screen & projector",
      "Schrijfmateriaal en papier",
      "Onbeperkt koffie, thee, water, meeting mints",
      "High-speed wifi",
      "Gratis parking",
    ],
  },
  {
    id: "8u",
    title: "8-uurs vergaderarrangement",
    duration: "8 uur",
    price: "€51,50",
    teaser: "Een hele dag verzorgd vergaderen, inclusief luxe broodjeslunch.",
    catering: "Luxe broodjeslunch + dranken",
    includes: [
      "Alles van het 4-uurs arrangement",
      "Luxe broodjeslunch",
      "Lunchbuffet of à-la-carte op aanvraag",
    ],
  },
  {
    id: "12u",
    title: "12-uurs vergaderarrangement",
    duration: "12 uur",
    price: "€110,00",
    teaser: "Aan je meeting nog een avonddeel toevoegen? Inclusief 3-gangen diner (excl. drank).",
    catering: "Broodjeslunch + 3-gangen diner",
    includes: [
      "Alles van het 8-uurs arrangement",
      "3-gangen diner of buffet bij ‘De Dorpermolen’ of ‘’t Pleintje’",
    ],
  },
  {
    id: "24u",
    title: "24-uurs vergaderarrangement",
    duration: "24 uur",
    price: "€225,00",
    teaser: "Volledig verzorgd: lunch, diner, één overnachting op het 5-sterren domein en ontbijtmand.",
    catering: "Lunch + diner + ontbijtmand",
    includes: [
      "Alles van het 12-uurs arrangement",
      "Eén overnachting op het domein",
      "Ontbijtmand",
    ],
    featured: true,
  },
  {
    id: "48u",
    title: "48-uurs vergaderarrangement",
    duration: "48 uur",
    price: "€450,00",
    teaser: "Twee dagen ontspannen vergaderen — ideaal voor meerdaagse trainingen of brainstormsessies.",
    catering: "2× lunch · 2× diner · ontbijtmanden",
    includes: [
      "Alles van het 24-uurs arrangement, twee dagen",
      "Yealink Meetingboard + dual eye camera (hybride meetings)",
      "Twee overnachtingen op het 5-sterren domein",
      "Twee ontbijtmanden",
    ],
  },
];

const FACILITIES = [
  { icon: Presentation, label: "Yealink Meetingboard" },
  { icon: Camera, label: "Dual-eye camerasysteem" },
  { icon: ScreenShare, label: "Green screen + projector" },
  { icon: Pencil, label: "Flip-over + schrijfmateriaal" },
  { icon: Wifi, label: "High-speed wifi" },
  { icon: Coffee, label: "Onbeperkt koffie & thee" },
  { icon: Droplet, label: "Water + mints inbegrepen" },
  { icon: Car, label: "Gratis parking" },
];

const Vergaderen = () => (
  <Layout>
    {/* HERO — wireframe h-lg */}
    <section className="relative bg-gradient-deep text-secondary overflow-hidden">
      <div className="absolute inset-0">
        <UnitGallerySlider
          slug="vergaderen-hero"
          extraLocationIds={VERGADEREN_HERO_IDS}
          alt="Vergaderen op Landgoed De Hoogmolen"
          placeholderLabel=""
          aspectClass="h-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/40 to-transparent pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-deep/65 via-primary-deep/25 to-transparent pointer-events-none" aria-hidden />
      <div className="relative container-wide py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="eyebrow text-secondary/70 mb-4">Zakelijk · B2B · tot 16 personen</div>
          <h1 className="heading-display text-secondary mb-5">
            Vergaderen in het groen<br />
            <span className="italic font-light">van Limburg.</span>
          </h1>
          <p className="lead text-secondary/85 max-w-2xl mb-8">
            Huiselijke setting · professionele technologie · midden in Nationaal Park Hoge Kempen.
            Vijf formules van 4 tot 48 uur, vanaf 8 personen.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <Link to="/vergader-offerte">Vraag offerte aan</Link>
            </Button>
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <a href="#arrangementen">Bekijk formules</a>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-secondary hover:bg-secondary/15">
              <a href="#faciliteiten">Faciliteiten →</a>
            </Button>
          </div>
        </div>
      </div>
    </section>

    <FastFacts />

    {/* HIGHLIGHT-BOX — wireframe */}
    <section className="py-12 bg-surface border-b border-border">
      <div className="container-narrow">
        <div className="surface-card p-6 md:p-8 bg-accent/30 border-accent">
          <div className="font-display text-xl text-primary-deep mb-2">Vergaderruimte op Landgoed De Hoogmolen</div>
          <p className="text-sm text-primary-deep/85 leading-relaxed">
            Molenhuis aan de Abeek · zicht op bos en water · overdekt terras · leefgebied van bevers.
            Capaciteit: <strong>tot 16 personen</strong> · alle formules vanaf 8 personen · prijzen p.p. excl. btw.
          </p>
        </div>
      </div>
    </section>

    {/* INTRO + WIST JE DAT — gids p.40 */}
    <section className="py-20 md:py-28">
      <div className="container-narrow grid lg:grid-cols-2 gap-12 items-start">
        <div>
          <div className="eyebrow mb-4">De ruimte</div>
          <h2 className="heading-section text-primary-deep mb-6">
            Ontsnap aan de traditionele vergaderzaal.
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Wordt omgeven door rust en kalmte van de natuur en ontdek Landgoed De Hoogmolen — een authentieke locatie
              op het 5★ landgoed van een eeuwenoude watermolen, te midden van Nationaal Park Hoge Kempen.
            </p>
            <p>
              De vergaderruimte voor 16 personen biedt diverse mogelijkheden. Werk samen aan de grote vergadertafel in
              de woonkamer of kies voor een informele setting in het salon. Neem tussendoor pauze op het overdekte
              terras of maak een verfrissende wandeling in het bos.
            </p>
          </div>
        </div>
        <aside className="surface-card p-8 bg-secondary/60 border-accent">
          <div className="flex items-start gap-3 mb-3">
            <Brain className="w-6 h-6 text-primary shrink-0 mt-1" />
            <div>
              <div className="eyebrow mb-2">Wist je dat …</div>
              <p className="text-primary-deep leading-relaxed">
                … omgeven worden door natuur niet alleen stress vermindert, maar ook het oplossingsvermogen,
                concentratievermogen én creatieve denkprocessen stimuleert? Niet te missen bij een vergadering.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>

    {/* OVERZICHTSTABEL — exact uit wireframe */}
    <section id="arrangementen" className="py-16 bg-secondary/40 border-y border-border">
      <div className="container-wide">
        <div className="text-center mb-10">
          <div className="eyebrow mb-3">In één oogopslag</div>
          <h2 className="heading-section text-primary-deep">Vergaderformules · vanaf 8 personen, p.p. excl. btw</h2>
        </div>
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-deep text-secondary">
                <tr>
                  <th className="text-left p-4 font-medium">Formule</th>
                  <th className="text-left p-4 font-medium">Duur</th>
                  <th className="text-right p-4 font-medium">Vanaf p.p.</th>
                  <th className="text-left p-4 font-medium">Catering inbegrepen</th>
                  <th className="text-left p-4 font-medium">Overnachting</th>
                </tr>
              </thead>
              <tbody>
                {ARRANGEMENTS.map((a, i) => (
                  <tr key={a.id} className={i % 2 === 1 ? "bg-secondary/40" : ""}>
                    <td className="p-4 font-medium text-primary-deep">{a.title.replace(" vergaderarrangement", "")}</td>
                    <td className="p-4 text-muted-foreground">{a.duration}</td>
                    <td className="p-4 text-right font-display text-lg text-primary">{a.price}</td>
                    <td className="p-4 text-muted-foreground">{a.catering}</td>
                    <td className="p-4 text-muted-foreground">{a.id === "24u" ? "1 nacht op domein" : a.id === "48u" ? "2 nachten op domein" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    {/* DETAILKAARTEN PER ARRANGEMENT */}
    <section className="py-20 md:py-28">
      <div className="container-wide">
        <div className="mb-10">
          <div className="eyebrow mb-3">Kies de formule die past bij jouw wensen</div>
          <h2 className="heading-section text-primary-deep">
            Je hoeft niet te kiezen tussen efficiëntie en inspiratie.
          </h2>
          <p className="lead max-w-3xl mt-4">
            In deze bijzondere vergaderlocatie krijg je het beste van beide werelden: een productieve werkomgeving
            met alle voordelen van de natuur om je heen.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARRANGEMENTS.map((a) => (
            <article
              key={a.id}
              className={`surface-card p-7 flex flex-col ${a.featured ? "ring-2 ring-primary border-primary" : ""}`}
            >
              {a.featured && (
                <div className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-3">
                  Meest gekozen
                </div>
              )}
              <div className="font-display text-2xl text-primary-deep">{a.title}</div>
              <div className="mt-2 text-primary font-medium">Vanaf 8 personen · vanaf {a.price} p.p.</div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{a.teaser}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {a.includes.map((x) => (
                  <li key={x} className="flex gap-2 items-start">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-primary-deep/85">{x}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline" className="mt-6 border-primary-deep text-primary-deep">
                <Link to={`/vergader-offerte?formule=${a.id}`}>
                  Aanvragen <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* BRAINFOOD */}
    <section className="py-20 bg-gradient-deep text-secondary">
      <div className="container-narrow text-center">
        <div className="eyebrow text-secondary/70 mb-4">Brainfood</div>
        <h2 className="heading-section text-secondary mb-6">
          Wij ontzorgen je volledig op het vlak van catering.
        </h2>
        <p className="lead text-secondary/85 max-w-2xl mx-auto mb-8">
          Van een vers ontbijt tot een luxe broodjeslunch en smakelijke versnaperingen.
          's Avonds geniet je van een diner bij één van de gezelligste brasserieën in de buurt:
          <em> De Dorpermolen</em> of <em>'t Pleintje</em>.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 text-left">
          {[
            { t: "Basis (alle formules)", s: "Inbegrepen", d: "Koffie/thee · water · mints · frisdrank op nacalculatie." },
            { t: "Brainfood extras", s: "Optioneel · excl. btw", d: "Ontbijtmand · koffiekoeken · vers fruit · cake · notenmix · lunch op maat." },
            { t: "Diner & overnachting", s: "24u en 48u formules", d: "3-gangen diner bij lokale brasserieën · overnachting in vakantiewoningen of kamers." },
          ].map((c) => (
            <div key={c.t} className="bg-secondary/10 backdrop-blur border border-secondary/20 rounded-md p-5">
              <div className="font-display text-lg text-secondary">{c.t}</div>
              <div className="text-xs text-secondary/60 mt-1">{c.s}</div>
              <p className="text-sm text-secondary/85 mt-3 leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* FACILITEITEN */}
    <section id="faciliteiten" className="py-20 md:py-28">
      <div className="container-wide">
        <div className="text-center mb-12">
          <div className="eyebrow mb-3">Technologie & faciliteiten</div>
          <h2 className="heading-section text-primary-deep">Alles wat een productieve dag vraagt.</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FACILITIES.map(({ icon: Icon, label }) => (
            <div key={label} className="surface-card p-6 flex flex-col items-center text-center">
              <Icon className="w-7 h-7 text-primary mb-3" />
              <div className="text-sm font-medium text-primary-deep">{label}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 surface-card p-6 md:p-8 bg-secondary/40 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Trees className="w-6 h-6 text-primary" />
            <div>
              <div className="font-display text-lg text-primary-deep">Vergaderen tot in de late uurtjes?</div>
              <p className="text-sm text-muted-foreground">Blijf overnachten in één van onze vakantiewoningen of duplexsuites op het landgoed.</p>
            </div>
          </div>
          <Button asChild className="bg-primary hover:bg-primary-deep text-primary-foreground shrink-0">
            <Link to="/overnachten">Bekijk overnachtingen</Link>
          </Button>
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 bg-secondary/40 border-t border-border">
      <div className="container-narrow text-center">
        <h2 className="heading-section text-primary-deep mb-4">Klaar voor een vergadering met karakter?</h2>
        <p className="lead mb-8">Stuur ons je wensen en je ontvangt binnen 24u een offerte op maat.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary-deep text-primary-foreground">
            <Link to="/vergader-offerte">Vraag offerte aan</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-deep text-primary-deep">
            <a href={`tel:${CONTACT.phone}`}>Bel {CONTACT.phone}</a>
          </Button>
        </div>
      </div>
    </section>

    <FAQAccordion context="praktisch" />
  </Layout>
);

export default Vergaderen;
