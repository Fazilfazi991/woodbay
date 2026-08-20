import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listAdminCategories, listAdminProducts } from "@/features/products/admin";
import { getActiveAdmin } from "@/lib/auth/admin";

function hrefFor(input: { q: string; status: string; featured: string; category: string }, page: number) {
  const params = new URLSearchParams();
  if (input.q) params.set("q", input.q);
  if (input.status !== "all") params.set("status", input.status);
  if (input.featured !== "all") params.set("featured", input.featured);
  if (input.category) params.set("category", input.category);
  if (page > 1) params.set("page", String(page));
  return `/admin/products${params.size ? `?${params}` : ""}`;
}

function categoryName(value: unknown) {
  const relation = Array.isArray(value) ? value[0] : value;
  return relation && typeof relation === "object" && "name" in relation && typeof relation.name === "string" ? relation.name : "Uncategorized";
}

export default async function ProductsAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const [data, categories] = await Promise.all([listAdminProducts(await searchParams), listAdminCategories()]);
  const pageCount = Math.max(1, Math.ceil(data.count / data.pageSize));
  const query = { q: data.q, status: data.status, featured: data.featured, category: data.category };

  return <main className="mx-auto max-w-6xl p-4 sm:p-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-semibold">Products</h1><p className="mt-1 text-muted-foreground">Manage the Woodbay catalogue and public visibility.</p></div><Link href="/admin/products/new" className="woodbay-button inline-flex min-h-12 items-center justify-center rounded-[3px] px-6 py-3 text-[11px] font-medium uppercase tracking-[.14em]">Add product</Link></div>
    <form className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_10rem_10rem_auto]">
      <input name="q" defaultValue={data.q} placeholder="Search name or slug" className="min-h-11 border px-3" />
      <select name="category" defaultValue={data.category} className="min-h-11 border px-3"><option value="">All categories</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
      <select name="status" defaultValue={data.status} className="min-h-11 border px-3"><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Hidden / Draft</option><option value="archived">Archived</option></select>
      <select name="featured" defaultValue={data.featured} className="min-h-11 border px-3"><option value="all">All products</option><option value="yes">Featured</option><option value="no">Not featured</option></select>
      <Button variant="light">Search</Button>
    </form>
    {data.rows.length === 0 ? <p className="mt-8 border p-6 text-muted-foreground">No products found.</p> : <><div className="mt-8 space-y-3 md:hidden">{data.rows.map((row) => <Link key={row.id} href={`/admin/products/${row.id}`} className="block border p-4"><div className="flex items-start justify-between gap-4"><b>{row.name}</b><span>{row.status === "published" ? "Published" : "Hidden"}</span></div><p className="mt-2 text-sm text-muted-foreground">{categoryName(row.product_categories)} · {row.is_featured ? "Featured" : "Standard"}</p></Link>)}</div><div className="mt-8 hidden overflow-x-auto border md:block"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b"><tr><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Featured</th><th className="p-3">Updated</th><th className="p-3" /></tr></thead><tbody>{data.rows.map((row) => { const images = row.product_images ?? []; const primary = [...images].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.sort_order - b.sort_order)[0]; return <tr key={row.id} className="border-b last:border-0"><td className="p-3">{primary?.storage_key ? <Image src={primary.storage_key} alt={primary.alt_text ?? ""} width={48} height={36} className="h-9 w-12 object-cover" /> : "—"}</td><td className="p-3 font-medium">{row.name}</td><td className="p-3">{categoryName(row.product_categories)}</td><td className="p-3">{row.status === "published" ? "Published" : row.status === "draft" ? "Hidden / Draft" : "Archived"}</td><td className="p-3">{row.is_featured ? "Yes" : "—"}</td><td className="p-3">{new Date(row.updated_at).toLocaleDateString()}</td><td className="p-3 text-right"><Link href={`/admin/products/${row.id}`}>Edit</Link></td></tr>; })}</tbody></table></div></>}
    {pageCount > 1 && <nav aria-label="Product pagination" className="mt-6 flex items-center justify-between"><>{data.page > 1 ? <Link href={hrefFor(query, data.page - 1)}>Previous</Link> : <span />}</><span>Page {data.page} of {pageCount}</span>{data.page < pageCount ? <Link href={hrefFor(query, data.page + 1)}>Next</Link> : <span />}</nav>}
  </main>;
}
