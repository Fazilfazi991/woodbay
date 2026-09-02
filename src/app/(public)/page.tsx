import type { Metadata } from "next";
import {
  CategoriesSection,
  ConversionGatewaySection,
  FeaturedProductsSection,
  ManufacturingSection,
  SmartSection,
} from "@/features/home/components/homepage-sections";
import { HomeTwoHero } from "@/features/home/components/home-two-hero";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({
  title: "Kitchen, Wardrobe & Interior Products in Kollam",
  description: "Explore Woodbay kitchen and wardrobe accessories, hardware fittings, smart furniture and home decor products in Kollam, Kerala.",
  path: "/",
});
export default function HomePage() {
  return (
    <>
      <HomeTwoHero />
      <CategoriesSection />
      <FeaturedProductsSection />
      <SmartSection />
      <ManufacturingSection />
      <ConversionGatewaySection />
    </>
  );
}
