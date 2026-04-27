/**
 * MediaIssuesPanel — Issue Dashboard voor naamconventie-violations.
 *
 * Toont alle image_library rows die NIET voldoen aan
 *   hoogmolen-verblijf-<unit>-<onderdeel>-<NN>
 * en biedt een rename-actie die via de cf-rename edge function:
 *   1. de Cloudflare image kopieert onder de nieuwe ID
 *   2. de originele verwijdert
 *   3. de DB-rij bijwerkt
 *
 * Suggested rename = best-effort via analyseLibraryFilename.
 * De suggestie is bewerkbaar voor de gebruiker submit.
 */
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Wand2, RefreshCw, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { analyseLibraryFilename, type LibraryMatchStatus } from "@/lib/libraryMatchStatus";
import { clearImageLibraryCache } from "@/hooks/useImageLibrary";
import { clearAliasCache } from "@/hooks/useImageAliases";

interface IssueRow {
  id: string;
  cloudflareId: string;
  filename: string;
  status: LibraryMatchStatus;
  reason?: string;
  suggestedRename?: string;
  unit?: string;
}

const StatusBadge = ({ status }: { status: LibraryMatchStatus }) => {
  if (status === "off")
    return (
      <Badge variant="destructive" className="font-mono text-[10px] uppercase">
        off-convention
      </Badge>
    );
  return (
    <Badge className="bg-accent/60 text-primary-deep border border-accent hover:bg-accent/80 font-mono text-[10px] uppercase">
      loose
    </Badge>
  );
};

