import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DATA_CLOUD_SLUGS, getDataCloudPage } from "../_data/data-cloud-data";
import { ServiceDetailPage } from "../../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../../components/marketing/ServiceStructuredData";
import { siteConfig } from "../../../config/site";

export function generateStaticParams() {
  return DATA_CLOUD_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getDataCloudPage(slug);
  if (!service) return {};
  const title = service.metaTitle;
  const description = service.metaDesc;
  const url = `${siteConfig.url}/services/data-cloud/${service.slug}`;
  return {
    title,
    description,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "OSYSTIC", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function DataCloudServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getDataCloudPage(slug);
  if (!service) notFound();

  const data = { ...service, category: "Data & Cloud" };
  return (
    <>
      <ServiceStructuredData data={data} path={`/services/data-cloud/${service.slug}`} />
      <ServiceDetailPage data={data} />
    </>
  );
}
