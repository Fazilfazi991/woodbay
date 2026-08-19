import { notFound } from "next/navigation";
import { getVisibleDealerBySlug } from "@/features/dealers/data/locator";

export default async function Page({
  params,
}: {
  params: Promise<{ dealerSlug: string }>;
}) {
  const dealer = await getVisibleDealerBySlug((await params).dealerSlug);
  if (!dealer) notFound();
  return (
    <main className="grid min-h-80 place-items-center bg-[color:var(--background-deep)] p-8 text-center text-[color:var(--foreground-light)]">
      <div>
        <p className="text-xs tracking-[.14em] text-[color:var(--gold)] uppercase">
          Woodbay dealer
        </p>
        <h1 className="font-display mt-4 text-5xl">{dealer.business_name}</h1>
        <p className="mt-4 text-sm text-[color:var(--muted)]">
          Dealer details will be available soon.
        </p>
      </div>
    </main>
  );
}
