/**
 * DUAL-TIER HEADER — strikte HTML-to-React transpilatie
 *
 * Tier 1 (top-bar): Logo · 7 hoofdcategorieën · Primary CTA
 *   - Verbergt bij scroll-down (translate-y -100%)
 *   - Verschijnt bij scroll-up
 *
 * Tier 2 (sub-nav): contextuele horizontale strip met sub-links van actieve sectie
 *   - Statisch in DOM (geen pulldown, geen Radix, geen JS-toggle)
 *   - Blijft sticky bovenaan bij scroll
 *   - Slim height + backdrop-blur
 *
 * Sub-nav-mapping wordt afgeleid uit MAIN_NAV[].children op basis van actieve URL-prefix.
 */
import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import { Menu, X, Wand2 } from "lucide-react";
import { MAIN_NAV, CONTACT, NavItem } from "@/config/navigationConfig";
import { Button } from "@/components/ui/button";
import { TopBar } from "./TopBar";
import { useAdminMode } from "@/contexts/AdminModeContext";
import logo from "@/assets/hoogmolen-logo.png";

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tier1Hidden, setTier1Hidden] = useState(false);
  const lastScrollY = useRef(0);
  const location = useLocation();
  const { isAdmin, isAdminMode, setAdminMode } = useAdminMode();

  /* Smart sticky: hide Tier 1 on scroll-down, show on scroll-up */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setTier1Hidden(false);
      } else if (y > lastScrollY.current + 4) {
        setTier1Hidden(true);
      } else if (y < lastScrollY.current - 4) {
        setTier1Hidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  /* Determine active section + its sub-children */
  const { activeTop, subNav } = useMemo(() => {
    const path = location.pathname;
    let active: NavItem | undefined;
    for (const item of MAIN_NAV) {
      if (path === item.to || path.startsWith(item.to + "/")) {
        active = item;
        break;
      }
    }
    // Speciale mapping: /over-ons/* en /ervaringen vallen onder Wall of Love (Tier 1)
    if (!active && (path === "/over-ons" || path.startsWith("/over-ons/") || path === "/ervaringen")) {
      active = MAIN_NAV.find((i) => i.to === "/wall-of-love");
    }
    if (!active && path === "/") active = undefined;
    return {
      activeTop: active?.to ?? null,
      subNav: active?.children ?? [],
    };
  }, [location.pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 overflow-visible">
      {/* ─────────── TOP TRUST BAR (altijd zichtbaar bovenaan) ─────────── */}
      <TopBar />

      {/* ───────────────────────── TIER 1 ───────────────────────── */}
      <div
        className={`bg-surface/95 backdrop-blur-md border-b border-border shadow-soft transition-transform duration-300 overflow-visible ${
          tier1Hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="container-wide flex items-center justify-between h-16 lg:h-[68px] relative">
          <Link
            to="/"
            className="flex items-center group shrink-0"
            aria-label="De Hoogmolen — home"
          >
            <img
              src={logo}
              alt="Landgoed De Hoogmolen — Anno 1500"
              className="h-12 md:h-14 lg:h-16 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </Link>

          {/* Desktop hoofdcategorieën — STATISCH, geen dropdown */}
          <nav className="hidden lg:flex items-center gap-0 ml-6">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `px-3 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive || activeTop === item.to
                      ? "text-primary"
                      : "text-primary-deep hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wide transition-colors ${
                  isActive ? "text-primary" : "text-primary-deep hover:text-primary"
                }`
              }
            >
              Contact
            </NavLink>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setAdminMode(!isAdminMode)}
                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded transition border ${
                  isAdminMode
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-background text-muted-foreground border-border hover:bg-accent/40"
                }`}
                title="Beheermodus aan/uit"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {isAdminMode ? "Beheer aan" : "Beheermodus"}
              </button>
            )}
            {location.pathname.startsWith("/groepsverblijf") ? (
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary-deep text-secondary"
              >
                <Link to="/groepsverblijf/aanvragen">Groepsverblijf aanvragen</Link>
              </Button>
            ) : (
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary-deep text-secondary"
              >
                <a href={CONTACT.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Boek verblijf
                </a>
              </Button>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-primary-deep"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ───────────────────────── TIER 2 ─────────────────────────
          Contextuele sub-nav. Statisch in DOM. Slim. Sticky bovenaan. */}
      {subNav.length > 0 && (
        <div
          className={`hidden lg:block bg-secondary/85 backdrop-blur-md border-b border-border transition-transform duration-300 ${
            tier1Hidden ? "-translate-y-[68px]" : "translate-y-0"
          }`}
        >
          <div className="container-wide flex items-center gap-1 h-10 overflow-x-auto scrollbar-none">
            {subNav.map((sub) => (
              <NavLink
                key={sub.to}
                to={sub.to}
                className={({ isActive }) =>
                  `whitespace-nowrap px-3 py-1.5 text-[12px] font-medium tracking-wide transition-colors rounded-sm ${
                    isActive
                      ? "text-primary-deep bg-card"
                      : "text-primary-deep/75 hover:text-primary"
                  }`
                }
              >
                {sub.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────── MOBILE PANEL ───────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface max-h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="container-wide py-4 space-y-1">
            {/* Statische geneste lijst — main + subs in DOM */}
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="block py-2.5 text-base font-medium text-primary-deep border-b border-border/50 pl-0"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="pl-4 py-1">
                      {item.children.map((c) => (
                        <li key={c.to}>
                          <Link
                            to={c.to}
                            className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                          >
                            — {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="pt-4 flex flex-col gap-2">
              <Button
                asChild
                variant="outline"
                className="border-primary-deep text-primary-deep"
              >
                <Link to="/groepsverblijf/aanvragen">Groepsverblijf aanvragen</Link>
              </Button>
              <Button asChild className="bg-primary hover:bg-primary-deep">
                <a href={CONTACT.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Boek verblijf
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
