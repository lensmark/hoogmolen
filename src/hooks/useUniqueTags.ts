/**
 * useUniqueTags — singleton hook voor de `unique_tags`-tabel.
 *
 * Provideert:
 *  - tags (alle bekende tags, gesorteerd op label)
 *  - createTag(label, color) — voegt een nieuwe tag toe (idempotent op label)
 *  - reload()
 *
 * Realtime: luistert op INSERT/UPDATE/DELETE events op `unique_tags`.
 */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface UniqueTag {
  id: string;
  label: string;
  color: string;
  created_at: string;
}

/** Toegestane brand-tokens voor tag-kleuren. */
export const TAG_COLORS = ["primary", "primary-deep", "accent", "secondary"] as const;
export type TagColor = (typeof TAG_COLORS)[number];

/** Tags die een foto vrijstellen van de naamconventie-check. */
export const EXEMPT_TAGS = new Set(["sfeer", "omgeving"]);

let cache: UniqueTag[] | null = null;
const listeners = new Set<(tags: UniqueTag[]) => void>();

const fetchAll = async (): Promise<UniqueTag[]> => {
  const { data, error } = await supabase
    .from("unique_tags")
    .select("id, label, color, created_at")
    .order("label", { ascending: true });
  if (error || !data) return [];
  return data as UniqueTag[];
};

const broadcast = (tags: UniqueTag[]) => {
  cache = tags;
  listeners.forEach((l) => l(tags));
};

const ensureRealtime = (() => {
  let started = false;
  return () => {
    if (started) return;
    started = true;
    supabase
      .channel("unique_tags_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unique_tags" },
        async () => {
          const fresh = await fetchAll();
          broadcast(fresh);
        },
      )
      .subscribe();
  };
})();

export const useUniqueTags = () => {
  const [tags, setTags] = useState<UniqueTag[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    listeners.add(setTags);
    ensureRealtime();
    if (!cache) {
      fetchAll().then((data) => {
        broadcast(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      listeners.delete(setTags);
    };
  }, []);

  const createTag = useCallback(
    async (rawLabel: string, color: TagColor = "primary"): Promise<UniqueTag | null> => {
      const label = rawLabel.trim().toLowerCase();
      if (!label || !/^[a-z0-9-]{2,32}$/.test(label)) return null;
      const existing = (cache ?? []).find((t) => t.label === label);
      if (existing) return existing;

      const { data, error } = await supabase
        .from("unique_tags")
        .insert({ label, color })
        .select("id, label, color, created_at")
        .single();
      if (error || !data) return null;
      const fresh = await fetchAll();
      broadcast(fresh);
      return data as UniqueTag;
    },
    [],
  );

  const reload = useCallback(async () => {
    const fresh = await fetchAll();
    broadcast(fresh);
  }, []);

  return { tags, loading, createTag, reload };
};
