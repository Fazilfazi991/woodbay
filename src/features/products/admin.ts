"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getActiveAdmin } from "@/lib/auth/admin";
import { getStorageProvider } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCT_STATUSES, productSlug } from "./admin-utils";
import { getExpectedMediaObjectKey } from "@/lib/security/media";
import { isSafeImageUpload } from "@/lib/security/upload";

const PAGE_SIZE = 20;
const statuses = PRODUCT_STATUSES;
const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(160).optional(),
  category_id: z.string().uuid(),
  short_description: z.string().trim().max(500).optional(),
  description: z.string().trim().max(5000).optional(),
  product_code: z.string().trim().max(100).optional(),
  status: z.enum(statuses),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
});

export type ProductStatus = (typeof statuses)[number];

function isChecked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

function errorPath(path: string, message: string) {
  return `${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`;
}

async function requireAdmin() {
  if (!(await getActiveAdmin())) throw new Error("Unauthorized");
}

async function assertCategory(categoryId: string) {
  const { data } = await createAdminClient()
    .from("product_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) throw new Error("Please select a valid category.");
}

function parseProduct(form: FormData) {
  const value = productSchema.parse(Object.fromEntries(form));
  const slug = productSlug(value.slug || value.name);
  if (!slug) throw new Error("Please provide a valid product name or slug.");
  return {
    ...value,
    slug,
    short_description: value.short_description || null,
    description: value.description || null,
    product_code: value.product_code || null,
    is_featured: isChecked(form.get("is_featured")),
  };
}

export async function listAdminProducts(input: Record<string, string | undefined>) {
  await requireAdmin();
  const q = (input.q ?? "").trim().slice(0, 100);
  const status = z.enum(["all", ...statuses]).catch("all").parse(input.status ?? "all");
  const featured = z.enum(["all", "yes", "no"]).catch("all").parse(input.featured ?? "all");
  const category = z.string().uuid().catch("").parse(input.category ?? "");
  const page = Math.max(1, Number(input.page) || 1);
  let query = createAdminClient()
    .from("products")
    .select("id,name,slug,status,is_featured,updated_at,category_id,product_categories(name),product_images(storage_key,alt_text,sort_order,is_primary)", { count: "exact" })
    .order("updated_at", { ascending: false });
  if (q) query = query.or(`name.ilike.%${q}%,slug.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (featured === "yes") query = query.eq("is_featured", true);
  if (featured === "no") query = query.eq("is_featured", false);
  if (category) query = query.eq("category_id", category);
  const { data, error, count } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw new Error("Unable to load products.");
  return { rows: data ?? [], count: count ?? 0, q, status, featured, category, page, pageSize: PAGE_SIZE };
}

export async function listAdminCategories() {
  await requireAdmin();
  const { data, error } = await createAdminClient().from("product_categories").select("id,name,slug,parent_id,sort_order").eq("is_active", true).order("sort_order");
  if (error) throw new Error("Unable to load categories.");
  return data ?? [];
}

export async function getAdminProduct(productId: string) {
  await requireAdmin();
  const { data, error } = await createAdminClient()
    .from("products")
    .select("id,name,slug,category_id,short_description,description,product_code,status,is_featured,sort_order,updated_at,product_images(id,storage_key,alt_text,sort_order,is_primary)")
    .eq("id", z.string().uuid().parse(productId))
    .maybeSingle();
  if (error || !data) throw new Error("Product not found.");
  return data;
}

export async function createProduct(form: FormData) {
  await requireAdmin();
  let value;
  try {
    value = parseProduct(form);
    await assertCategory(value.category_id);
  } catch (error) {
    redirect(errorPath("/admin/products/new", error instanceof Error ? error.message : "Please check the form."));
  }
  const { data, error } = await createAdminClient().from("products").insert(value).select("id").single();
  if (error || !data) redirect(errorPath("/admin/products/new", error?.code === "23505" ? "That slug is already in use." : "Unable to create the product."));
  revalidatePath("/products");
  redirect(`/admin/products/${data.id}?created=1`);
}

export async function updateProduct(form: FormData) {
  await requireAdmin();
  const productId = z.string().uuid().safeParse(form.get("id"));
  if (!productId.success) redirect(errorPath("/admin/products", "Product not found."));
  let value;
  try {
    value = parseProduct(form);
    await assertCategory(value.category_id);
  } catch (error) {
    redirect(errorPath(`/admin/products/${productId.data}`, error instanceof Error ? error.message : "Please check the form."));
  }
  const { error } = await createAdminClient().from("products").update(value).eq("id", productId.data);
  if (error) redirect(errorPath(`/admin/products/${productId.data}`, error.code === "23505" ? "That slug is already in use." : "Unable to save the product."));
  revalidatePath("/products");
  revalidatePath(`/admin/products/${productId.data}`);
  revalidatePath("/admin/products");
  redirect(`/admin/products/${productId.data}?saved=1`);
}

export async function uploadProductImages(form: FormData) {
  await requireAdmin();
  const productId = z.string().uuid().parse(form.get("id"));
  const files = form.getAll("images").filter((value): value is File => value instanceof File && value.size > 0);
  if (!files.length) redirect(errorPath(`/admin/products/${productId}`, "Choose at least one image."));
  if (files.length > 8 || !(await Promise.all(files.map(isSafeImageUpload))).every(Boolean)) {
    redirect(errorPath(`/admin/products/${productId}`, "Use up to 8 JPG, PNG, WebP or AVIF images, each no larger than 10 MB."));
  }
  const existing = await getAdminProduct(productId);
  const storage = getStorageProvider();
  const rows = [];
  for (const [index, file] of files.entries()) {
    const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const key = `products/${productId}/${randomUUID()}.${extension}`;
    await storage.upload({ key, file, contentType: file.type });
    rows.push({ product_id: productId, storage_key: await storage.getUrl(key), alt_text: existing.name, sort_order: existing.product_images.length + index, is_primary: existing.product_images.length === 0 && index === 0 });
  }
  const { error } = await createAdminClient().from("product_images").insert(rows);
  if (error) redirect(errorPath(`/admin/products/${productId}`, "Images uploaded but could not be attached to this product."));
  revalidatePath("/products");
  redirect(`/admin/products/${productId}?images=1`);
}

export async function removeProductImage(form: FormData) {
  await requireAdmin();
  const imageId = z.string().uuid().parse(form.get("image_id"));
  const productId = z.string().uuid().parse(form.get("product_id"));
  const { data } = await createAdminClient().from("product_images").select("storage_key").eq("id", imageId).eq("product_id", productId).maybeSingle();
  if (!data) redirect(errorPath(`/admin/products/${productId}`, "Image not found."));
  const { error } = await createAdminClient().from("product_images").delete().eq("id", imageId).eq("product_id", productId);
  if (error) redirect(errorPath(`/admin/products/${productId}`, "Unable to remove image."));
  const key = getExpectedMediaObjectKey(data.storage_key, "products", productId);
  if (key) {
    try { await getStorageProvider().delete(key); } catch { /* The catalogue record is already safely removed. */ }
  }
  revalidatePath("/products");
  redirect(`/admin/products/${productId}?images=1`);
}

export async function setPrimaryProductImage(form: FormData) {
  await requireAdmin();
  const imageId = z.string().uuid().parse(form.get("image_id"));
  const productId = z.string().uuid().parse(form.get("product_id"));
  const client = createAdminClient();
  const { data: image } = await client
    .from("product_images")
    .select("id")
    .eq("id", imageId)
    .eq("product_id", productId)
    .maybeSingle();
  if (!image) redirect(errorPath(`/admin/products/${productId}`, "Image not found."));
  const { error: clearError } = await client.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  const { error } = await client.from("product_images").update({ is_primary: true }).eq("id", imageId).eq("product_id", productId);
  if (clearError || error) redirect(errorPath(`/admin/products/${productId}`, "Unable to select the primary image."));
  revalidatePath("/products");
  redirect(`/admin/products/${productId}?images=1`);
}
