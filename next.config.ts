import type { NextConfig } from "next";
const config: NextConfig = {
  output: "export",
  experimental: { inlineCss: true },
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  devIndicators: false,
};
export default config;
