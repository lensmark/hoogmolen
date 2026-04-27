/**
 * SubNav — Tier 2 contextuele subnavigatie als content-strip.
 * Wordt door de Header óók al gerenderd (sticky), maar dit component biedt
 * een inline "page-tab" variant zoals in de wireframes (suites-kamers, etc.).
 *
 * Active state verspringt automatisch mee met de huidige route.
 */
import { NavLink } from "react-router-dom";

export interface SubNavItem {
  label: string;
  to: string;
  /** prefix-match voor active-state op subroutes (bv. /duplexsuites/suite-a1) */
  matchPrefix?: boolean;
}

interface SubNavProps {
  items: SubNavItem[];
}

export const SubNav = ({ items }: SubNavProps) => (
  <nav
    aria-label="Subnavigatie"
    className="border-b border-border bg-secondary/60"
  >
    <div className="container-wide flex items-center gap-6 overflow-x-auto scrollbar-none">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={!item.matchPrefix}
          className={({ isActive }) =>
            `relative whitespace-nowrap py-3 text-sm font-medium tracking-wide transition-colors ${
              isActive
                ? "text-primary-deep after:absolute after:left-0 after:right-0 after:-bottom-px after:h-0.5 after:bg-primary"
                : "text-primary-deep hover:text-primary"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
);
