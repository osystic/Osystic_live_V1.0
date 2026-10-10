import { createSeoMetadata } from "@/lib/seo";
import { ArrowRight, Code2, MapPin, Terminal, Users } from "lucide-react";
import { CareersClient } from "./_components/CareersClient";
import { siteConfig } from "../config/site";

export const metadata = createSeoMetadata({
  title: "Careers",
  description: "Explore engineering and business career opportunities at OSYSTIC, a US-based enterprise AI and software engineering company serving clients globally.",
  path: "/careers",
  keywords: ["AI engineering careers","software engineering careers","OSYSTIC careers"],
});

const lanes=[
  {Icon:Code2,label:"ENGINEERING",detail:"ARCHITECT · BUILD · REVIEW"},
  {Icon:Users,label:"DELIVERY",detail:"ALIGN · COMMUNICATE · OWN"},
  {Icon:Terminal,label:"OPERATIONS",detail:"DEPLOY · OBSERVE · IMPROVE"},
] as const;

export default function CareersPage(){
  return <main id="main-content" className="fp-careers">
    <section className="fp-careers-hero">
      <div className="container-shell fp-careers-hero-grid">
        <div>
          <span className="future-kicker">CAREERS / BUILD WITH OWNERSHIP</span>
          <span className="eyebrow">JOIN OSYSTIC</span>
          <h1>Build systems that have to <span>work after launch.</span></h1>
          <p>We value technical depth, ownership, clear communication, and people who can turn ambiguity into dependable delivery.</p>
        </div>

        <div className="fp-career-board" aria-label="OSYSTIC role operating board">
          <div className="fp-career-board-head"><span>HOW WE WORK</span><b>SHIP / OWN / IMPROVE</b></div>
          {lanes.map(({Icon,label,detail},index)=><div className="fp-career-board-row" key={label}>
            <span>0{index+1}</span>
            <Icon size={18}/>
            <strong>{label}</strong>
            <small>{detail}</small>
            <i/>
          </div>)}
          <div className="fp-career-board-foot"><span>OWNERSHIP MOVES WITH THE WORK</span><b>→</b></div>
        </div>
      </div>
    </section>

    <section className="fp-careers-values"><div className="container-shell">
      <div className="fp-careers-values-head"><span className="eyebrow">WORKING SIGNALS</span><h2>What matters in the room.</h2></div>
      <div className="fp-career-signals">
        <div><span>01</span><Code2 size={20}/><h3>Engineering depth</h3><p>AI, software, data, cloud, and product delivery grounded in actual system behavior.</p></div>
        <div><span>02</span><Users size={20}/><h3>Visible ownership</h3><p>Clear responsibility, direct communication, and reviewable outcomes instead of activity theatre.</p></div>
        <div><span>03</span><MapPin size={20}/><h3>Distributed execution</h3><p>US-based company operations with distributed project collaboration across client markets and time zones.</p></div>
      </div>
    </div></section>

    <section className="fp-careers-apply"><div className="container-shell fp-careers-apply-grid">
      <div>
        <span className="eyebrow">GENERAL APPLICATION</span><h2>Tell us what you can build.</h2>
        <p>Share your experience, role interests, relevant skills, and CV. Submission does not imply a current vacancy or guarantee a response.</p>
        <a className="future-inline-link" href={`mailto:${siteConfig.email}`}>Questions about careers <ArrowRight size={14}/></a>
      </div>
      <div className="fp-career-form"><CareersClient/></div>
    </div></section>
  </main>;
}
