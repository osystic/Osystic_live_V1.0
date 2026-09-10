import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { SectionHeading } from "../components/marketing/SectionHeading";
import { getPublishedBlogs, getPublishedNews } from "@/lib/public-content";

export const metadata: Metadata = {
  title: "Insights",
  description: "OSYSTIC engineering insights on production AI, agentic systems, machine learning, software architecture, data, cloud, MLOps, and delivery.",
  alternates: { canonical: "/insights" },
};

const editorialTopics = [
  {
    image: "/media/visuals/diagram-ai.svg",
    category: "AI SYSTEMS",
    title: "Agentic AI: what changes between a prototype and a production system",
    body: "A production agent needs explicit tool permissions, evaluation, failure handling, observability, and data boundaries. Those decisions matter more than the chat interface.",
  },
  {
    image: "/media/visuals/diagram-cloud.svg",
    category: "ARCHITECTURE",
    title: "Cloud, on-premise, hybrid, or edge: choosing the deployment boundary",
    body: "Latency, privacy, data residency, infrastructure ownership, hardware, and operational constraints should drive deployment strategy.",
  },
  {
    image: "/media/visuals/diagram-edge.svg",
    category: "EDGE AI",
    title: "Designing machine learning systems for constrained hardware",
    body: "Model size, inference time, telemetry, update paths, device variability, and fallback behavior become first-class architecture concerns at the edge.",
  },
] as const;

function formattedDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(value));
}

export default async function InsightsPage() {
  const [blogs, news] = await Promise.all([getPublishedBlogs(), getPublishedNews()]);
  const published = [...blogs, ...news]
    .sort((a, b) => (b.publishedAt ? Date.parse(b.publishedAt) : 0) - (a.publishedAt ? Date.parse(a.publishedAt) : 0));

  return (
    <main id="main-content">
      <section className="page-hero">
        <div className="container-shell page-hero-grid">
          <div>
            <span className="eyebrow">INSIGHTS</span>
            <h1>Engineering perspective, <span className="accent">without the noise.</span></h1>
            <p>Notes on the architecture, evaluation, deployment, and delivery decisions that determine whether AI and software systems remain reliable after launch.</p>
          </div>
          <div className="page-hero-visual editorial-visual">
            <div className="editorial-steps" aria-label="Engineering topics">
              {[["architecture", "evaluation", "deployment"], ["observability", "operations", "iteration"], ["ownership", "documentation", "handoff"]].map(row =>
                <div className="editorial-step-row" key={row[0]}>{row.map((word, i) => <span key={word}>{i > 0 && <span aria-hidden="true">→ </span>}{word}</span>)}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {published.length ? (
        <section className="section section-light">
          <div className="container-shell">
            <SectionHeading eyebrow="LATEST" title="Published by OSYSTIC." body="Only content currently marked as published in the OSYSTIC content system appears here." />
            <div className="insight-grid">
              {published.map((article, index) => {
                const fallback = editorialTopics[index % editorialTopics.length].image;
                const href = article.source === "blog" ? `/blogs/${article.slug}` : `/newsroom/${article.slug}`;
                return (
                  <Link className="insight-card" href={href} key={`${article.source}-${article.id}`}>
                    <div className="insight-media"><Image src={article.featuredImage || fallback} alt="" width={1600} height={1000} sizes="(max-width: 640px) 94vw, (max-width: 1024px) 46vw, 410px" /></div>
                    <div className="insight-meta">{article.category || article.source} {formattedDate(article.publishedAt) ? `• ${formattedDate(article.publishedAt)}` : ""}</div>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt || "Read the full engineering note."}</p>
                    <span className="text-link">Read insight <ArrowRight size={14}/></span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : (
        <section className="section section-light">
          <div className="container-shell">
            <SectionHeading eyebrow="ENGINEERING TOPICS" title="The publication library is being refreshed." body="Rather than keep stale or unverified articles online, the redesigned site starts with the technical topics OSYSTIC intends to cover and publishes articles only after review." />
            <div className="insight-grid">
              {editorialTopics.map(item => (
                <article className="insight-card" key={item.title}>
                  <div className="insight-media"><Image src={item.image} alt="" width={1600} height={1000} sizes="(max-width: 640px) 94vw, (max-width: 1024px) 46vw, 410px"/></div>
                  <div className="insight-meta">{item.category}</div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCTA title="Have a technical problem worth unpacking?" body="Bring the constraints, not a predetermined stack. We can help define the architecture, risk, validation path, and delivery phases." />
    </main>
  );
}
