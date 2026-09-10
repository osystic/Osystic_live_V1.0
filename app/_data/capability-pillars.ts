export type CapabilityPillar = {
  slug: "ai-systems" | "product-engineering" | "data-cloud";
  eyebrow: string;
  title: string;
  intro: string;
  outcomes: readonly string[];
  capabilities: readonly { title: string; body: string; href: string }[];
  approach: readonly { title: string; body: string }[];
  related: readonly { label: string; href: string }[];
};

export const CAPABILITY_PILLARS: Record<CapabilityPillar["slug"], CapabilityPillar> = {
  "ai-systems": {
    slug: "ai-systems",
    eyebrow: "AI SYSTEMS",
    title: "Production AI systems connected to real data, tools, and operating controls.",
    intro: "OSYSTIC engineers AI applications as production systems: retrieval, model behavior, tool access, evaluation, observability, deployment, and human review are designed together around the actual workflow.",
    outcomes: ["Grounded AI applications", "Tool-connected agents and workflows", "Evaluation and observability", "Private or cloud deployment patterns"],
    capabilities: [
      { title: "AI Agents & Workflow Automation", body: "Agents and durable workflows with explicit state, integrations, approvals, retries, and operational fallback paths.", href: "/services/intelligent-automation" },
      { title: "Enterprise RAG & Knowledge Systems", body: "Governed ingestion, hybrid retrieval, permission-aware context, grounded generation, and knowledge operations.", href: "/services/enterprise-rag" },
      { title: "AI Reliability & LLMOps", body: "Evaluation, observability, guardrails, release controls, and production feedback loops for AI applications.", href: "/services/ai-reliability" },
      { title: "Machine Learning & Generative AI", body: "Model development and AI application engineering selected for the problem, available evidence, and deployment environment.", href: "/services/ai-deep-learning" },
      { title: "Computer Vision", body: "Visual inspection, detection, classification, OCR, and domain-specific vision pipelines with deployment constraints considered early.", href: "/services/computer-vision-nlp" },
      { title: "Edge AI", body: "On-device inference and optimized deployment where latency, connectivity, cost, or data locality make edge execution useful.", href: "/services/edge-ai" },
    ],
    approach: [
      { title: "Define behavior", body: "Start with tasks, users, data boundaries, unacceptable failures, and the evidence needed to evaluate the system." },
      { title: "Engineer the system", body: "Build model, retrieval, tool, integration, security, and application layers as one operating architecture." },
      { title: "Validate before release", body: "Use representative evaluations, failure analysis, staging, and human review appropriate to the workflow." },
      { title: "Operate and improve", body: "Trace behavior, review failures, manage versions, and feed verified production evidence back into the release process." },
    ],
    related: [{ label: "Trust & Security", href: "/trust" }, { label: "Selected Work", href: "/case-studies" }, { label: "Contact", href: "/contact" }],
  },
  "product-engineering": {
    slug: "product-engineering",
    eyebrow: "PRODUCT ENGINEERING",
    title: "Digital products engineered from interface through backend and production delivery.",
    intro: "OSYSTIC builds software products with reusable architecture, reliable APIs, maintainable interfaces, delivery automation, and explicit handover. Product decisions stay connected to security, data, and operating requirements.",
    outcomes: ["SaaS and web applications", "Mobile products", "APIs and distributed backends", "Modernization and platform integration"],
    capabilities: [
      { title: "SaaS Product Engineering", body: "Multi-tenant product architecture, authentication, billing integration, administration, APIs, and delivery workflows.", href: "/services/engineering/saas-development" },
      { title: "Frontend Engineering", body: "Accessible, responsive interfaces and reusable component systems for product and operational applications.", href: "/services/engineering/frontend-development" },
      { title: "Backend & APIs", body: "Application services, APIs, data access, integrations, queues, and operational controls designed for production failure modes.", href: "/services/engineering/backend" },
      { title: "Mobile Engineering", body: "iOS and Android delivery using architecture appropriate to product requirements, team ownership, and platform constraints.", href: "/services/engineering/mobile-development" },
      { title: "Enterprise Software", body: "Workflow-heavy internal and customer-facing systems integrated with existing business processes and data sources.", href: "/services/data-cloud/erp" },
      { title: "Platform Integration", body: "APIs, events, identity, third-party services, and real-time or asynchronous integrations across the product estate.", href: "/services/engineering/backend" },
    ],
    approach: [
      { title: "Architecture before scale claims", body: "Define boundaries, data ownership, integration contracts, deployment environments, and operational risks before implementation." },
      { title: "Reusable product foundations", body: "Use predictable component, API, domain, and data boundaries so the system can evolve without rewriting unrelated areas." },
      { title: "Production delivery", body: "Integrate testing, migrations, observability, CI/CD, release controls, and rollback planning into the engineering work." },
      { title: "Handover for ownership", body: "Document architecture, environments, operational procedures, and decision points so client teams can maintain the delivered system under the agreed ownership terms." },
    ],
    related: [{ label: "Data & Cloud", href: "/capabilities/data-cloud" }, { label: "Selected Work", href: "/case-studies" }, { label: "Contact", href: "/contact" }],
  },
  "data-cloud": {
    slug: "data-cloud",
    eyebrow: "DATA & CLOUD",
    title: "Data foundations and cloud platforms that make software and AI operable.",
    intro: "OSYSTIC designs data pipelines, analytics layers, cloud infrastructure, platform automation, and operating controls around the workloads that depend on them. Reliability, security, cost, and developer ownership are treated as engineering constraints.",
    outcomes: ["Data pipelines and platforms", "Analytics and decision systems", "Cloud and platform engineering", "DevOps and AI/ML operations"],
    capabilities: [
      { title: "Data Engineering", body: "Batch and streaming ingestion, transformation, testing, lineage, orchestration, and serving layers for downstream products and analytics.", href: "/services/data-cloud/data" },
      { title: "Analytics & BI", body: "Modeled metrics, analytics applications, dashboards, and data-quality controls designed around decisions rather than decorative reporting.", href: "/services/data-cloud/data-analysis" },
      { title: "Cloud Engineering", body: "Cloud architecture, identity, networking, compute, storage, deployment, and migration planning aligned to workload requirements.", href: "/services/data-cloud/cloud" },
      { title: "Platform Engineering & DevOps", body: "CI/CD, infrastructure as code, container platforms, observability, developer workflows, and operational runbooks.", href: "/services/devops-cloud" },
      { title: "Security Engineering", body: "Application and platform security controls implemented as part of the system design and delivery lifecycle.", href: "/services/data-cloud/security" },
      { title: "Enterprise Data Systems", body: "Data and operational foundations for ERP, internal platforms, integrations, and AI workloads that rely on consistent source-of-truth behavior.", href: "/services/data-cloud/erp" },
    ],
    approach: [
      { title: "Map dependencies", body: "Understand sources, consumers, environments, ownership, SLAs, security boundaries, and operational constraints first." },
      { title: "Build observable foundations", body: "Instrument pipelines and infrastructure with tests, metrics, logs, traces, lineage, and actionable failure handling." },
      { title: "Automate repeatable operations", body: "Use infrastructure as code, delivery pipelines, migrations, and controlled configuration to reduce manual drift." },
      { title: "Operate to evidence", body: "Review reliability, performance, cost, data quality, and incident evidence to guide changes instead of optimizing by assumption." },
    ],
    related: [{ label: "AI Systems", href: "/capabilities/ai-systems" }, { label: "Trust & Security", href: "/trust" }, { label: "Contact", href: "/contact" }],
  },
};
