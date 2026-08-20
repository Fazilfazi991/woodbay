import "server-only";

/** Accept only absolute HTTP(S) URLs for values rendered as external links or media. */
export function isSafeHttpUrl(value: string) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}
