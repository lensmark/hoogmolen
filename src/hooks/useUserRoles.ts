/**
 * useUserRoles — laadt de rollen van de huidige ingelogde gebruiker.
 * Returns { roles, isAdmin, isEditor, loading, session, userEmail }.
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "editor";

export const useUserRoles = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) {
        setRoles([]);
        setLoading(false);
      }
    });

    // Then fetch existing session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (!data.session) setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);
      if (cancelled) return;
      if (!error && data) {
        setRoles(data.map((r) => r.role as AppRole));
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [session]);

  return {
    session,
    roles,
    isAdmin: roles.includes("admin"),
    isEditor: roles.includes("editor"),
    hasAnyRole: roles.length > 0,
    loading,
    userEmail: session?.user.email ?? null,
    userId: session?.user.id ?? null,
  };
};
