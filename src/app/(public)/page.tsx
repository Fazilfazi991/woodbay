import type { Metadata } from "next";
import {
  CategoriesSection,
  ConversionGatewaySection,
  FeaturedProductsSection,
  ManufacturingSection,
} from "@/features/home/components/homepage-sections";
import { HomeTwoHero } from "@/features/home/components/home-two-hero";
export const metadata: Metadata = {
  title: "Kitchen, Wardrobe, Furniture & Interior Solutions",
  description:
    "Woodbay offers premium kitchen accessories, wardrobe accessories, interior products, furniture and considered solutions for modern spaces.",
};
export default function HomePage() {
  return (
    <>
      <HomeTwoHero />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ManufacturingSection />
      <ConversionGatewaySection />
    </>
  );
}
