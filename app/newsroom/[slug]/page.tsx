import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Radio, CalendarDays } from "lucide-react";
import { getNewsBySlug } from "@/lib/public-content";
import { createSeoMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";
import { StructuredData } from "@/app/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) {
    return createSeoMetadata({
      title: "News item not found",
      description: "The requested OSYSTIC newsroom item could not be found.",
      path: "/insights",
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: article.title,
    description: article.excerpt || "OSYSTIC company and engineering news.",
    path: `/newsroom/${article.slug}`,
    keywords: [...article.tags, article.category || "OSYSTIC news"],
    image: article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: ["OSYSTIC"],
  });
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  const displayDate = article.publishedAt
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt))
    : null;

  const structuredData = [
    articleSchema({
      title: article.title,
      description: article.excerpt,
      path: `/newsroom/${article.slug}`,
      image: article.featuredImage,
      publishedAt: article.publishedAt,
      modifiedAt: article.updatedAt,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
      { name: article.title, path: `/newsroom/${article.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content" className="fp-article fp-news-article">
        <section className="fp-news-wire" aria-labelledby="news-title">
          <div className="container-shell">
            <Link href="/insights" className="future-inline-link"><ArrowLeft size={14} /> All signals</Link>
            <div className="fp-news-wire-head">
              <header>
                <span className="future-kicker">NEWSROOM / DISPATCH</span>
                <span className="eyebrow">{article.category || "COMPANY NEWS"}</span>
                <h1 id="news-title">{article.title}</h1>
                {article.excerpt ? <p>{article.excerpt}</p> : null}
              </header>
              <aside className="fp-dispatch-meta" aria-label="Dispatch metadata">
                <Radio size={24} /><b>OSYSTIC WIRE</b><span>AUTHOR / {article.author}</span>
                {displayDate ? <time dateTime={article.publishedAt || undefined}><CalendarDays size={14} />{displayDate}</time> : null}
                <i>PUBLIC DISPATCH</i>
              </aside>
            </div>
          </div>
        </section>
        <article className="fp-news-body">
          <div className="container-shell">
            {article.featuredImage ? (
              <div className="fp-news-image"><Image src={article.featuredImage} alt={`${article.title} featured visual`} fill sizes="(max-width:900px) 94vw, 1100px" /></div>
            ) : null}
            <div className="fp-news-copy prose-shell" dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>
        </article>
        <FinalCTA />
      </main>
    </>
  );
}
