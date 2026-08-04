import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async rewrites() {
    const apiUrl = process.env.API_URL ?? "http://localhost:8080";
    return [
      { source: "/api/v1/:path*", destination: `${apiUrl}/api/v1/:path*` },
      // Media files are served outside /api/v1 by the Go backend (section 7.9)
      { source: "/media/:path*", destination: `${apiUrl}/media/:path*` },
      { source: "/healthz", destination: `${apiUrl}/healthz` },
      { source: "/readyz", destination: `${apiUrl}/readyz` },
    ];
  },
};

export default nextConfig;
