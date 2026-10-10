import { siteConfig } from "@/app/config/site";

export const organizationId = `${siteConfig.url}/#organization`;
export const websiteId = `${siteConfig.url}/#website`;
export const localBusinessId = `${siteConfig.url}/#localbusiness`;

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/brand/osystic-logo.png`,
    },
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    email: siteConfig.email,
    description: siteConfig.description,
    address: postalAddressSchema(),
    sameAs: [siteConfig.social.linkedin],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and project inquiries",
      email: siteConfig.email,
      availableLanguage: ["English"],
      areaServed: siteConfig.serviceArea,
    },
    areaServed: { "@type": "Place", name: siteConfig.serviceArea },
    knowsAbout: [
      "Enterprise AI Engineering",
      "Agentic AI",
      "Enterprise RAG",
      "Machine Learning Engineering",
      "Software Engineering",
      "Data Engineering",
      "Cloud Engineering",
      "MLOps",
      "LLMOps",
    ],
  };
}

export function postalAddressSchema() {
  return {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.region,
    postalCode: siteConfig.address.postalCode,
    addressCountry: siteConfig.address.countryCode,
  };
}

export function localBusinessSchema() {
  return {
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": localBusinessId,
    name: siteConfig.name,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    email: siteConfig.email,
    description: siteConfig.description,
    address: postalAddressSchema(),
    parentOrganization: { "@id": organizationId },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales and project inquiries",
      email: siteConfig.email,
      availableLanguage: ["English"],
    },
    areaServed: { "@type": "Place", name: siteConfig.serviceArea },
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: { "@id": organizationId },
    inLanguage: "en-US",
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, siteConfig.url).toString(),
    })),
  };
}

export function articleSchema(input: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  publishedAt?: string | null;
  modifiedAt?: string | null;
  author?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description || undefined,
    mainEntityOfPage: new URL(input.path, siteConfig.url).toString(),
    image: input.image ? new URL(input.image, siteConfig.url).toString() : `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: input.publishedAt || undefined,
    dateModified: input.modifiedAt || input.publishedAt || undefined,
    author: { "@type": "Organization", "@id": organizationId, name: input.author || siteConfig.name },
    publisher: { "@id": organizationId },
  };
}

export function caseStudySchema(input: {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  technologies?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    url: new URL(input.path, siteConfig.url).toString(),
    image: input.image ? new URL(input.image, siteConfig.url).toString() : `${siteConfig.url}${siteConfig.ogImage}`,
    creator: { "@id": organizationId },
    publisher: { "@id": organizationId },
    keywords: input.technologies?.join(", ") || undefined,
  };
}
