/**
 * FloatingBackButton — universele zwevende terugknop op detailpagina's.
 *
 * Plaatsing: fixed linksonder (counter-balance op WhatsApp FAB rechtsonder).
 * Logica: bepaalt parent-overzicht op basis van huidige pathname.
 * Toont enkel op detailroutes; verborgen op overzichts- en hoofdpagina's.
 */
import { ChevronLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BackTarget {
  to: string;
  label: string;
}

/**
 * Bepaal parent-overzicht route op basis van pathname.
 * Returns null wanneer huidige pagina zelf een overzicht / hoofdpagina is.
 */
const resolveBackTarget = (pathname: string): BackTarget | null => {
  // Strip trailing slash voor consistente matching
  const path = pathname.replace(/\/$/, "");

  // ── ACTIVITEITEN sub-detailpagina's
  if (/^\/activiteiten\/wandelen\/[^/]+$/.test(path))
    return { to: "/activiteiten/wandelen", label: "Terug naar wandelroutes" };
  if (/^\/activiteiten\/fietsen\/[^/]+$/.test(path))
    return { to: "/activiteiten/fietsen", label: "Terug naar fietsroutes" };
  if (/^\/activiteiten\/paardrijden\/[^/]+$/.test(path))
    return { to: "/activiteiten/paardrijden", label: "Terug naar ruiterroutes" };
  if (/^\/activiteiten\/in-de-omgeving\/[^/]+$/.test(path))
    return { to: "/activiteiten/in-de-omgeving", label: "Terug naar omgeving" };
  if (/^\/activiteiten\/familie\/[^/]+$/.test(path))
    return { to: "/activiteiten/familie", label: "Terug naar familie" };

  // ── OVERNACHTEN sub-detailpagina's
  if (/^\/overnachten\/vakantiewoningen\/[^/]+$/.test(path))
    return { to: "/overnachten/vakantiewoningen", label: "Terug naar vakantiewoningen" };
  if (/^\/overnachten\/suites-kamers\/duplexsuites\/[^/]+$/.test(path))
    return { to: "/overnachten/suites-kamers/duplexsuites", label: "Terug naar duplexsuites" };
  if (/^\/overnachten\/suites-kamers\/kamers\/[^/]+$/.test(path))
    return { to: "/overnachten/suites-kamers/kamers", label: "Terug naar kamers" };
  // Overzichtspagina's binnen suites-kamers gaan terug naar de hub
  if (path === "/overnachten/suites-kamers/duplexsuites" || path === "/overnachten/suites-kamers/kamers")
    return { to: "/overnachten/suites-kamers", label: "Terug naar suites & kamers" };
  // Korte alias /overnachten/:slug
  if (/^\/overnachten\/[^/]+$/.test(path) &&
      !["vakantiewoningen", "suites-kamers", "boekingsinformatie", "molenhuys"].includes(path.split("/")[2]))
    return { to: "/overnachten", label: "Terug naar overnachten" };

  // ── GROEPSVERBLIJF buckets
  if (/^\/groepsverblijf\/(10-20|20-30|30-53)-personen$/.test(path))
    return { to: "/groepsverblijf", label: "Terug naar groepsverblijf" };
  if (path === "/groepsverblijf/aanvragen")
    return { to: "/groepsverblijf", label: "Terug naar groepsverblijf" };

  // ── VERGADEREN sub-arrangementen
  if (/^\/vergaderen\/[^/]+$/.test(path))
    return { to: "/vergaderen", label: "Terug naar vergaderen" };

  // ── TEAMBUILDINGS sub-pagina's
  if (/^\/teambuildings\/[^/]+$/.test(path))
    return { to: "/teambuildings", label: "Terug naar teambuildings" };

  // ── PRAKTISCH sub
  if (/^\/praktisch\/[^/]+$/.test(path))
    return { to: "/praktisch", label: "Terug naar praktisch" };

  // ── EXTRA template routes
  if (/^\/verblijf\/[^/]+$/.test(path))
    return { to: "/overnachten", label: "Terug naar overnachten" };
  if (path === "/accommodaties/peerdermolen-plus")
    return { to: "/overnachten/vakantiewoningen", label: "Terug naar vakantiewoningen" };

  // ── WALL OF LOVE / OVER ONS sub-pagina's → terug naar Wall of Love hub
  if (path === "/ervaringen")
    return { to: "/wall-of-love", label: "Terug naar Wall of Love" };
  if (path === "/over-ons")
    return { to: "/wall-of-love", label: "Terug naar Wall of Love" };
  if (path === "/over-ons/team")
    return { to: "/wall-of-love", label: "Terug naar Wall of Love" };
  if (path === "/over-ons/geschiedenis")
    return { to: "/wall-of-love", label: "Terug naar Wall of Love" };
  if (/^\/over-ons\/geschiedenis\/[^/]+$/.test(path))
    return { to: "/over-ons/geschiedenis", label: "Terug naar Molengeschiedenis" };

  // Geen match → niet tonen op overzichten / hoofdpagina's
  return null;
};

export const FloatingBackButton = () => {
  const { pathname } = useLocation();
  const target = resolveBackTarget(pathname);

  if (!target) return null;

  return (
    <Link
      to={target.to}
      aria-label={target.label}
      className="
        fixed bottom-6 left-4 md:bottom-8 md:left-8 z-40
        inline-flex items-center gap-2
        bg-secondary/90 backdrop-blur-md
        border border-border/60
        text-primary-deep
        px-3 py-2 md:px-4 md:py-2.5
        rounded-full
        shadow-lg shadow-primary-deep/10
        hover:bg-secondary hover:shadow-xl hover:-translate-x-0.5
        transition-all duration-200
        text-sm font-medium
      "
    >
      <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" aria-hidden />
      <span className="hidden md:inline">{target.label}</span>
      <span className="md:hidden">Terug</span>
    </Link>
  );
};
