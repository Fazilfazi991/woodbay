import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { saveProject } from "@/features/projects/admin";
import { getActiveAdmin } from "@/lib/auth/admin";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function NewProjectPage({ searchParams }: PageProps) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const params = await searchParams;

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Add Project</h1>
          <p className="mt-1 text-sm text-muted-foreground">New projects start hidden until you publish them.</p>
        </div>
        <Link href="/admin/projects" className="text-sm underline">
          Back
        </Link>
      </div>

      {params.error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{params.error}</p>}

      <form action={saveProject} className="mt-6 grid gap-4">
        <label>
          Title
          <input required name="title" className="mt-1 min-h-11 w-full border px-3" />
        </label>
        <label>
          Slug
          <input name="slug" placeholder="Leave blank to generate from title" className="mt-1 min-h-11 w-full border px-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Category
            <input required name="category" className="mt-1 min-h-11 w-full border px-3" />
          </label>
          <label>
            Location
            <input name="location" className="mt-1 min-h-11 w-full border px-3" />
          </label>
        </div>
        <label>
          Description
          <textarea name="description" rows={6} className="mt-1 w-full border p-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            Status
            <select name="status" defaultValue="draft" className="mt-1 min-h-11 w-full border px-3">
              <option value="draft">Hidden / Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Sort order
            <input name="sort_order" type="number" defaultValue="0" className="mt-1 min-h-11 w-full border px-3" />
          </label>
        </div>
        <label>
          Cover image
          <input name="cover_image" type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="mt-1 block w-full text-sm" />
        </label>
        <label>
          Gallery images
          <input name="images" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="mt-1 block w-full text-sm" />
        </label>
        <Button type="submit">Create project</Button>
      </form>
    </main>
  );
}
