import { Link } from "react-router-dom";
import { FOOTER_NAV, CONTACT } from "@/config/navigationConfig";
import { MapPin, Phone, Mail, Star, Wand2 } from "lucide-react";
import logo from "@/assets/hoogmolen-logo.png";
import { SITE_VERSION } from "@/lib/version";
import { useAdminMode } from "@/contexts/AdminModeContext";

export const Footer = () => {
  const { isAdmin, isAdminMode, setAdminMode } = useAdminMode();
  return (
  <footer className="bg-primary-deep text-accent">
    <div className="container-wide py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <img
            src={logo}
            alt="Landgoed De Hoogmolen — Anno 1500"
            className="h-20 w-auto object-contain bg-secondary/95 rounded-full p-2"
            loading="lazy"
            decoding="async"
          />
          <p className="text-sm leading-relaxed text-accent/80 max-w-xs">
            Een eeuwenoud erfgoeddomein aan de Abeekvallei. Verblijven, vergaderen en samenkomen
            in het hart van Limburg — vanaf 1 tot 53 gasten.
          </p>
          <ul className="space-y-2 text-sm text-accent/80">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-secondary shrink-0" />{CONTACT.address}</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary shrink-0" /><a href={`tel:${CONTACT.phone}`} className="hover:text-secondary">{CONTACT.phone}</a></li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-secondary shrink-0" /><a href={`mailto:${CONTACT.email}`} className="hover:text-secondary">{CONTACT.email}</a></li>
          </ul>
        </div>
        {FOOTER_NAV.map((col) => (
          <div key={col.title} className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-accent/70 hover:text-secondary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ─────────── TRUST ANCHOR — Onze Reputatie ─────────── */}
      <div className="mt-12 pt-8 border-t border-accent/15">
        <div className="flex items-baseline justify-between mb-5 flex-wrap gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
            Onze Reputatie
          </div>
          <Link
            to="/ervaringen"
            className="text-xs text-secondary hover:text-accent underline underline-offset-4"
          >
            Bekijk alle 571+ gastervaringen →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { name: "Google", score: "5.0", meta: "Gastenscore 2026 · 100%" },
            { name: "Airbnb", score: "4.97", meta: "571+ reviews · Superhost" },
            { name: "Booking.com", score: "9.7", meta: "171 reviews · Uitzonderlijk" },
          ].map((p) => (
            <Link
              key={p.name}
              to="/ervaringen"
              className="flex items-center gap-3 bg-accent/5 border border-accent/15 rounded-md px-4 py-3 hover:bg-accent/10 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Star className="w-5 h-5 fill-secondary text-secondary" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-accent leading-tight">
                  <span className="text-secondary">{p.score}</span>{" "}
                  <span className="text-accent/85">op {p.name}</span>
                </div>
                <div className="text-[11px] text-accent/60 mt-0.5">{p.meta}</div>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-accent/70 italic">
          Erkend Airbnb Superhost met 571+ geverifieerde gastervaringen.
        </p>
      </div>

      {/* ─────────── GASTENVERTROUWEN — CTA-anchor ─────────── */}
      <div className="mt-10 pt-8 border-t border-accent/15 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary mb-3">
          Gastenvertrouwen
        </div>
        <p className="text-sm text-accent/85 max-w-xl mx-auto mb-5">
          Bekijk waarom 571+ gasten ons beoordelen met een 5/5 score.
        </p>
        <Link
          to="/ervaringen"
          className="inline-flex items-center gap-2 bg-secondary text-primary-deep px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-accent transition-colors"
        >
          Lees alle ervaringen →
        </Link>
      </div>

      <div className="mt-10 pt-6 border-t border-accent/15 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs text-accent/60">
        <div className="text-center md:text-left">
          © {new Date().getFullYear()} Landgoed De Hoogmolen — Anno 1500. Alle rechten voorbehouden.
        </div>
        <div className="flex justify-center">
          <span
            className="px-3 py-1 rounded-sm border border-accent/25 text-[10px] tracking-[0.2em] text-accent/70 font-mono"
            aria-label="Site versie"
            title="Huidige site-versie"
          >
            {SITE_VERSION}
          </span>
        </div>
        <div className="flex items-center justify-center md:justify-end gap-4 flex-wrap">
          <Link to="/privacy" className="hover:text-secondary">Privacy</Link>
          <Link to="/algemene-voorwaarden" className="hover:text-secondary">Algemene voorwaarden</Link>
          <Link to="/cookies" className="hover:text-secondary">Cookies</Link>
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={() => setAdminMode(!isAdminMode)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[10px] tracking-[0.15em] transition ${
                  isAdminMode
                    ? "bg-secondary text-primary-deep border-secondary"
                    : "border-accent/20 text-accent/40 hover:text-secondary hover:border-accent/40"
                }`}
                title="Beheermodus aan/uit (Alt+A)"
                aria-label="Beheermodus toggle"
              >
                <Wand2 className="w-3 h-3" />
                {isAdminMode ? "BEHEER AAN" : "BEHEER"}
              </button>
              <Link
                to="/admin"
                className="text-[10px] tracking-[0.15em] text-accent/40 hover:text-secondary"
                title="Admin Console"
              >
                CONSOLE
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  </footer>
  );
};
