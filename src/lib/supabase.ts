// Zero-cost Supabase client (free tier, Mumbai region).
// Safe to import in client components — uses public anon key only.
// Server-side / build-time scripts should use the service role key from a non-public env var.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!_client) {
    _client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        // Disable cross-tab lock to avoid "lock was released" race in dev with multiple tabs
        lock: async (_name, _acquireTimeout, fn) => await fn(),
      },
    });
  }
  return _client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
