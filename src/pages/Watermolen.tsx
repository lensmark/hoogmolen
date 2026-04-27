/**
 * Watermolen — vakantiewoning voor 17 personen.
 * 1-op-1 transpilatie van wireframe-block #watermolen uit hoogmolen-volledig_2.html.
 * DOM-structuur: hero (h-lg) → specs (s4) → price-blk → gallery3 → pros → faq → cta-bar.
 * Classes vertaald naar Tailwind semantic tokens (zie docs/project-rules.md §2).
 */
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { Button } from "@/components/ui/button";
import { FAQAccordion } from "@/components/FAQAccordion";
import { CONTACT } from "@/config/navigationConfig";
import { Home, Bed, Bath, MapPin } from "lucide-react";
import heroImg from "@/assets/hero-estate.jpg";
import { UnitGallerySlider } from "@/components/UnitGallerySlider";
import { PropertyPhotoGrid } from "@/components/property/PropertyPhotoGrid";
import { useUnitGallery } from "@/hooks/useUnitGallery";
import { locationIdsForSlug } from "@/lib/locationId";

const SPECS = [
  { icon: Home, value: "17", label: "Personen" },
  { icon: Bed, value: "5", label: "Slaapkamers" },
  { icon: Bath, value: "5", label: "Badkamers" },
  { icon: MapPin, value: "Oudsbergen", label: "Locatie" },
];

const FACILITIES = [
  "Volledige keuken",
  "Wifi",
  "Gratis parking",
  "Terras / privétuin",
  "BBQ",
  "Wasmachine",
  "Vaatwasmachine",
  "Open haard",
  "Airconditioning",
  "Bedlinnen incl.",
  "Ontbijt mogelijk",
];

