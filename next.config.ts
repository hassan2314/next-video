import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["ik.imagekit.io"],
  },
  async redirects() {
    return [
      { source: "/signup", destination: "/register", permanent: false },
      { source: "/videos", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
