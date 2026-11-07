import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
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
