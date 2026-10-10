import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Signal, Binary, Cloud, Cpu } from "lucide-react";

const themes=[
  {image:"/media/visuals/diagram-ai.svg",meta:"AI SYSTEMS",title:"Building reliable agentic systems beyond the demo",body:"Evaluation, guardrails, tool permissions, observability, and the operational decisions that determine whether an AI agent belongs in production.",Icon:Binary},
  {image:"/media/visuals/diagram-cloud.svg",meta:"CLOUD & SECURITY",title:"Choosing between cloud, on-premise, and hybrid AI deployment",body:"A practical architecture lens for organizations balancing privacy, latency, governance, infrastructure, and cost.",Icon:Cloud},
  {image:"/media/visuals/diagram-edge.svg",meta:"EDGE AI",title:"What changes when machine learning moves to the edge",body:"Hardware constraints, model optimization, telemetry, update strategy, and reliability considerations for real-time inference.",Icon:Cpu},
] as const;

export function HomeInsightsExperience(){
  return <section className="fh-insights" aria-labelledby="fh-insights-title">
    <div className="container-shell">
      <div className="fh-insights-head"><div><span className="future-step">08 / ENGINEERING INSIGHTS</span><span className="eyebrow">KNOWLEDGE SIGNAL</span><h2 id="fh-insights-title">Technical perspective without the noise.</h2></div><Link href="/insights" className="future-inline-link">Open signal board <ArrowRight size={15}/></Link></div>
      <div className="fh-signal-grid">
        {themes.map((item,index)=><Link href="/insights" className={`fh-signal-card s${index+1}`} key={item.title}>
          <div className="fh-signal-media"><Image src={item.image} alt="" width={1200} height={760}/><span className="fh-signal-scan"/></div>
          <div className="fh-signal-meta"><item.Icon size={16}/><span>{item.meta}</span><b>0{index+1}</b></div>
          <h3>{item.title}</h3><p>{item.body}</p><span className="future-inline-link">Explore topic <ArrowRight size={14}/></span>
        </Link>)}
        <div className="fh-signal-terminal"><Signal size={22}/><span>OSYSTIC / SIGNAL</span><b>ENGINEERING NOTES</b><small>Architecture · AI reliability · data · cloud · product systems</small></div>
      </div>
    </div>
  </section>;
}
