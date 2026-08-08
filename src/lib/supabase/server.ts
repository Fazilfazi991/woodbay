import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, key } = getSupabasePublicEnv();
  return createServerClient(url, key, { cookies: { getAll: () => cookieStore.getAll(), setAll: (items) => { try { items.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Server Components cannot persist refreshed cookies. */ } } } });
}
