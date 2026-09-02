import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Keep canonical, robots and database-backed metadata in the initial HTML for
  // every crawler and return true HTTP 404 responses before streaming begins.
  htmlLimitedBots: /.*/,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co" }],
  },
  async redirects() {
    return [
      { source: "/products/kitchen-accessories", destination: "/products/kitchen-wardrobe-accessories", permanent: true },
      { source: "/products/wardrobe-accessories", destination: "/products/kitchen-wardrobe-accessories", permanent: true },
      { source: "/products/decor", destination: "/products/home-decor", permanent: true },
      { source: "/products/smart-products", destination: "/products/smart-furniture", permanent: true },
    ];
  },
};

export default nextConfig;
