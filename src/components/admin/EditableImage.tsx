/**
 * EditableImage — wrap een willekeurige image-render met een admin edit-overlay.
 *
 * In normale modus: rendert simpelweg de children.
 * In adminMode: voegt een blauwe hover-overlay + "Edit"-knop toe die de
 * MediaPicker opent. Gekozen image wordt weggeschreven naar `image_overrides`
 * met (pagePath, sectionKey).
 *
 * Gebruik:
 *   <EditableImage sectionKey="hero" pagePath={location.pathname}>
 *     <CFImage id="…" alt="…" />
 *   </EditableImage>
 */
import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Pencil } from "lucide-react";
import { useAdminMode } from "@/contexts/AdminModeContext";
import MediaPicker from "@/components/admin/MediaPicker";
import { cfImage } from "@/config/cloudflareImagesConfig";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EditableImageProps {
  sectionKey: string;
  pagePath?: string;
  /** Optioneel — wordt als contextSlug doorgegeven aan de MediaPicker. */
  contextHint?: string;
  className?: string;
  children: ReactNode;
}

export const EditableImage = ({
  sectionKey,
  pagePath,
  contextHint,
  className,
  children,
}: EditableImageProps) => {
  const { isAdminMode, saveOverride } = useAdminMode();
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);

  const path = pagePath ?? location.pathname;

  if (!isAdminMode) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative group/edit", className)}>
      {children}
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-500/0 group-hover/edit:bg-blue-500/30 transition-colors pointer-events-none z-10" />
      {/* Edit-knop */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setPickerOpen(true);
        }}
        className="absolute top-2 right-2 z-20 inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded shadow-md opacity-0 group-hover/edit:opacity-100 transition-opacity hover:bg-blue-700"
        title={`Wijzig foto — ${sectionKey}`}
      >
        <Pencil className="w-3.5 h-3.5" /> Edit
      </button>
      {/* Section-key indicator */}
      <span className="absolute top-2 left-2 z-20 text-[10px] font-mono bg-blue-600/90 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/edit:opacity-100 transition-opacity">
        {sectionKey}
      </span>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        contextSlug={contextHint ?? path}
        onSelect={async (cfId, filename) => {
          const url = cfImage(cfId);
          const { error } = await saveOverride(path, sectionKey, url);
          if (error) {
            toast({
              title: "Override niet opgeslagen",
              description: error,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Foto bijgewerkt",
              description: `${sectionKey} → ${filename}`,
            });
          }
        }}
      />
    </div>
  );
};

export default EditableImage;
