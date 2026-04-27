/**
 * MediaHistoryPanel — Library overview met DAM-tagging + bulk-acties.
 *
 * Toont laatste 500 image_library rows met thumbnail, status, ID en tags.
 * Per rij: selectie-checkbox, TagSelector (toevoegen/verwijderen).
 * Bulk: zwevende action bar met "tag toevoegen" en "tag verwijderen"
 * voor alle aangevinkte (of alle gefilterde) rijen tegelijk.
 *
 * Filter-balk: zoek op naam/ID/status + multi-select tag-pills (AND).
 */
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Copy,
  Check,
  Tags,
  Plus,
  Minus,
  X,
  ImageOff,
  Star,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagBadge } from "./TagBadge";
import { TagSelector } from "./TagSelector";
import { useUniqueTags } from "@/hooks/useUniqueTags";
import { cfImage } from "@/config/cloudflareImagesConfig";
import { MainPhotoSelector } from "./MainPhotoSelector";
import { useMainPhotos } from "@/hooks/useMainPhotos";

interface LibraryRow {
  id: string;
  filename: string;
  cloudflare_id: string | null;
  status: string;
  error_msg: string | null;
  created_at: string;
  tags: string[];
}

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "success")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-deep bg-accent/60 px-2 py-1 rounded">
        <CheckCircle2 className="w-3.5 h-3.5" /> success
      </span>
    );
  if (status === "failed")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
        <XCircle className="w-3.5 h-3.5" /> failed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
      <Clock className="w-3.5 h-3.5" /> {status}
    </span>
  );
};

const Thumbnail = ({
  cfId,
  alt,
  isMain,
}: {
  cfId: string | null;
  alt: string;
  isMain?: boolean;
}) => {
  const [errored, setErrored] = useState(false);
  return (
    <div className="relative w-14 h-14 shrink-0">
      {!cfId || errored ? (
        <div className="w-14 h-14 rounded bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <ImageOff className="w-5 h-5" />
        </div>
      ) : (
        <img
          src={cfImage(cfId)}
          alt={alt}
          loading="lazy"
          onError={() => setErrored(true)}
          className="w-14 h-14 rounded object-cover bg-muted border border-border"
        />
      )}
      {isMain && (
        <span
          className="absolute -top-1.5 -right-1.5 bg-secondary rounded-full p-0.5 shadow-soft border border-secondary"
          title="Hoofdfoto"
        >
          <Star className="w-3 h-3 fill-primary-deep text-primary-deep" />
        </span>
      )}
    </div>
  );
};

