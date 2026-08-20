import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  clearProjectCover,
  getAdminProject,
  removeProjectImage,
  reorderProjectImage,
  saveProject,
  setProjectCoverFromImage,
} from "@/features/projects/admin";
import { projectStatusLabel } from "@/features/projects/admin-utils";
import { getActiveAdmin } from "@/lib/auth/admin";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

function canPreview(src: string | null) {
  return Boolean(src && (src.startsWith("http") || src.startsWith("/")));
}

export default async function EditProjectPage({ params, searchParams }: PageProps) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const { id } = await params;
  const query = await searchParams;
  let project: Awaited<ReturnType<typeof getAdminProject>>;

  try {
    project = await getAdminProject(id);
  } catch {
    notFound();
  }

  const images = [...(project.project_images ?? [])].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Edit Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {project.title} · {projectStatusLabel(project.status)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {project.status === "published" && (
            <Link href={`/projects/${project.slug}`} className="text-sm underline">
              View public
            </Link>
          )}
          <Link href="/admin/projects" className="text-sm underline">
            Back
          </Link>
        </div>
      </div>

      {query.error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{query.error}</p>}
      {query.saved && <p className="mt-5 border border-green-300 bg-green-50 p-3 text-sm text-green-800">Project saved.</p>}
      {query.created && <p className="mt-5 border border-green-300 bg-green-50 p-3 text-sm text-green-800">Project created.</p>}
      {query.images && <p className="mt-5 border border-green-300 bg-green-50 p-3 text-sm text-green-800">Media updated.</p>}

      <form action={saveProject} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={project.id} />
        <label>
          Title
          <input required name="title" defaultValue={project.title} className="mt-1 min-h-11 w-full border px-3" />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={project.slug} className="mt-1 min-h-11 w-full border px-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Category
            <input required name="category" defaultValue={project.category} className="mt-1 min-h-11 w-full border px-3" />
          </label>
          <label>
            Location
            <input name="location" defaultValue={project.location ?? ""} className="mt-1 min-h-11 w-full border px-3" />
          </label>
        </div>
        <label>
          Description
          <textarea name="description" rows={7} defaultValue={project.description ?? ""} className="mt-1 w-full border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Status
            <select name="status" defaultValue={project.status} className="mt-1 min-h-11 w-full border px-3">
              <option value="draft">Hidden / Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Sort order
            <input name="sort_order" type="number" defaultValue={project.sort_order} className="mt-1 min-h-11 w-full border px-3" />
          </label>
        </div>

        <section className="mt-4 border p-4 sm:p-5">
          <h2 className="text-xl font-medium">Cover Image</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-[220px_1fr] sm:items-start">
            <div className="relative aspect-[4/3] border bg-black/5">
              {canPreview(project.featured_image) ? (
                <Image src={project.featured_image ?? ""} alt={project.title} fill sizes="220px" className="object-cover" />
              ) : (
                <div className="grid h-full place-items-center p-4 text-sm text-muted-foreground">No cover image</div>
              )}
            </div>
            <div className="space-y-4">
              <label>
                Replace cover
                <input name="cover_image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-1 block w-full text-sm" />
              </label>
              {project.featured_image && (
                <>
                  <input type="hidden" name="project_id" value={project.id} />
                  <button formAction={clearProjectCover} type="submit" className="text-sm underline">
                    Remove cover
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="border p-4 sm:p-5">
          <h2 className="text-xl font-medium">Gallery Images</h2>
          <label className="mt-4 block">
            Add images
            <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="mt-1 block w-full text-sm" />
          </label>
        </section>

        <Button type="submit">Save Changes</Button>
      </form>

      <section className="mt-8 border p-4 sm:p-5">
        <h2 className="text-xl font-medium">Current Gallery</h2>
        {images.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No gallery images have been added.</p>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <article key={image.id} className="border p-3">
                <div className="relative aspect-[4/3] bg-black/5">
                  {canPreview(image.storage_key) ? (
                    <Image src={image.storage_key} alt={image.alt_text ?? project.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  ) : (
                    <span className="block p-3 text-sm">{image.storage_key}</span>
                  )}
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  <form action={reorderProjectImage} className="flex items-end gap-2">
                    <input type="hidden" name="project_id" value={project.id} />
                    <input type="hidden" name="image_id" value={image.id} />
                    <label className="flex-1">
                      Sort
                      <input name="sort_order" type="number" defaultValue={image.sort_order} className="mt-1 min-h-9 w-full border px-2" />
                    </label>
                    <button type="submit" className="underline">
                      Save order
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-3">
                    <form action={setProjectCoverFromImage}>
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="image_id" value={image.id} />
                      <button type="submit" className="underline">
                        Use as cover
                      </button>
                    </form>
                    <form action={removeProjectImage}>
                      <input type="hidden" name="project_id" value={project.id} />
                      <input type="hidden" name="image_id" value={image.id} />
                      <button type="submit" className="underline">
                        Remove
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
