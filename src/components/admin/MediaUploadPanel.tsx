/**
 * MediaUploadPanel — drag-and-drop upload-paneel naar Cloudflare Images.
 * Refactor van AdminUpload zonder eigen auth/header (zit nu in AdminLayout).
 */
import { useCallback, useRef, useState } from "react";
import { Upload, Copy, Check, AlertTriangle, FolderUp, Images, RefreshCw } from "lucide-react";
import MediaPicker from "@/components/admin/MediaPicker";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CF_PROXY_BASE,
  cfImage,
  sanitizeImageId,
} from "@/config/cloudflareImagesConfig";
import {
  preflightFile,
  tipForStatus,
  NAME_CONVENTION_REGEX,
} from "@/lib/uploadValidation";
import {
  extractFilesFromDataTransfer,
  filterImageFiles,
} from "@/lib/directoryTraversal";
import { clearImageLibraryCache } from "@/hooks/useImageLibrary";
import { toast } from "@/hooks/use-toast";

interface UploadedItem {
  id: string;
  originalName: string;
  url: string;
  status: "queued" | "uploading" | "success" | "error";
  error?: string;
}

const MAX_PARALLEL = 3;

export const MediaUploadPanel = () => {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dirInputRef = useRef<HTMLInputElement>(null);

  const queueRef = useRef<File[]>([]);
  const activeRef = useRef(0);
  const totalRef = useRef(0);
  const completedRef = useRef(0);
  const [progress, setProgress] = useState({ active: 0, done: 0, total: 0 });

  const updateProgress = useCallback(() => {
    setProgress({
      active: activeRef.current,
      done: completedRef.current,
      total: totalRef.current,
    });
  }, []);

  const performUpload = useCallback(async (file: File, id: string) => {
    let logRowId: string | null = null;
    try {
      // sequence_number wordt automatisch toegekend door DB-trigger
      // (assign_image_sequence_number) — niet nodig om mee te sturen.
      const { data: logRow } = await supabase
        .from("image_library")
        .insert({
          filename: file.name,
          cloudflare_id: id,
          cloudflare_uid: id,
          status: "pending",
        } as never)
        .select("id")
        .single();
      if (logRow) logRowId = logRow.id;
    } catch {
      /* ignore log error */
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/cf-upload`;

    let status = 0;
    let bodyJson: { success?: boolean; error?: string; cf_code?: number } = {};
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token ?? ""}` },
        body: formData,
      });
      status = res.status;
      try {
        bodyJson = await res.json();
      } catch {
        bodyJson = { error: `HTTP ${status}` };
      }
    } catch (networkErr) {
      bodyJson = { error: networkErr instanceof Error ? networkErr.message : "Netwerkfout" };
    }

    const ok = status >= 200 && status < 300 && bodyJson.success;
    const errorText = ok
      ? null
      : `[${status || "—"}] ${bodyJson.error ?? "Upload mislukt"}${
          bodyJson.cf_code ? ` (CF ${bodyJson.cf_code})` : ""
        } — ${tipForStatus(status)}`;

    if (logRowId) {
      try {
        await supabase
          .from("image_library")
          .update({ status: ok ? "success" : "failed", error_msg: errorText })
          .eq("id", logRowId);
      } catch {
        /* ignore */
      }
    }

    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? ok
            ? { ...it, status: "success" }
            : { ...it, status: "error", error: errorText ?? "Upload mislukt" }
          : it,
      ),
    );

    return ok;
  }, []);

  const drainQueue = useCallback(async () => {
    while (activeRef.current < MAX_PARALLEL && queueRef.current.length > 0) {
      const file = queueRef.current.shift();
      if (!file) break;
      const id = sanitizeImageId(file.name);
      if (!id) {
        completedRef.current += 1;
        updateProgress();
        continue;
      }
      activeRef.current += 1;
      updateProgress();
      setItems((prev) =>
        prev.map((it) =>
          it.id === id && it.status === "queued" ? { ...it, status: "uploading" } : it,
        ),
      );
      performUpload(file, id).finally(() => {
        activeRef.current -= 1;
        completedRef.current += 1;
        updateProgress();
        void drainQueue();
      });
    }
    if (
      activeRef.current === 0 &&
      queueRef.current.length === 0 &&
      totalRef.current > 0 &&
      completedRef.current >= totalRef.current
    ) {
      const total = totalRef.current;
      totalRef.current = 0;
      completedRef.current = 0;
      updateProgress();
      toast({ title: "Upload voltooid", description: `${total} bestand(en) verwerkt.` });
    }
  }, [performUpload, updateProgress]);

  const enqueueFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      const accepted: { file: File; id: string }[] = [];
      const seenIds = new Set(items.map((i) => i.id));
      let blocked = 0;
      let warned = 0;

      for (const file of files) {
        const pre = preflightFile(file);
        if (!pre.ok) {
          blocked += 1;
          toast({ title: "Geblokkeerd", description: `${file.name}: ${pre.error}`, variant: "destructive" });
          continue;
        }
        if (pre.warning) warned += 1;
        const id = sanitizeImageId(file.name);
        if (!id || seenIds.has(id)) {
          blocked += 1;
          continue;
        }
        seenIds.add(id);
        accepted.push({ file, id });
      }

      if (warned > 0) {
        toast({
          title: `${warned} bestand(en) niet volgens conventie`,
          description: `Verwacht: ${NAME_CONVENTION_REGEX.source.replace(/[\\^$]/g, "")}`,
        });
      }

      if (accepted.length === 0) {
        if (blocked > 0) {
          toast({ title: "Geen bestanden toegevoegd", variant: "destructive" });
        }
        return;
      }

      const newItems: UploadedItem[] = accepted.map(({ file, id }) => ({
        id,
        originalName: file.name,
        url: cfImage(id),
        status: "queued",
      }));
      setItems((prev) => [...newItems, ...prev]);
      queueRef.current.push(...accepted.map((a) => a.file));
      totalRef.current += accepted.length;
      updateProgress();
      void drainQueue();
    },
    [items, drainQueue, updateProgress],
  );

  const onDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      setScanning(true);
      try {
        const result = await extractFilesFromDataTransfer(e.dataTransfer.items);
        enqueueFiles(result.files);
      } finally {
        setScanning(false);
      }
    },
    [enqueueFiles],
  );

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    enqueueFiles(filterImageFiles(e.target.files ?? []));
    e.target.value = "";
  };

  const copyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  const progressPct =
    progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-xs text-muted-foreground">
          Proxy: <code className="bg-accent px-1.5 py-0.5 rounded">{CF_PROXY_BASE}</code>
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={syncing}
            onClick={async () => {
              if (
                !window.confirm(
                  "Synchroniseer alle bestaande Cloudflare-foto's met de bibliotheek? Dit voegt enkel ontbrekende records toe.",
                )
              ) {
                return;
              }
              setSyncing(true);
              try {
                const { data, error } = await supabase.functions.invoke("cf-sync");
                if (error) throw error;
                const d = (data ?? {}) as {
                  scanned?: number;
                  inserted?: number;
                  skipped?: number;
                  errors?: string[];
                };
                clearImageLibraryCache();
                toast({
                  title: "Sync voltooid",
                  description: `${d.inserted ?? 0} nieuwe records, ${d.skipped ?? 0} bestaande overgeslagen (${d.scanned ?? 0} gescand).`,
                });
                if (d.errors && d.errors.length > 0) {
                  toast({
                    title: `${d.errors.length} fout(en) tijdens sync`,
                    description: d.errors.slice(0, 2).join(" · "),
                    variant: "destructive",
                  });
                }
              } catch (err) {
                toast({
                  title: "Sync mislukt",
                  description: err instanceof Error ? err.message : "Onbekende fout",
                  variant: "destructive",
                });
              } finally {
                setSyncing(false);
              }
            }}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Synchroniseren…" : "Synchroniseer met Cloudflare"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <Images className="w-4 h-4 mr-2" /> Bibliotheek
          </Button>
        </div>
      </div>

      <MediaPicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(cfId, filename) => {
          navigator.clipboard.writeText(cfImage(cfId));
          toast({ title: "Image-link gekopieerd", description: `${filename}` });
        }}
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`block border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragOver ? "border-primary bg-accent" : "border-border bg-card hover:bg-accent/40"
        }`}
      >
        <div className="flex items-center justify-center gap-6 mb-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <Upload className="w-10 h-10 text-primary-deep group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Bestanden</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              dirInputRef.current?.click();
            }}
            className="flex flex-col items-center gap-1 group"
          >
            <FolderUp className="w-10 h-10 text-primary-deep group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Map</span>
          </button>
        </div>
        <p className="font-medium text-primary-deep">Sleep foto's of een volledige map hier</p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, WebP — max 10 MB per bestand — max {MAX_PARALLEL} parallel
        </p>
        {scanning && <p className="text-xs text-primary mt-3">Map wordt gescand…</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onPick}
          className="hidden"
        />
        <input
          ref={dirInputRef}
          type="file"
          accept="image/*"
          multiple
          // @ts-expect-error - webkitdirectory is non-standard
          webkitdirectory=""
          directory=""
          onChange={onPick}
          className="hidden"
        />
      </div>

      {progress.total > 0 && (
        <section className="bg-card rounded-md p-4 shadow-soft border border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-primary-deep">
              Bestand {progress.done} van {progress.total}…
            </span>
            <span className="text-muted-foreground">
              {progress.active} actief · {progressPct}%
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </section>
      )}

      {items.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-primary-deep mb-4">Uploads ({items.length})</h2>
          <ul className="space-y-3">
            {items.map((it) => (
              <li
                key={`${it.id}-${it.originalName}`}
                className="flex items-center gap-4 bg-card rounded-md p-3 shadow-soft border border-border"
              >
                <div className="w-20 h-20 bg-accent rounded overflow-hidden flex-shrink-0">
                  {it.status === "success" && (
                    <img src={it.url} alt={it.id} className="w-full h-full object-cover" />
                  )}
                  {(it.status === "uploading" || it.status === "queued") && (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {it.status === "queued" ? "wacht…" : "…"}
                    </div>
                  )}
                  {it.status === "error" && (
                    <div className="w-full h-full flex items-center justify-center text-destructive">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-primary-deep truncate">{it.originalName}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: <code>{it.id}</code>
                  </p>
                  {it.status === "success" && (
                    <a
                      href={it.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline truncate block"
                    >
                      {it.url}
                    </a>
                  )}
                  {it.status === "error" && (
                    <p className="text-xs text-destructive mt-1">{it.error}</p>
                  )}
                </div>
                {it.status === "success" && (
                  <Button variant="outline" size="sm" onClick={() => copyLink(it.url, it.id)}>
                    {copied === it.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default MediaUploadPanel;
