import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveAdmin } from "@/lib/auth/admin";
import { getVoucherDetail } from "@/features/vouchers/admin";
export default async function VoucherDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await getActiveAdmin())) redirect("/admin/login");
  const { id } = await params;
  const { voucher, audits } = await getVoucherDetail(id);
  const v = voucher as {
    code: string;
    status: string;
    batch_reference: string | null;
    value_benefit: string | null;
    created_at: string;
    expires_at: string | null;
    redeemed_at: string | null;
    admin_note: string | null;
    voucher_redemptions:
      | {
          customer_name: string;
          location: string | null;
          district: string;
          dealer_name: string;
          redeemed_at: string;
        }[]
      | null;
  };
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/admin/vouchers">← Vouchers</Link>
      <h1 className="mt-6 font-mono text-3xl">{v.code}</h1>
      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt>Status</dt>
          <dd>{v.status}</dd>
        </div>
        <div>
          <dt>Campaign</dt>
          <dd>{v.batch_reference ?? "—"}</dd>
        </div>
        <div>
          <dt>Value</dt>
          <dd>{v.value_benefit ?? "—"}</dd>
        </div>
        <div>
          <dt>Expiry</dt>
          <dd>{v.expires_at ?? "—"}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{new Date(v.created_at).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Redeemed</dt>
          <dd>{v.redeemed_at ?? "—"}</dd>
        </div>
      </dl>
      {v.admin_note && <p className="mt-6 border p-4">{v.admin_note}</p>}
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Redemption</h2>
        {v.voucher_redemptions?.length ? (
          <p className="mt-3">
            {v.voucher_redemptions[0].dealer_name} ·{" "}
            {v.voucher_redemptions[0].location ?? "—"}
          </p>
        ) : (
          <p className="mt-3 text-sm">Not redeemed.</p>
        )}
      </section>
      <section className="mt-8">
        <h2 className="text-xl font-semibold">Administrative history</h2>
        {audits.length ? (
          <ul className="mt-3 space-y-2">
            {audits.map(
              (
                audit: { action: string; created_at: string },
                index: number,
              ) => (
                <li key={`${audit.action}-${index}`} className="border p-3">
                  {audit.action.replaceAll("_", " ")} ·{" "}
                  {new Date(audit.created_at).toLocaleString()}
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-3 text-sm">No administrative events.</p>
        )}
      </section>
    </main>
  );
}
