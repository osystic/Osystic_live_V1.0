/* ═══════════════════════════════════════════════════════════════
   industries-data.ts
   Single source of truth for all 8 industry sub-pages.
   Used by:
     — app/industries/[slug]/page.tsx  (metadata + JSON-LD)
     — IndustriesCarousel.tsx          (home page cards)
   No fake numbers, no fabricated case study results.
═══════════════════════════════════════════════════════════════ */

export interface IndustrySolution {
  title: string;
  desc:  string;
}

export interface IndustryChallenge {
  title: string;
  desc:  string;
}

export interface Industry {
  slug:        string;
  name:        string;
  tagline:     string;           // one-line hero sub-heading
  description: string;           // ~2 sentence intro for meta + hero
  accent:      string;           // brand color for this industry
  heroDesc:    string;           // longer body paragraph for hero section
  challenges:  IndustryChallenge[]; // 3 pain points this industry faces
  solutions:   IndustrySolution[];  // what OSYSTIC builds for them
  relatedSlugs: string[];           // 3 related industry slugs
}

export const INDUSTRIES: Industry[] = [
  /* ────────────────────────────────── */
  {
    slug:        "healthcare",
    name:        "Healthcare",
    tagline:     "AI for clinical intelligence and diagnostic support.",
    description: "OSYSTIC builds AI systems for healthcare teams — from medical imaging pipelines to clinical NLP and patient risk models deployed inside your existing infrastructure.",
    accent:      "#0EA5E9",
    heroDesc:    "Healthcare data is rich, sensitive, and underutilised. We help clinical and operational teams build AI systems for regulated environments, with human review, data handling, and validation requirements defined around the clinical workflow.",
    challenges: [
      { title: "Unstructured clinical data",        desc: "Patient records, discharge summaries, and imaging reports contain critical information locked in unstructured formats that standard analytics tools cannot process." },
      { title: "Regulatory and privacy constraints", desc: "Privacy, security, data residency, and applicable regulatory obligations need to be treated as architecture inputs rather than retrofitted late in delivery." },
      { title: "Integration with legacy systems",    desc: "Most healthcare organisations run EHRs and PACS systems that are decades old. New AI tools must integrate without replacing the clinical workflow." },
    ],
    solutions: [
      { title: "Medical imaging analysis",      desc: "Computer vision models for radiology, pathology, and dermatology — trained on your annotated data and deployed inside your existing PACS environment." },
      { title: "Clinical NLP",                  desc: "Named entity recognition, ICD coding assistance, and discharge summary analysis that extracts structured data from clinical free text." },
      { title: "Patient risk stratification",   desc: "Machine learning models that identify high-risk patients using EHR data, enabling earlier intervention and better resource allocation." },
      { title: "Drug discovery pipelines",      desc: "Molecular property prediction and screening models that accelerate early-stage research workflows." },
      { title: "On-premise deployment",         desc: "Where required, models and supporting services can be designed for controlled or on-premise deployment. Data movement and processing boundaries are defined explicitly for the engagement." },
    ],
    relatedSlugs: ["finance", "manufacturing", "technology"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "finance",
    name:        "Banking & Finance",
    tagline:     "AI for fraud, credit, and compliance at scale.",
    description: "OSYSTIC builds machine learning systems for financial services teams — fraud detection, credit scoring, trading signal generation, and document processing automation.",
    accent:      "#2563EB",
    heroDesc:    "Financial institutions handle enormous volumes of transactions, documents, and regulatory obligations. We build AI systems around the client’s scale, auditability, security controls, and defined regulatory requirements.",
    challenges: [
      { title: "Real-time fraud at scale",       desc: "Fraud workloads can require low-latency decisions across high event volumes, while static rules may need frequent manual updates as patterns change." },
      { title: "Regulatory explainability",      desc: "Credit and risk models used in lending decisions must be explainable to regulators. Black-box models are not acceptable without interpretability layers." },
      { title: "Document processing volume",     desc: "KYC, contract review, and loan origination involve processing thousands of documents daily — most still handled manually or with brittle OCR pipelines." },
    ],
    solutions: [
      { title: "Fraud detection models",         desc: "Real-time transaction scoring models designed to detect evolving patterns and provide risk signals that can be evaluated against existing rules and review workflows." },
      { title: "Credit scoring",                 desc: "ML-based credit decision-support models with explainability outputs designed around the client’s validation, governance, and applicable regulatory requirements." },
      { title: "Algorithmic trading signals",    desc: "Feature engineering and signal generation pipelines that feed quantitative strategies with market and alternative data." },
      { title: "Document intelligence",          desc: "Automated extraction and classification of KYC documents, loan agreements, and regulatory filings using NLP and OCR." },
      { title: "Compliance automation",          desc: "Workflow systems that flag, route, and audit compliance-related events to support controlled review processes." },
    ],
    relatedSlugs: ["healthcare", "technology", "retail"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "manufacturing",
    name:        "Manufacturing",
    tagline:     "AI for quality, maintenance, and operational efficiency.",
    description: "OSYSTIC builds computer vision and predictive ML systems for manufacturing teams — visual defect inspection, equipment failure prediction, and demand-driven production planning.",
    accent:      "#3B6CFF",
    heroDesc:    "Manufacturing operations generate vast sensor and imaging data that most teams cannot yet act on. We build systems that turn sensor and imaging data into decision support for quality, maintenance, and production workflows.",
    challenges: [
      { title: "Manual visual inspection",       desc: "Human inspection on production lines is inconsistent, slow, and expensive. Defect escape rates remain high even with experienced operators." },
      { title: "Unplanned equipment downtime",   desc: "Reactive maintenance is costly. Most plants lack the predictive capability to act on early failure signals embedded in vibration, temperature, and log data." },
      { title: "Demand forecasting accuracy",    desc: "Production planning based on historical averages leads to overproduction, waste, and stockouts. More granular demand signals require ML-based forecasting." },
    ],
    solutions: [
      { title: "Visual defect inspection",       desc: "Real-time computer vision systems deployed on production lines that detect surface defects, dimensional errors, and assembly anomalies." },
      { title: "Predictive maintenance",         desc: "Sensor data pipelines and anomaly detection models designed to surface potential equipment-failure signatures for maintenance review." },
      { title: "Yield optimisation",             desc: "Process parameter models that identify the settings most correlated with high-yield output across different product families." },
      { title: "Demand forecasting",             desc: "Time-series models incorporating order history, external signals, and seasonal patterns to drive production planning." },
      { title: "Edge AI deployment",             desc: "Models can be deployed on edge hardware at the line to reduce cloud dependency and support local data-processing requirements." },
    ],
    relatedSlugs: ["logistics", "technology", "healthcare"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "retail",
    name:        "Retail & E-Commerce",
    tagline:     "AI for personalisation, inventory, and customer intelligence.",
    description: "OSYSTIC builds recommendation engines, demand forecasting systems, and visual search tools for retail and e-commerce teams working on personalization, forecasting, visual search, and operational decision support.",
    accent:      "#DC2626",
    heroDesc:    "Retail is a data-dense, margin-thin business. The teams that win are the ones that act on their data faster. We build the AI infrastructure that connects customer behaviour, inventory, and operations into a coherent picture.",
    challenges: [
      { title: "Generic customer experiences",   desc: "Most retail platforms still surface the same products to every customer. Personalisation at scale requires ML pipelines that most teams cannot build in-house." },
      { title: "Inventory imbalance",            desc: "Overstock and stockouts both destroy margin. Demand forecasting that accounts for seasonality, promotions, and external signals is beyond spreadsheet-based planning." },
      { title: "High return rates",              desc: "High return rates in e-commerce create margin pressure. Predicting return risk at the point of purchase enables targeted sizing guidance and policy adjustments." },
    ],
    solutions: [
      { title: "Recommendation engines",        desc: "Collaborative and content-based filtering models that personalise product discovery across browse, search, and email surfaces." },
      { title: "Demand forecasting",            desc: "SKU-level forecasting models that account for promotions, seasonality, and external demand signals to drive replenishment decisions." },
      { title: "Visual search",                 desc: "Image similarity models that let customers find products by uploading a photo — deployed as an API into your existing storefront." },
      { title: "Returns prediction",            desc: "Order-level risk scoring that identifies high-return-probability purchases, enabling pre-emptive sizing guidance or policy adjustments." },
      { title: "Customer lifetime value",       desc: "Segmentation and LTV prediction models that help marketing teams allocate acquisition and retention spend more effectively." },
    ],
    relatedSlugs: ["finance", "logistics", "technology"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "logistics",
    name:        "Logistics",
    tagline:     "AI for routing, prediction, and warehouse intelligence.",
    description: "OSYSTIC builds optimisation and forecasting systems for logistics and supply chain teams — route optimisation, delivery time prediction, warehouse automation, and demand sensing.",
    accent:      "#D97706",
    heroDesc:    "Logistics margins are thin and customer expectations for speed and visibility are rising. The operations teams that stay competitive are those that have turned their data into a real-time operational advantage.",
    challenges: [
      { title: "Suboptimal routing decisions",   desc: "Static routing rules cannot account for real-time traffic, weather, vehicle capacity, and time-window constraints simultaneously at scale." },
      { title: "Delivery time unpredictability", desc: "Customers expect accurate ETAs. Most logistics platforms offer only broad windows because they lack the predictive models to do better." },
      { title: "Warehouse inefficiency",         desc: "Slotting, pick path planning, and labour scheduling in large warehouses are still heavily manual — leaving significant throughput gains on the table." },
    ],
    solutions: [
      { title: "Route optimisation",            desc: "Constraint-aware routing models that account for traffic, capacity, time windows, and driver hours — reducing cost per delivery." },
      { title: "Delivery time prediction",      desc: "ML models that estimate delivery windows using historical delivery data, real-time conditions, and carrier performance signals." },
      { title: "Warehouse automation",          desc: "Slotting optimisation, pick path planning, and labour forecasting systems designed to support warehouse planning and throughput decisions." },
      { title: "Demand sensing",                desc: "Short-horizon demand models that feed replenishment and transport planning with signals beyond historical averages." },
      { title: "Anomaly detection",             desc: "Systems that flag shipment delays, carrier performance outliers, and inventory discrepancies in real time." },
    ],
    relatedSlugs: ["manufacturing", "retail", "technology"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "telecom",
    name:        "Telecommunications",
    tagline:     "AI for network intelligence, churn, and customer operations.",
    description: "OSYSTIC builds anomaly detection, churn prediction, and NLP systems for telecommunications teams managing large subscriber bases and complex network infrastructure.",
    accent:      "#059669",
    heroDesc:    "Telecoms operate infrastructure that generates continuous high-volume data and serve millions of customers simultaneously. The AI opportunity is enormous — from network operations to customer experience.",
    challenges: [
      { title: "Network anomaly detection",      desc: "Network faults and performance degradation affect millions of users. Manual monitoring cannot process the volume of telemetry data generated by modern infrastructure." },
      { title: "High subscriber churn",          desc: "Telecoms face structural churn pressure from commoditisation and competition. Identifying at-risk subscribers before they leave requires predictive modelling." },
      { title: "Call centre volume",             desc: "Large telecoms handle millions of support interactions monthly. Most are still manually routed and resolved, creating cost and quality inconsistency." },
    ],
    solutions: [
      { title: "Network anomaly detection",     desc: "Time-series models trained on telemetry data to detect degradation signatures and surface alerts for operational review." },
      { title: "Churn prediction",              desc: "Subscriber-level churn risk models that identify at-risk customers based on usage patterns, service history, and plan features." },
      { title: "Call centre NLP",               desc: "Intent detection, call routing, and automated summarisation models that reduce handle time and improve first-contact resolution." },
      { title: "Usage forecasting",             desc: "Network capacity models that predict regional demand spikes and inform infrastructure provisioning decisions." },
      { title: "Customer segmentation",         desc: "Behavioural clustering that enables targeted retention, upsell, and re-engagement campaigns at the subscriber level." },
    ],
    relatedSlugs: ["finance", "technology", "retail"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "education",
    name:        "Education",
    tagline:     "AI for personalised learning and institutional intelligence.",
    description: "OSYSTIC builds personalised learning systems, automated assessment tools, and engagement analytics for education platforms and institutions.",
    accent:      "#0891B2",
    heroDesc:    "Education technology has accumulated enormous amounts of learner data with relatively limited ability to act on it. We build systems that use that data to improve outcomes — for learners, instructors, and institutions.",
    challenges: [
      { title: "One-size-fits-all content",      desc: "Most learning platforms deliver the same content sequence to every learner regardless of prior knowledge, pace, or preferred format." },
      { title: "Assessment at scale",            desc: "Manual grading and feedback is the bottleneck in large cohorts. Automated assessment that maintains quality requires sophisticated NLP and domain modelling." },
      { title: "Learner drop-off",               desc: "Completion rates on digital learning products are low. Identifying at-risk learners early and intervening effectively requires predictive engagement models." },
    ],
    solutions: [
      { title: "Personalised learning paths",   desc: "Adaptive sequencing models that adjust content difficulty, format, and pacing based on each learner's demonstrated knowledge and engagement." },
      { title: "Automated assessment",          desc: "NLP-based grading and feedback systems for written responses, code submissions, and open-ended questions." },
      { title: "Content summarisation",         desc: "Lecture and document summarisation pipelines that help learners review material and instructors create study aids at scale." },
      { title: "Engagement analytics",          desc: "Learner-behaviour models that estimate drop-off risk and help teams evaluate intervention points and content-performance patterns." },
      { title: "Institutional dashboards",      desc: "Analytics platforms that give programme managers visibility into cohort performance, completion trends, and learning outcome attainment." },
    ],
    relatedSlugs: ["technology", "healthcare", "retail"],
  },

  /* ────────────────────────────────── */
  {
    slug:        "technology",
    name:        "Technology",
    tagline:     "AI and engineering for software products and platforms.",
    description: "OSYSTIC builds AI features, developer tooling, and platform infrastructure for software companies — from LLM-powered product features to data pipelines and SaaS architecture.",
    accent:      "#3B6CFF",
    heroDesc:    "Technology companies have the highest AI literacy and the most demanding engineering standards. We work as an extension of product and engineering teams, with delivery responsibility, reviewable engineering outputs, and clear project ownership.",
    challenges: [
      { title: "AI feature integration",         desc: "Adding LLM-powered features to existing products requires careful architecture decisions around latency, cost, and reliability that most product teams are still learning." },
      { title: "Data pipeline reliability",      desc: "Software products generate event streams and usage data that are valuable but often poorly ingested and modelled — limiting the product intelligence teams can build." },
      { title: "Scaling infrastructure",         desc: "Growth-stage software companies frequently hit infrastructure ceilings. Cloud architecture decisions made early have long-term cost and reliability consequences." },
    ],
    solutions: [
      { title: "LLM-powered product features",  desc: "Design and implementation of AI features — search, summarisation, generation, and classification — integrated into your existing product stack." },
      { title: "Developer tooling",             desc: "AI-assisted code review, documentation generation, and test writing tools built for engineering teams." },
      { title: "Data infrastructure",           desc: "Event pipelines, warehouses, and feature stores that give product and data teams reliable access to the data they need." },
      { title: "SaaS architecture",             desc: "Multi-tenant architecture, authentication, billing integration, and API design for B2B software products." },
      { title: "Platform engineering",          desc: "Cloud infrastructure, CI/CD, observability, and developer-experience improvements designed to make delivery more repeatable and operationally visible." },
    ],
    relatedSlugs: ["finance", "healthcare", "retail"],
  },
];

/* Helper — find by slug */
export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find(ind => ind.slug === slug);
}

/* All slugs — used by generateStaticParams */
export const ALL_SLUGS = INDUSTRIES.map(ind => ind.slug);