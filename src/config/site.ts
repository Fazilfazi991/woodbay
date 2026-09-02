const suppliedUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteConfig = {
  name: "WOODBAY",
  tagline: "Decor & Interiors",
  url:
    suppliedUrl && /^https?:\/\//.test(suppliedUrl)
      ? suppliedUrl
      : "https://woodbay.vercel.app",
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
  // The official number remains centrally configurable and is never duplicated
  // in product components. Example: https://wa.me/971500000000
  whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? null,
} as const;
