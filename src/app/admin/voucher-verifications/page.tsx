import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/auth/admin";
import { listVerificationRequests, reviewVerificationRequest } from "@/features/vouchers/verification-request";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";
export default async function VoucherVerificationAdminPage() {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const rows = await listVerificationRequests();
  return <main className="mx-auto max-w-6xl p-4 sm:p-6"><h1 className="text-3xl font-semibold">Voucher verification requests</h1><p className="mt-2 text-sm text-[color:var(--muted)]">Independent review queue. This does not alter voucher inventory or redemption history.</p><div className="mt-8 grid gap-4">{rows.map((row) => <article key={row.id} className="border p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-semibold">{row.product_name}</h2><p className="text-sm">{row.customer_name} · {row.contact_number}</p></div><b className="uppercase">{row.status}</b></div><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2"><div><dt className="font-semibold">Product code</dt><dd>{row.product_code || "—"}</dd></div><div><dt className="font-semibold">Dealer</dt><dd>{row.dealer_name}</dd></div><div><dt className="font-semibold">Reference</dt><dd>{row.voucher_or_invoice_number}</dd></div><div><dt className="font-semibold">Purchase date</dt><dd>{row.purchase_date || "—"}</dd></div><div className="sm:col-span-2"><dt className="font-semibold">Address</dt><dd>{row.address}</dd></div></dl>{row.status === "pending" && <form action={reviewVerificationRequest} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_auto]"><input type="hidden" name="id" value={row.id} /><input name="admin_notes" placeholder="Admin notes" className="min-h-11 border px-3" /><Button name="status" value="verified">Verify</Button><Button name="status" value="rejected" variant="light">Reject</Button></form>}</article>)}{rows.length === 0 && <p className="border p-8 text-sm">No verification requests yet.</p>}</div></main>;
}
