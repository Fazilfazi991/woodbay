import type { Metadata } from "next";
import { CategoriesSection, DealerAndCatalogueSection, DecorAndFurnitureSection, FeaturedProductsSection, FinalHomeCta, HeroSection, ManufacturingSection, ProjectsSection, SmartSection } from "@/features/home/components/homepage-sections";
export const metadata: Metadata = { title: "Kitchen, Wardrobe, Furniture & Interior Solutions", description: "Woodbay offers premium kitchen accessories, wardrobe accessories, interior products, furniture and considered solutions for modern spaces." };
export default function HomePage() { return <><HeroSection /><CategoriesSection /><FeaturedProductsSection /><ManufacturingSection /><SmartSection /><DecorAndFurnitureSection /><ProjectsSection /><DealerAndCatalogueSection /><FinalHomeCta /></>; }
