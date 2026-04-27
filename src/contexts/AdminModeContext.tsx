/**
 * AdminModeContext — beheermodus toggle + cache van image_overrides en text_overrides.
 *
 * Wanneer een ingelogde admin (Lovable Cloud session) `isAdminMode` activeert,
 * tonen alle CFImage / hero-componenten een edit-overlay die de MediaPicker opent,
 * en worden FeatureCards (titel/omschrijving) inline editable.
 *
 * Geselecteerde foto's worden opgeslagen in `image_overrides` (page_path + section_key).
 * Tekst-aanpassingen worden opgeslagen in `text_overrides` (page_path + section_key).
 *
 * De overrides worden eenmalig opgehaald bij mount en in een Map gecached;
 * components vragen via `getOverride(pagePath, sectionKey)` of er een keuze is.
 * Toggle-state wordt bewaard in localStorage zodat een refresh de modus behoudt.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";

interface OverrideRow {
  page_path: string;
  section_key: string;
  image_url: string;
}

interface TextOverrideRow {
  page_path: string;
  section_key: string;
  text_value: string;
}

interface AdminModeContextValue {
  isAdmin: boolean;
  isAdminMode: boolean;
  setAdminMode: (v: boolean) => void;
  /** Ophalen voor weergave; returnt cloudflare_id of volledige URL. */
  getOverride: (pagePath: string, sectionKey: string) => string | null;
  /** Schrijf override naar DB + cache. */
  saveOverride: (
    pagePath: string,
    sectionKey: string,
    imageUrl: string,
  ) => Promise<{ error: string | null }>;
  /** Refresh image-overrides cache. */
  refreshOverrides: () => Promise<void>;
  /** Tekst-override ophalen. */
  getTextOverride: (pagePath: string, sectionKey: string) => string | null;
  /** Tekst-override opslaan (delete-then-insert). */
  saveTextOverride: (
    pagePath: string,
    sectionKey: string,
    textValue: string,
  ) => Promise<{ error: string | null }>;
}

const AdminModeContext = createContext<AdminModeContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "hoogmolen.adminMode";
const overrideKey = (path: string, section: string) => `${path}::${section}`;

