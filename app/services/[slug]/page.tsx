import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ALL_SLUGS, getService } from "../../_data/all-services-data";
import { ServiceDetailPage } from "../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../components/marketing/ServiceStructuredData";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return createSeoMetadata({ title: "Service not found", description: "The requested OSYSTIC service page could not be found.", path: "/capabilities", noIndex: true });

  return createSeoMetadata({
    title: service.metaTitle,
    description: service.metaDesc,
    path: `/services/${service.slug}`,
    keywords: service.keywords,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <ServiceStructuredData data={service} path={`/services/${service.slug}`} />
      <ServiceDetailPage data={service} />
    </>
  );
}
