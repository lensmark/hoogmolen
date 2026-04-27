/**
 * FeatureCard — herbruikbare tegel voor het 4×3 Master Grid op de homepagina.
 *
 * • Normale modus: volledige <Link> wrap → hele kaart is klikbaar.
 * • Admin-modus: navigatie wordt geblokkeerd; titel + beschrijving zijn inline
 *   editable (saven naar `text_overrides`), en een edit-overlay opent de
 *   MediaPicker voor de header-zone (saven naar `image_overrides`).
 *
 * De CTA-tekst ("Ontdek →") blijft als visuele wegwijzer, maar zonder
 * onafhankelijke knop-styling — de kaart zélf is de actie.
 */
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Pencil } from "lucide-react";
import { useAdminMode } from "@/contexts/AdminModeContext";
import EditableText from "@/components/admin/EditableText";
import MediaPicker from "@/components/admin/MediaPicker";
import { cfImage } from "@/config/cloudflareImagesConfig";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  title: string;
  description: string;
  to: string;
  badge?: string;
  cta?: string;
  /** Optionele unieke key (default = `to`) voor text/image override-lookup. */
  sectionKey?: string;
}

export const FeatureCard = ({
  title,
  description,
  to,
  badge,
  cta = "Ontdek",
  sectionKey,
}: FeatureCardProps) => {
  const { isAdminMode, getOverride, saveOverride } = useAdminMode();
  const location = useLocation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const baseKey = sectionKey ?? `feature-card${to}`;
  const titleKey = `${baseKey}.title`;
  const descKey = `${baseKey}.description`;
  const imageKey = `${baseKey}.image`;
  const path = location.pathname;
  const imageOverride = getOverride(path, imageKey);

  const cardClasses =
    "group surface-card overflow-hidden flex flex-col bg-card hover:shadow-card transition-all hover:-translate-y-0.5";

  const headerSlot = imageOverride ? (
    <div
      className="aspect-[16/7] bg-cover bg-center"
      style={{ backgroundImage: `url(${imageOverride})` }}
      aria-hidden
    />
  ) : (
    <div className="h-1.5 bg-primary-deep w-full" />
  );

  const body = (
    <>
      {headerSlot}

      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-baseline justify-between mb-3 gap-3">
          <EditableText
            sectionKey={titleKey}
            defaultText={title}
            as="h3"
            singleLine
            className="font-display text-xl text-primary-deep leading-tight"
          />
          {badge && (
            <span className="shrink-0 text-[11px] font-medium text-primary-deep bg-accent px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>

        <EditableText
          sectionKey={descKey}
          defaultText={description}
          as="p"
          className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1"
        />

        <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:text-primary-deep transition-colors pt-3">
          {cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </>
  );

  // ── Admin-modus: GEEN <Link>; klikken op tekst/foto opent editors ──
  if (isAdminMode) {
    return (
      <div className={cn(cardClasses, "relative ring-1 ring-blue-400/40")}>
        {/* Image-edit overlay (alleen op header-zone) */}
        <div className="relative group/img">
          {headerSlot}
          <div className="absolute inset-0 bg-blue-500/0 group-hover/img:bg-blue-500/25 transition-colors pointer-events-none" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPickerOpen(true);
            }}
            className="absolute top-2 right-2 inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-medium px-2.5 py-1.5 rounded shadow-md opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-blue-700"
            title={`Wijzig foto — ${imageKey}`}
          >
            <Pencil className="w-3.5 h-3.5" /> Foto
          </button>
          <span className="absolute top-2 left-2 text-[10px] font-mono bg-blue-600/90 text-white px-1.5 py-0.5 rounded opacity-0 group-hover/img:opacity-100 transition-opacity">
            {imageKey}
          </span>
        </div>

        <div className="flex-1 flex flex-col p-5">
          <div className="flex items-baseline justify-between mb-3 gap-3">
            <EditableText
              sectionKey={titleKey}
              defaultText={title}
              as="h3"
              singleLine
              className="font-display text-xl text-primary-deep leading-tight flex-1"
            />
            {badge && (
              <span className="shrink-0 text-[11px] font-medium text-primary-deep bg-accent px-2 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>

          <EditableText
            sectionKey={descKey}
            defaultText={description}
            as="p"
            className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1"
          />

          <div className="flex items-center gap-1 text-sm font-medium text-primary pt-3 opacity-60">
            {cta}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <MediaPicker
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          contextSlug={to}
          onSelect={async (cfId, filename) => {
            const url = cfImage(cfId);
            const { error } = await saveOverride(path, imageKey, url);
            if (error) {
              toast({
                title: "Foto niet opgeslagen",
                description: error,
                variant: "destructive",
              });
            } else {
              toast({
                title: "Foto bijgewerkt",
                description: `${imageKey} → ${filename}`,
              });
            }
          }}
        />
      </div>
    );
  }

  // ── Normale modus: volledige kaart is een <Link> ──
  return (
    <Link to={to} className={cardClasses}>
      {body}
    </Link>
  );
};
