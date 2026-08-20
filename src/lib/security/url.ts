import "server-only";

/** Accept only absolute HTTPS URLs for values rendered as external links or media. */
export function isSafeHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
