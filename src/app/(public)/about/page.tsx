import type { Metadata } from "next";
import { AboutHero, BrandIntroduction, BrandValues, DivisionsAndFurniture, FounderSection, JourneyAndWhy, LocationAndCta, ManufacturingStory, VisionMission } from "@/features/about/components/about-sections";
export const metadata: Metadata = { title: "About Woodbay | Premium Interior & Furniture Solutions", description: "Learn about Woodbay’s kitchen accessories, wardrobe accessories, furniture, smart products and interior/decor solutions built around quality and design." };
export default function AboutPage() { return <><AboutHero /><BrandIntroduction /><BrandValues /><FounderSection /><VisionMission /><DivisionsAndFurniture /><ManufacturingStory /><JourneyAndWhy /><LocationAndCta /></>; }
