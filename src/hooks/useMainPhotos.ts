/**
 * useMainPhotos — singleton hook voor de `main_photos` tabel.
 *
 * Een main_photo is een markering "deze foto is de hoofdfoto voor [context]".
 * Context = combinatie van context_type + context_key, bv:
 *   - unit:watermolen
 *   - page:/
 *   - section:home-hero
 *   - category:sfeer
 *
 * Per context max 1 hoofdfoto (UNIQUE constraint in DB).
 *
 * Realtime: alle open admin-tabs zien wijzigingen direct.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MainPhoto {
  id: string;
  contextType: string;
  contextKey: string;
  imageId: string;
}

export type ContextType = "unit" | "page" | "section" | "category" | string;

const cache = new Map<string, MainPhoto>(); // key = `${contextType}:${contextKey}`
let loaded = false;
let inflight: Promise<void> | null = null;
const listeners = new Set<() => void>();
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

const ctxKey = (type: string, key: string) => `${type}:${key}`;
const imgKey = (imageId: string) => `image:${imageId}`;

const fetchAll = (): Promise<void> => {
  if (loaded) return Promise.resolve();
  if (inflight) return inflight;
  inflight = (async () => {
    const { data, error } = await supabase
      .from("main_photos")
      .select("id, context_type, context_key, image_id");
    cache.clear();
    if (!error && data) {
      for (const r of data) {
        cache.set(ctxKey(r.context_type, r.context_key), {
          id: r.id,
          contextType: r.context_type,
          contextKey: r.context_key,
          imageId: r.image_id,
        });
      }
    }
    loaded = true;
    inflight = null;
  })();
  return inflight;
};

const ensureRealtime = () => {
  if (realtimeChannel) return;
  realtimeChannel = supabase
    .channel("main_photos_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "main_photos" },
      async () => {
        loaded = false;
        await fetchAll();
        listeners.forEach((l) => l());
      },
    )
    .subscribe();
};

/**
 * Geeft alle contexten terug waarvoor de gegeven image_id de hoofdfoto is.
 */
export const getMainContextsForImage = (imageId: string): MainPhoto[] => {
  const out: MainPhoto[] = [];
  for (const m of cache.values()) {
    if (m.imageId === imageId) out.push(m);
  }
  return out;
};

/**
 * Geeft de image_id terug die als hoofdfoto is gemarkeerd voor de gegeven context, of null.
 */
export const getMainImageId = (
  contextType: string,
  contextKey: string,
): string | null => cache.get(ctxKey(contextType, contextKey))?.imageId ?? null;

export const useMainPhotos = () => {
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

  /**
   * Markeer een foto als hoofdfoto voor de gegeven context.
   * Upsert op (context_type, context_key) — vervangt automatisch een bestaande markering.
   */
  const setMain = useCallback(
    async (
      contextType: string,
      contextKey: string,
      imageId: string,
    ): Promise<boolean> => {
      const { error } = await supabase
        .from("main_photos")
        .upsert(
          {
            context_type: contextType,
            context_key: contextKey,
            image_id: imageId,
          },
          { onConflict: "context_type,context_key" },
        );
      if (error) {
        console.error("[useMainPhotos] setMain error:", error);
        return false;
      }
      return true;
    },
    [],
  );

  /** Verwijder de hoofdfoto-markering voor de gegeven context. */
  const unsetMain = useCallback(
    async (contextType: string, contextKey: string): Promise<boolean> => {
      const { error } = await supabase
        .from("main_photos")
        .delete()
        .eq("context_type", contextType)
        .eq("context_key", contextKey);
      if (error) {
        console.error("[useMainPhotos] unsetMain error:", error);
        return false;
      }
      return true;
    },
    [],
  );

  return {
    contexts: Array.from(cache.values()),
    getMainImageId,
    getMainContextsForImage,
    setMain,
    unsetMain,
  };
};

/** Helpers voor de UI */
export const CONTEXT_LABELS: Record<string, string> = {
  unit: "Unit",
  page: "Pagina",
  section: "Sectie",
  category: "Categorie",
};

export const formatContext = (m: MainPhoto): string =>
  `${CONTEXT_LABELS[m.contextType] ?? m.contextType}: ${m.contextKey}`;
