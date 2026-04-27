/**
 * TagBadge — elegante pill voor een tag-label, gestyled volgens
 * Hoogmolen brand-tokens. Ondersteunt 4 kleurvarianten.
 */
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const COLOR_CLASSES: Record<string, string> = {
  primary: "bg-primary/15 text-primary-deep border-primary/40 hover:bg-primary/25",
  "primary-deep":
    "bg-primary-deep/15 text-primary-deep border-primary-deep/40 hover:bg-primary-deep/25",
  accent: "bg-accent text-primary-deep border-accent hover:bg-accent/80",
  secondary:
    "bg-secondary text-primary-deep border-secondary/80 hover:bg-secondary/80",
};

interface TagBadgeProps {
  label: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  size?: "sm" | "md";
  className?: string;
}

export const TagBadge = ({
  label,
  color = "primary",
  active = false,
  onClick,
  onRemove,
  size = "md",
  className,
}: TagBadgeProps) => {
  const colorClass = COLOR_CLASSES[color] ?? COLOR_CLASSES.primary;
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "span";

  return (
    <Tag
      type={interactive ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium transition tracking-wide",
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
        active
          ? "bg-primary text-primary-foreground border-primary shadow-soft"
          : colorClass,
        interactive && "cursor-pointer",
        className,
      )}
    >
      <span className="capitalize">{label}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full hover:bg-foreground/10 p-0.5"
          aria-label={`Verwijder tag ${label}`}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </Tag>
  );
};

export default TagBadge;
