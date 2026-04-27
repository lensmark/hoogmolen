/**
 * EditableText — inline contentEditable wrapper voor admin-mode tekst-editing.
 *
 * Normale modus: rendert simpelweg de huidige (geoverridete) tekst in `as`-element.
 * Admin-mode: maakt het element contentEditable, toont een subtiele blauwe highlight,
 * en slaat de waarde bij `onBlur` op naar `text_overrides` (page_path + sectionKey).
 *
 * Gebruik:
 *   <EditableText sectionKey="card.title" as="h3" defaultText="Overnachten" />
 */
import { useEffect, useRef, useState, type ElementType } from "react";
import { useLocation } from "react-router-dom";
import { useAdminMode } from "@/contexts/AdminModeContext";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  sectionKey: string;
  defaultText: string;
  pagePath?: string;
  as?: ElementType;
  className?: string;
  /** Single-line: blokkeer Enter (forceer blur). */
  singleLine?: boolean;
}

export const EditableText = ({
  sectionKey,
  defaultText,
  pagePath,
  as: Tag = "span",
  className,
  singleLine = false,
}: EditableTextProps) => {
  const { isAdminMode, getTextOverride, saveTextOverride } = useAdminMode();
  const location = useLocation();
  const path = pagePath ?? location.pathname;
  const ref = useRef<HTMLElement>(null);
  const override = getTextOverride(path, sectionKey);
  const display = override ?? defaultText;
  const [busy, setBusy] = useState(false);

  // Sync DOM-tekst wanneer override-cache wijzigt buiten dit element om.
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = display;
    }
  }, [display]);

  if (!isAdminMode) {
    return <Tag className={className}>{display}</Tag>;
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-label={`Bewerk tekst — ${sectionKey}`}
      className={cn(
        className,
        "outline-none rounded-sm px-1 -mx-1 ring-1 ring-blue-400/40 hover:ring-blue-500 focus:ring-2 focus:ring-blue-600 focus:bg-blue-50/60 transition-shadow cursor-text",
        busy && "opacity-60",
      )}
      onClick={(e) => {
        // Blokkeer dat een omhullende <Link> navigeert in admin-mode.
        e.preventDefault();
        e.stopPropagation();
      }}
      onKeyDown={(e) => {
        if (singleLine && e.key === "Enter") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
        if (e.key === "Escape") {
          if (ref.current) ref.current.textContent = display;
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={async (e) => {
        const next = (e.currentTarget.textContent ?? "").trim();
        if (!next || next === display) {
          if (ref.current) ref.current.textContent = display;
          return;
        }
        setBusy(true);
        const { error } = await saveTextOverride(path, sectionKey, next);
        setBusy(false);
        if (error) {
          toast({
            title: "Tekst niet opgeslagen",
            description: error,
            variant: "destructive",
          });
          if (ref.current) ref.current.textContent = display;
        } else {
          toast({ title: "Tekst bijgewerkt", description: sectionKey });
        }
      }}
    >
      {display}
    </Tag>
  );
};

export default EditableText;
