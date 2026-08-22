import "server-only";

/**
 * Converts a stored public Supabase URL back to its object key, but only when
 * it belongs to the resource namespace being deleted. This prevents a record
 * containing an arbitrary key from becoming an arbitrary bucket deletion.
 */
export function getExpectedMediaObjectKey(
  value: string,
  namespace: "products" | "projects" | "dealers",
  resourceId: string,
) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "woodbay-media";
  const prefix = `${namespace}/${resourceId}/`;
  const publicPrefix = `/storage/v1/object/public/${bucket}/`;
  let key = value;

  try {
    const url = new URL(value);
    const markerIndex = url.pathname.indexOf(publicPrefix);
    if (markerIndex >= 0) key = decodeURIComponent(url.pathname.slice(markerIndex + publicPrefix.length));
  } catch {
    // A raw object key is allowed, subject to the namespace check below.
  }

  return key.startsWith(prefix) && !key.includes("\\") && !key.includes("..")
    ? key
    : null;
}
