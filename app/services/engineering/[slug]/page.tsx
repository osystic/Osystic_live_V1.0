import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ENGINEERING_SLUGS, getEngineeringPage } from "../_data/engineering-data";
import { ServiceDetailPage } from "../../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../../components/marketing/ServiceStructuredData";
import { siteConfig } from "../../../config/site";

export function generateStaticParams() {
  return ENGINEERING_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getEngineeringPage(slug);
  if (!service) return {};
  const title = service.metaTitle;
  const description = service.metaDesc;
  const url = `${siteConfig.url}/services/engineering/${service.slug}`;
  return {
    title,
    description,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "OSYSTIC", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function EngineeringServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getEngineeringPage(slug);
  if (!service) notFound();

  const data = { ...service, category: "Product Engineering" };
  return (
    <>
      <ServiceStructuredData data={data} path={`/services/engineering/${service.slug}`} />
      <ServiceDetailPage data={data} />
    </>
  );
}
