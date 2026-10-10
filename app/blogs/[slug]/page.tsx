import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Clock3, Signal } from "lucide-react";
import { getBlogBySlug } from "@/lib/public-content";
import { createSeoMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";
import { StructuredData } from "@/app/components/seo/StructuredData";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) {
    return createSeoMetadata({
      title: "Insight not found",
      description: "The requested OSYSTIC engineering insight could not be found.",
      path: "/insights",
      noIndex: true,
    });
  }

  return createSeoMetadata({
    title: article.title,
    description: article.excerpt || "OSYSTIC engineering insight on enterprise AI, software, data, cloud, and production delivery.",
    path: `/blogs/${article.slug}`,
    keywords: [...article.tags, article.category || "enterprise AI engineering"],
    image: article.featuredImage,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: ["OSYSTIC"],
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) notFound();

  const displayDate = article.publishedAt
    ? new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric" }).format(new Date(article.publishedAt))
    : null;

  const structuredData = [
    articleSchema({
      title: article.title,
      description: article.excerpt,
      path: `/blogs/${article.slug}`,
      image: article.featuredImage,
      publishedAt: article.publishedAt,
      modifiedAt: article.updatedAt,
    }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Insights", path: "/insights" },
      { name: article.title, path: `/blogs/${article.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <main id="main-content" className="fp-article fp-blog-article">
        <section className="fp-article-hero" aria-labelledby="article-title">
          <div className="container-shell">
            <Link href="/insights" className="future-inline-link"><ArrowLeft size={14} /> Signal board</Link>
            <div className="fp-article-hero-grid">
              <header>
                <span className="future-kicker">ENGINEERING NOTE / {article.category || "INSIGHT"}</span>
                <span className="eyebrow">LONGFORM</span>
                <h1 id="article-title">{article.title}</h1>
                {article.excerpt ? <p>{article.excerpt}</p> : null}
                <div className="fp-article-byline">
                  <BookOpen size={15} /><span>By {article.author}</span>
                  {displayDate ? <><Clock3 size={15} /><time dateTime={article.publishedAt || undefined}>{displayDate}</time></> : null}
                </div>
              </header>
              <aside className="fp-article-signal" aria-label="Article focus areas">
                <Signal size={27} /><b>OSYSTIC / NOTE</b><span>ARCHITECTURE</span><i /><span>EVIDENCE</span><i /><span>OPERATIONS</span>
              </aside>
            </div>
          </div>
        </section>

        <article className="fp-article-body">
          <div className="container-shell fp-article-body-grid">
            <aside aria-label="Article metadata"><span>READING MODE</span><b>{article.category || "ENGINEERING"}</b><small>{article.tags.slice(0, 5).join(" · ")}</small></aside>
            <div>
              {article.featuredImage ? (
                <Image src={article.featuredImage} alt={`${article.title} featured visual`} width={1600} height={900} sizes="(max-width:900px) 94vw, 760px" className="fp-article-image" />
              ) : null}
              <div className="prose-shell" dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        </article>
        <FinalCTA title="Have a related engineering problem?" body="Bring the real constraints and operating context. We can turn the discussion into an actionable architecture path." />
      </main>
    </>
  );
}