export const AdminModeProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminMode, setIsAdminModeState] = useState(false);
  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
  const [textOverrides, setTextOverrides] = useState<Map<string, string>>(
    new Map(),
  );

  /** Auth state — is iemand ingelogd? */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session);
      if (data.session && localStorage.getItem(STORAGE_KEY) === "1") {
        setIsAdminModeState(true);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsAdmin(!!session);
      if (!session) {
        setIsAdminModeState(false);
        localStorage.removeItem(STORAGE_KEY);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /**
   * Cache opvullen — draait voor IEDEREEN (ook anonieme bezoekers),
   * anders zien live-bezoekers de admin-overrides nooit. RLS staat
   * publieke SELECT toe op image_overrides + text_overrides; schrijven
   * blijft beperkt tot admins/editors.
   */
  const refreshOverrides = useCallback(async () => {
    const [imgRes, txtRes] = await Promise.all([
      supabase
        .from("image_overrides")
        .select("page_path, section_key, image_url"),
      supabase
        .from("text_overrides")
        .select("page_path, section_key, text_value"),
    ]);
    if (!imgRes.error && imgRes.data) {
      const m = new Map<string, string>();
      (imgRes.data as OverrideRow[]).forEach((r) =>
        m.set(overrideKey(r.page_path, r.section_key), r.image_url),
      );
      setOverrides(m);
    }
    if (!txtRes.error && txtRes.data) {
      const m = new Map<string, string>();
      (txtRes.data as TextOverrideRow[]).forEach((r) =>
        m.set(overrideKey(r.page_path, r.section_key), r.text_value),
      );
      setTextOverrides(m);
    }
  }, []);

  useEffect(() => {
    let signaled = false;
    const signalRender = () => {
      if (signaled || typeof document === "undefined") return;
      signaled = true;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.dispatchEvent(new Event("render-event"));
        });
      });
    };
    // Race: trigger event zodra overrides binnen zijn, óf na 4s safety-timeout
    // (zodat prerender ook werkt als Supabase tijdelijk traag/onbereikbaar is).
    refreshOverrides().finally(signalRender);
    const timer = setTimeout(signalRender, 4000);
    return () => clearTimeout(timer);
  }, [refreshOverrides]);

  /** Public mode-toggle (persisted). */
  const setAdminMode = useCallback(
    (v: boolean) => {
      if (!isAdmin) return;
      setIsAdminModeState(v);
      localStorage.setItem(STORAGE_KEY, v ? "1" : "0");
    },
    [isAdmin],
  );

  /** Sneltoets Alt+A om Beheermodus te togglen (alleen voor ingelogde admins). */
  useEffect(() => {
    if (!isAdmin) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsAdminModeState((prev) => {
          const next = !prev;
          localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
          return next;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdmin]);

  const getOverride = useCallback(
    (pagePath: string, sectionKey: string): string | null => {
      return overrides.get(overrideKey(pagePath, sectionKey)) ?? null;
    },
    [overrides],
  );

  const saveOverride = useCallback(
    async (pagePath: string, sectionKey: string, imageUrl: string) => {
      if (!isAdmin) return { error: "not authenticated" };
      // Upsert via delete-then-insert (geen unique-constraint op (path, section))
      const { error: delError } = await supabase
        .from("image_overrides")
        .delete()
        .eq("page_path", pagePath)
        .eq("section_key", sectionKey);
      if (delError) return { error: delError.message };
      const { error: insError } = await supabase
        .from("image_overrides")
        .insert({ page_path: pagePath, section_key: sectionKey, image_url: imageUrl });
      if (insError) return { error: insError.message };

      setOverrides((prev) => {
        const next = new Map(prev);
        next.set(overrideKey(pagePath, sectionKey), imageUrl);
        return next;
      });
      return { error: null };
    },
    [isAdmin],
  );

  const getTextOverride = useCallback(
    (pagePath: string, sectionKey: string): string | null => {
      return textOverrides.get(overrideKey(pagePath, sectionKey)) ?? null;
    },
    [textOverrides],
  );

  const saveTextOverride = useCallback(
    async (pagePath: string, sectionKey: string, textValue: string) => {
      if (!isAdmin) return { error: "not authenticated" };
      const { error: delError } = await supabase
        .from("text_overrides")
        .delete()
        .eq("page_path", pagePath)
        .eq("section_key", sectionKey);
      if (delError) return { error: delError.message };
      const { error: insError } = await supabase
        .from("text_overrides")
        .insert({
          page_path: pagePath,
          section_key: sectionKey,
          text_value: textValue,
        });
      if (insError) return { error: insError.message };

      setTextOverrides((prev) => {
        const next = new Map(prev);
        next.set(overrideKey(pagePath, sectionKey), textValue);
        return next;
      });
      return { error: null };
    },
    [isAdmin],
  );

  const value = useMemo<AdminModeContextValue>(
    () => ({
      isAdmin,
      isAdminMode: isAdmin && isAdminMode,
      setAdminMode,
      getOverride,
      saveOverride,
      refreshOverrides,
      getTextOverride,
      saveTextOverride,
    }),
    [
      isAdmin,
      isAdminMode,
      setAdminMode,
      getOverride,
      saveOverride,
      refreshOverrides,
      getTextOverride,
      saveTextOverride,
    ],
  );

  return (
    <AdminModeContext.Provider value={value}>
      {children}
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = (): AdminModeContextValue => {
  const ctx = useContext(AdminModeContext);
  if (!ctx) throw new Error("useAdminMode must be used inside AdminModeProvider");
  return ctx;
};
