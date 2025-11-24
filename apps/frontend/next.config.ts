import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "www.itb.ac.id" }],
  },
};

export default nextConfig;
