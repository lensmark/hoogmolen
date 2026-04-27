/**
 * Molengeschiedenis — "The Heritage & Nature Grid"
 *
 * Museale, rustige uitstraling met:
 *  - Hero met sepia-naar-kleur fade
 *  - Verticale 5-tijdperken tijdlijn (1500 → nu)
 *  - Status-grid met beschermde statuten (Natura 2000, Monument, …)
 */
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { HistoryTabs } from "@/components/history/HistoryTabs";
import { StatusWall } from "@/components/history/StatusWall";

interface Era {
  year: string;
  title: string;
  body: string;
}

const ERAS: Era[] = [
  {
    year: "1500",
    title: "De Oorsprong",
    body:
      "Eerste schriftelijke vermelding van de molen aan de Abeek als eigendom van de Heer van Peer. Eeuwenlang het kloppende economische hart van de regio: graan werd hier gemalen voor wijde omtrek.",
  },
  {
    year: "1828",
    title: "De Verstening",
    body:
      "Bouw van de huidige bakstenen muren. De muurankers met jaartal 1828 sieren tot vandaag de gevel — stille getuigen van een ambachtelijke heropleving.",
  },
  {
    year: "1913 – 1980",
    title: "Het Ambacht",
    body:
      "Drie generaties van de familie Leyssen waren de laatste beroepsmolenaars. Hun vakmanschap, geduld en verbondenheid met het water vormen de ziel die we vandaag in elk hoekje proeven.",
  },
  {
    year: "1995",
    title: "Officiële Erkenning",
    body:
      "De molen wordt beschermd als Monument en het omliggende erf als Dorpsgezicht. Een formele bevestiging van wat de generaties vóór ons al lang wisten: dit is een uitzonderlijke plek.",
  },
  {
    year: "2016 – nu",
    title: "Duurzame Toekomst",
    body:
      "Installatie van een waterkrachtcentrale op de oorspronkelijke molenas — energie uit dezelfde stroom die hier al vijf eeuwen ruist. Tegelijk transformeert het domein tot een vijf-sterren landgoed waar erfgoed en hospitality elkaar in stilte ontmoeten.",
  },
];


const Geschiedenis = () => (
  <Layout>
    <PageHero
      eyebrow="Erfgoed"
      title="Vijf Eeuwen Karakter aan de Abeek"
      subtitle="Een reis door de tijd op Landgoed De Hoogmolen in Oudsbergen."
      align="center"
      size="compact"
    />
    <HistoryTabs />

    {/* ───── Openings-citaat (sober, geen placeholder-image) ───── */}
    <section className="bg-background border-b border-border/40">
      <div className="container-narrow py-8 md:py-10 text-center">
        <p className="font-serif italic text-primary-deep text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
          "De molen heeft de eeuwen overleefd doordat hij zich telkens opnieuw
          uitvond — zonder ooit zijn ziel te verliezen."
        </p>
      </div>
    </section>

    {/* ───── Tijdlijn ───── */}
    <section className="py-12 md:py-16 bg-background">
      <div className="container-narrow">
        <div className="text-center mb-10">
          <div className="eyebrow text-primary-deep/70 mb-2">Tijdlijn</div>
          <h2 className="heading-section text-primary-deep">
            Vijf tijdperken, één plek
          </h2>
        </div>

        <ol className="relative border-l-2 border-primary/30 pl-8 md:pl-12 space-y-14">
          {ERAS.map((era, idx) => (
            <li key={era.year} className="relative">
              <span
                className="absolute -left-[42px] md:-left-[54px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-background"
                aria-hidden
              />
              <div className="font-serif text-3xl md:text-4xl text-primary-deep tracking-tight">
                {era.year}
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-foreground mt-1 mb-3">
                {era.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-prose">
                {era.body}
              </p>
              {idx === ERAS.length - 1 && (
                <div className="mt-4 inline-block text-xs uppercase tracking-[0.2em] text-primary-deep/70 border border-primary/30 px-3 py-1 rounded-full">
                  Vandaag
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>

    {/* ───── Status Wall (gedeeld component) ───── */}
    <StatusWall />
  </Layout>
);

export default Geschiedenis;
