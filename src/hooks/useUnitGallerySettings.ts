/**
 * useUnitGallerySettings — singleton hook voor de `unit_gallery_settings` tabel.
 *
 * Per (context_type, context_key, image_id) houdt deze tabel bij of de foto
 * verborgen is op de publieke detailpagina én een handmatige sort_order voor
 * drag-to-reorder. Realtime: alle open tabs zien wijzigingen direct.
 *
 * Context-conventie spiegelt useMainPhotos:
 *   - unit:watermolen
 *   - unit:peerdermolen
 *   - unit:kamer-b2
 *   - page:/, etc.
 *
 * HMR-veilig: channel-ref leeft op globalThis zodat hot-reloads niet
 * opnieuw `.on()` aanroepen op een al-subscribed channel.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UnitGallerySetting {
  id: string;
  contextType: string;
  contextKey: string;
  imageId: string;
  hidden: boolean;
  sortOrder: number;
}

const cache = new Map<string, UnitGallerySetting>(); // key = ctx|image
let loaded = false;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();

const REALTIME_KEY = "__hoogmolen_unit_gallery_settings_channel__";
const getRealtimeChannel = (): ReturnType<typeof supabase.channel> | null =>
  (globalThis as any)[REALTIME_KEY] ?? null;
const setRealtimeChannel = (ch: ReturnType<typeof supabase.channel>) => {
  (globalThis as any)[REALTIME_KEY] = ch;
};

const rowKey = (type: string, key: string, imageId: string) =>
  `${type}|${key}|${imageId}`;
const ctxKey = (type: string, key: string) => `${type}|${key}|`;

const fetchAll = (): Promise<void> => {
  if (loaded) return Promise.resolve();
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("unit_gallery_settings")
      .select("id, context_type, context_key, image_id, hidden, sort_order");
    cache.clear();
    if (!error && data) {
      for (const r of data) {
        cache.set(rowKey(r.context_type, r.context_key, r.image_id), {
          id: r.id,
          contextType: r.context_type,
          contextKey: r.context_key,
          imageId: r.image_id,
          hidden: !!r.hidden,
          sortOrder: r.sort_order ?? 0,
        });
      }
    }
    loaded = true;
    inflight = null;
  })();
  return inflight;
};

const ensureRealtime = () => {
  if (getRealtimeChannel()) return;
  const existing = supabase
    .getChannels()
    .find((c) => c.topic === "realtime:unit_gallery_settings_changes");
  if (existing) void supabase.removeChannel(existing);
  const ch = supabase
    .channel("unit_gallery_settings_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "unit_gallery_settings" },
      async () => {
        loaded = false;
        await fetchAll();
        listeners.forEach((l) => l());
      },
    )
    .subscribe();
  setRealtimeChannel(ch);
};

/** Geeft alle settings voor een gegeven context. */
export const getSettingsForContext = (
  contextType: string,
  contextKey: string,
): UnitGallerySetting[] => {
  const prefix = ctxKey(contextType, contextKey);
  const out: UnitGallerySetting[] = [];
  for (const [k, v] of cache.entries()) {
    if (k.startsWith(prefix)) out.push(v);
  }
  return out;
};

/** Snelle lookup of een specifieke image hidden is voor een context. */
export const isImageHidden = (
  contextType: string,
  contextKey: string,
  imageId: string,
): boolean => cache.get(rowKey(contextType, contextKey, imageId))?.hidden ?? false;

/** Snelle lookup van sort_order; fallback Number.MAX_SAFE_INTEGER (= einde). */
export const getImageSortOrder = (
  contextType: string,
  contextKey: string,
  imageId: string,
): number =>
  cache.get(rowKey(contextType, contextKey, imageId))?.sortOrder ??
  Number.MAX_SAFE_INTEGER;

export const useUnitGallerySettings = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    ensureRealtime();
    const cb = () => setTick((t) => t + 1);
    listeners.add(cb);
    fetchAll().then(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  /** Toggle hidden voor één image. Upsert op (ctx,image). */
  const setHidden = useCallback(
    async (
      contextType: string,
      contextKey: string,
      imageId: string,
      hidden: boolean,
    ): Promise<boolean> => {
      const existing = cache.get(rowKey(contextType, contextKey, imageId));
      const { error } = await supabase
        .from("unit_gallery_settings")
        .upsert(
          {
            context_type: contextType,
            context_key: contextKey,
            image_id: imageId,
            hidden,
            sort_order: existing?.sortOrder ?? 0,
          },
          { onConflict: "context_type,context_key,image_id" },
        );
      if (error) {
        console.error("[useUnitGallerySettings] setHidden error:", error);
        return false;
      }
      return true;
    },
    [],
  );

  /**
   * Schrijf één volledige volgorde weg voor een context.
   * `orderedImageIds` = de gewenste eindvolgorde (alleen image_library.id's).
   * Bestaande hidden-vlaggen blijven bewaard.
   */
  const setOrder = useCallback(
    async (
      contextType: string,
      contextKey: string,
      orderedImageIds: string[],
    ): Promise<boolean> => {
      const rows = orderedImageIds.map((imageId, idx) => {
        const existing = cache.get(rowKey(contextType, contextKey, imageId));
        return {
          context_type: contextType,
          context_key: contextKey,
          image_id: imageId,
          hidden: existing?.hidden ?? false,
          sort_order: idx,
        };
      });
      if (rows.length === 0) return true;
      const { error } = await supabase
        .from("unit_gallery_settings")
        .upsert(rows, { onConflict: "context_type,context_key,image_id" });
      if (error) {
        console.error("[useUnitGallerySettings] setOrder error:", error);
        return false;
      }
      return true;
    },
    [],
  );

  return {
    getSettingsForContext,
    isImageHidden,
    getImageSortOrder,
    setHidden,
    setOrder,
  };
};
