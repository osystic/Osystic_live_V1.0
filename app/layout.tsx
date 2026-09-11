import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./premium.css";
import "./responsive.css";
import "./interaction.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { FooterVisibility } from "./components/FooterVisibility";
import { CalBookingProvider } from "./components/CalBooking";
import { siteConfig } from "./config/site";
import ChatWidget from "./chatbot/ChatWidgetLoader";

const geistSans = localFont({ src: "../public/fonts/Geist-Variable.woff2", variable: "--font-geist-sans", weight: "100 900", display: "swap" });
const geistMono = localFont({ src: "../public/fonts/GeistMono-Variable.woff2", preload: false, variable: "--font-geist-mono", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "OSYSTIC | AI & Software Engineering",
    template: "%s | OSYSTIC",
  },
  description: siteConfig.description,
  applicationName: "OSYSTIC",
  authors: [{ name: "OSYSTIC", url: siteConfig.url }],
  creator: "OSYSTIC",
  publisher: "OSYSTIC",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "OSYSTIC",
    title: "OSYSTIC | AI & Software Engineering",
    description: siteConfig.description,
    images: [{ url: "/brand/osystic-og.png", width: 2400, height: 1260, alt: "OSYSTIC" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "OSYSTIC | AI & Software Engineering",
    description: siteConfig.description,
    images: ["/brand/osystic-og.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#090B0F",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    logo: `${siteConfig.url}/brand/osystic-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.line1,
      addressLocality: "Albuquerque",
      addressRegion: "NM",
      postalCode: "87102",
      addressCountry: "US",
    },
    sameAs: [siteConfig.social.linkedin],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <CalBookingProvider>
          <Navbar />
          {children}
          <FooterVisibility><Footer /></FooterVisibility>
        </CalBookingProvider>
        <ChatWidget />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
