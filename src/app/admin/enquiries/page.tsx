import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { listEnquiries } from "@/features/furniture/admin";
import {
  ENQUIRY_STATUS_OPTIONS,
  enquiryStatusLabel,
} from "@/features/furniture/enquiry-status";
import { getActiveAdmin } from "@/lib/auth/admin";

const PAGE_SIZE = 20;

function pageHref(q: string, status: string, page: number) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status !== "all") params.set("status", status);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `/admin/enquiries${query ? `?${query}` : ""}`;
}

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");

  const data = await listEnquiries(await searchParams);
  const exportParams = new URLSearchParams();
  if (data.q) exportParams.set("q", data.q);
  if (data.status !== "all") exportParams.set("status", data.status);
  const exportHref = `/admin/enquiries/export${exportParams.size ? `?${exportParams}` : ""}`;

  return (
    <main className="mx-auto max-w-6xl p-4 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Furniture enquiries</h1>
          <p className="mt-1 text-muted-foreground">Customer requests from the furniture design form.</p>
        </div>
        <Link
          href={exportHref}
          className="woodbay-button inline-flex min-h-12 items-center justify-center rounded-[3px] border border-[color:var(--foreground-dark)] px-6 py-3 text-[11px] font-medium uppercase tracking-[.14em]"
        >
          Export CSV
        </Link>
      </div>

      <form className="mt-6 grid gap-3 sm:grid-cols-[1fr_14rem_auto]">
        <input
          name="q"
          defaultValue={data.q}
          placeholder="Search customer, phone or furniture"
          className="min-h-11 border px-3"
        />
        <select name="status" defaultValue={data.status} className="min-h-11 border px-3">
          <option value="all">All statuses</option>
          {ENQUIRY_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button variant="light">Search</Button>
      </form>

      {data.rows.length === 0 ? (
        <p className="mt-8 border p-6 text-muted-foreground">No enquiries found.</p>
      ) : (
        <>
          <div className="mt-8 space-y-3 md:hidden">
            {data.rows.map((row) => (
              <Link className="block border p-4" key={row.id} href={`/admin/enquiries/${row.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <strong>{row.name}</strong>
                  <span>{enquiryStatusLabel(row.status)}</span>
                </div>
                <p className="mt-2 text-sm">{row.phone} · {row.furniture_type}</p>
                <p className="mt-1 text-sm text-muted-foreground">{row.location}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8 hidden overflow-x-auto border md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">Furniture</th>
                  <th className="p-3">Requirement</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row) => (
                  <tr className="border-b last:border-0" key={row.id}>
                    <td className="p-3 font-medium">{row.name}</td><td className="p-3">{row.phone}</td>
                    <td className="p-3">{row.furniture_type}</td><td className="p-3">{row.requirement_type ?? "—"}</td>
                    <td className="p-3">{new Date(row.created_at).toLocaleDateString()}</td>
                    <td className="p-3">{enquiryStatusLabel(row.status)}</td>
                    <td className="p-3 text-right"><Link href={`/admin/enquiries/${row.id}`}>View</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {data.count > PAGE_SIZE && (
        <nav className="mt-6 flex items-center justify-between gap-3" aria-label="Enquiry pagination">
          {data.page > 1 ? <Link href={pageHref(data.q, data.status, data.page - 1)}>Previous</Link> : <span />}
          <span>Page {data.page} of {Math.ceil(data.count / PAGE_SIZE)}</span>
          {data.page * PAGE_SIZE < data.count ? <Link href={pageHref(data.q, data.status, data.page + 1)}>Next</Link> : <span />}
        </nav>
      )}
    </main>
  );
}
