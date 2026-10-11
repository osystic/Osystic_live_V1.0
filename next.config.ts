import type { NextConfig } from "next";

const cmsImageHosts = [
  "images.unsplash.com",
  "res.cloudinary.com",
  "raw.githubusercontent.com",
  ...((process.env.NEXT_PUBLIC_IMAGE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter((host) => host && !host.includes("/") && !host.includes(":"))),
];

if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    cmsImageHosts.push(new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname);
  } catch {
    // Supabase configuration is validated by the integration itself.
  }
}

const uniqueImageHosts = Array.from(new Set(cmsImageHosts));
const imageSources = uniqueImageHosts.map((host) => `https://${host}`).join(" ");
const isDevelopment = process.env.NODE_ENV !== "production";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://app.cal.com https://cal.com https://*.cal.com`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  `img-src 'self' data: blob: ${imageSources}`,
  "media-src 'self' data: blob:",
  "connect-src 'self' https://app.cal.com https://cal.com https://*.cal.com https://*.supabase.co",
  "frame-src https://app.cal.com https://cal.com https://*.cal.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
  !isDevelopment ? "upgrade-insecure-requests" : "",
].filter(Boolean).join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "X-Download-Options", value: "noopen" },
  { key: "X-XSS-Protection", value: "0" },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: uniqueImageHosts.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "osystic.com" }], destination: "https://www.osystic.com/:path*", permanent: true },
      { source: "/services/frontend", destination: "/services/engineering/frontend-development", permanent: true },
      { source: "/services/backend-apis", destination: "/services/engineering/backend", permanent: true },
      { source: "/services/mobile", destination: "/services/engineering/mobile-development", permanent: true },
      { source: "/services/saas-dev", destination: "/services/engineering/saas-development", permanent: true },
      { source: "/services/uiux-design", destination: "/capabilities/product-engineering", permanent: true },
      { source: "/services/data-bi", destination: "/services/data-cloud/data-analysis", permanent: true },
      { source: "/services/cloud", destination: "/services/data-cloud/cloud", permanent: true },
      { source: "/services/data-infrastructure", destination: "/services/data-cloud/data", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      { source: "/api/admin/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
