import { StructuredData } from "../seo/StructuredData";
import { siteConfig } from "../../config/site";
import { breadcrumbSchema, organizationId, postalAddressSchema } from "@/lib/structured-data";
import type { ServiceDetailData } from "./ServiceDetailPage";

export function ServiceStructuredData({ data, path }: { data: ServiceDetailData; path: string }) {
  const url = new URL(path, siteConfig.url).toString();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: data.name,
      description: data.heroSub,
      serviceType: data.category,
      url,
      areaServed: { "@type": "Place", name: siteConfig.serviceArea },
      provider: {
        "@type": "Organization",
        "@id": organizationId,
        name: siteConfig.name,
        url: siteConfig.url,
        email: siteConfig.email,
        address: postalAddressSchema(),
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: data.name,
        itemListElement: data.services.slice(0, 8).map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.title, description: item.desc },
        })),
      },
    },
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Capabilities", path: "/capabilities" },
      { name: data.name, path },
    ]),
  ];

  return <StructuredData data={jsonLd} />;
}
