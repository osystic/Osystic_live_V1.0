import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { DATA_CLOUD_SLUGS, getDataCloudPage } from "../_data/data-cloud-data";
import { ServiceDetailPage } from "../../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../../components/marketing/ServiceStructuredData";

export function generateStaticParams() {
  return DATA_CLOUD_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getDataCloudPage(slug);
  if (!service) return createSeoMetadata({ title: "Service not found", description: "The requested OSYSTIC service page could not be found.", path: "/capabilities", noIndex: true });

  return createSeoMetadata({
    title: service.metaTitle,
    description: service.metaDesc,
    path: `/services/data-cloud/${service.slug}`,
    keywords: service.keywords,
  });
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
