import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
import { CartProvider } from "@/features/cart/cart-provider";
import { absoluteUrl, jsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CartProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: "Woodbay Decor & Interiors",
        url: siteConfig.url,
        logo: absoluteUrl("/images/woodbay-logo.png"),
        areaServed: { "@type": "AdministrativeArea", name: "Kollam, Kerala" },
      }) }} />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <Footer />
      <WhatsAppCta />
    </CartProvider>
  );
}
