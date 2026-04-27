/**
 * /ervaringen — "The Wall of Love" met video-integratie
 *
 * Combineert:
 *  - Hero + Triple Trust strip
 *  - Video-placeholder #1 (full-width, drone-overzicht)
 *  - Masonry-grid van 10 top-reviews met platformbadges
 *  - Video-placeholder #2 (met SongScape zijtekst)
 *  - CTA naar de drie review-platformen
 *
 * SEO: AggregateRating + Review + VideoObject JSON-LD geïnjecteerd in <head>.
 */
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { PageHero } from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Star, ExternalLink, Play } from "lucide-react";

interface Review {
  author: string;
  location?: string;
  date: string;
  platform: "Google" | "Airbnb" | "Booking";
  rating: number;
  title?: string;
  body: string;
}

const REVIEWS: Review[] = [
  {
    author: "Sofie",
    location: "Antwerpen",
    date: "Maart 2026",
    platform: "Google",
    rating: 5,
    title: "Eeuwenoude rust in elke steen",
    body: "Vanaf het moment dat we het domein opreden viel alles van ons af. De Peerdermolen ademt geschiedenis, maar elk comfort zit erin. We sliepen als rozen — letterlijk geen geluid, alleen de beek.",
  },
  {
    author: "Thomas & Lien",
    location: "Gent",
    date: "Februari 2026",
    platform: "Airbnb",
    rating: 5,
    title: "Superhost-niveau, terecht",
    body: "Communicatie was perfect, check-in soepel, het huis nog mooier dan op de foto's. De gastvrouw dacht écht mee — van een lokale bakker-tip tot een extra deken voor op de kille avonden.",
  },
  {
    author: "Familie Vermeulen",
    date: "Januari 2026",
    platform: "Booking",
    rating: 5,
    title: "Erfgoed met hedendaags comfort",
    body: "Eindelijk een plek waar geschiedenis en luxe écht samengaan. Eigen tuin, doordachte details, en een wandeling vanuit de voordeur de Abeekvallei in.",
  },
  {
    author: "Marieke",
    location: "Eindhoven",
    date: "December 2025",
    platform: "Google",
    rating: 5,
    title: "Wereldverblijf voor een teamretreat",
    body: "We waren met 18 collega's. Vergaderzaal, suites, gezamenlijke maaltijden — alles in één hand. Ronald en het team regelden alles tot in de puntjes. Wij komen zeker terug.",
  },
  {
    author: "Jeroen",
    date: "November 2025",
    platform: "Airbnb",
    rating: 5,
    title: "Architectonisch een pareltje",
    body: "Authentieke balken, witgekalkte muren, hedendaags comfort. Geen kitsch, geen overdaad — pure klasse. De duplexsuite voelde als een privé-museum waar je in mag wonen.",
  },
  {
    author: "Anouk & David",
    location: "Rotterdam",
    date: "Oktober 2025",
    platform: "Booking",
    rating: 5,
    title: "Stilte die je hoort",
    body: "Geen wifi gebruikt, geen tv aangezet. Alleen het knetteren van de open haard en het ruisen van de beek. Drie dagen lang. Onbetaalbaar.",
  },
  {
    author: "Familie Janssens",
    date: "Oktober 2025",
    platform: "Google",
    rating: 5,
    title: "Onvergetelijk familieweekend",
    body: "Met 24 mensen, 3 generaties. Het Molenhuys was perfect voor onze gezamenlijke avonden. Kinderen speelden in de tuin, opa en oma genoten van de rust. Logistiek vlekkeloos.",
  },
  {
    author: "Pieter",
    location: "Brussel",
    date: "September 2025",
    platform: "Airbnb",
    rating: 5,
    title: "Hospitality op sterrenniveau",
    body: "Welkomstmand met streekproducten, persoonlijk briefje, en bij vertrek nog koffie aangeboden. Dit is geen verhuur, dit is gastvrijheid in haar zuiverste vorm.",
  },
  {
    author: "Sandrine",
    date: "Augustus 2025",
    platform: "Booking",
    rating: 5,
    title: "Paardrijden vanuit de voordeur",
    body: "Onze paarden hadden hun eigen logies in de Peerdermolen-stallen. Wij konden direct de bossen in. Voor ruiters is dit een uniek adres in België.",
  },
  {
    author: "Karin & Marc",
    location: "Maastricht",
    date: "Juli 2025",
    platform: "Google",
    rating: 5,
    title: "Anno 1500 in 2026 — magisch",
    body: "Je voelt de geschiedenis. De watermolen draait nog. De binnenplaats lijkt uit een schilderij. En toch is alles modern en piekfijn onderhouden. Een zeldzaamheid.",
  },
];

