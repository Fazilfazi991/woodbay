import type { Metadata } from "next";
import { FurniturePage } from "@/features/furniture/components/furniture-page";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({ title: "Custom Furniture by Woodbay", description: "Explore custom furniture, wardrobes, kitchens and bedrooms designed around your space through Woodbay's factory-direct experience.", path: "/furniture" });
export default function Page() {
  return <FurniturePage />;
}
