import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getNewsBySlug } from "@/lib/public-content";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) return { title: "News item not found" };
  return {
    title: article.title,
    description: article.excerpt || undefined,
    alternates: { canonical: `/newsroom/${article.slug}` },
    openGraph: { title: article.title, description: article.excerpt || undefined, type: "article", images: article.featuredImage ? [article.featuredImage] : undefined },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsBySlug(slug);
  if (!article) notFound();

  return (
    <main id="main-content">
      <section className="page-hero" style={{ paddingBottom:76 }}>
        <div className="content-shell" style={{ position:"relative",zIndex:2 }}>
          <Link href="/insights" className="text-link" style={{ marginBottom:28 }}><ArrowLeft size={15}/> All insights</Link>
          <span className="eyebrow">{article.category || "NEWSROOM"}</span>
          <h1 style={{ maxWidth:900 }}>{article.title}</h1>
          {article.excerpt ? <p>{article.excerpt}</p> : null}
          <div style={{ marginTop:20,color:"#788391",fontSize:13 }}>By {article.author}{article.publishedAt ? ` • ${new Intl.DateTimeFormat("en", { year:"numeric",month:"long",day:"numeric" }).format(new Date(article.publishedAt))}` : ""}</div>
        </div>
      </section>
      <article className="section section-light">
        <div className="content-shell">
          {article.featuredImage ? <Image src={article.featuredImage} alt="" width={1600} height={900} sizes="(max-width: 850px) 94vw, 800px" style={{ width:"100%",height:"auto",borderRadius:22,marginBottom:48 }} /> : null}
          <div className="prose-shell" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </article>
      <FinalCTA />
    </main>
  );
}
