import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Home, BedDouble, Users, Bike, Mail } from "lucide-react";

/**
 * NotFound (404) — nette fallback voor onbekende routes / verlopen deep links.
 * - Stuurt noindex,nofollow zodat Google de pagina niet indexeert.
 * - Logt het pad in de console voor debugging.
 * - Biedt duidelijke, contextuele navigatie naar de hoofdsecties van de site.
 */
const QUICK_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/overnachten", label: "Overnachten", icon: BedDouble },
  { to: "/groepsverblijf", label: "Groepsverblijf", icon: Users },
  { to: "/activiteiten", label: "Activiteiten", icon: Bike },
  { to: "/contact", label: "Contact", icon: Mail },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      `404 — Geen route voor pad: ${location.pathname}${location.search}`
    );
  }, [location.pathname, location.search]);

  return (
    <Layout>
      <SEO
        title="Pagina niet gevonden (404)"
        description="Deze pagina bestaat niet (meer). Keer terug naar het landgoed of bekijk onze accommodaties, activiteiten en contactgegevens."
        noIndex
      />
      <section className="min-h-[70vh] flex items-center justify-center pt-24 pb-20">
        <div className="container-narrow text-center">
          <p className="font-display text-[8rem] md:text-[10rem] leading-none text-primary/30 select-none">
            404
          </p>
          <h1 className="heading-section text-primary-deep mb-4 -mt-6">
            Deze pagina bestaat niet (meer)
          </h1>
          <p className="lead mb-3 max-w-xl mx-auto text-muted-foreground">
            Mogelijk volgde u een verouderde link of is het adres verkeerd
            getypt. Vanaf hier vindt u snel uw weg terug op het landgoed.
          </p>
          <p className="text-sm text-muted-foreground/80 mb-10 break-all">
            Gevraagd pad:{" "}
            <code className="px-2 py-0.5 rounded bg-secondary text-primary-deep">
              {location.pathname}
            </code>
          </p>

          <div className="flex justify-center gap-3 flex-wrap mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary-deep">
              <Link to="/">Naar de homepage</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-deep text-primary-deep hover:bg-secondary"
            >
              <Link to="/overnachten">Bekijk verblijven</Link>
            </Button>
          </div>

          <div className="border-t border-accent/40 pt-8">
            <p className="text-sm uppercase tracking-wider text-primary-deep/70 mb-5 font-medium">
              Of ga direct naar
            </p>
            <nav
              aria-label="Snelnavigatie 404"
              className="grid grid-cols-2 sm:grid-cols-5 gap-3"
            >
              {QUICK_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="group flex flex-col items-center gap-2 p-4 rounded-lg border border-accent/40 bg-secondary/40 hover:bg-secondary hover:border-primary transition-colors"
                >
                  <Icon className="h-5 w-5 text-primary group-hover:text-primary-deep transition-colors" />
                  <span className="text-sm font-medium text-primary-deep">
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;
