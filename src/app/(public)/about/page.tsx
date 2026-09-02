import type { Metadata } from "next";
import { AboutHero, BrandIntroduction, BrandValues, DivisionsAndFurniture, FounderSection, JourneyAndWhy, LocationAndCta, ManufacturingStory, VisionMission } from "@/features/about/components/about-sections";
import { pageMetadata } from "@/lib/seo";
export const metadata: Metadata = pageMetadata({ title: "About Woodbay Decor & Interiors", description: "Learn about Woodbay’s kitchen accessories, wardrobe solutions, furniture, smart products and decor-led interior solutions.", path: "/about" });
export default function AboutPage() { return <><AboutHero /><BrandIntroduction /><BrandValues /><FounderSection /><VisionMission /><DivisionsAndFurniture /><ManufacturingStory /><JourneyAndWhy /><LocationAndCta /></>; }
