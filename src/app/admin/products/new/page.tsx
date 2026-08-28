import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { createProduct, listAdminCategories } from "@/features/products/admin";
import { getActiveAdmin } from "@/lib/auth/admin";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const [categories, params] = await Promise.all([
    listAdminCategories(),
    searchParams,
  ]);
  return (
    <main className="mx-auto max-w-4xl p-4 sm:p-6">
      <Link
        href="/admin/products"
        className="text-sm underline underline-offset-4"
      >
        Back to products
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">Add product</h1>
      <p className="text-muted-foreground mt-1">
        New products start hidden until you publish them.
      </p>
      <form
        action={createProduct}
        className="mt-8 grid gap-6 border p-5 sm:p-7"
      >
        <FormError message={params.error} />
        <section className="grid gap-4">
          <h2 className="text-xl font-medium">Basic information</h2>
          <label>
            Name
            <input
              required
              name="name"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Slug{" "}
            <span className="text-muted-foreground text-sm">
              (optional — generated from name)
            </span>
            <input name="slug" className="mt-1 min-h-11 w-full border px-3" />
          </label>
          <label>
            Category
            <select
              required
              name="category_id"
              defaultValue=""
              className="mt-1 min-h-11 w-full border px-3"
            >
              <option disabled value="">
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </section>
        <section className="grid gap-4">
          <h2 className="text-xl font-medium">Content</h2>
          <label>
            Short description
            <textarea
              name="short_description"
              rows={3}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Full description
            <textarea
              name="description"
              rows={6}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Product code{" "}
            <input
              name="product_code"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Catalogue page reference
            <input
              name="catalogue_page_number"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Catalogue source reference
            <input
              name="catalogue_source_reference"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
        </section>
        <section className="grid gap-4">
          <h2 className="text-xl font-medium">Raw catalogue values</h2>
          <p className="text-muted-foreground text-sm">
            Preserved exactly for traceability; public display fields may be
            cleaned separately.
          </p>
          <label>
            Raw catalogue name
            <input
              name="raw_catalogue_name"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Raw catalogue description
            <textarea
              name="raw_catalogue_description"
              rows={4}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Raw primary product code
            <input
              name="raw_product_code"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
        </section>
        <section className="grid gap-4 sm:grid-cols-3">
          <h2 className="text-xl font-medium sm:col-span-3">Display</h2>
          <label>
            Status
            <select
              name="status"
              defaultValue="draft"
              className="mt-1 min-h-11 w-full border px-3"
            >
              <option value="draft">Hidden / Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>
          <label>
            Sort order
            <input
              name="sort_order"
              type="number"
              min="0"
              defaultValue="0"
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label className="flex items-end gap-2 pb-3">
            <input name="is_featured" type="checkbox" /> Featured
          </label>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button>Create product</Button>
          <Link
            href="/admin/products"
            className="inline-flex min-h-12 items-center px-3 text-sm underline"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}
