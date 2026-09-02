import QRCode from "qrcode";
import { getActiveAdmin } from "@/lib/auth/admin";
import { getVoucherDetail } from "@/features/vouchers/admin";
import { voucherRedemptionUrl } from "@/features/vouchers/qr";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getActiveAdmin())) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  try {
    const { voucher } = await getVoucherDetail(id);
    const code = (voucher as { code: string }).code;
    const svg = await QRCode.toString(voucherRedemptionUrl(code), { type: "svg", errorCorrectionLevel: "H", margin: 4, width: 768, color: { dark: "#000000", light: "#ffffff" } });
    const download = new URL(request.url).searchParams.get("download") === "1";
    return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "private, no-store", "Content-Disposition": `${download ? "attachment" : "inline"}; filename="woodbay-voucher-${code}.svg"` } });
  } catch { return new Response("Voucher not found", { status: 404 }); }
}