const platformStyles: Record<Review["platform"], { bg: string; text: string; label: string }> = {
  Google: { bg: "bg-[#4285F4]/10", text: "text-[#4285F4]", label: "Google" },
  Airbnb: { bg: "bg-[#FF5A5F]/10", text: "text-[#FF5A5F]", label: "Airbnb" },
  Booking: { bg: "bg-[#003580]/10", text: "text-[#003580]", label: "Booking.com" },
};

/* Luxe video-placeholder met olijfgroene play-overlay */
const VideoPlaceholder = ({ label, poster }: { label: string; poster?: string }) => (
  <div className="relative aspect-video w-full bg-primary-deep rounded-lg overflow-hidden group shadow-elegant">
    {poster && (
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden
      />
    )}
    {/* Subtiele radial accent */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.25)_0%,transparent_70%)]" />

    {/* Play-button overlay — olijfgroen */}
    <div className="absolute inset-0 flex items-center justify-center">
      <button
        type="button"
        aria-label={`Speel video af: ${label}`}
        className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary text-secondary flex items-center justify-center shadow-2xl ring-4 ring-secondary/20 hover:bg-primary-deep hover:scale-110 transition-all duration-300"
      >
        <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-secondary" aria-hidden />
      </button>
    </div>

    {/* Label-strip onderaan */}
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary-deep/95 via-primary-deep/70 to-transparent p-5 md:p-6">
      <div className="text-[10px] uppercase tracking-[0.18em] text-accent/80 mb-1">Video</div>
      <div className="text-base md:text-lg font-display text-secondary leading-tight">{label}</div>
    </div>
  </div>
);

