/**
 * AdminLibrary — Volledige fotobibliotheek als echte HTML-pagina (v4.21.6).
 *
 * Geen MediaPicker-overlay meer: dit is een dedicated full-page beheerscherm
 * met eigen layout. Functies:
 *   - Zoeken op bestandsnaam / cloudflare-ID / tags
 *   - Filteren op naamconventie-status (match / sfeer / loose / off)
 *   - Filteren op unique tags
 *   - Sorteren op volgnummer of datum (asc/desc)
 *   - Volgnummer-overlay rechtsboven op elke thumbnail (uit DB-veld
 *     `sequence_number`, oudste = #1, nieuwe upload = MAX+1 via trigger)
 *   - Klik = preview-zijbalk met hernoem-veld + bulk-acties
 *   - Bulk-selectie + bulk-tag toevoegen
 */
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Pencil,
  Tags,
  CheckSquare,
  Square,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clearImageLibraryCache } from "@/hooks/useImageLibrary";
import { cfImage, sanitizeImageId } from "@/config/cloudflareImagesConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { analyseLibraryFilename } from "@/lib/libraryMatchStatus";
import { toast } from "@/hooks/use-toast";
import { TagBadge } from "@/components/admin/TagBadge";
import { useUniqueTags } from "@/hooks/useUniqueTags";

interface LibraryImage {
  id: string;
  filename: string;
  cloudflare_id: string | null;
  created_at: string;
  tags: string[];
  sequence_number: number;
}

type SortMode = "seq-asc" | "seq-desc" | "date-desc" | "date-asc" | "name-asc";
type StatusFilter = "all" | "match" | "loose" | "off" | "exempt";

const STOP_TOKENS = new Set([
  "hoogmolen", "verblijf",
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
]);

const extractTokens = (filename: string): string[] => {
  const base = filename.toLowerCase().replace(/\.[a-z0-9]+$/i, "");
  return base
    .split(/[-_]+/)
    .filter((t) => t.length >= 2 && !STOP_TOKENS.has(t) && !/^\d+$/.test(t));
};

const titleCase = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

