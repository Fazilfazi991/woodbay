export function adminDate(
  value: string | null | undefined,
  includeTime = false,
) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(new Date(value));
}

export function AdminStatus({
  value,
  label,
}: {
  value: string;
  label?: string;
}) {
  const positive = [
    "published",
    "active",
    "approved",
    "won",
    "verified",
    "available",
  ];
  const negative = [
    "archived",
    "inactive",
    "rejected",
    "lost",
    "closed",
    "disabled",
    "expired",
  ];
  const tone = positive.includes(value)
    ? "available"
    : negative.includes(value)
      ? "disabled"
      : "neutral";
  const text = label ?? value.replaceAll("_", " ");
  return <span className={`admin-status admin-status--${tone}`}>{text}</span>;
}
