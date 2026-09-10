import { DeliveryVisual } from "../../components/marketing/TechnicalVisual";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { fetchCaseStudy } from "../actions";
import { FinalCTA } from "@/app/components/marketing/FinalCTA";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: study.title,
    description: study.excerpt || study.challenge,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: { title: study.title, description: study.excerpt || study.challenge, images: study.featuredImage ? [study.featuredImage] : undefined },
  };
}

export default async function CaseStudyDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = await fetchCaseStudy(slug);
  if (!study) notFound();

  return (
    <main id="main-content">
      <section className="page-hero" style={{ paddingBottom:78 }}>
        <div className="container-shell page-hero-grid">
          <div>
            <Link href="/case-studies" className="text-link" style={{ marginBottom:26 }}><ArrowLeft size={15}/> Back to work</Link>
            <span className="eyebrow">CASE STUDY</span>
            <h1>{study.title}</h1>
            <p>{study.excerpt || study.challenge}</p>
            <div style={{ marginTop:20,color:"#7f8995",fontSize:13 }}>Client: {study.client}</div>
          </div>
          <div className="page-hero-visual">
            {study.featuredImage ? <Image src={study.featuredImage} alt="" fill sizes="(max-width:1024px) min(90vw,640px), 600px" style={{ objectFit:"cover" }}/> : <DeliveryVisual />}
          </div>
        </div>
      </section>

      <section className="section section-light">
        <div className="container-shell case-narrative">
          <div><span className="eyebrow">CHALLENGE</span><h2 style={{ fontSize:36,letterSpacing:"-.04em",margin:"18px 0 0" }}>What needed to change</h2><p style={{ color:"var(--muted)",lineHeight:1.8,fontSize:16 }}>{study.challenge}</p></div>
          <div><span className="eyebrow">SOLUTION</span><h2 style={{ fontSize:36,letterSpacing:"-.04em",margin:"18px 0 0" }}>How the system was approached</h2><p style={{ color:"var(--muted)",lineHeight:1.8,fontSize:16 }}>{study.solution}</p></div>
        </div>
      </section>

      {study.results.length ? <section className="section section-soft"><div className="container-shell"><span className="eyebrow">RESULTS</span><div className="case-results">{study.results.map(result => <div key={result} style={{ display:"flex",gap:12,alignItems:"flex-start",padding:24,border:"1px solid var(--border)",borderRadius:16,background:"#fff" }}><CheckCircle2 size={20} color="#3b6cff"/><span>{result}</span></div>)}</div></div></section> : null}

      {study.content ? <section className="section section-light"><div className="content-shell prose-shell" dangerouslySetInnerHTML={{ __html: study.content }} /></section> : null}

      <section className="section section-dark"><div className="container-shell"><span className="eyebrow">TECHNOLOGY</span><div style={{ display:"flex",flexWrap:"wrap",gap:10,marginTop:24 }}>{study.technologies.map(tech => <span key={tech} style={{ padding:"10px 13px",border:"1px solid #2b333e",borderRadius:10,color:"#aeb8c3",fontSize:13 }}>{tech}</span>)}</div></div></section>
      <FinalCTA />
    </main>
  );
}
