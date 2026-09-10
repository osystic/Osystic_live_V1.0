import type { NextConfig } from "next";

const cmsImageHosts = [
  "images.unsplash.com",
  "res.cloudinary.com",
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

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: Array.from(new Set(cmsImageHosts)).map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**",
    })),
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
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
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-XSS-Protection", value: "0" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.cal.com https://cal.com; style-src 'self' 'unsafe-inline'; img-src 'self' https://images.unsplash.com https://res.cloudinary.com https://*.supabase.co data:; font-src 'self'; connect-src 'self' https://*.supabase.co https://app.cal.com; frame-src https://app.cal.com https://cal.com; base-uri 'self'; form-action 'self'" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }],
      },
    ];
  },
};

export default nextConfig;
