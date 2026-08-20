import "server-only";
import type { StorageProvider } from "./types";
import { createAdminClient } from "@/lib/supabase/admin";
const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "woodbay-media";
export const supabaseStorage: StorageProvider = { async upload({ key, file, contentType }) { const { error } = await createAdminClient().storage.from(bucket).upload(key, file, { contentType, upsert: false }); if (error) throw error; return { key }; }, async delete(key) { const { error } = await createAdminClient().storage.from(bucket).remove([key]); if (error) throw error; }, async getUrl(key, options) { const client = createAdminClient().storage.from(bucket); if (options?.expiresIn) { const { data, error } = await client.createSignedUrl(key, options.expiresIn); if (error) throw error; return data.signedUrl; } return client.getPublicUrl(key).data.publicUrl; } };
