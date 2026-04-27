/**
 * TagSelector — popover om tags toe te voegen aan een image_library record.
 *
 * - Kies uit bestaande tags
 * - Maak on-the-fly een nieuwe tag (lowercase, a-z 0-9 -)
 * - Toont gekoppelde tags als verwijderbare pills
 *
 * Persisteert direct via supabase.update() op image_library.
 */
import { useState } from "react";
import { Plus, Tag as TagIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { TagBadge } from "./TagBadge";
import { useUniqueTags, TAG_COLORS, type TagColor } from "@/hooks/useUniqueTags";
import { cn } from "@/lib/utils";

interface TagSelectorProps {
  imageId: string;
  currentTags: string[];
  onChange: (tags: string[]) => void;
  size?: "sm" | "md";
}

export const TagSelector = ({
  imageId,
  currentTags,
  onChange,
  size = "md",
}: TagSelectorProps) => {
  const { tags: allTags, createTag } = useUniqueTags();
  const [open, setOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newColor, setNewColor] = useState<TagColor>("primary");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const persist = async (next: string[]) => {
    setSaving(true);
    const { error } = await supabase
      .from("image_library")
      .update({ tags: next })
      .eq("id", imageId);
    setSaving(false);
    if (error) {
      toast({
        title: "Tags opslaan mislukt",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
    onChange(next);
    return true;
  };

  const toggleTag = async (label: string) => {
    const has = currentTags.includes(label);
    const next = has
      ? currentTags.filter((t) => t !== label)
      : [...currentTags, label];
    await persist(next);
  };

  const handleCreate = async () => {
    const label = newLabel.trim().toLowerCase();
    if (!/^[a-z0-9-]{2,32}$/.test(label)) {
      toast({
        title: "Ongeldige tag",
        description: "Gebruik 2-32 tekens, alleen a-z, 0-9, en -.",
        variant: "destructive",
      });
      return;
    }
    const created = await createTag(label, newColor);
    if (created) {
      const ok = await persist([...currentTags, created.label]);
      if (ok) {
        setNewLabel("");
        toast({ title: "Tag aangemaakt", description: `#${created.label}` });
      }
    } else {
      toast({
        title: "Tag bestaat al of is ongeldig",
        variant: "destructive",
      });
    }
  };

  const tagMap = new Map(allTags.map((t) => [t.label, t]));

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {currentTags.map((label) => (
        <TagBadge
          key={label}
          label={label}
          color={tagMap.get(label)?.color ?? "primary"}
          size={size}
          onRemove={() => toggleTag(label)}
        />
      ))}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-6 px-2 text-[10px] gap-1"
            disabled={saving}
          >
            <TagIcon className="w-3 h-3" /> Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-72 p-3 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
              Bestaande tags
            </p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {allTags.length === 0 && (
                <p className="text-xs text-muted-foreground">Nog geen tags.</p>
              )}
              {allTags.map((t) => (
                <TagBadge
                  key={t.id}
                  label={t.label}
                  color={t.color}
                  active={currentTags.includes(t.label)}
                  size="sm"
                  onClick={() => toggleTag(t.label)}
                />
              ))}
            </div>
          </div>

          <div className="border-t pt-2 space-y-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Nieuwe tag
            </p>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value.toLowerCase())}
              placeholder="bv. winter"
              className="h-7 text-xs"
            />
            <div>
              <p className="text-[10px] text-muted-foreground mb-1">Kies een kleur:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {TAG_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewColor(c)}
                    className={cn(
                      "h-7 rounded border-2 transition flex items-center justify-center px-1",
                      newColor === c ? "border-primary" : "border-transparent",
                    )}
                    aria-label={`Kleur ${c}`}
                    title={`Kleur: ${c}`}
                  >
                    <TagBadge label={c} color={c} size="sm" />
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              className="w-full h-7 text-[11px] gap-1"
            >
              <Plus className="w-3 h-3" /> Aanmaken & toevoegen
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelector;
