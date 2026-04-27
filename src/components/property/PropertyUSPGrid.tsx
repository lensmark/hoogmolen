/**
 * PropertyUSPGrid — 4 USP-kaarten direct onder de hero.
 * Configurable per template (Duplex / Room / House) — andere icoontjes & labels.
 */
import { ReactNode } from "react";

export interface UspItem {
  icon: ReactNode;
  value: string;
  label: string;
}

export const PropertyUSPGrid = ({ items }: { items: UspItem[] }) => (
  <section className="py-8 bg-background">
    <div className="container-wide grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="border border-border bg-card p-5 text-center flex flex-col items-center gap-2"
        >
          <div className="text-2xl leading-none">{it.icon}</div>
          <div className="font-display text-base text-primary-deep">{it.value}</div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  </section>
);
