import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.itb.ac.id",
        port: "",
        pathname: "/files/images/**",
      },
    ],
  },
};

export default nextConfig;
