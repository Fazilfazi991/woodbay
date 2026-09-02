import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

function readEnv(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        return [line.slice(0, separator), line.slice(separator + 1).trim()];
      }),
  );
}

const localEnv = readEnv(path.resolve(".env.local"));
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? localEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? localEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) throw new Error("Supabase public environment is required");

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { data: products, error } = await supabase
  .from("products")
  .select("name,slug,product_images(storage_key,alt_text,is_primary,sort_order)")
  .eq("status", "published")
  .order("slug");
if (error) throw error;

const manifest = JSON.parse(readFileSync("product-images-manifest.json", "utf8"));
const expectedPaths = new Set([
  ...manifest.map((entry) => entry.imagePath),
  "/images/products/artificial-grass.webp",
]);
const fileRows = await Promise.all(
  [...expectedPaths].map(async (publicPath) => {
    const file = path.join("public", publicPath.replace(/^\//, ""));
    if (!existsSync(file)) return { publicPath, missing: true };
    const bytes = readFileSync(file);
    const metadata = await sharp(bytes).metadata();
    return {
      publicPath,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      bytes: bytes.length,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    };
  }),
);

const missingFiles = fileRows.filter((row) => row.missing);
const duplicateGroups = Object.values(
  fileRows.reduce((groups, row) => {
    if (!("sha256" in row)) return groups;
    (groups[row.sha256] ??= []).push(row.publicPath);
    return groups;
  }, {}),
).filter((paths) => paths.length > 1);
const imageLess = products.filter((product) => product.product_images.length === 0).map((product) => product.slug);
const brokenReferences = products.flatMap((product) =>
  product.product_images
    .filter((image) => image.storage_key.startsWith("/") && !existsSync(path.join("public", image.storage_key.replace(/^\//, ""))))
    .map((image) => ({ slug: product.slug, storageKey: image.storage_key })),
);
const invalidAltText = products.flatMap((product) =>
  product.product_images
    .filter((image) => !image.alt_text?.trim())
    .map((image) => ({ slug: product.slug, storageKey: image.storage_key })),
);

const summary = {
  publishedProducts: products.length,
  productsWithImages: products.length - imageLess.length,
  imageLess,
  auditedFiles: fileRows.length,
  missingFiles,
  brokenReferences,
  duplicateGroups,
  invalidAltText,
};
console.log(JSON.stringify(summary, null, 2));

if (products.length !== 76) throw new Error(`Expected 76 published products, found ${products.length}`);
if (missingFiles.length || brokenReferences.length || duplicateGroups.length || invalidAltText.length) process.exitCode = 1;

