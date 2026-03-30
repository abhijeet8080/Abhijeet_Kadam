import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/experience", destination: "/about/experience", permanent: true },
    ];
  },
};

export default nextConfig;
