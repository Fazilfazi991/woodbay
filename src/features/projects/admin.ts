"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getActiveAdmin } from "@/lib/auth/admin";
import { getExpectedMediaObjectKey } from "@/lib/security/media";
import { isSafeImageUpload } from "@/lib/security/upload";
import { getStorageProvider } from "@/lib/storage";
import { createAdminClient } from "@/lib/supabase/admin";
import { PROJECT_STATUSES, projectSlug } from "./admin-utils";

const PAGE_SIZE = 20;

const projectSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z.string().trim().max(160).optional(),
  category: z.string().trim().min(2).max(120),
  location: z.string().trim().max(160).optional(),
  description: z.string().trim().max(5000).optional(),
  status: z.enum(PROJECT_STATUSES).default("draft"),
  sort_order: z.coerce.number().int().min(0).max(100000).default(0),
});

async function requireProjectAdmin() {
  if (!(await getActiveAdmin())) throw new Error("Unauthorized");
}

function errorPath(path: string, message: string) {
  return `${path}${path.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`;
}

function parseProject(form: FormData) {
  const raw = projectSchema.parse(Object.fromEntries(form));
  const normalizedSlug = projectSlug(raw.slug || raw.title);
  if (!normalizedSlug) throw new Error("Please provide a valid project title or slug.");

  return {
    title: raw.title,
    slug: normalizedSlug,
    category: raw.category,
    location: raw.location || null,
    description: raw.description || null,
    status: raw.status,
    sort_order: raw.sort_order,
  };
}

async function persistProjectMedia(projectId: string, title: string, form: FormData) {
  const storage = getStorageProvider();
  const db = createAdminClient();
  const cover = form.get("cover_image");
  const gallery = form
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (cover instanceof File && cover.size > 0) {
    if (!(await isSafeImageUpload(cover))) {
      throw new Error("Use a JPG, PNG, WebP or AVIF cover image no larger than 10 MB.");
    }
    const extension = cover.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const key = `projects/${projectId}/cover-${randomUUID()}.${extension}`;
    await storage.upload({ key, file: cover, contentType: cover.type });
    const { error } = await db.from("projects").update({ featured_image: await storage.getUrl(key) }).eq("id", projectId);
    if (error) throw new Error("Cover uploaded but could not be attached to this project.");
  }

  if (!gallery.length) return;
  if (gallery.length > 8 || !(await Promise.all(gallery.map(isSafeImageUpload))).every(Boolean)) {
    throw new Error("Use up to 8 JPG, PNG, WebP or AVIF gallery images, each no larger than 10 MB.");
  }

  const { data: existing } = await db
    .from("project_images")
    .select("id")
    .eq("project_id", projectId);
  const baseSort = existing?.length ?? 0;
  const rows = [];

  for (const [index, file] of gallery.entries()) {
    const extension = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
    const key = `projects/${projectId}/${randomUUID()}.${extension}`;
    await storage.upload({ key, file, contentType: file.type });
    rows.push({
      project_id: projectId,
      storage_key: await storage.getUrl(key),
      alt_text: title,
      sort_order: baseSort + index,
    });
  }

  const { error } = await db.from("project_images").insert(rows);
  if (error) throw new Error("Images uploaded but could not be attached to this project.");
}

