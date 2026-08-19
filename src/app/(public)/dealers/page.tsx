import type { Metadata } from "next";
import { DealerLocatorPage } from "@/features/dealers/components/dealer-locator-page";

export const metadata: Metadata = {
  title: "Find a Woodbay Dealer | Dealer Locator",
  description:
    "Find authorised Woodbay dealers for kitchen accessories, wardrobe accessories and interior products near you.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <DealerLocatorPage searchParams={await searchParams} />;
}
