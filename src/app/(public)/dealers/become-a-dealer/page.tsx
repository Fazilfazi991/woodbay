import type { Metadata } from "next";
import { DealerApplicationPage } from "@/features/dealers/components/dealer-application-page";

export const metadata: Metadata = {
  title: "Become a Woodbay Dealer | Dealer Partnership",
  description:
    "Apply for a Woodbay dealer partnership for kitchen accessories, wardrobe accessories, interior and hardware products.",
};

export default function Page() {
  return <DealerApplicationPage />;
}