const AdminLibrary = () => {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("seq-asc");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [bulkApplying, setBulkApplying] = useState(false);
  const { tags: allTags, createTag } = useUniqueTags();

  const reloadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("image_library")
      .select("id, filename, cloudflare_id, created_at, tags, sequence_number")
      .eq("status", "success")
      .not("cloudflare_id", "is", null)
      .order("sequence_number", { ascending: true })
      .limit(2000);
    if (!error && data) setImages(data as unknown as LibraryImage[]);
    setLoading(false);
  };

  useEffect(() => {
    void reloadImages();
  }, []);

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const clearSelection = () => setSelectedIds(new Set());

  const pills = useMemo(() => {
    const freq = new Map<string, number>();
    images.forEach((img) =>
      extractTokens(img.filename).forEach((t) =>
        freq.set(t, (freq.get(t) ?? 0) + 1),
      ),
    );
    return Array.from(freq.entries())
      .filter(([, n]) => n >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 18)
      .map(([t]) => t);
  }, [images]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = images.filter((img) => {
      const f = img.filename.toLowerCase();
      if (
        q &&
        !f.includes(q) &&
        !(img.cloudflare_id ?? "").toLowerCase().includes(q) &&
        !img.tags.some((t) => t.includes(q)) &&
        !`#${img.sequence_number}`.includes(q)
      ) {
        return false;
      }
      if (activePill && !f.includes(activePill)) return false;
      if (activeTags.length > 0 && !activeTags.every((t) => img.tags.includes(t))) {
        return false;
      }
      if (statusFilter !== "all") {
        const a = analyseLibraryFilename(img.filename, img.tags);
        if (a.status !== statusFilter) return false;
      }
      return true;
    });

    return matches.sort((a, b) => {
      switch (sortMode) {
        case "seq-asc":
          return a.sequence_number - b.sequence_number;
        case "seq-desc":
          return b.sequence_number - a.sequence_number;
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "name-asc":
          return a.filename.localeCompare(b.filename);
      }
    });
  }, [images, query, activePill, activeTags, statusFilter, sortMode]);

  const statusCounts = useMemo(() => {
    const c = { match: 0, loose: 0, off: 0, exempt: 0 };
    images.forEach((img) => {
      const s = analyseLibraryFilename(img.filename, img.tags).status;
      c[s] += 1;
    });
    return c;
  }, [images]);

  const previewImg = images.find((i) => i.id === previewId) ?? filtered[0] ?? null;
  const previewMatch = previewImg
    ? analyseLibraryFilename(previewImg.filename, previewImg.tags)
    : null;

  useEffect(() => {
    if (previewImg) {
      const base = previewImg.filename.replace(/\.[a-z0-9]+$/i, "");
      setRenameValue(base);
    }
  }, [previewImg?.id]);

  const renameImage = async () => {
    if (!previewImg || !previewImg.cloudflare_id) return;
    const newId = sanitizeImageId(renameValue);
    if (!newId) {
      toast({
        title: "Ongeldige naam",
        description: "Voer een geldige bestandsnaam in.",
        variant: "destructive",
      });
      return;
    }
    if (newId === previewImg.cloudflare_id) {
      toast({ title: "Geen wijziging", description: "Dit is dezelfde naam." });
      return;
    }
    setRenaming(true);
    const { data, error } = await supabase.functions.invoke("cf-rename", {
      body: { oldId: previewImg.cloudflare_id, newId },
    });
    setRenaming(false);
    if (error || (data && (data as { error?: string }).error)) {
      const msg =
        (data as { error?: string } | null)?.error ??
        error?.message ??
        "Onbekende fout";
      toast({
        title: "Hernoemen mislukt",
        description: msg.includes("5409") || msg.toLowerCase().includes("duplicate")
          ? "Deze naam is al in gebruik door een andere foto."
          : msg,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Hernoemd", description: `Nieuwe naam: ${newId}` });
    await clearImageLibraryCache();
    await reloadImages();
  };

  const filteredIds = useMemo(() => filtered.map((i) => i.id), [filtered]);
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected =
    !allFilteredSelected && filteredIds.some((id) => selectedIds.has(id));
  const toggleAllFiltered = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  };

  const applyBulkTag = async () => {
    const label = bulkTagInput.trim().toLowerCase();
    if (!/^[a-z0-9-]{2,32}$/.test(label)) {
      toast({
        title: "Ongeldige tag",
        description: "Gebruik 2-32 tekens, alleen a-z, 0-9, en -.",
        variant: "destructive",
      });
      return;
    }
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkApplying(true);
    if (!allTags.some((t) => t.label === label)) {
      await createTag(label, "primary");
    }
    const { data: rows, error: readErr } = await supabase
      .from("image_library")
      .select("id, tags")
      .in("id", ids);
    if (readErr || !rows) {
      setBulkApplying(false);
      toast({
        title: "Bulk-update mislukt",
        description: readErr?.message ?? "Kon huidige tags niet lezen.",
        variant: "destructive",
      });
      return;
    }
    const updates = rows
      .filter((r) => !(r.tags ?? []).includes(label))
      .map((r) => ({ id: r.id, tags: [...(r.tags ?? []), label] }));
    if (updates.length === 0) {
      setBulkApplying(false);
      toast({
        title: "Geen wijziging",
        description: `Alle ${ids.length} foto's hebben tag "${label}" al.`,
      });
      return;
    }
    const results = await Promise.all(
      updates.map((u) =>
        supabase.from("image_library").update({ tags: u.tags }).eq("id", u.id),
      ),
    );
    const failed = results.filter((r) => r.error).length;
    void supabase.from("sync_history").insert({
      action: "bulk_tag",
      status: failed === 0 ? "success" : "partial",
      message: `Bulk-tag "${label}" toegepast op ${updates.length - failed}/${updates.length} foto's.`,
      affected_items: updates.map((u) => u.id),
      counts: { applied: updates.length - failed, failed, total: ids.length },
    });
    setBulkApplying(false);
    toast({
      title: failed > 0 ? `${failed} update(s) mislukt` : "Bulk-tag toegepast",
      description: `${updates.length - failed} van ${updates.length} foto's getagd met "${label}".`,
      variant: failed > 0 ? "destructive" : undefined,
    });
    setBulkTagInput("");
    await reloadImages();
  };

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl text-primary-deep">Fotobibliotheek</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Volledige bibliotheek met zoek, filter, tags en hernoem-acties.
            Elke foto heeft een vast volgnummer (oudste = #1) — zichtbaar
            rechtsboven op de thumbnail.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            <strong className="text-primary-deep">{images.length}</strong> foto's totaal
          </span>
          <span className="inline-flex items-center gap-1.5">
            <strong className="text-primary-deep">{filtered.length}</strong> zichtbaar
          </span>
        </div>
      </header>

      {/* Toolbar */}
      <div className="rounded-lg border bg-background p-4 space-y-3 shadow-soft">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam, ID, tag of #nummer…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-9 text-xs bg-background border rounded px-2 text-foreground"
              aria-label="Sorteer-volgorde"
            >
              <option value="seq-asc">Nummer ↑ (#1 eerst)</option>
              <option value="seq-desc">Nummer ↓ (nieuwste eerst)</option>
              <option value="date-desc">Datum ↓ (recentst eerst)</option>
              <option value="date-asc">Datum ↑ (oudst eerst)</option>
              <option value="name-asc">Naam A→Z</option>
            </select>
          </div>

          {(query || activePill || activeTags.length > 0 || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setQuery("");
                setActivePill(null);
                setActiveTags([]);
                setStatusFilter("all");
              }}
              className="text-xs h-9"
            >
              <X className="w-3.5 h-3.5 mr-1" /> Wis filters
            </Button>
          )}
        </div>

        {/* Status-filter */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
            Status:
          </span>
          {([
            { key: "all", label: `Alles (${images.length})`, color: "bg-background" },
            { key: "match", label: `✓ Match (${statusCounts.match})`, color: "bg-primary/10 text-primary-deep border-primary/40" },
            { key: "exempt", label: `★ Sfeer (${statusCounts.exempt})`, color: "bg-secondary text-primary-deep border-secondary" },
            { key: "loose", label: `~ Onbekende unit (${statusCounts.loose})`, color: "bg-accent text-primary-deep border-accent" },
            { key: "off", label: `✗ Niet conform (${statusCounts.off})`, color: "bg-destructive/10 text-destructive border-destructive/40" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setStatusFilter(opt.key)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition",
                statusFilter === opt.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : opt.color,
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1 inline-flex items-center gap-1">
              <Tags className="w-3 h-3" /> Tags:
            </span>
            {allTags.map((t) => (
              <TagBadge
                key={t.id}
                label={t.label}
                color={t.color}
                active={activeTags.includes(t.label)}
                size="sm"
                onClick={() =>
                  setActiveTags((prev) =>
                    prev.includes(t.label)
                      ? prev.filter((x) => x !== t.label)
                      : [...prev, t.label],
                  )
                }
              />
            ))}
          </div>
        )}

        {/* Auto-pills uit filename-tokens */}
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">
              Onderwerp:
            </span>
            <button
              type="button"
              onClick={() => setActivePill(null)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition",
                activePill === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:bg-accent/40",
              )}
            >
              Alles
            </button>
            {pills.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setActivePill(activePill === p ? null : p)}
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full border transition capitalize",
                  activePill === p
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-accent/40",
                )}
              >
                {titleCase(p)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body: grid + preview-zijbalk */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-[60vh]">
        {/* Grid */}
        <div className="rounded-lg border bg-background shadow-soft overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b flex items-center justify-between bg-muted/40">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <Checkbox
                checked={allFilteredSelected}
                onCheckedChange={toggleAllFiltered}
                aria-label="Selecteer alle gefilterde resultaten"
                className={cn(someFilteredSelected && "data-[state=unchecked]:bg-primary/20")}
              />
              Selecteer alle gefilterde resultaten ({filtered.length})
            </label>
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={clearSelection}
                className="text-[11px] text-primary-deep hover:underline font-medium"
              >
                Deselecteer alles ({selectedIds.size})
              </button>
            )}
          </div>

          <ScrollArea className="flex-1 p-3">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Bibliotheek laden…
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Geen afbeeldingen gevonden.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((img) => {
                  const selected = previewImg?.id === img.id;
                  const isChecked = selectedIds.has(img.id);
                  const matchInfo = analyseLibraryFilename(img.filename, img.tags);
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPreviewId(img.id)}
                      className={cn(
                        "group relative aspect-square rounded-md overflow-hidden border-2 transition shadow-soft text-left",
                        isChecked
                          ? "border-primary-deep ring-2 ring-primary-deep/40"
                          : selected
                            ? "border-primary ring-2 ring-primary/40"
                            : matchInfo.status === "off"
                              ? "border-destructive/40"
                              : matchInfo.status === "loose"
                                ? "border-accent"
                                : "border-transparent hover:border-primary/40",
                      )}
                    >
                      {/* Bulk-select checkbox (linksonder) */}
                      <span
                        role="checkbox"
                        aria-checked={isChecked}
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelected(img.id);
                        }}
                        className={cn(
                          "absolute bottom-1.5 right-1.5 z-10 w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition shadow-soft",
                          isChecked
                            ? "bg-primary-deep text-primary-foreground"
                            : "bg-background/90 text-muted-foreground opacity-0 group-hover:opacity-100",
                        )}
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </span>

                      {img.cloudflare_id && (
                        <img
                          src={cfImage(img.cloudflare_id)}
                          alt={img.filename}
                          loading="lazy"
                          className="w-full h-full object-cover transition group-hover:scale-105"
                        />
                      )}

                      {/* Volgnummer-overlay — RECHTSBOVEN, vast nummer uit DB */}
                      <span
                        className="absolute top-1.5 right-1.5 z-10 inline-flex items-center justify-center min-w-[34px] h-7 px-2 rounded-md bg-primary-deep/95 text-primary-foreground text-xs font-bold font-mono tabular-nums shadow-elegant pointer-events-none ring-1 ring-primary-foreground/20"
                        aria-label={`Foto nummer ${img.sequence_number}`}
                      >
                        #{img.sequence_number}
                      </span>

                      {/* Status-badge: linksboven */}
                      {matchInfo.status === "exempt" ? (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-secondary text-primary-deep px-1.5 py-0.5 rounded">
                          ★ sfeer
                        </span>
                      ) : matchInfo.status === "off" ? (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> niet conform
                        </span>
                      ) : matchInfo.status === "loose" ? (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-accent text-primary-deep px-1.5 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" /> {matchInfo.unit ?? "?"}
                        </span>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded capitalize">
                          <Sparkles className="w-3 h-3" /> {matchInfo.unit}
                        </span>
                      )}

                      {/* Tag-pills linksonder (max 2) */}
                      {img.tags.length > 0 && (
                        <div className="absolute bottom-7 left-1.5 flex flex-wrap gap-0.5 max-w-[60%]">
                          {img.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] bg-primary-deep/85 text-primary-foreground px-1.5 py-0.5 rounded-full capitalize"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Filename-strook onderaan */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-1.5 pr-9">
                        <p className="text-[10px] text-white truncate font-mono">
                          {img.filename}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Preview-zijbalk */}
        <aside className="rounded-lg border bg-muted/30 shadow-soft flex flex-col overflow-hidden lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)]">
          {previewImg ? (
            <>
              <div className="aspect-square bg-background border-b relative">
                {previewImg.cloudflare_id && (
                  <img
                    src={cfImage(previewImg.cloudflare_id)}
                    alt={previewImg.filename}
                    className="w-full h-full object-contain"
                  />
                )}
                <span className="absolute top-2 right-2 inline-flex items-center justify-center min-w-[40px] h-8 px-2.5 rounded-md bg-primary-deep text-primary-foreground text-sm font-bold font-mono tabular-nums shadow-elegant ring-1 ring-primary-foreground/30">
                  #{previewImg.sequence_number}
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                  {previewMatch && (
                    <div
                      className={cn(
                        "rounded-md p-2.5 text-[11px] border",
                        previewMatch.status === "match"
                          ? "bg-primary/5 border-primary/30 text-primary-deep"
                          : previewMatch.status === "exempt"
                            ? "bg-secondary border-secondary text-primary-deep"
                            : previewMatch.status === "loose"
                              ? "bg-accent/40 border-accent text-primary-deep"
                              : "bg-destructive/5 border-destructive/30 text-destructive",
                      )}
                    >
                      <p className="font-medium uppercase tracking-wide text-[10px] mb-0.5">
                        {previewMatch.status === "match"
                          ? `✓ Verschijnt op ${previewMatch.unit}-pagina`
                          : previewMatch.status === "exempt"
                            ? "★ Sfeerfoto — vrijgesteld"
                            : previewMatch.status === "loose"
                              ? "~ Onbekende of onvolledige naam"
                              : "✗ Volgt conventie niet"}
                      </p>
                      {previewMatch.reason && <p>{previewMatch.reason}</p>}
                      {previewMatch.locationId && (
                        <p className="font-mono text-[10px] mt-1 opacity-80">
                          → {previewMatch.locationId}
                        </p>
                      )}
                    </div>
                  )}

                  {previewImg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {previewImg.tags.map((t) => (
                        <TagBadge key={t} label={t} size="sm" />
                      ))}
                    </div>
                  )}

                  <p className="text-xs font-mono break-all text-primary-deep">
                    {previewImg.filename}
                  </p>
                  {previewImg.cloudflare_id && (
                    <p className="text-[10px] font-mono text-muted-foreground break-all">
                      ID: {previewImg.cloudflare_id}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground">
                    Geüpload:{" "}
                    {new Date(previewImg.created_at).toLocaleString("nl-BE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>

                  <div className="pt-3 border-t space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
                      <Pencil className="w-3 h-3" /> Hernoem (zonder extensie)
                    </label>
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="text-xs font-mono h-8"
                      placeholder="hoogmolen-verblijf-watermolen-keuken-01"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={renameImage}
                      disabled={renaming}
                      className="w-full h-7 text-[11px]"
                    >
                      {renaming ? "Hernoemen…" : "Hernoem en match opnieuw"}
                    </Button>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      De foto verschijnt automatisch in de juiste gallery zodra de
                      naam aan{" "}
                      <span className="font-mono">
                        hoogmolen-verblijf-&lt;unit&gt;-…-NN
                      </span>{" "}
                      voldoet.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : (
            <p className="text-xs text-muted-foreground text-center p-6">
              Klik een foto om te previewen.
            </p>
          )}
        </aside>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary-deep text-primary-foreground rounded-lg shadow-elegant border border-primary/40 px-4 py-3 flex items-center gap-3 max-w-[95vw]">
          <div className="flex items-center gap-2 pr-3 border-r border-primary-foreground/20">
            <CheckSquare className="w-4 h-4" />
            <span className="text-sm font-medium whitespace-nowrap">
              {selectedIds.size} geselecteerd
            </span>
          </div>
          <Tags className="w-4 h-4 opacity-70" />
          <Input
            value={bulkTagInput}
            onChange={(e) => setBulkTagInput(e.target.value.toLowerCase())}
            placeholder="tag (bv. kamer-b1)"
            className="h-8 w-44 text-xs bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && bulkTagInput.trim()) applyBulkTag();
            }}
          />
          {allTags.length > 0 && (
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) setBulkTagInput(e.target.value);
              }}
              className="h-8 text-xs bg-background/10 border border-primary-foreground/20 rounded px-2 text-primary-foreground"
              aria-label="Kies bestaande tag"
            >
              <option value="" className="text-foreground">Bestaand…</option>
              {allTags.map((t) => (
                <option key={t.id} value={t.label} className="text-foreground">
                  #{t.label}
                </option>
              ))}
            </select>
          )}
          <Button
            type="button"
            size="sm"
            onClick={applyBulkTag}
            disabled={bulkApplying || !bulkTagInput.trim()}
            variant="secondary"
          >
            {bulkApplying ? "Toepassen…" : "Tag toevoegen"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearSelection}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminLibrary;
