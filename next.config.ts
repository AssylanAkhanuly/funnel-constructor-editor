import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d7pqxnw01lpes.cloudfront.net",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