export const MediaIssuesPanel = () => {
  const [rows, setRows] = useState<IssueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [renaming, setRenaming] = useState<IssueRow | null>(null);
  const [newId, setNewId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("image_library")
        .select("id, filename, cloudflare_id, tags")
        .eq("status", "success")
        .order("created_at", { ascending: false })
        .limit(1000);

      if (cancelled) return;
      if (error || !data) {
        setRows([]);
        setLoading(false);
        return;
      }

      const issues: IssueRow[] = [];
      for (const r of data) {
        if (!r.cloudflare_id) continue;
        const analysis = analyseLibraryFilename(r.cloudflare_id, r.tags ?? []);
        // exempt + match worden niet als issue getoond.
        if (analysis.status === "match" || analysis.status === "exempt") continue;
        issues.push({
          id: r.id,
          cloudflareId: r.cloudflare_id,
          filename: r.filename,
          status: analysis.status,
          reason: analysis.reason,
          suggestedRename: analysis.suggestedRename ?? r.cloudflare_id,
          unit: analysis.unit,
        });
      }
      setRows(issues);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const stats = useMemo(() => {
    const off = rows.filter((r) => r.status === "off").length;
    const loose = rows.filter((r) => r.status === "loose").length;
    return { total: rows.length, off, loose };
  }, [rows]);

  const openRename = (row: IssueRow) => {
    setRenaming(row);
    // Best-effort suggestie: voor "loose" met onbekende unit suggereren we
    // duplexsuite-vervanging als de originele 'suite' bevat.
    const suggested = row.cloudflareId.includes("suite-a")
      ? row.cloudflareId.replace(/(^|-)suite-(a[1-6])/i, "$1duplexsuite-$2")
      : row.suggestedRename ?? row.cloudflareId;
    setNewId(suggested);
  };

  const performRename = async (oldId: string, rawNewId: string): Promise<boolean> => {
    const trimmed = rawNewId.trim().toLowerCase();
    if (!/^[a-z0-9_-]{1,128}$/.test(trimmed)) {
      toast({
        title: "Ongeldige nieuwe ID",
        description: "Gebruik a-z, 0-9, - en _ (max 128 tekens).",
        variant: "destructive",
      });
      return false;
    }
    if (trimmed === oldId) {
      toast({
        title: "Geen wijziging",
        description: "Nieuwe ID is identiek aan de oude.",
        variant: "destructive",
      });
      return false;
    }

    const { data, error } = await supabase.functions.invoke("cf-rename", {
      body: { oldId, newId: trimmed },
    });
    if (error) throw error;
    if (!data?.success) throw new Error(data?.error ?? "Rename faalde");

    toast({
      title: "Hernoemd + alias actief",
      description: `${oldId} → ${trimmed}`,
    });

    try {
      await navigator.clipboard.writeText(`${oldId} → ${trimmed}`);
    } catch {
      /* clipboard niet beschikbaar */
    }

    await clearImageLibraryCache();
    await clearAliasCache();
    return true;
  };

  const submitRename = async () => {
    if (!renaming) return;
    setSubmitting(true);
    try {
      const ok = await performRename(renaming.cloudflareId, newId);
      if (ok) {
        setRenaming(null);
        setRefreshKey((k) => k + 1);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      toast({
        title: "Rename mislukt",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isUsableSuggestion = (s?: string): s is string =>
    !!s && !/[<>]/.test(s) && /^[a-z0-9_-]{1,128}$/.test(s);

  const applySuggestion = async (row: IssueRow) => {
    const suggested = row.suggestedRename;
    if (!isUsableSuggestion(suggested) || suggested === row.cloudflareId) {
      toast({
        title: "Geen geldige suggestie",
        description:
          "Voor deze rij moet je handmatig een nieuwe ID kiezen via 'Hernoem'.",
        variant: "destructive",
      });
      return;
    }
    try {
      const ok = await performRename(row.cloudflareId, suggested);
      if (ok) setRefreshKey((k) => k + 1);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Onbekende fout";
      toast({
        title: "Suggestie mislukt",
        description: msg,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-3 text-xs">
          <Stat label="Totaal issues" value={stats.total} />
          <Stat label="Off-convention" value={stats.off} destructive />
          <Stat label="Loose match" value={stats.loose} />
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => setRefreshKey((k) => k + 1)}
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Vernieuwen
        </Button>
      </div>

      <div className="rounded-md border border-accent bg-accent/30 px-4 py-3 text-xs text-primary-deep flex gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          De rename-engine werkt Cloudflare + DB bij. Code-referenties (bv. in
          <code className="px-1 mx-1 bg-card rounded">propertyConfig.ts</code>) moeten je
          handmatig vervangen — de oude→nieuwe ID wordt automatisch naar je klembord
          gekopieerd. <strong>Tip:</strong> sfeer- of omgevingsfoto's? Tag ze met
          <code className="px-1 mx-1 bg-card rounded">sfeer</code> of
          <code className="px-1 mx-1 bg-card rounded">omgeving</code> in het Library-tabblad —
          dan verdwijnen ze hier vanzelf.
        </p>
      </div>

      <div className="bg-card rounded-md shadow-soft overflow-hidden border border-border">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Laden…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            🎉 Alle media voldoen aan de naamconventie.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cloudflare ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reden</TableHead>
                <TableHead>Suggestie</TableHead>
                <TableHead className="text-right">Actie</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs text-primary-deep break-all max-w-xs">
                    {r.cloudflareId}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-sm">
                    {r.reason ?? "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary break-all max-w-xs">
                    {isUsableSuggestion(r.suggestedRename) ? r.suggestedRename : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {isUsableSuggestion(r.suggestedRename) &&
                        r.suggestedRename !== r.cloudflareId && (
                          <Button
                            type="button"
                            size="sm"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() => applySuggestion(r)}
                            title="Pas suggestie automatisch toe + maak alias aan"
                          >
                            <Sparkles className="w-3.5 h-3.5 mr-2" /> Suggestie toepassen
                          </Button>
                        )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => openRename(r)}
                      >
                        <Wand2 className="w-3.5 h-3.5 mr-2" /> Hernoem
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hernoem Cloudflare ID</DialogTitle>
            <DialogDescription>
              De afbeelding wordt onder de nieuwe ID opnieuw geüpload, de oude wordt
              verwijderd en de DB wordt bijgewerkt. Vergeet niet de string in je code te
              vervangen.
            </DialogDescription>
          </DialogHeader>
          {renaming && (
            <div className="space-y-3">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Oud
                </label>
                <p className="font-mono text-sm text-primary-deep break-all">
                  {renaming.cloudflareId}
                </p>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Nieuw
                </label>
                <Input
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  className="font-mono"
                  autoFocus
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Conventie: <code>hoogmolen-verblijf-&lt;unit&gt;-&lt;onderdeel&gt;-&lt;NN&gt;</code>
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenaming(null)} disabled={submitting}>
              Annuleer
            </Button>
            <Button onClick={submitRename} disabled={submitting}>
              {submitting ? "Bezig…" : "Hernoem & kopieer naar klembord"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

export default MediaIssuesPanel;
