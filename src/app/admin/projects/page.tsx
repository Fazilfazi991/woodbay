import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listAdminProjects } from "@/features/projects/admin";
import { projectStatusLabel } from "@/features/projects/admin-utils";
import { getActiveAdmin } from "@/lib/auth/admin";

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

function pageHref(page: number, data: Awaited<ReturnType<typeof listAdminProjects>>) {
  const params = new URLSearchParams();
  if (data.q) params.set("q", data.q);
  if (data.category) params.set("category", data.category);
  if (data.status !== "all") params.set("status", data.status);
  params.set("page", String(page));
  return `/admin/projects?${params.toString()}`;
}

export default async function ProjectsAdminPage({ searchParams }: PageProps) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const data = await listAdminProjects(await searchParams);

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage Woodbay project gallery entries.</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>+ Add Project</Button>
        </Link>
      </div>

      <form className="mt-6 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
        <input
          name="q"
          defaultValue={data.q}
          placeholder="Search title, location or slug"
          className="min-h-11 border px-3"
        />
        <input
          name="category"
          defaultValue={data.category}
          placeholder="Category"
          className="min-h-11 border px-3"
        />
        <select name="status" defaultValue={data.status} className="min-h-11 border px-3">
          <option value="all">All statuses</option>
          <option value="draft">Hidden / Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <Button type="submit">Filter</Button>
      </form>

      {data.rows.length === 0 ? (
        <p className="mt-8 border p-6 text-muted-foreground">No projects found.</p>
      ) : (
        <>
          <div className="mt-8 space-y-3 md:hidden">
            {data.rows.map((row) => (
              <Link key={row.id} href={`/admin/projects/${row.id}`} className="block border p-4">
                <div className="flex items-start justify-between gap-4">
                  <b>{row.title}</b>
                  <span className="text-sm">{projectStatusLabel(row.status)}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {row.category} · {row.location ?? "No location"} · Order {row.sort_order}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 hidden overflow-x-auto border md:block">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-3">Cover</th>
                  <th className="p-3">Project</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sort</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr key={row.id} className="border-b last:border-0">
                    <td className="p-3">
                      {row.featured_image ? (
                        <Image src={row.featured_image} alt="" width={56} height={42} className="h-11 w-14 object-cover" />
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3 font-medium">{row.title}</td>
                    <td className="p-3">{row.category}</td>
                    <td className="p-3">{row.location ?? "-"}</td>
                    <td className="p-3">{projectStatusLabel(row.status)}</td>
                    <td className="p-3">{row.sort_order}</td>
                    <td className="p-3 text-right">
                      <Link href={`/admin/projects/${row.id}`}>Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data.pageCount > 1 && (
        <nav className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <span>
            Page {data.page} of {data.pageCount}
          </span>
          {data.page > 1 && <Link href={pageHref(data.page - 1, data)}>Previous</Link>}
          {data.page < data.pageCount && <Link href={pageHref(data.page + 1, data)}>Next</Link>}
        </nav>
      )}
    </main>
  );
}
