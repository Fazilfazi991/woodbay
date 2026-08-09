import type { Metadata } from "next";
import { FurniturePage } from "@/features/furniture/components/furniture-page";
export const metadata: Metadata = {
  title: "Woodbay Furniture | Factory Direct Custom Furniture",
  description:
    "Custom furniture, wardrobes, kitchens and bedrooms designed around your space through Woodbay's factory direct experience.",
};
export default function Page() {
  return <FurniturePage />;
}
