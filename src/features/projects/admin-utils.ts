export const PROJECT_STATUSES = ["draft", "published", "archived"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export function projectSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 120);
}

export function projectStatusLabel(status: string) {
  return status === "published"
    ? "Published"
    : status === "draft"
      ? "Hidden / Draft"
      : status === "archived"
        ? "Archived"
        : status;
}
