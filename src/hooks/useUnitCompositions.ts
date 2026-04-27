/**
 * useUnitCompositions — haalt samengestelde verhuurformules op uit de
 * `unit_compositions` tabel en cachet ze in een Map (slug → modules).
 *
 * Wordt globaal gebruikt door `getExtraLocationIdsAsync` / via de in-memory
 * cache door `getExtraLocationIds` (sync, met config-fallback).
 *
 * Realtime: luistert op postgres_changes zodat wijzigingen vanuit de admin
 * console direct doorwerken op alle open browsers.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  setCompositionCache,
  type CompositionRow,
} from "@/config/unitCompositionConfig";

export const useUnitCompositions = () => {
  const [rows, setRows] = useState<CompositionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    const { data, error } = await supabase
      .from("unit_compositions")
      .select(
        "id, slug, display_name, module_location_ids, description, sort_order, unit_type, visible_on, country, city",
      )
      .order("sort_order", { ascending: true });
    if (!error && data) {
      const typed = data as unknown as CompositionRow[];
      setRows(typed);
      setCompositionCache(typed);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
    const channel = supabase
      .channel("unit_compositions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "unit_compositions" },
        () => fetchAll(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rows, loading, refresh: fetchAll };
};
