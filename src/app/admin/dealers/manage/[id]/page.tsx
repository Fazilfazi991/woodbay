import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAdminDealer } from "@/features/dealers/admin";
import { DealerEditForm } from "@/features/dealers/components/dealer-edit-form";
import { getActiveAdmin } from "@/lib/auth/admin";

export default async function DealerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");

  let dealer;
  try {
    dealer = await getAdminDealer((await params).id);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <Link href="/admin/dealers?view=network" className="text-sm font-medium">
        ← Back to dealers
      </Link>
      <div className="mt-6 border p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[.14em] text-[color:var(--gold)]">
          Dealer profile
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{dealer.business_name}</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Update the dealer details shown in the public locator.
        </p>
        <div className="mt-6">
          <DealerEditForm dealer={dealer} />
        </div>
      </div>
    </main>
  );
}
