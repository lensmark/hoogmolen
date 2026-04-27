import { MessageCircle } from "lucide-react";

/**
 * Floating WhatsApp button — site-wide.
 * Number: +32 475 95 03 35 → wa.me/32475950335
 */
export const FloatingWhatsApp = () => (
  <a
    href="https://wa.me/32475950335?text=Hallo%20Landgoed%20De%20Hoogmolen%2C%20ik%20heb%20een%20vraag."
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp ons op +32 475 95 03 35"
    className="fixed bottom-24 right-4 lg:bottom-8 lg:right-8 z-40 group"
  >
    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" aria-hidden />
    <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[hsl(142_70%_40%)] hover:bg-[hsl(142_70%_34%)] text-white shadow-elevated transition-transform group-hover:scale-105">
      <MessageCircle className="w-6 h-6" strokeWidth={2.2} />
    </span>
    <span className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary-deep text-secondary text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      Chat met ons op WhatsApp
    </span>
  </a>
);
