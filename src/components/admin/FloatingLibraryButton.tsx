/**
 * FloatingLibraryButton — floating knop op publieke pagina's, alleen
 * zichtbaar in beheermodus. Opent de volledige fotobibliotheek in een dialog.
 *
 * Positionering: rechtsonder, boven de WhatsApp FAB en sticky CTA's.
 */
import { useState } from "react";
import { Images } from "lucide-react";
import { useAdminMode } from "@/contexts/AdminModeContext";
import LibraryDialog from "./LibraryDialog";

export const FloatingLibraryButton = () => {
  const { isAdminMode } = useAdminMode();
  const [open, setOpen] = useState(false);

  if (!isAdminMode) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open fotobibliotheek"
        className="fixed bottom-44 right-4 lg:bottom-28 lg:right-8 z-40 group"
      >
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary-deep hover:bg-primary text-secondary shadow-elevated transition-transform group-hover:scale-105 ring-2 ring-accent/40">
          <Images className="w-6 h-6" strokeWidth={2.2} />
        </span>
        <span className="hidden lg:block absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-primary-deep text-secondary text-xs font-medium px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Fotobibliotheek
        </span>
      </button>
      <LibraryDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default FloatingLibraryButton;
