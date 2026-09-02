import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminShell } from "@/features/admin/components/admin-shell";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={children}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
