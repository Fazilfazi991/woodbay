import { createClient } from "@/lib/supabase/server";

export type AdminAccess = { userId: string; fullName: string; role: "super_admin" | "admin" | "editor" };
export function hasActiveAdminProfile(profile: { is_active: boolean } | null) { return profile?.is_active === true; }

export async function getActiveAdmin(): Promise<AdminAccess | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_profiles").select("user_id, full_name, role, is_active").eq("user_id", user.id).eq("is_active", true).maybeSingle();
  if (!data || !hasActiveAdminProfile(data)) return null;
  return { userId: data.user_id, fullName: data.full_name, role: data.role };
}
