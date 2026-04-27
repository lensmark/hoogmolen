/**
 * MediaPicker — contextuele image picker modal.
 *
 * Toont alle 'success' uploads uit `image_library` als grid van thumbnails.
 * Features:
 *  - Zoekbalk (filename match)
 *  - Auto-filter pills uit filename-tokens (split op '-')
 *  - Klik op thumb = preview in zijbalk (lighting/styling check)
 *  - Dubbelklik of "Selecteer" knop = bevestig keuze via onSelect callback
 *  - Auto-highlight + sortering van images die `contextSlug` bevatten
 */
import { useEffect, useMemo, useState } from "react";
import { Search, X, Check, Sparkles, AlertTriangle, Pencil, Tags, CheckSquare, Square, Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { clearImageLibraryCache } from "@/hooks/useImageLibrary";
import { cfImage, sanitizeImageId } from "@/config/cloudflareImagesConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { analyseLibraryFilename } from "@/lib/libraryMatchStatus";
import { toast } from "@/hooks/use-toast";
import { TagBadge } from "./TagBadge";
import { useUniqueTags } from "@/hooks/useUniqueTags";

interface LibraryImage {
  id: string;
  filename: string;
  cloudflare_id: string | null;
  created_at: string;
  tags: string[];
  sequence_number: number;
}

export interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Slug of route-fragment om relevante images bovenaan te plaatsen. */
  contextSlug?: string;
  /** Callback met geselecteerde Cloudflare ID (te gebruiken via cfImage()). */
  onSelect: (cloudflareId: string, filename: string) => void;
  /**
   * Embedded modus: render inline (geen Dialog overlay) — gebruikt door
   * de admin Library pagina, zodat de bibliotheek vol-breedte verschijnt
   * zoals galerijbeheer. Default: false (Dialog).
   */
  embedded?: boolean;
}

/** Stop-words die we uit pills filteren (te generiek). */
const STOP_TOKENS = new Set([
  "hoogmolen",
  "verblijf",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]);

/** Extracteer pill-tokens uit een filename (zonder ext). */
const extractTokens = (filename: string): string[] => {
  const base = filename.toLowerCase().replace(/\.[a-z0-9]+$/i, "");
  return base
    .split(/[-_]+/)
    .filter((t) => t.length >= 2 && !STOP_TOKENS.has(t) && !/^\d+$/.test(t));
};

const titleCase = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");

