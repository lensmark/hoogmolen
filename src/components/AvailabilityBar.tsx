/**
 * AvailabilityBar — donkergroene full-width footer-bar met beschikbaarheid CTA.
 */
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/config/navigationConfig";

interface AvailabilityBarProps {
  /** Headline links, default placeholder */
  title?: string;
  description?: string;
  ctaLabel?: string;
  /** override booking URL (default = hoogmolen.com) */
  href?: string;
}

export const AvailabilityBar = ({
  title = "Klaar om te boeken?",
  description = "Live beschikbaarheid en directe reservatie via ons boekingsplatform.",
  ctaLabel = "Bekijk beschikbaarheid",
  href = CONTACT.bookingUrl,
}: AvailabilityBarProps) => (
  <section className="bg-primary-deep text-secondary">
    <div className="container-wide py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="font-display text-lg text-secondary mb-1">{title}</div>
        <div className="text-sm text-secondary/80">{description}</div>
      </div>
      <Button
        asChild
        size="lg"
        className="bg-secondary text-primary-deep hover:bg-accent shrink-0"
      >
        <a href={href} target="_blank" rel="noopener noreferrer">
          {ctaLabel}
        </a>
      </Button>
    </div>
  </section>
);