export const MediaHistoryPanel = () => {
  const [rows, setRows] = useState<LibraryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<"add" | "remove">("add");
  const [bulkTag, setBulkTag] = useState<string>("");
  const [bulkBusy, setBulkBusy] = useState(false);
  const { toast } = useToast();
  const { tags: allTags, createTag } = useUniqueTags();
  const { getMainContextsForImage } = useMainPhotos();

  const handleCopy = async (cfId: string) => {
    try {
      await navigator.clipboard.writeText(cfId);
      setCopiedId(cfId);
      toast({
        title: "Gekopieerd",
        description: `Plak in propertyConfig.ts of unitsConfig.ts als imageId.`,
      });
      setTimeout(() => setCopiedId((c) => (c === cfId ? null : c)), 1800);
    } catch {
      toast({
        title: "Kopiëren mislukt",
        description: "Selecteer en kopieer de ID handmatig.",
        variant: "destructive",
      });
    }
  };

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("image_library")
      .select("id, filename, cloudflare_id, status, error_msg, created_at, tags")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) setRows(data as LibraryRow[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const updateRowTags = (id: string, tags: string[]) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, tags } : r)));
  };

  const toggleFilterTag = (label: string) => {
    setActiveTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (q) {
        const hit =
          r.filename.toLowerCase().includes(q) ||
          (r.cloudflare_id ?? "").toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q));
        if (!hit) return false;
      }
      if (activeTags.length > 0) {
        const has = activeTags.every((t) => r.tags.includes(t));
        if (!has) return false;
      }
      return true;
    });
  }, [rows, query, activeTags]);

  const stats = useMemo(() => {
    const total = rows.length;
    const success = rows.filter((r) => r.status === "success").length;
    const failed = rows.filter((r) => r.status === "failed").length;
    const tagged = rows.filter((r) => r.tags.length > 0).length;
    return { total, success, failed, tagged };
  }, [rows]);

  const tagMap = new Map(allTags.map((t) => [t.label, t]));

  // Selectie-helpers
  const filteredIds = useMemo(() => filtered.map((r) => r.id), [filtered]);
  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const someFilteredSelected =
    filteredIds.some((id) => selectedIds.has(id)) && !allFilteredSelected;

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allFilteredSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const applyBulk = async () => {
    const label = bulkTag.trim().toLowerCase();
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

    setBulkBusy(true);

    // Voor "add": maak tag aan als deze nog niet bestaat
    if (bulkAction === "add" && !tagMap.has(label)) {
      await createTag(label, "primary");
    }

    // Haal huidige tags op om correct te mergen/verwijderen
    const { data: current, error: fetchErr } = await supabase
      .from("image_library")
      .select("id, tags")
      .in("id", ids);

    if (fetchErr || !current) {
      setBulkBusy(false);
      toast({
        title: "Bulk-actie mislukt",
        description: fetchErr?.message ?? "Kon huidige tags niet ophalen.",
        variant: "destructive",
      });
      return;
    }

    const updates = current
      .map((r) => {
        const existing: string[] = r.tags ?? [];
        let next: string[] = existing;
        if (bulkAction === "add") {
          if (existing.includes(label)) return null;
          next = [...existing, label];
        } else {
          if (!existing.includes(label)) return null;
          next = existing.filter((t) => t !== label);
        }
        return { id: r.id, tags: next };
      })
      .filter((u): u is { id: string; tags: string[] } => u !== null);

    let okCount = 0;
    let failCount = 0;
    await Promise.all(
      updates.map(async (u) => {
        const { error } = await supabase
          .from("image_library")
          .update({ tags: u.tags })
          .eq("id", u.id);
        if (error) failCount++;
        else {
          okCount++;
          updateRowTags(u.id, u.tags);
        }
      }),
    );

    // Audit log
    await supabase.from("sync_history").insert({
      action: "bulk_tag",
      status: failCount === 0 ? "success" : "partial",
      message: `Bulk ${bulkAction === "add" ? "toegevoegd" : "verwijderd"}: #${label} op ${okCount}/${ids.length} foto(s)`,
      affected_items: ids,
      counts: { ok: okCount, fail: failCount, skipped: ids.length - updates.length },
    });

    setBulkBusy(false);
    toast({
      title: bulkAction === "add" ? "Tags toegevoegd" : "Tags verwijderd",
      description: `#${label} • ${okCount} succes${failCount ? `, ${failCount} mislukt` : ""}${ids.length - updates.length > 0 ? `, ${ids.length - updates.length} overgeslagen` : ""}.`,
    });
    setBulkTag("");
  };

  return (
    <div className="space-y-5 pb-28">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative max-w-md flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Zoek op bestandsnaam, ID, tag of status…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3 text-xs">
          <Stat label="Totaal" value={stats.total} />
          <Stat label="Geslaagd" value={stats.success} />
          <Stat label="Getagd" value={stats.tagged} />
          <Stat label="Mislukt" value={stats.failed} destructive />
        </div>
      </div>

      {/* Tag filter-balk */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-secondary/40 rounded-md border border-border">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground inline-flex items-center gap-1 mr-1">
            <Tags className="w-3 h-3" /> Filter op tag:
          </span>
          {allTags.map((t) => (
            <TagBadge
              key={t.id}
              label={t.label}
              color={t.color}
              active={activeTags.includes(t.label)}
              size="sm"
              onClick={() => toggleFilterTag(t.label)}
            />
          ))}
          {activeTags.length > 0 && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-6 text-[10px] ml-auto"
              onClick={() => setActiveTags([])}
            >
              Wis filters
            </Button>
          )}
        </div>
      )}

      <div className="bg-card rounded-md shadow-soft overflow-hidden border border-border">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Laden…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {rows.length === 0 ? "Nog geen uploads gelogd." : "Geen resultaten."}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={
                      allFilteredSelected
                        ? true
                        : someFilteredSelected
                          ? "indeterminate"
                          : false
                    }
                    onCheckedChange={toggleAllFiltered}
                    aria-label="Selecteer alle gefilterde foto's"
                  />
                </TableHead>
                <TableHead className="w-[80px]">Foto</TableHead>
                <TableHead className="w-[60px]" title="Hoofdfoto-markering">Hoofd</TableHead>
                <TableHead className="w-[28%]">Bestandsnaam</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[28%]">Tags</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => {
                const checked = selectedIds.has(r.id);
                return (
                  <TableRow
                    key={r.id}
                    data-state={checked ? "selected" : undefined}
                  >
                    <TableCell className="align-top">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleRow(r.id)}
                        aria-label={`Selecteer ${r.filename}`}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Thumbnail
                        cfId={r.cloudflare_id}
                        alt={r.filename}
                        isMain={getMainContextsForImage(r.id).length > 0}
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <MainPhotoSelector
                        imageId={r.id}
                        filename={r.filename}
                        cloudflareId={r.cloudflare_id}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="font-medium text-primary-deep align-top">
                      <div className="break-all">{r.filename}</div>
                      {r.cloudflare_id && (
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-muted-foreground font-mono break-all">
                            {r.cloudflare_id}
                          </code>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 shrink-0"
                            onClick={() => handleCopy(r.cloudflare_id!)}
                            title="Kopieer ID"
                            aria-label={`Kopieer ID ${r.cloudflare_id}`}
                          >
                            {copiedId === r.cloudflare_id ? (
                              <Check className="w-3.5 h-3.5 text-primary" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </Button>
                        </div>
                      )}
                      {r.error_msg && (
                        <p className="text-[10px] text-destructive mt-1">
                          {r.error_msg}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      <StatusBadge status={r.status} />
                    </TableCell>
                    <TableCell className="align-top">
                      <TagSelector
                        imageId={r.id}
                        currentTags={r.tags}
                        onChange={(tags) => updateRowTags(r.id, tags)}
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap align-top">
                      {new Date(r.created_at).toLocaleString("nl-BE", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(960px,calc(100vw-2rem))] bg-primary-deep text-primary-foreground rounded-lg shadow-lg border border-primary-deep/40 px-4 py-3 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium">
            {selectedIds.size} geselecteerd
          </span>

          <Select
            value={bulkAction}
            onValueChange={(v) => setBulkAction(v as "add" | "remove")}
          >
            <SelectTrigger className="h-8 w-[160px] bg-background text-foreground text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">
                <span className="inline-flex items-center gap-1.5">
                  <Plus className="w-3 h-3" /> Tag toevoegen
                </span>
              </SelectItem>
              <SelectItem value="remove">
                <span className="inline-flex items-center gap-1.5">
                  <Minus className="w-3 h-3" /> Tag verwijderen
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={bulkTag}
            onChange={(e) => setBulkTag(e.target.value.toLowerCase())}
            placeholder="bv. terras of kamer-b1"
            className="h-8 w-[200px] bg-background text-foreground text-xs"
          />

          {allTags.length > 0 && (
            <Select value="" onValueChange={(v) => setBulkTag(v)}>
              <SelectTrigger className="h-8 w-[160px] bg-background text-foreground text-xs">
                <SelectValue placeholder="of kies tag…" />
              </SelectTrigger>
              <SelectContent>
                {allTags.map((t) => (
                  <SelectItem key={t.id} value={t.label}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            type="button"
            size="sm"
            onClick={applyBulk}
            disabled={bulkBusy || !bulkTag.trim()}
            className="h-8 bg-accent text-primary-deep hover:bg-accent/80"
          >
            {bulkBusy ? "Bezig…" : "Toepassen"}
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={clearSelection}
            className="h-8 ml-auto text-primary-foreground hover:bg-primary-foreground/10"
            aria-label="Selectie wissen"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

const Stat = ({
  label,
  value,
  destructive,
}: {
  label: string;
  value: number;
  destructive?: boolean;
}) => (
  <div className="bg-card px-3 py-2 rounded shadow-soft border border-border">
    <div className="text-muted-foreground">{label}</div>
    <div
      className={`font-display text-lg ${destructive ? "text-destructive" : "text-primary-deep"}`}
    >
      {value}
    </div>
  </div>
);

export default MediaHistoryPanel;
