import type { Metadata } from "next";
import { DealerLocatorPage } from "@/features/dealers/components/dealer-locator-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Find a Woodbay Dealer in Kerala",
  description: "Find published Woodbay dealer contact and location information for kitchen accessories, wardrobe accessories, hardware and interior products.",
  path: "/dealers",
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DealerLocatorPage searchParams={await searchParams} />;
}
