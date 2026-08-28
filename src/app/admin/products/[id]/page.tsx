import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import {
  getAdminProduct,
  listAdminCategories,
  removeProductImage,
  setPrimaryProductImage,
  updateProduct,
  uploadProductImages,
} from "@/features/products/admin";
import { getActiveAdmin } from "@/lib/auth/admin";

export default async function ProductEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
    created?: string;
    images?: string;
  }>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const { id } = await params;
  let product;
  try {
    product = await getAdminProduct(id);
  } catch {
    notFound();
  }
  const [categories, query] = await Promise.all([
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
      <div className="mt-4">
        <h1 className="text-3xl font-semibold">Edit product</h1>
        <p className="text-muted-foreground mt-1">{product.name}</p>
      </div>
      {(query.saved || query.created || query.images) && (
        <p
          role="status"
          className="mt-5 border border-[color:var(--gold)] p-3 text-sm"
        >
          Changes saved.
        </p>
      )}
      <FormError message={query.error} />
      <form
        action={updateProduct}
        className="mt-6 grid gap-6 border p-5 sm:p-7"
      >
        <input type="hidden" name="id" value={product.id} />
        <section className="grid gap-4">
          <h2 className="text-xl font-medium">Basic information</h2>
          <label>
            Name
            <input
              required
              name="name"
              defaultValue={product.name}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Slug
            <input
              required
              name="slug"
              defaultValue={product.slug}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Category
            <select
              required
              name="category_id"
              defaultValue={product.category_id}
              className="mt-1 min-h-11 w-full border px-3"
            >
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
              defaultValue={product.short_description ?? ""}
              rows={3}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Full description
            <textarea
              name="description"
              defaultValue={product.description ?? ""}
              rows={6}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Product code
            <input
              name="product_code"
              defaultValue={product.product_code ?? ""}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Catalogue page reference
            <input
              name="catalogue_page_number"
              defaultValue={product.catalogue_page_number ?? ""}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Catalogue source reference
            <input
              name="catalogue_source_reference"
              defaultValue={product.catalogue_source_reference ?? ""}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
        </section>
        <section className="grid gap-4">
          <h2 className="text-xl font-medium">Raw catalogue values</h2>
          <p className="text-muted-foreground text-sm">
            Stored separately from cleaned public display fields.
          </p>
          <label>
            Raw catalogue name
            <input
              name="raw_catalogue_name"
              defaultValue={String(
                (product.raw_catalogue_data as Record<string, unknown> | null)
                  ?.product_name ?? product.name,
              )}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label>
            Raw catalogue description
            <textarea
              name="raw_catalogue_description"
              defaultValue={String(
                (product.raw_catalogue_data as Record<string, unknown> | null)
                  ?.catalogue_description ?? "",
              )}
              rows={4}
              className="mt-1 w-full border p-3"
            />
          </label>
          <label>
            Raw primary product code
            <input
              name="raw_product_code"
              defaultValue={String(
                (product.raw_catalogue_data as Record<string, unknown> | null)
                  ?.primary_product_code ??
                  product.product_code ??
                  "",
              )}
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
              defaultValue={product.status}
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
              defaultValue={product.sort_order}
              className="mt-1 min-h-11 w-full border px-3"
            />
          </label>
          <label className="flex items-end gap-2 pb-3">
            <input
              name="is_featured"
              type="checkbox"
              defaultChecked={product.is_featured}
            />{" "}
            Featured
          </label>
        </section>
        <Button className="w-fit">Save changes</Button>
      </form>
      <section className="mt-8 border p-5 sm:p-7">
        <h2 className="text-xl font-medium">Media</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Upload JPG, PNG, WebP or AVIF files up to 10 MB each.
        </p>
        <form
          action={uploadProductImages}
          className="mt-5 flex flex-wrap items-end gap-3"
        >
          <input type="hidden" name="id" value={product.id} />
          <label className="flex-1">
            Images
            <input
              name="images"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="mt-1 block w-full text-sm"
            />
          </label>
          <Button>Upload images</Button>
        </form>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {product.product_images.length ? (
            product.product_images
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((image) => (
                <article key={image.id} className="border p-3">
                  <div className="relative aspect-[4/3] bg-black/5">
                    {image.storage_key.startsWith("/") ||
                    image.storage_key.startsWith("http") ? (
                      <Image
                        src={image.storage_key}
                        alt={image.alt_text ?? product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : (
                      <span className="p-3 text-sm">{image.storage_key}</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    {image.is_primary ? (
                      <span>Primary image</span>
                    ) : (
                      <form action={setPrimaryProductImage}>
                        <input
                          type="hidden"
                          name="product_id"
                          value={product.id}
                        />
                        <input type="hidden" name="image_id" value={image.id} />
                        <button className="underline" type="submit">
                          Make primary
                        </button>
                      </form>
                    )}
                    <form action={removeProductImage}>
                      <input
                        type="hidden"
                        name="product_id"
                        value={product.id}
                      />
                      <input type="hidden" name="image_id" value={image.id} />
                      <button className="underline" type="submit">
                        Remove
                      </button>
                    </form>
                  </div>
                </article>
              ))
          ) : (
            <p className="text-muted-foreground text-sm">
              No images have been added.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
