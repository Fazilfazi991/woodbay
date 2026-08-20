import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from "@/lib/env";

/** Server-only: use only for privileged workflows that cannot be expressed by RLS. */
export function createAdminClient() { const { url } = getSupabasePublicEnv(); return createClient(url, getSupabaseServiceRoleKey(), { auth: { autoRefreshToken: false, persistSession: false } }); }
