import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Toutes les URLs publiques des specs se terminent par « / ».
  trailingSlash: true,
  images: { formats: ["image/webp"] },
  // Hors production (dev, preprod, local) : aucune page indexable, même si robots.txt est ignoré.
  async headers() {
    if (process.env.VERCEL_ENV === "production") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
