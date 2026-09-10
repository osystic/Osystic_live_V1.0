import { siteConfig } from "../../config/site";
import type { ServiceDetailData } from "./ServiceDetailPage";

export function ServiceStructuredData({ data, path }: { data: ServiceDetailData; path: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: data.name,
    description: data.heroSub,
    serviceType: data.category,
    url: `${siteConfig.url}${path}`,
    provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url, email: siteConfig.email },
    hasOfferCatalog: { "@type": "OfferCatalog", name: data.name, itemListElement: data.services.slice(0, 6).map(item => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: item.title } })) },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
