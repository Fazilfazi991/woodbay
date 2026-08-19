import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content">
        <ScrollReveal>{children}</ScrollReveal>
      </main>
      <Footer />
      <WhatsAppCta />
    </>
  );
}
