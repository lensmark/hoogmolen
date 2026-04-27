/**
 * LibraryDialog — herbruikbare wrapper rond MediaPicker in browse-modus.
 *
 * Toont exact dezelfde foto-bibliotheek UI als de MediaPicker die opent
 * wanneer je een afbeelding wilt vervangen via EditableImage. Wordt gebruikt door:
 *   - FloatingLibraryButton (publieke site, in beheermodus)
 *   - /admin/library route (in admin console)
 *
 * Single source of truth: alle UI-aanpassingen aan MediaPicker werken
 * automatisch door in beide entry-points.
 */
import { useLocation } from "react-router-dom";
import MediaPicker from "./MediaPicker";
import { toast } from "@/hooks/use-toast";

interface LibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optioneel: contextSlug om relevante foto's bovenaan te plaatsen. */
  contextSlug?: string;
}

export const LibraryDialog = ({
  open,
  onOpenChange,
  contextSlug,
}: LibraryDialogProps) => {
  const location = useLocation();
  const ctx = contextSlug ?? location.pathname;

  return (
    <MediaPicker
      open={open}
      onOpenChange={onOpenChange}
      contextSlug={ctx}
      onSelect={(_id, filename) => {
        toast({
          title: "Browse-modus",
          description: `${filename} — om te plaatsen, gebruik de edit-knop op een hero of foto.`,
        });
      }}
    />
  );
};

export default LibraryDialog;
