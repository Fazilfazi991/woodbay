import "server-only";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const supportedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function startsWith(bytes: Uint8Array, signature: number[]) {
  return signature.every((value, index) => bytes[index] === value);
}

function hasSupportedImageSignature(type: string, bytes: Uint8Array) {
  if (type === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (type === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (type === "image/webp") return startsWith(bytes, [0x52, 0x49, 0x46, 0x46]) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (type === "image/avif") return String.fromCharCode(...bytes.slice(4, 8)) === "ftyp" && ["avif", "avis"].includes(String.fromCharCode(...bytes.slice(8, 12)));
  return false;
}

/** Validate both the declared MIME type and the file signature before upload. */
export async function isSafeImageUpload(file: File) {
  if (!supportedTypes.has(file.type) || file.size <= 0 || file.size > MAX_IMAGE_BYTES) return false;
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  return hasSupportedImageSignature(file.type, header);
}
