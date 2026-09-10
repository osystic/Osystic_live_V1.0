import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ALL_SLUGS, getService } from "../../_data/all-services-data";
import { ServiceDetailPage } from "../../components/marketing/ServiceDetailPage";
import { siteConfig } from "../../config/site";
import { ServiceStructuredData } from "../../components/marketing/ServiceStructuredData";

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  const title = service.metaTitle;
  const description = service.metaDesc;
  const url = `${siteConfig.url}/services/${service.slug}`;

  return {
    title,
    description,
    keywords: service.keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "OSYSTIC", type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
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
