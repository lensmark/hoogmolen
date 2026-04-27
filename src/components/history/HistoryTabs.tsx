/**
 * HistoryTabs — lokale Tier 2-strip voor de Geschiedenis-sub-architectuur.
 * Verschijnt direct onder de PageHero op /over-ons/geschiedenis(/*).
 */
import { NavLink } from "react-router-dom";

const TABS = [
  { label: "Overzicht", to: "/over-ons/geschiedenis", end: true },
  { label: "Erfgoed & Monument", to: "/over-ons/geschiedenis/erfgoed" },
  { label: "Natuur & Habitat", to: "/over-ons/geschiedenis/natuur" },
  { label: "Duurzaamheid", to: "/over-ons/geschiedenis/duurzaamheid" },
];

export const HistoryTabs = () => (
  <nav
    aria-label="Geschiedenis subnavigatie"
    className="sticky top-[108px] z-30 border-b border-border bg-secondary/85 backdrop-blur-md"
  >
    <div className="container-wide flex items-center gap-1 h-11 overflow-x-auto scrollbar-none">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-1.5 text-[12px] font-medium tracking-wide rounded-sm transition-colors ${
              isActive
                ? "text-primary-deep bg-card"
                : "text-primary-deep/75 hover:text-primary"
            }`
          }
        >
          {t.label}
        </NavLink>
      ))}
    </div>
  </nav>
);
