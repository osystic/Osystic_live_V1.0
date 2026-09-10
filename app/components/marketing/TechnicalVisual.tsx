import { ArrowRight, BrainCircuit, Code2, Database, Layers3, Radio, ShieldCheck } from "lucide-react";

/** Conceptual diagrams only: no client data, fabricated metrics or live status. */
export function TechnicalVisual({ variant = "ai", name = "Production system" }: { variant?: "ai" | "product" | "data"; name?: string }) {
  const Icon = variant === "data" ? Database : variant === "product" ? Code2 : BrainCircuit;
  return <div className={`technical-visual technical-${variant}`} aria-hidden="true">
    <div className="technical-caption"><span>OSYSTIC / SYSTEM DESIGN</span><Layers3 size={17} /></div>
    <div className="technical-rail"><span>Architecture</span><span>Deployment</span></div>
    <div className="technical-connection" />
    <div className="technical-core"><Icon size={34} strokeWidth={1.4}/><strong>{name}</strong><span>Production system</span></div>
    <div className="technical-connection" />
    <div className="technical-end"><ShieldCheck size={18}/><span>Observability</span><Radio size={18}/></div>
  </div>;
}

export function CapabilityVisual() {
  return <div className="capability-visual" aria-label="AI systems, product engineering, and data and cloud capabilities">
    <span className="technical-caption">OSYSTIC / ENGINEERING DISCIPLINES</span>
    {[[BrainCircuit, "AI Systems"], [Code2, "Product Engineering"], [Database, "Data & Cloud"]].map(([Icon, title]) => {
      const Component = Icon as typeof BrainCircuit;
      return <div className="capability-visual-row" key={title as string}><Component size={26} strokeWidth={1.5}/><strong>{title as string}</strong><ArrowRight size={18}/></div>;
    })}
  </div>;
}

export function DeliveryVisual() {
  return <div className="delivery-visual" role="img" aria-label="Conceptual engineering delivery: architecture, implementation, and handoff">
    <span className="technical-caption">OSYSTIC / CONCEPTUAL SYSTEM</span>
    <div className="delivery-stages">{["Architecture", "Implementation", "Handoff"].map((stage, i) =>
      <div className="delivery-stage" key={stage}><span className="delivery-number">0{i + 1}</span><strong>{stage}</strong>{i < 2 && <ArrowRight size={20} aria-hidden="true" />}</div>
    )}</div>
  </div>;
}
