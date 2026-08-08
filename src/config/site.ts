const suppliedUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const siteConfig = { name: "WOODBAY", url: suppliedUrl && /^https?:\/\//.test(suppliedUrl) ? suppliedUrl : "http://localhost:3000" } as const;
