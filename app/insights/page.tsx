import { createSeoMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Binary, Cloud, Cpu, Signal } from "lucide-react";
import { getPublishedBlogs, getPublishedNews } from "@/lib/public-content";
import { FinalCTA } from "../components/marketing/FinalCTA";

export const metadata = createSeoMetadata({
  title: 'Enterprise AI Engineering Insights',
  description: 'Read OSYSTIC insights on production AI, agentic systems, enterprise RAG, software architecture, data engineering, cloud, MLOps, LLMOps, and delivery.',
  path: '/insights',
  keywords: ['enterprise AI insights','agentic AI architecture','LLMOps insights','MLOps engineering'],
});
const editorial=[
  {image:"/media/visuals/diagram-ai.svg",cat:"AI SYSTEMS",title:"Agentic AI: what changes between a prototype and a production system",body:"Tool permissions, evaluation, failure handling, observability, and data boundaries determine whether an agent belongs in production.",Icon:Binary},
  {image:"/media/visuals/diagram-cloud.svg",cat:"ARCHITECTURE",title:"Choosing the deployment boundary",body:"Latency, privacy, data residency, infrastructure ownership, hardware, and operations should drive cloud, private, hybrid, or edge strategy.",Icon:Cloud},
  {image:"/media/visuals/diagram-edge.svg",cat:"EDGE AI",title:"Designing machine learning for constrained hardware",body:"Model size, inference time, telemetry, device variability, update paths, and fallback behavior become first-class concerns.",Icon:Cpu},
] as const;
function date(v:string|null){return v?new Intl.DateTimeFormat("en",{year:"numeric",month:"short",day:"numeric"}).format(new Date(v)):null}
export default async function InsightsPage(){const [blogs,news]=await Promise.all([getPublishedBlogs(),getPublishedNews()]);const published=[...blogs,...news].sort((a,b)=>(b.publishedAt?Date.parse(b.publishedAt):0)-(a.publishedAt?Date.parse(a.publishedAt):0));return <main id="main-content" className="fp-insights-page">
  <section className="fp-insights-hero"><div className="container-shell fp-insights-hero-grid"><div><span className="future-kicker">KNOWLEDGE SIGNAL / ENGINEERING NOTES</span><span className="eyebrow">INSIGHTS</span><h1>Signal over noise. <span>Architecture over hype.</span></h1><p>Notes on the decisions that determine whether AI and software systems remain reliable, operable, and owned after launch.</p></div><div className="fp-signal-scope"><Signal size={26}/><b>LIVE TOPICS</b><span>ARCHITECTURE</span><i/><span>EVALUATION</span><i/><span>DEPLOYMENT</span><i/><span>OPERATIONS</span><i/><span>OWNERSHIP</span></div></div></section>
  <section className="fp-insight-board"><div className="container-shell"><div className="fp-board-head"><span className="eyebrow">SIGNAL BOARD</span><h2>{published.length?"Published by OSYSTIC.":"Publication library is being refreshed."}</h2></div><div className="fp-board-grid">{(published.length?published:editorial).map((article,index)=>{const isPublished="source" in article;const fallback=editorial[index%editorial.length];const image=isPublished?(article.featuredImage||fallback.image):article.image;const title=article.title;const body=isPublished?(article.excerpt||"Read the full engineering note."):article.body;const category=isPublished?(article.category||article.source):article.cat;const href=isPublished?(article.source==="blog"?`/blogs/${article.slug}`:`/newsroom/${article.slug}`):"/contact";const Icon=fallback.Icon;return <Link href={href} className={`fp-board-card b${(index%3)+1}`} key={title}><div className="fp-board-media"><Image src={image} alt="" width={1200} height={760}/><span/></div><div className="fp-board-meta"><Icon size={15}/><b>{category}</b><span>{isPublished&&date(article.publishedAt)?date(article.publishedAt):`SIGNAL 0${index+1}`}</span></div><h3>{title}</h3><p>{body}</p><span className="future-inline-link">{isPublished?"Read insight":"Discuss topic"} <ArrowRight size={14}/></span></Link>})}</div></div></section>
  <FinalCTA title="Have a technical problem worth unpacking?" body="Bring the constraints, not a predetermined stack. We can help define the architecture, risk, validation path, and delivery phases."/>
</main>}
