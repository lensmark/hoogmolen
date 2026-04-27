/**
 * PropertyAmenities — pills-row met groene vinkjes (✓).
 */
import { Check } from "lucide-react";

export const PropertyAmenities = ({
  items,
  title = "Faciliteiten",
}: {
  items: string[];
  title?: string;
}) => (
  <section className="py-8 bg-background">
    <div className="container-wide">
      <h2 className="font-display text-xl text-primary-deep mb-2">{title}</h2>
      <div className="border-t border-border mb-4" />
      <div className="flex flex-wrap gap-2">
        {items.map((a) => (
          <span
            key={a}
            className="inline-flex items-center gap-1.5 text-sm text-primary-deep border border-accent bg-secondary/40 px-3 py-1.5 rounded-md"
          >
            <Check className="w-3.5 h-3.5 text-primary" /> {a}
          </span>
        ))}
      </div>
    </div>
  </section>
);
