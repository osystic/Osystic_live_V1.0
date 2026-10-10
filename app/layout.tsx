import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./premium.css";
import "./responsive.css";
import "./interaction.css";
import "./future-home.css";
import "./future-pages.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FooterVisibility } from "./components/FooterVisibility";
import { CalBookingProvider } from "./components/CalBooking";
import { StructuredData } from "./components/seo/StructuredData";
import { siteConfig } from "./config/site";
import ChatWidget from "./chatbot/ChatWidgetLoader";
import { DEFAULT_SEO_KEYWORDS } from "@/lib/seo";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/structured-data";

const geistSans = localFont({ src: "../public/fonts/Geist-Variable.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap" });
const geistMono = localFont({ src: "../public/fonts/GeistMono-Variable.woff2", preload: false, variable: "--font-geist-mono", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "OSYSTIC | Enterprise AI Engineering",
    template: "%s | OSYSTIC",
  },
  description: siteConfig.description,
  keywords: [...DEFAULT_SEO_KEYWORDS],
  applicationName: "OSYSTIC",
  authors: [{ name: "OSYSTIC", url: siteConfig.url }],
  creator: "OSYSTIC",
  publisher: "OSYSTIC",
  category: "technology",
  classification: "Enterprise AI Engineering and Software Engineering",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "OSYSTIC",
    locale: "en_US",
    title: "OSYSTIC | Enterprise AI Engineering",
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 2400, height: 1260, alt: "OSYSTIC enterprise AI engineering" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSYSTIC | Enterprise AI Engineering",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090B0F",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), localBusinessSchema(), websiteSchema()],
  };

  return (
    <html lang="en-US">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CalBookingProvider>
          <Navbar />
          {children}
          <FooterVisibility><Footer /></FooterVisibility>
        </CalBookingProvider>
        <ChatWidget />
        <StructuredData id="osystic-organization-schema" data={graph} />
      </body>
    </html>
  );
}
