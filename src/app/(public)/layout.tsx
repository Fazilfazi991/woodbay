import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { WhatsAppCta } from "@/components/layout/whatsapp-cta";
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <><a href="#main-content" className="skip-link">Skip to content</a><Header /><main id="main-content">{children}</main><Footer /><WhatsAppCta /></>; }