const Watermolen = () => {
  const bookingUrl = `${CONTACT.bookingUrl}/watermolen`;

  // Magic image-resolver: longest-prefix match in image_library
  // op "hoogmolen-verblijf-watermolen-…" (auto-pick van uploads).
  const locIds = locationIdsForSlug("watermolen");
  const { images: galleryImages } = useUnitGallery({
    locationId: locIds.primary,
    parentLocationId: locIds.parent,
  });

  return (
    <Layout transparentHeader>
      {/* HERO — wireframe: <div class="hero h-lg"> */}
      <section className="relative h-[60vh] min-h-[440px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Watermolen — vakantiewoning voor 17 personen op Landgoed De Hoogmolen"
            className="w-full h-full object-cover ken-burns"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/85 via-primary-deep/45 to-primary-deep/15" />
        </div>
        <div className="relative container-wide pb-12 md:pb-16 pt-32 text-secondary">
          <div className="max-w-3xl animate-rise">
            <div className="eyebrow text-secondary/80 mb-4">Vakantiewoning · 17 personen</div>
            <h1 className="heading-display text-secondary mb-4">
              Watermolen
            </h1>
            <p className="lead text-secondary/85 max-w-2xl">
              Een vakantiewoning voor 17 personen — bakstenen muren, eikenhouten balken,
              open haard en privétuin aan de Abeek.
            </p>
          </div>
        </div>
      </section>

      {/* SPECS — wireframe: <div class="specs s4"> */}
      <section className="py-10 md:py-14 bg-surface border-b border-border">
        <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-4">
          {SPECS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-6 surface-card"
            >
              <Icon className="w-6 h-6 text-primary mb-3" />
              <div className="font-display text-3xl text-primary-deep leading-none mb-1">{value}</div>
              <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICE BLOCK — wireframe: <div class="price-blk"> */}
      <section className="py-12 md:py-16">
        <div className="container-wide">
          <div className="surface-card p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="eyebrow mb-2">Prijs vanaf per nacht</div>
              <div className="font-display text-5xl text-primary-deep leading-none mb-2">€350</div>
              <div className="text-sm text-muted-foreground">
                Weekdag · €750 weekend · €40 per extra gast · €450 schoonmaak
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button asChild variant="outline" size="lg" className="border-primary-deep text-primary-deep">
                <Link to="/contact">Beschikbaarheid</Link>
              </Button>
              <Button asChild size="lg" className="bg-primary hover:bg-primary-deep text-primary-foreground">
                <a href={bookingUrl} target="_blank" rel="noopener noreferrer">Boek nu</a>
              </Button>
            </div>
          </div>

          {/* PRIJSTABEL — uitgebreide breakdown uit gids p.21 */}
          <div className="mt-10 surface-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-primary-deep">
                <tr>
                  <th className="text-left px-5 py-3 font-medium">Periode</th>
                  <th className="text-right px-5 py-3 font-medium">Basisprijs (8 pers.)</th>
                  <th className="text-right px-5 py-3 font-medium">Extra per persoon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr><td className="px-5 py-3">Weekdag (zo–do)</td><td className="text-right px-5 py-3">€350</td><td className="text-right px-5 py-3">€40</td></tr>
                <tr><td className="px-5 py-3">Weekend (vr–zo)</td><td className="text-right px-5 py-3">€750</td><td className="text-right px-5 py-3">€40</td></tr>
                <tr><td className="px-5 py-3">Midweek (ma–vr)</td><td className="text-right px-5 py-3">€1.850</td><td className="text-right px-5 py-3">€40</td></tr>
                <tr><td className="px-5 py-3">Volledige week</td><td className="text-right px-5 py-3">€1.950</td><td className="text-right px-5 py-3">€40</td></tr>
                <tr className="bg-secondary/40"><td className="px-5 py-3 font-medium">Schoonmaak (eenmalig)</td><td className="text-right px-5 py-3 font-medium">€450</td><td className="text-right px-5 py-3">—</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* GALLERY — automatische binding via image_library (longest-prefix match).
          Toont focus + 4 thumbs zodra Watermolen-foto's in de library staan. */}
      {galleryImages.length > 0 ? (
        <PropertyPhotoGrid slug="watermolen" images={galleryImages.slice(0, 5)} />
      ) : (
        <section className="pb-12 md:pb-16">
          <div className="container-wide">
            <UnitGallerySlider
              slug="watermolen"
              alt="Watermolen — sfeerbeelden"
              placeholderLabel="Watermolen"
              aspectClass="aspect-[16/9] md:aspect-[21/9]"
            />
          </div>
        </section>
      )}

      {/* FACILITEITEN — wireframe: <div class="pros"> */}
      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container-wide">
          <div className="mb-8">
            <div className="eyebrow mb-3">Faciliteiten</div>
            <h2 className="heading-section text-primary-deep">Alles voor een onbezorgd verblijf</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {FACILITIES.map((f) => (
              <div key={f} className="px-4 py-3 surface-card text-sm text-primary-deep">
                ✓ {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — wireframe: 3 faq-items */}
      <FAQAccordion context="watermolen" title="Veelgestelde vragen" />

      {/* NOTE — wireframe: <div class="note"> */}
      <section className="py-10 bg-surface border-y border-border">
        <div className="container-narrow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Met een grotere groep? Bekijk onze <strong>Watermolen Plus</strong> (tot 25 gasten) of het volledige groepsverblijf 10–20 personen.
          </p>
          <Button asChild variant="outline" className="border-primary-deep text-primary-deep">
            <Link to="/groepsverblijf/10-20-personen">Groepsverblijf 10–20p</Link>
          </Button>
        </div>
      </section>

      {/* CTA BAR — wireframe: <div class="cta-bar"> */}
      <section className="py-16 md:py-20 bg-gradient-deep text-secondary">
        <div className="container-narrow text-center">
          <div className="eyebrow text-secondary/70 mb-3">Boek uw verblijf</div>
          <h2 className="heading-section text-secondary mb-6">
            Watermolen wacht op u — vanaf 1 nacht.
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">Boek nu</a>
            </Button>
            <Button asChild size="lg" className="bg-secondary text-primary-deep hover:bg-accent">
              <Link to="/contact">Beschikbaarheid opvragen</Link>
            </Button>
          </div>
        </div>
      </section>

      <StickyMobileCTA bookingUrl={bookingUrl} label="Boek Watermolen" />
    </Layout>
  );
};

export default Watermolen;