const Ervaringen = () => {
  useEffect(() => {
    document.title = "Reviews & Ervaringen | Landgoed De Hoogmolen — 5/5 Gastenscore";

    const SCRIPT_ID = "ld-json-ervaringen";
    const payload = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "LodgingBusiness",
          name: "Landgoed De Hoogmolen",
          url: "https://hoogmolen.be/ervaringen",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5.0",
            bestRating: "5",
            worstRating: "1",
            reviewCount: "571",
          },
          review: REVIEWS.map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.author },
            reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.body,
            publisher: { "@type": "Organization", name: r.platform },
          })),
        },
        /* VideoObject — Drone-overzicht */
        {
          "@type": "VideoObject",
          name: "Dronebeelden: Landgoed De Hoogmolen in vogelvlucht",
          description:
            "Panoramisch overzicht van de watermolen, de Abeek en de omliggende natuur op het eeuwenoude landgoed.",
          thumbnailUrl: "https://hoogmolen.be/og-drone.jpg",
          uploadDate: "2026-01-15",
          contentUrl: "https://hoogmolen.be/video/drone-overzicht.mp4",
          publisher: { "@type": "Organization", name: "Landgoed De Hoogmolen" },
        },
        /* VideoObject — SongScape sfeerimpressie */
        {
          "@type": "VideoObject",
          name: "Sfeerimpressie door SongScape — Landgoed De Hoogmolen",
          description:
            "Drone- en sfeeropnames van een activiteit op het domein, vastgelegd door SongScape.",
          thumbnailUrl: "https://hoogmolen.be/og-songscape.jpg",
          uploadDate: "2026-02-20",
          contentUrl: "https://hoogmolen.be/video/songscape.mp4",
          publisher: { "@type": "Organization", name: "SongScape" },
        },
      ],
    };

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(payload);

    return () => {
      script?.remove();
    };
  }, []);

  return (
    <Layout>
      <PageHero
        eyebrow="Wall of Love"
        title="Wat onze gasten beleven"
        subtitle="Gecertificeerde 100% gastenscore (5/5) voor Google in 2026."
        align="center"
      />

      {/* ─────────── TRIPLE TRUST STRIP ─────────── */}
      <section className="container-wide -mt-8 md:-mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { score: "5.0", label: "Google 2026", meta: "100% gastenscore" },
            { score: "4.97", label: "Airbnb", meta: "571+ reviews · Superhost" },
            { score: "9.7", label: "Booking.com", meta: "171 reviews · Uitzonderlijk" },
          ].map((s) => (
            <div
              key={s.label}
              className="text-center bg-surface border border-border shadow-soft rounded-md py-5 px-3 border-l-4 border-l-primary"
            >
              <div className="text-3xl font-display text-primary-deep">{s.score}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-primary-deep/80 mt-1">{s.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.meta}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────── VIDEO PLACEHOLDER #1 — Drone full-width ─────────── */}
      <section className="bg-secondary/40 py-16 md:py-20 mt-16 md:mt-20">
        <div className="container-wide">
          <div className="max-w-3xl mb-8">
            <div className="eyebrow text-primary mb-2">Beeld · Drone</div>
            <h2 className="heading-section text-primary-deep">
              Het landgoed in vogelvlucht
            </h2>
            <p className="lead text-foreground/80 mt-3">
              Een panoramisch overzicht over de watermolen, de Abeek en de omliggende natuur —
              vastgelegd vanuit de lucht.
            </p>
          </div>
          <VideoPlaceholder label="Dronebeelden: Het Landgoed De Hoogmolen in vogelvlucht" />
        </div>
      </section>

      {/* ─────────── REVIEW MASONRY GRID ─────────── */}
      <section className="container-wide py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow text-primary mb-2">571+ Gastervaringen</div>
          <h2 className="heading-section text-primary-deep">In hun eigen woorden</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {REVIEWS.map((r, i) => {
            const style = platformStyles[r.platform];
            return (
              <article
                key={i}
                className="break-inside-avoid mb-6 bg-surface border border-border rounded-lg p-6 shadow-soft hover:shadow-lg transition-shadow"
              >
                <header className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" aria-hidden />
                    ))}
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 rounded-sm ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                </header>

                {r.title && (
                  <h3 className="font-display text-xl text-primary-deep leading-snug mb-2">
                    "{r.title}"
                  </h3>
                )}
                <p className="text-sm leading-relaxed text-foreground/85 mb-4">{r.body}</p>

                <footer className="text-xs text-muted-foreground border-t border-border/50 pt-3">
                  <span className="font-medium text-primary-deep">{r.author}</span>
                  {r.location && <> · {r.location}</>}
                  <> · {r.date}</>
                </footer>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─────────── VIDEO PLACEHOLDER #2 — SongScape met zijtekst ─────────── */}
      <section className="bg-secondary/40 py-16 md:py-20">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <VideoPlaceholder label="Sfeerimpressie door SongScape" />
          </div>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="eyebrow text-primary mb-2">Beeld · SongScape</div>
            <h2 className="heading-section text-primary-deep mb-4">
              De magie van het samenkomen
            </h2>
            <p className="lead text-foreground/85 mb-4">
              Beleef wat woorden niet vatten. Drone- en sfeeropnames van een activiteit op het
              domein, gevangen in beeld.
            </p>
            <p className="text-sm text-foreground/70 italic">
              Met dank aan <span className="font-semibold text-primary-deep">SongScape</span> voor
              de prachtige vastlegging van ons landgoed in actie.
            </p>
          </div>
        </div>
      </section>

      {/* ─────────── CTA — Zelf delen ─────────── */}
      <section className="bg-accent/30 py-16 md:py-20">
        <div className="container-wide text-center max-w-3xl">
          <h2 className="heading-section text-primary-deep mb-4">Zelf uw ervaring delen?</h2>
          <p className="lead text-foreground/80 mb-8">
            Heeft u bij ons verbleven? Een review is het mooiste compliment — en helpt
            toekomstige gasten hun keuze te maken.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="bg-[#4285F4] hover:bg-[#4285F4]/90 text-white">
              <a href="https://g.page/r/landgoed-de-hoogmolen/review" target="_blank" rel="noopener noreferrer">
                Review op Google <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button asChild size="lg" className="bg-[#FF5A5F] hover:bg-[#FF5A5F]/90 text-white">
              <a href="https://www.airbnb.com/users/show/hoogmolen" target="_blank" rel="noopener noreferrer">
                Review op Airbnb <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
            <Button asChild size="lg" className="bg-[#003580] hover:bg-[#003580]/90 text-white">
              <a href="https://www.booking.com/hotel/be/landgoed-de-hoogmolen.html" target="_blank" rel="noopener noreferrer">
                Review op Booking <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Ervaringen;
