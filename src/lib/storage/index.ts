import "server-only";
import type { StorageProvider } from "./types";
import { supabaseStorage } from "./supabase";
/** Replace the R2 branch with an R2 provider without changing feature code. */
export function getStorageProvider(): StorageProvider { switch (process.env.STORAGE_PROVIDER ?? "supabase") { case "supabase": return supabaseStorage; default: throw new Error("Configured storage provider is not implemented."); } }
