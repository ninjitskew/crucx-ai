"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

// Hardcoded primary admin — always has access regardless of DB state.
// Additional admins are managed via /admin/settings/ (app_user.role = 'admin').
export const ADMIN_EMAILS = ["alcubis@gmail.com"];

export interface AdminState {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  configured: boolean;
  role: string | null;
}

export function useAdmin(): AdminState {
  const [state, setState] = useState<AdminState>({
    loading: true,
    user: null,
    isAdmin: false,
    configured: isSupabaseConfigured,
    role: null,
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setState((s) => ({ ...s, loading: false, configured: false }));
      return;
    }
    let mounted = true;

    function emailIsAdmin(u: User | null): boolean {
      if (!u?.email) return false;
      return ADMIN_EMAILS.includes(u.email.toLowerCase());
    }

    async function load(u: User | null) {
      if (!u) {
        if (mounted) setState({ loading: false, user: null, isAdmin: false, configured: true, role: null });
        return;
      }

      // Flip admin immediately for hardcoded primary admins — no DB wait
      const fastAdmin = emailIsAdmin(u);
      if (mounted) {
        setState({ loading: false, user: u, isAdmin: fastAdmin, configured: true, role: fastAdmin ? "admin" : null });
      }

      // Best-effort role lookup for secondary admins (added via /admin/settings).
      // Wrapped in a timeout so a hanging RLS/network call never re-blocks the UI.
      try {
        const lookup = sb!.from("app_user").select("role").eq("id", u.id).maybeSingle();
        const timeout = new Promise<{ data: null }>((resolve) =>
          setTimeout(() => resolve({ data: null }), 2500)
        );
        const { data } = (await Promise.race([lookup, timeout])) as { data: { role?: string } | null };
        const role = (data?.role as string) ?? null;
        if (mounted) {
          setState({ loading: false, user: u, isAdmin: fastAdmin || role === "admin", configured: true, role: role ?? (fastAdmin ? "admin" : null) });
        }
      } catch {
        // ignore — fastAdmin already applied
      }
    }

    sb.auth.getUser().then(({ data }) => load(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => load(session?.user ?? null));
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

// Back-compat export (admin settings page imports this)
export const ADMIN_EMAIL = ADMIN_EMAILS[0];
