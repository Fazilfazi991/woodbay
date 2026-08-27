import type { Metadata } from "next";
import {
  CategoriesSection,
  DealerAndCatalogueSection,
  DecorAndFurnitureSection,
  FeaturedProductsSection,
  FinalHomeCta,
  HeroSection,
  ManufacturingSection,
  ProjectsSection,
  SmartSection,
} from "@/features/home/components/homepage-sections";

export const metadata: Metadata = {
  title: "Home 2 | Light Theme | Woodbay",
  description:
    "A light, contemporary Woodbay homepage direction for premium interiors and accessories.",
};

export default function HomeTwoPage() {
  return (
    <div className="home-two">
      <HeroSection variant="light" />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ManufacturingSection />
      <SmartSection />
      <DecorAndFurnitureSection />
      <ProjectsSection />
      <DealerAndCatalogueSection />
      <FinalHomeCta />
    </div>
  );
}
