import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client: server-only, bypasses RLS. Used for submissions insert
 * (public form → Server Action) and admin inbox read/update.
 */
export function createServiceClient(): SupabaseClient | null {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? null;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
