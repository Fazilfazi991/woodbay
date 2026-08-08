"use server";
import { redirect } from "next/navigation";
import { adminLoginSchema } from "@/lib/validation/auth";
import { createClient } from "@/lib/supabase/server";
import { getActiveAdmin } from "@/lib/auth/admin";
import { normalizeError } from "@/lib/errors";

export type LoginState = { ok: boolean; message: string };
export async function login(_previousState: LoginState, formData: FormData): Promise<LoginState> { try { const credentials = adminLoginSchema.parse({ email: formData.get("email"), password: formData.get("password") }); const supabase = await createClient(); const { error } = await supabase.auth.signInWithPassword(credentials); if (error) return { ok: false, message: "Invalid email or password." }; if (!(await getActiveAdmin())) { await supabase.auth.signOut(); return { ok: false, message: "This account does not have active admin access." }; } } catch (error) { const result = normalizeError(error); return { ok: false, message: result.ok ? "Something went wrong. Please try again." : result.message }; } redirect("/admin"); }
export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/admin/login"); }
