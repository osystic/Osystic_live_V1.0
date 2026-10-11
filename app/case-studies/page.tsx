import { createSeoMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Layers3, LockKeyhole, ShieldCheck } from "lucide-react";
import { fetchCaseStudies } from "./actions";
import { FinalCTA } from "../components/marketing/FinalCTA";
import { FutureReveal } from "../components/future/FutureReveal";

export const dynamic = "force-dynamic";

export const metadata = createSeoMetadata({
  title: "Enterprise AI & Software Case Studies",
  description: "Explore selected OSYSTIC case studies across production AI, product engineering, data platforms, cloud infrastructure, and enterprise software delivery.",
  path: "/case-studies",
  keywords: ["enterprise AI case studies","software engineering case studies","AI implementation examples"],
});

const fallback="/media/visuals/diagram-work.svg";

export default async function WorkPage(){
  const studies=await fetchCaseStudies();
  const featured=studies[0];
  const rest=studies.slice(1);
  const count=studies.length.toString().padStart(2,"0");

  return <main id="main-content" className="fp-work-page">
    <section className="fp-work-hero">
      <div className="container-shell fp-work-hero-grid">
        <div>
          <span className="future-kicker">EVIDENCE LEDGER / PUBLIC WORK</span>
          <span className="eyebrow">CASE STUDIES</span>
          <h1>Systems are judged by <span>what survives production.</span></h1>
          <p>We publish project information only when cleared for public use. Where confidentiality applies, relevant experience can be discussed privately during discovery.</p>
        </div>

        <div className="fp-evidence-ledger" aria-label="OSYSTIC public evidence ledger">
          <div className="fp-evidence-ledger-head"><span>PUBLIC EVIDENCE REGISTER</span><b>{count} FILES</b></div>
          <div className="fp-evidence-ledger-row">
            <span>01</span><strong>DELIVERY</strong><em>Working system / deployed scope</em><b>VERIFIED</b>
          </div>
          <div className="fp-evidence-ledger-row">
            <span>02</span><strong>OUTCOMES</strong><em>Measured or reviewable results</em><b>RECORDED</b>
          </div>
          <div className="fp-evidence-ledger-row">
            <span>03</span><strong>HANDOFF</strong><em>Source / documentation / ownership</em><b>EXPLICIT</b>
          </div>
          <div className="fp-evidence-ledger-foot">
            <LockKeyhole size={14}/>
            <span>{studies.length?"PUBLIC FILES AVAILABLE":"CLIENT CONFIDENTIALITY ACTIVE"}</span>
          </div>
        </div>
      </div>
    </section>

    {featured?<section className="fp-featured-evidence"><div className="container-shell">
      <div className="fp-work-section-head"><span className="eyebrow">FEATURED EVIDENCE</span><span>CASE / 001</span></div>
      <Link href={`/case-studies/${featured.slug}`} className="fp-featured-case">
        <div className="fp-featured-media"><Image src={featured.featuredImage||fallback} alt="" fill sizes="(max-width:900px) 94vw, 52vw"/></div>
        <div>
          <span className="future-kicker">{featured.client}</span>
          <h2>{featured.title}</h2>
          <p>{featured.excerpt||featured.challenge}</p>
          <div className="fp-evidence-lines">
            <span><b>CHALLENGE</b>{featured.challenge}</span>
            <span><b>SOLUTION</b>{featured.solution}</span>
          </div>
          {featured.results.length?<div className="fp-result-chips">{featured.results.slice(0,3).map(x=><span key={x}>{x}</span>)}</div>:null}
          <span className="future-inline-link">Open evidence file <ArrowRight size={15}/></span>
        </div>
      </Link>
    </div></section>:<section className="fp-featured-evidence"><div className="container-shell">
      <div className="fp-private-evidence">
        <LockKeyhole size={28}/><span className="eyebrow">CLIENT CONFIDENTIALITY</span>
        <h2>Relevant work exists beyond the public ledger.</h2>
        <p>Many engagements involve proprietary systems, private data, or non-public product work. We discuss relevant experience without exposing confidential client information.</p>
        <Link href="/contact" className="future-inline-link">Discuss relevant experience <ArrowRight size={15}/></Link>
      </div>
    </div></section>}

    {rest.length?<section className="fp-evidence-archive"><div className="container-shell">
      <div className="fp-work-section-head"><span className="eyebrow">EVIDENCE ARCHIVE</span><span>{rest.length} ADDITIONAL FILES</span></div>
      <div className="fp-evidence-grid">{rest.map((study,i)=><FutureReveal key={study.id} delay={(i%3)*.05}>
        <Link href={`/case-studies/${study.slug}`} className="fp-evidence-card">
          <div className="fp-evidence-media"><Image src={study.featuredImage||fallback} alt="" fill sizes="(max-width:800px) 94vw, 32vw"/></div>
          <div><span>CASE / {String(i+2).padStart(3,"0")}</span><h3>{study.title}</h3><p>{study.excerpt||study.challenge}</p>
            {study.results.length?<div>{study.results.slice(0,2).map(x=><small key={x}>{x}</small>)}</div>:null}
            <b>OPEN <ArrowRight size={13}/></b>
          </div>
        </Link>
      </FutureReveal>)}</div>
    </div></section>:null}

    <section className="fp-evidence-model"><div className="container-shell">
      <div className="fp-work-section-head"><span className="eyebrow">EVERY ENGAGEMENT</span><span>CONTROL MODEL</span></div>
      <div className="fp-evidence-model-grid">
        {[[LockKeyhole,"Ownership & handover"],[Layers3,"Phased delivery"],[ShieldCheck,"Security-conscious engineering"],[CheckCircle2,"Documentation & evidence"]].map(([Icon,title],i)=>{
          const I=Icon as typeof LockKeyhole;
          return <div key={title as string}><span>0{i+1}</span><I size={21}/><h3>{title as string}</h3></div>;
        })}
      </div>
    </div></section>

    <FinalCTA title="Have a challenge worth solving?" body="Tell us the constraints, current system, data, and desired outcome. We can discuss relevant experience without exposing confidential client work."/>
  </main>;
}
