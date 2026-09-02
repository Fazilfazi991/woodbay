import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listDealerApplications, listDealers } from "@/features/dealers/admin";
import {
  dealerBusinessTypes,
  dealerProductInterests,
} from "@/features/dealers/validation/dealer";
import { getActiveAdmin } from "@/lib/auth/admin";
import {
  AdminStatus,
  adminDate,
} from "@/features/admin/components/admin-status";

function label(status: string) {
  return status[0].toUpperCase() + status.slice(1);
}

export default async function DealerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const params = await searchParams;
  if (params.view === "network") {
    const dealers = await listDealers(params);
    return (
      <main className="mx-auto max-w-7xl p-4 sm:p-6">
        <div className="admin-page-heading">
          <div>
            <h1>Dealers</h1>
            <p>Manage active, private and inactive dealer records.</p>
          </div>
          <Link href="/admin/dealers">View applications</Link>
        </div>
        <form className="admin-filterbar mt-6 grid gap-3 sm:grid-cols-[1fr_12rem_auto]">
          <input type="hidden" name="view" value="network" />
          <input
            name="q"
            defaultValue={dealers.q}
            placeholder="Search dealer, contact or location"
            className="min-h-11 border px-3"
          />
          <select
            name="status"
            defaultValue={dealers.status}
            className="min-h-11 border px-3"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
          <Button variant="light">Search</Button>
        </form>
        <div className="mt-8 space-y-3 md:hidden">
          {dealers.rows.map((row) => {
            const relations = Array.isArray(row.dealer_applications)
              ? row.dealer_applications
              : [];
            const applicationId = relations[0]?.id;
            return (
              <article key={row.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <strong>{row.business_name}</strong>
                  <AdminStatus value={row.status} />
                </div>
                <p className="mt-2 text-sm">
                  {row.contact_person ?? "No contact"} · {row.phone}
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  {row.area ?? row.district} ·{" "}
                  {row.is_visible ? "Public" : "Private"} ·{" "}
                  {row.payment_qr_image ? "QR ready" : "No payment QR"}
                </p>
                {applicationId && (
                  <Link
                    className="mt-4 inline-block text-sm font-semibold"
                    href={`/admin/dealers/${applicationId}`}
                  >
                    View details →
                  </Link>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-8 hidden overflow-x-auto rounded-lg border md:block">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead>
              <tr>
                <th className="p-3">Dealer</th>
                <th className="p-3">Location</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Status</th>
                <th className="p-3">Visibility</th>
                <th className="p-3">Payment QR</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {dealers.rows.map((row) => {
                const relations = Array.isArray(row.dealer_applications)
                  ? row.dealer_applications
                  : [];
                const applicationId = relations[0]?.id;
                return (
                  <tr key={row.id}>
                    <td className="p-3 font-semibold">{row.business_name}</td>
                    <td className="p-3">{row.area ?? row.district}</td>
                    <td className="p-3">{row.phone}</td>
                    <td className="p-3">
                      <AdminStatus value={row.status} />
                    </td>
                    <td className="p-3">
                      {row.is_visible ? "Public" : "Private"}
                    </td>
                    <td className="p-3">
                      {row.payment_qr_image ? "Ready" : "Missing"}
                    </td>
                    <td className="p-3">
                      {applicationId ? (
                        <Link href={`/admin/dealers/${applicationId}`}>
                          View details →
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {dealers.rows.length === 0 && (
          <p className="admin-empty mt-8 rounded-lg border bg-white">
            No dealers found. Try changing your filters.
          </p>
        )}
      </main>
    );
  }
  const data = await listDealerApplications(params);
  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Dealer applications</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            Qualify partnership leads before deliberately creating a private
            dealer record.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/admin/dealers?view=network"
            className="text-sm font-semibold"
          >
            View dealers
          </Link>
          <Link
            href="/dealers/become-a-dealer"
            className="text-sm text-[color:var(--gold)] underline underline-offset-4"
          >
            Public application form
          </Link>
        </div>
      </div>
      <form className="mt-8 grid gap-3 sm:grid-cols-2 2xl:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,1fr))_auto]">
        <input
          name="q"
          defaultValue={data.q}
          placeholder="Applicant, business or phone"
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        />
        <select
          name="status"
          defaultValue={data.status}
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        >
          <option value="all">All statuses</option>
          {["new", "contacted", "qualified", "approved", "rejected"].map(
            (status) => (
              <option key={status} value={status}>
                {label(status)}
              </option>
            ),
          )}
        </select>
        <input
          name="location"
          defaultValue={data.location}
          placeholder="City or district"
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        />
        <select
          name="business_type"
          defaultValue={data.businessType}
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        >
          <option value="">All business types</option>
          {dealerBusinessTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          name="product_interest"
          defaultValue={data.productInterest}
          className="min-h-11 border border-[color:var(--border-dark)] bg-transparent px-3"
        >
          <option value="">All product interests</option>
          {dealerProductInterests.map((interest) => (
            <option key={interest}>{interest}</option>
          ))}
        </select>
        <Button variant="light">Apply filters</Button>
      </form>
      <div className="mt-8 space-y-3 md:hidden">
        {data.rows.map((row) => (
          <article
            key={row.id}
            className="rounded-lg border border-[color:var(--border-dark)] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <Link href={`/admin/dealers/${row.id}`} className="font-semibold">
                {row.businessName}
              </Link>
              <AdminStatus value={row.status} />
            </div>
            <p className="mt-1 text-sm">
              {row.contactPerson} · {row.phone}
            </p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {row.location}, {row.district} · {adminDate(row.createdAt)}
            </p>
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              {row.businessType ?? "Legacy application"}
            </p>
            <Link
              className="mt-4 inline-block text-sm font-semibold"
              href={`/admin/dealers/${row.id}`}
            >
              View details →
            </Link>
          </article>
        ))}
        {data.rows.length === 0 && (
          <p className="border p-8 text-center text-sm text-[color:var(--muted)]">
            No applications found.
          </p>
        )}
      </div>
      <div className="mt-8 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead>
            <tr className="border-b border-[color:var(--border-dark)] text-xs tracking-[.12em] text-[color:var(--muted)] uppercase">
              <th className="py-3">Business</th>
              <th>Applicant</th>
              <th>Phone</th>
              <th>Location</th>
              <th>Business type</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-[color:var(--border-dark)]"
              >
                <td className="py-4">
                  <Link href={`/admin/dealers/${row.id}`} className="underline">
                    {row.businessName}
                  </Link>
                </td>
                <td>{row.contactPerson}</td>
                <td>{row.phone}</td>
                <td>
                  {row.location}, {row.district}
                </td>
                <td>{row.businessType ?? "—"}</td>
                <td>{adminDate(row.createdAt)}</td>
                <td>
                  <AdminStatus value={row.status} />
                </td>
                <td>
                  <Link
                    className="font-semibold"
                    href={`/admin/dealers/${row.id}`}
                  >
                    View details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.rows.length === 0 && (
          <p className="py-12 text-center text-sm text-[color:var(--muted)]">
            No applications found.
          </p>
        )}
      </div>
    </main>
  );
}