export async function listAdminProjects(input: Record<string, string | undefined>) {
  await requireProjectAdmin();
  const q = (input.q ?? "").trim().slice(0, 100);
  const status = z.enum(["all", ...PROJECT_STATUSES]).catch("all").parse(input.status ?? "all");
  const category = (input.category ?? "").trim().slice(0, 120);
  const page = Math.max(1, Number(input.page) || 1);

  let query = createAdminClient()
    .from("projects")
    .select("id,title,slug,category,location,status,sort_order,updated_at,featured_image", { count: "exact" })
    .order("sort_order")
    .order("updated_at", { ascending: false });

  if (q) query = query.or(`title.ilike.%${q}%,location.ilike.%${q}%,slug.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (category) query = query.eq("category", category);

  const { data, error, count } = await query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (error) throw new Error("Unable to load projects.");

  return {
    rows: data ?? [],
    count: count ?? 0,
    q,
    status,
    category,
    page,
    pageSize: PAGE_SIZE,
    pageCount: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

export async function getAdminProject(id: string) {
  await requireProjectAdmin();
  const { data, error } = await createAdminClient()
    .from("projects")
    .select("id,title,slug,category,location,description,featured_image,status,sort_order,project_images(id,storage_key,alt_text,sort_order)")
    .eq("id", z.string().uuid().parse(id))
    .maybeSingle();

  if (error || !data) throw new Error("Project not found.");
  return data;
}

export async function saveProject(form: FormData) {
  await requireProjectAdmin();
  const id = z.string().uuid().optional().parse(form.get("id") || undefined);
  const targetPath = id ? `/admin/projects/${id}` : "/admin/projects/new";
  let value: ReturnType<typeof parseProject>;

  try {
    value = parseProject(form);
  } catch (error) {
    redirect(errorPath(targetPath, error instanceof Error ? error.message : "Please check the project form."));
  }

  const db = createAdminClient();

  if (id) {
    const { error } = await db.from("projects").update(value).eq("id", id);
    if (error) {
      redirect(errorPath(targetPath, error.code === "23505" ? "That slug is already in use." : "Unable to save project."));
    }
    try {
      await persistProjectMedia(id, value.title, form);
    } catch (error) {
      redirect(errorPath(targetPath, error instanceof Error ? error.message : "Project saved, but media could not be updated."));
    }
    revalidatePath(`/admin/projects/${id}`);
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
    redirect(`/admin/projects/${id}?saved=1`);
  }

  const { data, error } = await db.from("projects").insert(value).select("id").single();
  if (error || !data) {
    redirect(errorPath(targetPath, error?.code === "23505" ? "That slug is already in use." : "Unable to create project."));
  }
  try {
    await persistProjectMedia(data.id, value.title, form);
  } catch (mediaError) {
    redirect(errorPath(`/admin/projects/${data.id}`, mediaError instanceof Error ? mediaError.message : "Project created, but media could not be attached."));
  }
  revalidatePath("/admin/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${data.id}?created=1`);
}

export async function removeProjectImage(form: FormData) {
  await requireProjectAdmin();
  const projectId = z.string().uuid().parse(form.get("project_id"));
  const imageId = z.string().uuid().parse(form.get("image_id"));
  const db = createAdminClient();
  const { data } = await db
    .from("project_images")
    .select("storage_key")
    .eq("id", imageId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!data) redirect(errorPath(`/admin/projects/${projectId}`, "Image not found."));
  const { error } = await db.from("project_images").delete().eq("id", imageId).eq("project_id", projectId);
  if (error) redirect(errorPath(`/admin/projects/${projectId}`, "Unable to remove image."));

  const key = getExpectedMediaObjectKey(data.storage_key, "projects", projectId);
  if (key) {
    try {
      await getStorageProvider().delete(key);
    } catch {
      // The gallery record is already removed; keep the admin flow moving.
    }
  }

  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${projectId}?images=1`);
}

export async function reorderProjectImage(form: FormData) {
  await requireProjectAdmin();
  const projectId = z.string().uuid().parse(form.get("project_id"));
  const imageId = z.string().uuid().parse(form.get("image_id"));
  const sortOrder = z.coerce.number().int().min(0).max(100000).parse(form.get("sort_order"));
  const { error } = await createAdminClient()
    .from("project_images")
    .update({ sort_order: sortOrder })
    .eq("id", imageId)
    .eq("project_id", projectId);

  if (error) redirect(errorPath(`/admin/projects/${projectId}`, "Unable to reorder image."));
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${projectId}?images=1`);
}

export async function setProjectCoverFromImage(form: FormData) {
  await requireProjectAdmin();
  const projectId = z.string().uuid().parse(form.get("project_id"));
  const imageId = z.string().uuid().parse(form.get("image_id"));
  const db = createAdminClient();
  const { data } = await db
    .from("project_images")
    .select("storage_key")
    .eq("id", imageId)
    .eq("project_id", projectId)
    .maybeSingle();

  if (!data) redirect(errorPath(`/admin/projects/${projectId}`, "Image not found."));
  const { error } = await db.from("projects").update({ featured_image: data.storage_key }).eq("id", projectId);
  if (error) redirect(errorPath(`/admin/projects/${projectId}`, "Unable to set cover image."));
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${projectId}?images=1`);
}

export async function clearProjectCover(form: FormData) {
  await requireProjectAdmin();
  const projectId = z.string().uuid().parse(form.get("project_id"));
  const { error } = await createAdminClient().from("projects").update({ featured_image: null }).eq("id", projectId);
  if (error) redirect(errorPath(`/admin/projects/${projectId}`, "Unable to remove cover image."));
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/projects");
  revalidatePath("/");
  redirect(`/admin/projects/${projectId}?images=1`);
}
