/**
 * useImageAliases — laadt en cachet de image_aliases-tabel.
 *
 * Smart Resolver pattern: oude Cloudflare-IDs in de broncode worden
 * automatisch doorgestuurd naar hun nieuwe ID via deze map. Hierdoor
 * blijft de website altijd werken, zelfs als configs nog niet zijn
 * bijgewerkt na een rename.
 *
 * Singleton-cache + realtime subscription zodat alle CFImage-instances
 * dezelfde aliassen delen en automatisch verversen na een rename.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ImageAlias {
  oldId: string;
  newId: string;
}

let cache: Map<string, string> | null = null;
let inflight: Promise<Map<string, string>> | null = null;
const listeners = new Set<(map: Map<string, string>) => void>();
let realtimeChannel: ReturnType<typeof supabase.channel> | null = null;

const fetchAll = async (): Promise<Map<string, string>> => {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from("image_aliases")
      .select("old_id, new_id");

    const map = new Map<string, string>();
    if (!error && data) {
      for (const r of data) {
        if (r.old_id && r.new_id) map.set(r.old_id, r.new_id);
      }
    }
    cache = map;
    inflight = null;
    return map;
  })();

  return inflight;
};

const ensureRealtime = () => {
  if (realtimeChannel) return;
  realtimeChannel = supabase
    .channel("image_aliases_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "image_aliases" },
      () => {
        cache = null;
        inflight = null;
        void fetchAll().then((map) => listeners.forEach((cb) => cb(map)));
      },
    )
    .subscribe();
};

/** Sync getter — geeft de huidige cache terug, of `null` als nog niet geladen. */
export const getCachedAlias = (oldId: string): string | null => {
  if (!cache) return null;
  return cache.get(oldId) ?? null;
};

/** Trigger initial load (idempotent). Resolveert direct als cache al bestaat. */
export const primeAliasCache = (): Promise<void> => {
  ensureRealtime();
  return fetchAll().then(() => undefined);
};

export const clearAliasCache = async () => {
  cache = null;
  inflight = null;
  const fresh = await fetchAll();
  listeners.forEach((cb) => cb(fresh));
};

export const useImageAliases = (): {
  aliases: ImageAlias[];
  loading: boolean;
  resolve: (id: string) => string;
} => {
  const [map, setMap] = useState<Map<string, string>>(cache ?? new Map());
  const [loading, setLoading] = useState<boolean>(cache === null);

  useEffect(() => {
    ensureRealtime();
    let alive = true;
    const cb = (m: Map<string, string>) => {
      if (!alive) return;
      setMap(new Map(m));
      setLoading(false);
    };
    listeners.add(cb);
    fetchAll().then((m) => {
      if (!alive) return;
      setMap(new Map(m));
      setLoading(false);
    });
    return () => {
      alive = false;
      listeners.delete(cb);
    };
  }, []);

  return {
    aliases: Array.from(map.entries()).map(([oldId, newId]) => ({ oldId, newId })),
    loading,
    resolve: (id: string) => map.get(id) ?? id,
  };
};
