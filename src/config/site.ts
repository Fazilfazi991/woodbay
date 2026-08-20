const suppliedUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteConfig = {
  name: "WOODBAY",
  tagline: "Decor & Interiors",
  url:
    suppliedUrl && /^https?:\/\//.test(suppliedUrl)
      ? suppliedUrl
      : "http://localhost:3000",
  // Keep unverified business details out of the public experience.
  contact: {
    phone: null as string | null,
    email: null as string | null,
    factoryAddress: null as string | null,
  },
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    youtube: null as string | null,
  },
  // Replace after the official business WhatsApp number is approved.
  whatsappUrl: null as string | null,
} as const;
