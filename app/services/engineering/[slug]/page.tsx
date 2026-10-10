import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ENGINEERING_SLUGS, getEngineeringPage } from "../_data/engineering-data";
import { ServiceDetailPage } from "../../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../../components/marketing/ServiceStructuredData";

export function generateStaticParams() {
  return ENGINEERING_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getEngineeringPage(slug);
  if (!service) return createSeoMetadata({ title: "Service not found", description: "The requested OSYSTIC service page could not be found.", path: "/capabilities", noIndex: true });

  return createSeoMetadata({
    title: service.metaTitle,
    description: service.metaDesc,
    path: `/services/engineering/${service.slug}`,
    keywords: service.keywords,
  });
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
