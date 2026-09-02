import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listDealerApplications } from "@/features/dealers/admin";
import { dealerBusinessTypes, dealerProductInterests } from "@/features/dealers/validation/dealer";
import { getActiveAdmin } from "@/lib/auth/admin";

function label(status: string) { return status[0].toUpperCase() + status.slice(1); }

export default async function DealerApplicationsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const data = await listDealerApplications(await searchParams);
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-3xl font-semibold">Dealer applications</h1><p className="mt-1 text-sm text-[color:var(--muted)]">Qualify partnership leads before deliberately creating a private dealer record.</p></div>
        <Link href="/dealers/become-a-dealer" className="text-sm text-[color:var(--gold)] underline underline-offset-4">Public application form</Link>
      </div>
      <form className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-[1.4fr_repeat(4,1fr)_auto]">
        <input name="q" defaultValue={data.q} placeholder="Applicant, business or phone" className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3" />
        <select name="status" defaultValue={data.status} className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"><option value="all">All statuses</option>{["new","contacted","qualified","approved","rejected"].map((status) => <option key={status} value={status}>{label(status)}</option>)}</select>
        <input name="location" defaultValue={data.location} placeholder="City or district" className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3" />
        <select name="business_type" defaultValue={data.businessType} className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"><option value="">All business types</option>{dealerBusinessTypes.map((type) => <option key={type}>{type}</option>)}</select>
        <select name="product_interest" defaultValue={data.productInterest} className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"><option value="">All product interests</option>{dealerProductInterests.map((interest) => <option key={interest}>{interest}</option>)}</select>
        <Button variant="light">Apply filters</Button>
      </form>
      <div className="mt-8 space-y-3 md:hidden">
        {data.rows.map((row) => <article key={row.id} className="border border-[color:var(--border-dark)] p-4"><Link href={`/admin/dealers/${row.id}`} className="font-semibold underline">{row.businessName}</Link><p className="mt-1 text-sm">{row.contactPerson} · {row.phone}</p><p className="mt-2 text-sm text-[color:var(--muted)]">{row.location}, {row.district} · {label(row.status)}</p><p className="mt-2 text-xs text-[color:var(--muted)]">{row.businessType ?? "Legacy application"}</p></article>)}
        {data.rows.length === 0 && <p className="border p-8 text-center text-sm text-[color:var(--muted)]">No applications found.</p>}
      </div>
      <div className="mt-8 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-left text-sm"><thead><tr className="border-b border-[color:var(--border-dark)] text-xs uppercase tracking-[.12em] text-[color:var(--muted)]"><th className="py-3">Business</th><th>Applicant</th><th>Phone</th><th>Location</th><th>Business type</th><th>Submitted</th><th>Status</th></tr></thead><tbody>{data.rows.map((row) => <tr key={row.id} className="border-b border-[color:var(--border-dark)]"><td className="py-4"><Link href={`/admin/dealers/${row.id}`} className="underline">{row.businessName}</Link></td><td>{row.contactPerson}</td><td>{row.phone}</td><td>{row.location}, {row.district}</td><td>{row.businessType ?? "—"}</td><td>{new Date(row.createdAt).toLocaleDateString()}</td><td>{label(row.status)}</td></tr>)}</tbody></table>
        {data.rows.length === 0 && <p className="py-12 text-center text-sm text-[color:var(--muted)]">No applications found.</p>}
      </div>
    </main>
  );
}
