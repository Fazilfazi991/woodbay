const suppliedUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteConfig = {
  name: "WOODBAY",
  tagline: "Decor & Interiors",
  url: suppliedUrl && /^https?:\/\//.test(suppliedUrl) ? suppliedUrl : "http://localhost:3000",
  contact: { phone: "+91 00000 00000", email: "hello@woodbay.in", factoryAddress: "Factory address to be announced" },
  social: { facebook: "#", instagram: "#", youtube: "#" },
  // Replace after the official business WhatsApp number is approved.
  whatsappUrl: null as string | null,
} as const;
