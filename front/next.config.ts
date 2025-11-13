import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/graphql/:path*',          // все GraphQL-запросы
        destination: 'http://localhost:4200/graphql/:path*', // NestJS
      },
      {
        source: '/api/:path*',              // если есть REST API
        destination: 'http://localhost:4200/api/:path*',
      },
    ]
  },
}

export default nextConfig;