const MediaPicker = ({
  open,
  onOpenChange,
  contextSlug,
  onSelect,
  embedded = false,
}: MediaPickerProps) => {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState<string | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "match" | "loose" | "off" | "exempt">("all");
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [renaming, setRenaming] = useState(false);
  const { tags: allTags, createTag } = useUniqueTags();

  // ── Bulk selection ────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkTagInput, setBulkTagInput] = useState("");
  const [bulkApplying, setBulkApplying] = useState(false);

  const toggleSelected = (id: string) =>
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const clearSelection = () => setSelectedIds(new Set());

  const reloadImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("image_library")
      .select("id, filename, cloudflare_id, created_at, tags, sequence_number")
      .eq("status", "success")
      .not("cloudflare_id", "is", null)
      .order("created_at", { ascending: false })
      .limit(1000);
    if (!error && data) setImages(data as unknown as LibraryImage[]);
    setLoading(false);
  };

  /** Fetch on open (of altijd, in embedded modus). */
  useEffect(() => {
    if (!embedded && !open) {
      // Reset bulk-state bij sluiten — geen vergeten selecties bij volgende open.
      clearSelection();
      setBulkTagInput("");
      return;
    }
    let cancelled = false;
    (async () => {
      await reloadImages();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [open, embedded]);

  /**
   * Volgnummer per foto — komt rechtstreeks uit de database (kolom
   * `sequence_number`). Oudste = #1; nieuwe uploads krijgen automatisch
   * MAX+1 via DB-trigger `assign_image_sequence_number`.
   */
  const sequenceMap = useMemo(() => {
    const map = new Map<string, number>();
    images.forEach((img) => map.set(img.id, img.sequence_number));
    return map;
  }, [images]);

  /** Top-frequency tokens als pills. */
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
      .slice(0, 16)
      .map(([t]) => t);
  }, [images]);

  /** Filter + sort: contextSlug-matches eerst. */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ctx = (contextSlug ?? "").toLowerCase().replace(/^\/+|\/+$/g, "");
    const ctxTokens = ctx.split(/[\/-]+/).filter((t) => t.length >= 3);

    const matches = images.filter((img) => {
      const f = img.filename.toLowerCase();
      if (q && !f.includes(q) && !(img.cloudflare_id ?? "").toLowerCase().includes(q) && !img.tags.some((t) => t.includes(q))) {
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
      const aHit = ctxTokens.some((t) => a.filename.toLowerCase().includes(t)) ? 1 : 0;
      const bHit = ctxTokens.some((t) => b.filename.toLowerCase().includes(t)) ? 1 : 0;
      if (aHit !== bHit) return bHit - aHit;
      return a.filename.localeCompare(b.filename);
    });
  }, [images, query, activePill, activeTags, statusFilter, contextSlug]);

  /** Tellers per status — voor filter-knoppen. */
  const statusCounts = useMemo(() => {
    const c = { match: 0, loose: 0, off: 0, exempt: 0 };
    images.forEach((img) => {
      const s = analyseLibraryFilename(img.filename, img.tags).status;
      c[s] += 1;
    });
    return c;
  }, [images]);

  const isContextHit = (filename: string): boolean => {
    const ctx = (contextSlug ?? "").toLowerCase();
    if (!ctx) return false;
    const tokens = ctx.split(/[\/-]+/).filter((t) => t.length >= 3);
    return tokens.some((t) => filename.toLowerCase().includes(t));
  };

  const previewImg = images.find((i) => i.id === previewId) ?? filtered[0] ?? null;
  const previewMatch = previewImg ? analyseLibraryFilename(previewImg.filename, previewImg.tags) : null;

  // Reset rename-veld zodra een andere foto wordt gekozen.
  useEffect(() => {
    if (previewImg) {
      const base = previewImg.filename.replace(/\.[a-z0-9]+$/i, "");
      setRenameValue(base);
    }
  }, [previewImg?.id]);

  const confirmSelection = () => {
    if (previewImg?.cloudflare_id) {
      onSelect(previewImg.cloudflare_id, previewImg.filename);
      onOpenChange(false);
    }
  };

  /**
   * Rename via cf-rename edge function — verplicht pad sinds v4.9.0.
   *
   * De edge function:
   *  1. Downloadt de originele Cloudflare-asset
   *  2. Re-uploadt onder de nieuwe custom ID
   *  3. Verwijdert het oude asset
   *  4. Update image_library (cloudflare_id + filename)
   *  5. Schrijft een image_aliases-rij zodat oude code-referenties blijven werken
   *
   * Hierdoor blijven Cloudflare en de DB altijd in sync — een latere
   * cf-sync run kan de naam nooit meer overschrijven.
   */
  const renameImage = async () => {
    if (!previewImg || !previewImg.cloudflare_id) return;
    const newId = sanitizeImageId(renameValue);
    if (!newId) {
      toast({ title: "Ongeldige naam", description: "Voer een geldige bestandsnaam in.", variant: "destructive" });
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
    // Wis lokale cache zodat de nieuwe naam direct verschijnt — zonder
    // dat een latere cf-sync run de wijziging kan overschrijven.
    await clearImageLibraryCache();
    await reloadImages();
  };

  // ── Selecteer-alle-gefilterde helpers ─────────────────────────────
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

  /**
   * Bulk-tag toepassen: voegt één tag toe aan ALLE geselecteerde rijen.
   * Strategie: lees huidige tags → merge → batch upsert via één .in()-update
   * per nieuwe tag-array vorm. Omdat tags per rij verschillen doen we één
   * upsert met de volledige rij-payloads; Supabase doet dat in één HTTP-call.
   * Realtime-listeners op image_library refetchen daarna automatisch.
   */
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

    // Tag aanmaken indien onbekend (no-op als hij al bestaat).
    if (!allTags.some((t) => t.label === label)) {
      await createTag(label, "primary");
    }

    // Lees alle rijen, merge tags, batch-update via upsert.
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

    // Per-rij update is hier nodig omdat tags per rij verschillen.
    // Promise.all is snel genoeg (≤ paar honderd rijen).
    const results = await Promise.all(
      updates.map((u) =>
        supabase.from("image_library").update({ tags: u.tags }).eq("id", u.id),
      ),
    );
    const failed = results.filter((r) => r.error).length;

    // Audit-log naar sync_history (niet-blokkerend bij fout).
    void supabase.from("sync_history").insert({
      action: "bulk_tag",
      status: failed === 0 ? "success" : "partial",
      message: `Bulk-tag "${label}" toegepast op ${updates.length - failed}/${updates.length} foto's.`,
      affected_items: updates.map((u) => u.id),
      counts: { applied: updates.length - failed, failed, total: ids.length },
    });

    setBulkApplying(false);
    if (failed > 0) {
      toast({
        title: `${failed} update(s) mislukt`,
        description: `${updates.length - failed} van ${updates.length} foto's getagd met "${label}".`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Bulk-tag toegepast",
        description: `${updates.length} foto's getagd met "${label}".`,
      });
    }
    setBulkTagInput("");
    await reloadImages();
  };

  // ── Body als render-prop zodat we 'm in Dialog of inline kunnen mounten ──
  const body = (
    <>
      <div className={cn(
        "px-6 pt-6 pb-3 border-b",
        embedded && "px-0 pt-0",
      )}>
        {!embedded && (
          <>
            <h2 className="font-display text-2xl text-primary-deep">
              Foto kiezen uit bibliotheek
            </h2>
            <p className="text-xs text-muted-foreground">
              {contextSlug ? (
                <>
                  Context: <span className="font-mono">{contextSlug}</span> — relevante
                  foto's staan bovenaan.
                </>
              ) : (
                "Filter, klik om te previewen, dubbelklik of bevestig om te kiezen."
              )}
            </p>
          </>
        )}
      </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Zoek op bestandsnaam…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Status-filter: zichtbaar maken welke foto's wel/niet automatisch
              op een pagina verschijnen volgens de naamconventie. */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground mr-1">Status:</span>
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

          {/* Tag filter */}
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
              {activeTags.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTags([])}
                  className="text-[10px] text-muted-foreground hover:text-primary-deep underline ml-1"
                >
                  wis
                </button>
              )}
            </div>
          )}

          {pills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
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

        {/* Body: grid + preview */}
        <div className="flex-1 flex min-h-0">
          {/* Grid */}
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Bibliotheek laden…
              </p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-12">
                Geen afbeeldingen gevonden.
              </p>
            ) : (
              <>
                {/* Bulk-selectie header */}
                <div className="flex items-center justify-between mb-3 px-1">
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
                    <span className="text-[11px] font-medium text-primary-deep">
                      {selectedIds.size} geselecteerd
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filtered.map((img) => {
                  const hit = isContextHit(img.filename);
                  const selected = previewImg?.id === img.id;
                  const isChecked = selectedIds.has(img.id);
                  const matchInfo = analyseLibraryFilename(img.filename, img.tags);
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setPreviewId(img.id)}
                      onDoubleClick={() => {
                        setPreviewId(img.id);
                        if (img.cloudflare_id) {
                          onSelect(img.cloudflare_id, img.filename);
                          onOpenChange(false);
                        }
                      }}
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
                                : hit
                                  ? "border-primary/60"
                                  : "border-transparent hover:border-primary/40",
                      )}
                    >
                      {/* Bulk-select checkbox overlay (stop click bubbling) */}
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
                      {/* Volgnummer-overlay — rechtsboven, vast nummer uit DB */}
                      <span
                        className="absolute top-1.5 right-1.5 z-10 inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-md bg-primary-deep/95 text-primary-foreground text-xs font-semibold font-mono tabular-nums shadow-elegant pointer-events-none ring-1 ring-primary-foreground/20"
                        aria-label={`Foto nummer ${sequenceMap.get(img.id) ?? "?"}`}
                      >
                        #{sequenceMap.get(img.id) ?? "?"}
                      </span>
                      {/* Status-badge: één per foto. Match wint van context-hit. */}
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
                      ) : hit ? (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                          <Sparkles className="w-3 h-3" /> match
                        </span>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 inline-flex items-center gap-1 text-[10px] font-medium bg-primary/80 text-primary-foreground px-1.5 py-0.5 rounded capitalize">
                          {matchInfo.unit}
                        </span>
                      )}
                      {/* Tag-pills — linksonder (max 2), boven de filename-strook */}
                      {img.tags.length > 0 && (
                        <div className="absolute bottom-7 left-1.5 flex flex-wrap gap-0.5 max-w-[60%]">
                          {img.tags.slice(0, 2).map((t) => (
                            <span
                              key={t}
                              className="text-[9px] bg-primary-deep/80 text-primary-foreground px-1.5 py-0.5 rounded-full capitalize"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                        <p className="text-[10px] text-white truncate font-mono">
                          {img.filename}
                        </p>
                      </div>
                    </button>
                  );
                })}
                </div>
              </>
            )}
          </ScrollArea>

          {/* Preview-zijbalk */}
          <aside className="hidden md:flex w-80 border-l bg-muted/30 flex-col">
            {previewImg ? (
              <>
                <div className="aspect-square bg-background border-b">
                  {previewImg.cloudflare_id && (
                    <img
                      src={cfImage(previewImg.cloudflare_id)}
                      alt={previewImg.filename}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                <div className="p-4 space-y-3 flex-1 overflow-auto">
                  {/* Match-status panel */}
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
                            ? "★ Sfeerfoto — vrijgesteld van naamconventie"
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

                  {/* Tags op deze foto */}
                  {previewImg.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {previewImg.tags.map((t) => (
                        <TagBadge key={t} label={t} size="sm" />
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2 rounded-md bg-primary-deep text-primary-foreground text-xs font-semibold font-mono tabular-nums">
                      #{sequenceMap.get(previewImg.id) ?? "?"}
                    </span>
                    <p className="text-xs font-mono break-all text-primary-deep">
                      {previewImg.filename}
                    </p>
                  </div>
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

                  {/* Rename-formulier */}
                  <div className="pt-2 border-t space-y-1.5">
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
                      naam aan <span className="font-mono">hoogmolen-verblijf-&lt;unit&gt;-…-NN</span> voldoet.
                    </p>
                  </div>
                </div>
                <div className="p-3 border-t bg-background flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    <X className="w-3.5 h-3.5 mr-1" /> Annuleer
                  </Button>
                  <Button
                    size="sm"
                    onClick={confirmSelection}
                    className="flex-1"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Selecteer
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground text-center p-6">
                Klik een foto om te previewen.
              </p>
            )}
          </aside>
        </div>

        {/* ── Bulk Action Bar (drijft onderaan zodra er items geselecteerd zijn) ── */}
        {selectedIds.size > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary-deep text-primary-foreground rounded-lg shadow-elegant border border-primary/40 px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-4 max-w-[95%]">
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
              className="h-8 w-44 text-xs bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:ring-accent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && bulkTagInput.trim()) applyBulkTag();
              }}
            />

            {/* Quick-pick uit bestaande tags */}
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
              className="h-8 bg-accent text-primary-deep hover:bg-accent/80 gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              {bulkApplying ? "Toepassen…" : "Apply Tags to Filtered"}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="h-8 text-primary-foreground hover:bg-background/10 gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Wis
            </Button>
          </div>
        )}
    </>
  );

  if (embedded) {
    return (
      <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] border border-border rounded-lg overflow-hidden bg-background relative">
        {body}
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Foto kiezen uit bibliotheek</DialogTitle>
          <DialogDescription>Bibliotheek met zoek, filter en bulk-acties.</DialogDescription>
        </DialogHeader>
        {body}
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;
