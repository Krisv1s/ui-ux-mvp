import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${
  //         process.env.NEXT_PUBLIC_API_URL || "https://forsage.art"
  //       }/api/:path*`,
  //     },
  //   ];
  // },
  output: "standalone",
};

export default nextConfig;
