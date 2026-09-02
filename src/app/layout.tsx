import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Woodbay Decor & Interiors | Kollam", template: "%s | Woodbay" },
  description: "Woodbay kitchen and wardrobe accessories, hardware fittings, smart furniture and home decor products in Kollam, Kerala.",
  applicationName: "Woodbay Decor & Interiors",
  category: "Home and interior products",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#12130f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>;
}
const display = Cormorant_Garamond({ variable: "--font-display", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });
