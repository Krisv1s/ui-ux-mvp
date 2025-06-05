import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${
          process.env.NEXT_PUBLIC_API_URL ||
          "http://host.docker.internal:8000"
        }/api/:path*`,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
