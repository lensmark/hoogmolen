import { Phone } from "lucide-react";
import { CONTACT } from "@/config/navigationConfig";

interface StickyCTAProps {
  bookingUrl?: string;
  label?: string;
}

export const StickyMobileCTA = ({ bookingUrl = CONTACT.bookingUrl, label = "Boek nu" }: StickyCTAProps) => (
  <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-elevated">
    <div className="flex items-stretch gap-2 p-3">
      <a
        href={`tel:${CONTACT.phone}`}
        className="flex items-center justify-center px-4 rounded-md border border-primary-deep text-primary-deep"
        aria-label="Bel ons"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 inline-flex items-center justify-center bg-primary hover:bg-primary-deep text-primary-foreground font-medium text-sm py-3 rounded-md transition-colors"
      >
        {label}
      </a>
    </div>
  </div>
);
