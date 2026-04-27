/**
 * SyncHistoryPanel — Activity Feed van de laatste sync/rename/metadata acties.
 * Leest uit public.sync_history, beperkt tot de 20 meest recente items.
 */
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, RefreshCw, Pencil, Sparkles, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SyncRow {
  id: string;
  created_at: string;
  status: "success" | "failed" | "partial";
  action: string;
  message: string;
  affected_items: string[];
  counts: Record<string, unknown>;
}

const ACTION_META: Record<string, { label: string; icon: React.ElementType }> = {
  media_sync: { label: "Media Sync", icon: RefreshCw },
  rename: { label: "Rename", icon: Pencil },
  metadata_update: { label: "Metadata", icon: Sparkles },
  ai_analysis: { label: "AI Analyse", icon: Sparkles },
};

const StatusBadge = ({ status }: { status: SyncRow["status"] }) => {
  if (status === "success") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-deep bg-accent/60 px-2 py-1 rounded">
        <CheckCircle2 className="w-3.5 h-3.5" /> success
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
        <XCircle className="w-3.5 h-3.5" /> failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-deep bg-muted px-2 py-1 rounded">
      <AlertTriangle className="w-3.5 h-3.5" /> partial
    </span>
  );
};

const formatCounts = (counts: Record<string, unknown>): string => {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(counts)) {
    if (typeof v === "number" && v > 0) parts.push(`${k}: ${v}`);
    else if (typeof v === "boolean") parts.push(`${k}: ${v ? "✓" : "✗"}`);
  }
  return parts.join(" · ");
};

export const SyncHistoryPanel = () => {
  const [rows, setRows] = useState<SyncRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sync_history")
      .select("id, created_at, status, action, message, affected_items, counts")
      .order("created_at", { ascending: false })
      .limit(20);
    if (!error && data) {
      setRows(data as SyncRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4" />
          Laatste 20 acties · sync, rename en metadata-updates
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Vernieuwen
        </Button>
      </div>

      <div className="bg-card rounded-md shadow-soft overflow-hidden border border-border">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">Laden…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nog geen sync-acties gelogd. Klik op <strong>Synchroniseer met Cloudflare</strong> om de eerste run te starten.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => {
              const meta = ACTION_META[r.action] ?? { label: r.action, icon: Activity };
              const Icon = meta.icon;
              const countsStr = formatCounts(r.counts);
              return (
                <li key={r.id} className="p-4 flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-primary-deep">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-medium text-primary-deep">{meta.label}</span>
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString("nl-BE", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 break-words">{r.message}</p>
                    {countsStr && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono">{countsStr}</p>
                    )}
                    {r.affected_items.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {r.affected_items.slice(0, 6).map((item, i) => (
                          <Badge key={i} variant="outline" className="text-xs font-mono break-all">
                            {item.length > 60 ? `${item.slice(0, 57)}…` : item}
                          </Badge>
                        ))}
                        {r.affected_items.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{r.affected_items.length - 6} meer
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SyncHistoryPanel;
