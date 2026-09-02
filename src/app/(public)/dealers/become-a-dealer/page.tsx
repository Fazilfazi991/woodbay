import type { Metadata } from "next";
import { DealerApplicationPage } from "@/features/dealers/components/dealer-application-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Become a Woodbay Dealer", description: "Apply for a Woodbay dealer partnership covering kitchen accessories, wardrobe accessories, interior and hardware products.", path: "/dealers/become-a-dealer" });

export default function Page() {
  return <DealerApplicationPage />;
}
