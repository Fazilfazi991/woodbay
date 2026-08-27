import type { Metadata } from "next";
import {
  CategoriesSection,
  DealerAndCatalogueSection,
  DecorAndFurnitureSection,
  FeaturedProductsSection,
  FinalHomeCta,
  ManufacturingSection,
  ProjectsSection,
  SmartSection,
} from "@/features/home/components/homepage-sections";
import { HomeTwoHero } from "@/features/home/components/home-two-hero";

export const metadata: Metadata = {
  title: "Home 2 | Light Theme | Woodbay",
  description:
    "A light, contemporary Woodbay homepage direction for premium interiors and accessories.",
};

export default function HomeTwoPage() {
  return (
    <div className="home-two">
      <HomeTwoHero />
      <CategoriesSection />
      <FeaturedProductsSection />
      <ManufacturingSection variant="home-two" />
      <SmartSection />
      <DecorAndFurnitureSection variant="home-two" />
      <ProjectsSection />
      <DealerAndCatalogueSection />
      <div className="home-two-dark-cta">
        <FinalHomeCta />
      </div>
    </div>
  );
}
