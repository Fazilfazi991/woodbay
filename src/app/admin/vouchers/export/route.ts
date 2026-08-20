import { NextResponse } from "next/server";
import { exportVouchers } from "@/features/vouchers/admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const csv = await exportVouchers({
      q: searchParams.get("q") ?? "",
      status: searchParams.get("status") ?? "all",
      campaign: searchParams.get("campaign") ?? "",
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="woodbay-vouchers-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to export vouchers." },
      { status: 403 },
    );
  }
}
