import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/crypto-signals",
  images: { unoptimized: true },
};

export default nextConfig;
