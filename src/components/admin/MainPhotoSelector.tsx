/**
 * MainPhotoSelector — ster-knop die toont/beheert voor welke contexten
 * een foto als hoofdfoto is gemarkeerd.
 *
 * Slim: leidt automatisch een unit-suggestie af uit de filename
 * (bv. "hoogmolen-verblijf-watermolen-..." → suggereer unit:watermolen).
 *
 * Toont:
 *  - Ster-icoon (gevuld goud als ≥ 1 markering bestaat, leeg anders)
 *  - Popover met:
 *      • Lijst huidige markeringen (verwijderbaar)
 *      • Snelle suggesties (uit filename)
 *      • Vrije input: type + key
 */
import { useMemo, useState } from "react";
import { Star, X, Plus, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  useMainPhotos,
  CONTEXT_LABELS,
  formatContext,
  type ContextType,
} from "@/hooks/useMainPhotos";
import { parseImageId } from "@/lib/imageMatcher";
import { cn } from "@/lib/utils";

interface MainPhotoSelectorProps {
  imageId: string;
  filename: string;
  cloudflareId: string | null;
  size?: "sm" | "md";
}

interface Suggestion {
  contextType: ContextType;
  contextKey: string;
  label: string;
}

const deriveSuggestions = (cloudflareId: string | null): Suggestion[] => {
  if (!cloudflareId) return [];
  const parsed = parseImageId(cloudflareId);
  const suggestions: Suggestion[] = [];

  // Suggestie 1: unit
  const afterPrefix = cloudflareId
    .toLowerCase()
    .replace(/^hoogmolen-verblijf-/, "");
  const unitSlug = afterPrefix.split("-")[0];
  if (unitSlug && unitSlug !== cloudflareId) {
    suggestions.push({
      contextType: "unit",
      contextKey: unitSlug,
      label: `Unit: ${unitSlug}`,
    });
  }

  // Suggestie 2: kamer (als locationId een kamer-suffix bevat)
  if (parsed.locationId && parsed.locationId.includes("-kamer-")) {
    suggestions.push({
      contextType: "unit",
      contextKey: parsed.locationId,
      label: `Unit/kamer: ${parsed.locationId}`,
    });
  }

  return suggestions;
};

export const MainPhotoSelector = ({
  imageId,
  filename,
  cloudflareId,
  size = "md",
}: MainPhotoSelectorProps) => {
  const { getMainContextsForImage, setMain, unsetMain } = useMainPhotos();
  const [open, setOpen] = useState(false);
  const [newType, setNewType] = useState<ContextType>("unit");
  const [newKey, setNewKey] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const myContexts = getMainContextsForImage(imageId);
  const isMain = myContexts.length > 0;
  const suggestions = useMemo(
    () => deriveSuggestions(cloudflareId),
    [cloudflareId],
  );

  const apply = async (type: ContextType, key: string) => {
    const cleanKey = key.trim().toLowerCase();
    if (!cleanKey) {
      toast({
        title: "Geef een context-naam",
        description: "Bv. 'watermolen' of 'home-hero'.",
        variant: "destructive",
      });
      return;
    }
    setBusy(true);
    const ok = await setMain(type, cleanKey, imageId);
    setBusy(false);
    if (ok) {
      toast({
        title: "Hoofdfoto gemarkeerd",
        description: `${CONTEXT_LABELS[type] ?? type}: ${cleanKey}`,
      });
      setNewKey("");
    } else {
      toast({
        title: "Markeren mislukt",
        description: "Probeer opnieuw of bekijk de console.",
        variant: "destructive",
      });
    }
  };

  const remove = async (type: string, key: string) => {
    setBusy(true);
    const ok = await unsetMain(type, key);
    setBusy(false);
    if (ok) {
      toast({
        title: "Markering verwijderd",
        description: `${CONTEXT_LABELS[type] ?? type}: ${key}`,
      });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={cn(
            "h-7 px-2 gap-1",
            isMain && "text-secondary",
          )}
          title={
            isMain
              ? `Hoofdfoto voor ${myContexts.length} context(en)`
              : "Markeer als hoofdfoto"
          }
          aria-label={isMain ? "Bewerk hoofdfoto-markering" : "Markeer als hoofdfoto"}
        >
          <Star
            className={cn(
              size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4",
              isMain && "fill-secondary",
            )}
          />
          {isMain && (
            <span className="text-[10px] font-medium">{myContexts.length}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 p-3 space-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5">
            Hoofdfoto voor
          </p>
          {myContexts.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Nog niet als hoofdfoto gemarkeerd.
            </p>
          ) : (
            <ul className="space-y-1">
              {myContexts.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-2 bg-accent/40 rounded px-2 py-1.5"
                >
                  <span className="text-xs text-primary-deep font-medium truncate">
                    {formatContext(c)}
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(c.contextType, c.contextKey)}
                    disabled={busy}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                    aria-label={`Verwijder ${formatContext(c)}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="border-t pt-2">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1.5 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Slimme suggesties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s) => {
                const already = myContexts.some(
                  (c) =>
                    c.contextType === s.contextType && c.contextKey === s.contextKey,
                );
                return (
                  <Button
                    key={`${s.contextType}:${s.contextKey}`}
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy || already}
                    onClick={() => apply(s.contextType, s.contextKey)}
                    className="h-7 text-[11px] gap-1"
                  >
                    <Star className="w-3 h-3" /> {s.label}
                    {already && " ✓"}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        <div className="border-t pt-2 space-y-2">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
            Nieuwe markering
          </p>
          <div className="grid grid-cols-[100px_1fr] gap-1.5">
            <Select
              value={newType}
              onValueChange={(v) => setNewType(v as ContextType)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unit">Unit</SelectItem>
                <SelectItem value="page">Pagina</SelectItem>
                <SelectItem value="section">Sectie</SelectItem>
                <SelectItem value="category">Categorie</SelectItem>
              </SelectContent>
            </Select>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder={
                newType === "unit"
                  ? "watermolen"
                  : newType === "page"
                    ? "/"
                    : newType === "section"
                      ? "home-hero"
                      : "sfeer"
              }
              className="h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") apply(newType, newKey);
              }}
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => apply(newType, newKey)}
            disabled={busy || !newKey.trim()}
            className="w-full h-7 text-[11px] gap-1"
          >
            <Plus className="w-3 h-3" /> Markeer als hoofdfoto
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground italic leading-snug">
          Bestand: <span className="font-mono">{filename}</span>
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default MainPhotoSelector;
