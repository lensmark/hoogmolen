/**
 * useImageLibrary — haalt alle 'success'-rijen uit de image_library tabel.
 *
 * Magic-flow (v3.14.6):
 *  - In-memory cache → 1 fetch per app-sessie
 *  - Realtime subscription op image_library → bij INSERT/UPDATE/DELETE
 *    wordt cache geïnvalideerd én alle gemonteerde hooks krijgen vers data.
 *    Resultaat: na een upload of rename verschijnt de foto direct op alle
 *    open tabs/devices, zonder page reload.
 *  - Listener-pattern: meerdere componenten delen één subscription.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LibraryImage {
  id: string;
  cloudflareId: string;
  filename: string;
}

let cache: LibraryImage[] | null = null;
let inflight: Promise<LibraryImage[]> | null = null;
const listeners = new Set<(rows: LibraryImage[]) => void>();

// HMR-safe: bewaar de channel-ref op globalThis zodat we bij hot-reload
// niet opnieuw .on() proberen op een al-subscribed channel.
const REALTIME_KEY = "__hoogmolen_image_library_channel__";
const getRealtimeChannel = (): ReturnType<typeof supabase.channel> | null =>
  (globalThis as any)[REALTIME_KEY] ?? null;
const setRealtimeChannel = (ch: ReturnType<typeof supabase.channel> | null) => {
  (globalThis as any)[REALTIME_KEY] = ch;
};

const notifyListeners = (rows: LibraryImage[]) => {
  listeners.forEach((cb) => cb(rows));
};

/**
 * Reset de in-memory cache zodat de volgende hook-call vers ophaalt.
 * Na refetch worden alle subscribers automatisch geüpdatet.
 */
export const clearImageLibraryCache = async () => {
  cache = null;
  inflight = null;
  const fresh = await fetchAll();
  notifyListeners(fresh);
};

const fetchAll = async (): Promise<LibraryImage[]> => {
  if (cache) return cache;
  if (inflight) return inflight;

  inflight = (async () => {
    const { data, error } = await supabase
      .from("image_library")
      .select("id, cloudflare_id, filename")
      .eq("status", "success");

    if (error || !data) {
      inflight = null;
      return [];
    }
    const result = data
      .filter((r) => !!r.cloudflare_id)
      .map((r) => ({
        id: r.id as string,
        cloudflareId: r.cloudflare_id as string,
        filename: r.filename,
      }));
    cache = result;
    inflight = null;
    return result;
  })();

  return inflight;
};

/**
 * Setup één gedeelde realtime channel die luistert naar wijzigingen op
 * image_library. Bij élke change → cache wissen + alle hooks notifiëren.
 */
const ensureRealtime = () => {
  if (getRealtimeChannel()) return;
  // Verwijder eventueel een ouder channel met hetzelfde topic dat door HMR
  // is achtergebleven in de supabase client.
  const existing = supabase
    .getChannels()
    .find((c) => c.topic === "realtime:image_library_changes");
  if (existing) {
    void supabase.removeChannel(existing);
  }
  const ch = supabase
    .channel("image_library_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "image_library" },
      () => {
        cache = null;
        inflight = null;
        void fetchAll().then((rows) => notifyListeners(rows));
      },
    )
    .subscribe();
  setRealtimeChannel(ch);
};

export const useImageLibrary = (): { images: LibraryImage[]; loading: boolean } => {
  const [images, setImages] = useState<LibraryImage[]>(cache ?? []);
  const [loading, setLoading] = useState<boolean>(cache === null);

  useEffect(() => {
    ensureRealtime();
    let alive = true;
    const cb = (rows: LibraryImage[]) => {
      if (!alive) return;
      setImages(rows);
      setLoading(false);
    };
    listeners.add(cb);
    fetchAll().then((rows) => {
      if (!alive) return;
      setImages(rows);
      setLoading(false);
    });
    return () => {
      alive = false;
      listeners.delete(cb);
    };
  }, []);

  return { images, loading };
};
