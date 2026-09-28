import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Toutes les URLs publiques des specs se terminent par « / ».
  trailingSlash: true,
  images: { formats: ["image/webp"] },
};

export default nextConfig;
