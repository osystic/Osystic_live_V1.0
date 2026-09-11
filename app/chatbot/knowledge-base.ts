import type { KnowledgeEntry } from "./types";

export const knowledgeBase: KnowledgeEntry[] = [
  // ═══════════════════════════════════════════════════
  // COMPANY
  // ═══════════════════════════════════════════════════
  {
    id: "company-about",
    patterns: [
      "what is osystic",
      "who are you",
      "tell me about osystic",
      "what does osystic do",
      "about the company",
      "about osystic",
      "company overview",
      "what is your company",
      "who is osystic",
      "describe osystic",
    ],
    category: "company",
    priority: 10,
    response:
      "OSYSTIC is an AI and Software Engineering company that designs, builds, and deploys production AI systems, digital products, and data infrastructure. We serve organizations where reliability, security, and ownership matter. Our core capabilities span AI Systems, Product Engineering, and Data & Cloud infrastructure.",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Capabilities", href: "/capabilities" },
    ],
    followUp: [
      "What services do you offer?",
      "Which industries do you serve?",
      "Where are you located?",
    ],
  },
  {
    id: "company-location",
    patterns: [
      "where are you located",
      "where is osystic",
      "office location",
      "headquarters",
      "address",
      "where do you operate",
      "global presence",
      "office address",
    ],
    category: "company",
    response:
      "OSYSTIC has operations in Albuquerque, NM, USA (102 Gold Ave SW, PMB 734, Albuquerque, NM 87102) and local operations in Lahore, Pakistan. We serve clients globally.",
    links: [{ label: "Contact Us", href: "/contact" }],
  },
  {
    id: "company-principles",
    patterns: [
      "engineering principles",
      "your principles",
      "how do you work",
      "your approach",
      "what are your values",
      "operating principles",
      "work philosophy",
    ],
    category: "company",
    response:
      "We follow four core engineering principles:\n\n1. **Technical Honesty** — We define what will and will not work before committing.\n2. **Ownership & Handover** — Explicit licensing, source delivery, and complete handover.\n3. **Deploy Where the System Belongs** — Cloud, on-premise, hybrid, or edge — your choice.\n4. **Phased Delivery** — Each phase ends with something concrete you can inspect and validate.",
    links: [{ label: "Learn More", href: "/about" }],
  },
  {
    id: "company-process",
    patterns: [
      "how do you work",
      "your process",
      "development process",
      "how do you build",
      "delivery process",
      "working with osystic",
      "engagement model",
      "project process",
    ],
    category: "company",
    response:
      "Our operating model follows five phases:\n\n1. **Strategy** — Define the problem, outcomes, constraints, and risks.\n2. **Architecture** — Design the system, data flow, interfaces, and deployment boundary.\n3. **Engineering** — Build, integrate, test, and document.\n4. **Deployment** — Release with operational controls.\n5. **Optimization** — Measure and improve based on evidence.\n\nEach phase concludes with something concrete to inspect.",
    links: [
      { label: "About Our Process", href: "/about" },
      { label: "Book a Call", href: "/contact" },
    ],
  },
  {
    id: "company-leadership",
    patterns: [
      "who leads osystic",
      "founder",
      "ceo",
      "leadership team",
      "who started osystic",
      "management team",
    ],
    category: "company",
    response:
      "OSYSTIC was founded by Shawaiz Arif, who serves as Founder & CEO. The company operates with a lean, engineering-focused team across the US and Pakistan.",
    links: [{ label: "Leadership", href: "/about" }],
  },

  // ═══════════════════════════════════════════════════
  // SERVICES - AI
  // ═══════════════════════════════════════════════════
  {
    id: "services-overview",
    patterns: [
      "what services do you offer",
      "what do you do",
      "your services",
      "capabilities",
      "what can you build",
      "solutions",
      "what do you provide",
      "service offerings",
    ],
    category: "services",
    priority: 9,
    response:
      "We offer three core capability areas:\n\n**AI Systems** — AI Agents, Enterprise RAG, LLMOps, Generative AI, Computer Vision, Predictive Analytics, Edge AI.\n\n**Product Engineering** — SaaS, Web Apps, Mobile Apps, Backend & APIs, Enterprise Software.\n\n**Data & Cloud** — Data Engineering, Analytics, Cloud Engineering, DevOps, Platform Engineering.",
    links: [
      { label: "AI Systems", href: "/capabilities/ai-systems" },
      { label: "Product Engineering", href: "/capabilities/product-engineering" },
      { label: "Data & Cloud", href: "/capabilities/data-cloud" },
    ],
    followUp: [
      "Tell me about AI Agents",
      "What about Enterprise RAG?",
      "Do you build SaaS products?",
    ],
  },
  {
    id: "service-ai-agents",
    patterns: [
      "ai agents",
      "workflow automation",
      "intelligent automation",
      "automated workflows",
      "process automation",
      "rpa",
      "bot automation",
      "ai automation",
    ],
    category: "services",
    response:
      "We build production AI agents and durable workflow automation with tool integrations, retries, approvals, auditability, and operational fallback paths. This includes document processing pipelines, system integration & APIs, workflow orchestration, monitoring & observability, and RPA for legacy systems.",
    links: [
      { label: "AI Agents & Workflow Automation", href: "/services/intelligent-automation" },
    ],
    followUp: [
      "What is your process for automation?",
      "How do you handle failures?",
    ],
  },
  {
    id: "service-rag",
    patterns: [
      "rag",
      "retrieval augmented",
      "knowledge systems",
      "enterprise rag",
      "knowledge base",
      "ai knowledge",
      "document search",
      "semantic search",
    ],
    category: "services",
    response:
      "We engineer Enterprise RAG and Knowledge Systems with governed ingestion, hybrid retrieval, permission-aware context, evaluation, observability, and deployment controls. This goes beyond simple vector search — we build complete knowledge systems with access controls, content refresh workflows, and grounded AI applications.",
    links: [
      { label: "Enterprise RAG & Knowledge Systems", href: "/services/enterprise-rag" },
    ],
  },
  {
    id: "service-llmops",
    patterns: [
      "llmops",
      "ai reliability",
      "ai observability",
      "ai evaluation",
      "ai guardrails",
      "model monitoring",
      "ai operations",
      "production ai",
    ],
    category: "services",
    response:
      "We build the evaluation and operating layer around AI applications — evaluation suites, observability tracing, guardrails, release management, and AI security engineering. This gives teams the evidence and controls to make release decisions confidently.",
    links: [
      { label: "AI Reliability & LLMOps", href: "/services/ai-reliability" },
    ],
  },
  {
    id: "service-genai",
    patterns: [
      "generative ai",
      "gen ai",
      "llm",
      "large language model",
      "chatgpt",
      "gpt",
      "ai model",
      "machine learning",
      "deep learning",
      "neural network",
    ],
    category: "services",
    response:
      "We develop custom Generative AI and Machine Learning solutions — selecting and training the right model for your specific problem. This includes fine-tuning, custom model development, and integration into your existing workflows.",
    links: [
      { label: "Generative AI & Machine Learning", href: "/services/ai-deep-learning" },
    ],
  },
  {
    id: "service-cv",
    patterns: [
      "computer vision",
      "image recognition",
      "object detection",
      "nlp",
      "natural language processing",
      "text analysis",
      "document intelligence",
      "ocr",
    ],
    category: "services",
    response:
      "We build domain-specific Computer Vision and NLP systems — object detection, document intelligence, semantic search, text classification, and multimodal pipelines. These are fine-tuned on your data for accuracy in your specific domain.",
    links: [
      { label: "Computer Vision & NLP", href: "/services/computer-vision-nlp" },
    ],
  },
  {
    id: "service-predictive",
    patterns: [
      "predictive analytics",
      "forecasting",
      "anomaly detection",
      "recommendation system",
      "demand forecast",
      "churn prediction",
      "time series",
    ],
    category: "services",
    response:
      "We build forecasting, anomaly detection, and decision support models — and integrate them into the dashboards and workflows your team already uses. No separate tool required.",
    links: [
      { label: "Predictive Analytics", href: "/services/predictive-analytics" },
    ],
  },
  {
    id: "service-edge-ai",
    patterns: [
      "edge ai",
      "on-device",
      "embedded ai",
      "iot ai",
      "mobile ai",
      "tensorflow lite",
      "onnx",
      "edge deployment",
    ],
    category: "services",
    response:
      "We optimize and deploy ML models to embedded systems, IoT hardware, and mobile — enabling real-time inference without cloud dependency. We support ONNX, TFLite, CoreML, and TensorRT runtimes.",
    links: [{ label: "Edge AI Deployment", href: "/services/edge-ai" }],
  },

  // ═══════════════════════════════════════════════════
  // SERVICES - PRODUCT ENGINEERING
  // ═══════════════════════════════════════════════════
  {
    id: "service-saas",
    patterns: [
      "saas",
      "saas development",
      "saas product",
      "software as a service",
      "multi-tenant",
      "build a saas",
    ],
    category: "services",
    response:
      "We engineer SaaS platforms with multi-tenant architecture, authentication, billing, APIs, and the operational infrastructure needed for production SaaS products.",
    links: [{ label: "SaaS Product Engineering", href: "/services/engineering/saas-development" }],
  },
  {
    id: "service-web",
    patterns: [
      "web development",
      "web app",
      "web application",
      "frontend",
      "website development",
      "react",
      "nextjs",
      "next.js",
    ],
    category: "services",
    response:
      "We build accessible, responsive web applications and frontend interfaces using modern frameworks. Our focus is on performance, accessibility, and maintainability.",
    links: [{ label: "Frontend Engineering", href: "/services/engineering/frontend-development" }],
  },
  {
    id: "service-mobile",
    patterns: [
      "mobile app",
      "mobile development",
      "ios",
      "android",
      "mobile application",
      "cross-platform",
      "react native",
    ],
    category: "services",
    response:
      "We deliver native and cross-platform mobile applications for iOS and Android, from interface design through backend integration.",
    links: [{ label: "Mobile Engineering", href: "/services/engineering/mobile-development" }],
  },
  {
    id: "service-backend",
    patterns: [
      "backend",
      "api",
      "apis",
      "rest api",
      "graphql",
      "server side",
      "backend development",
    ],
    category: "services",
    response:
      "We build application services, REST and GraphQL APIs, integrations, queues, and the backend infrastructure your applications depend on.",
    links: [{ label: "Backend & APIs", href: "/services/engineering/backend" }],
  },

  // ═══════════════════════════════════════════════════
  // SERVICES - DATA & CLOUD
  // ═══════════════════════════════════════════════════
  {
    id: "service-data",
    patterns: [
      "data engineering",
      "data pipeline",
      "data infrastructure",
      "etl",
      "data warehouse",
      "data lake",
      "data processing",
    ],
    category: "services",
    response:
      "We build batch and streaming data ingestion, transformation, and serving pipelines — the infrastructure that makes data usable for analytics, AI, and operational systems.",
    links: [{ label: "Data Engineering", href: "/services/data-cloud/data" }],
  },
  {
    id: "service-cloud",
    patterns: [
      "cloud",
      "cloud engineering",
      "aws",
      "azure",
      "gcp",
      "cloud migration",
      "cloud architecture",
      "infrastructure",
    ],
    category: "services",
    response:
      "We design and build cloud architecture — networking, compute, storage, and migration — on AWS, Azure, or GCP. We also handle hybrid and multi-cloud environments.",
    links: [{ label: "Cloud Engineering", href: "/services/data-cloud/cloud" }],
  },
  {
    id: "service-devops",
    patterns: [
      "devops",
      "ci/cd",
      "kubernetes",
      "docker",
      "terraform",
      "infrastructure as code",
      "cicd",
      "platform engineering",
      "deployment",
    ],
    category: "services",
    response:
      "We build CI/CD pipelines, Kubernetes infrastructure, infrastructure as code, incident response tooling, and security baselines — so engineering teams can ship and operate confidently.",
    links: [
      { label: "Platform Engineering & DevOps", href: "/services/devops-cloud" },
    ],
  },
  {
    id: "service-analytics",
    patterns: [
      "analytics",
      "data analytics",
      "business intelligence",
      "bi",
      "reporting",
      "dashboard",
      "data visualization",
    ],
    category: "services",
    response:
      "We build analytics pipelines and BI integrations that surface data-driven insights in the tools your team already uses — Tableau, Looker, Power BI, or Metabase.",
    links: [{ label: "Analytics", href: "/services/data-cloud/data-analysis" }],
  },

  // ═══════════════════════════════════════════════════
  // INDUSTRIES
  // ═══════════════════════════════════════════════════
  {
    id: "industries-overview",
    patterns: [
      "which industries",
      "industries you serve",
      "industry experience",
      "sectors",
      "who do you work with",
      "industry expertise",
      "clients",
    ],
    category: "industries",
    priority: 8,
    response:
      "We serve organizations across multiple industries:\n\n• **Finance** — Fraud detection, credit scoring, trading signals, document intelligence\n• **Healthcare** — Medical imaging, clinical NLP, patient risk, secure AI\n• **Manufacturing** — Visual inspection, predictive maintenance, yield optimization\n• **Technology** — SaaS, AI products, developer platforms\n• **Retail & E-Commerce** — Recommendation engines, demand forecasting\n• **Logistics** — Route optimization, delivery prediction\n• **Telecommunications** — Network anomaly detection, churn prediction\n• **Education** — Personalized learning, automated assessment",
    links: [
      { label: "Industries We Serve", href: "/industries" },
    ],
  },
  {
    id: "industry-finance",
    patterns: [
      "finance",
      "banking",
      "fintech",
      "financial services",
      "fraud detection",
      "credit scoring",
    ],
    category: "industries",
    response:
      "For Finance, we deliver fraud detection, credit scoring, trading signals, document intelligence, regulatory reporting automation, and risk assessment systems. We understand the compliance and security requirements of financial services.",
    links: [{ label: "Finance Industry", href: "/industries/finance" }],
  },
  {
    id: "industry-healthcare",
    patterns: [
      "healthcare",
      "medical",
      "clinical",
      "hospital",
      "health tech",
      "healthtech",
    ],
    category: "industries",
    response:
      "For Healthcare, we build medical imaging systems, clinical NLP, patient risk assessment, document intelligence, and secure AI deployments designed around privacy and compliance requirements.",
    links: [{ label: "Healthcare Industry", href: "/industries/healthcare" }],
  },
  {
    id: "industry-manufacturing",
    patterns: [
      "manufacturing",
      "industrial",
      "factory",
      "production line",
      "quality inspection",
      "predictive maintenance",
    ],
    category: "industries",
    response:
      "For Manufacturing, we deliver visual quality inspection, predictive maintenance, yield optimization, and industrial intelligence systems — including edge AI for on-site deployment.",
    links: [{ label: "Manufacturing Industry", href: "/industries/manufacturing" }],
  },
  {
    id: "industry-tech",
    patterns: [
      "technology",
      "tech company",
      "software company",
      "startup",
      "tech startup",
    ],
    category: "industries",
    response:
      "For Technology companies, we build LLM-powered features, developer tooling, SaaS architecture, AI product development, and scalable digital infrastructure.",
    links: [{ label: "Technology Industry", href: "/industries/technology" }],
  },

  // ═══════════════════════════════════════════════════
  // FAQ
  // ═══════════════════════════════════════════════════
  {
    id: "faq-pricing",
    patterns: [
      "pricing",
      "cost",
      "how much",
      "price",
      "rates",
      "budget",
      "expensive",
      "affordable",
      "hourly rate",
      "project cost",
    ],
    category: "faq",
    response:
      "Every project is different. Pricing depends on scope, complexity, timeline, and the specific technologies involved. We provide transparent estimates after understanding your requirements.\n\nThe best way to get started is to book a technical discovery call where we can discuss your needs and provide an honest assessment.",
    links: [
      { label: "Book a Discovery Call", href: "/contact" },
    ],
  },
  {
    id: "faq-timeline",
    patterns: [
      "how long",
      "timeline",
      "duration",
      "delivery time",
      "project timeline",
      "how quickly",
      "turnaround",
      "deadline",
    ],
    category: "faq",
    response:
      "Project timelines vary based on scope and complexity. Simple integrations may take weeks, while enterprise AI systems can take months. We follow phased delivery — each phase ends with something concrete you can inspect.\n\nWe'll provide a realistic timeline after understanding your requirements.",
    links: [{ label: "Book a Discovery Call", href: "/contact" }],
  },
  {
    id: "faq-technologies",
    patterns: [
      "what technologies",
      "tech stack",
      "programming languages",
      "frameworks",
      "tools you use",
    ],
    category: "faq",
    response:
      "We use the right technology for the problem — not a fixed stack. Common technologies include:\n\n• **AI/ML**: Python, PyTorch, TensorFlow, HuggingFace, LangChain\n• **Backend**: Node.js, Python, FastAPI, PostgreSQL\n• **Frontend**: React, Next.js, TypeScript\n• **Cloud**: AWS, Azure, GCP, Kubernetes, Terraform\n• **Data**: Spark, Kafka, Airflow, dbt\n\nWe select based on your requirements, existing stack, and long-term maintainability.",
  },
  {
    id: "faq-support",
    patterns: [
      "support",
      "maintenance",
      "after launch",
      "ongoing",
      "post deployment",
      "retainer",
      "continued support",
    ],
    category: "faq",
    response:
      "We hand over all code, documentation, and runbooks so your team can operate independently. For ongoing needs, we offer support and optimization engagements.\n\nOur goal is to build systems your team owns and can maintain — not create dependency.",
    links: [{ label: "Support", href: "/support" }],
  },
  {
    id: "faq-security",
    patterns: [
      "security",
      "data privacy",
      "compliance",
      "gdpr",
      "hipaa",
      "data protection",
      "secure",
      "encryption",
    ],
    category: "faq",
    response:
      "Security is fundamental to our approach:\n\n• Data remains under your control\n• Critical behavior is observable\n• Delivery is explicit with defined milestones\n• We don't claim certifications — security is scoped per engagement\n\nWe design security controls around your specific compliance requirements.",
    links: [{ label: "Trust & Security", href: "/trust" }],
  },
  {
    id: "faq-ownership",
    patterns: [
      "code ownership",
      "intellectual property",
      "ip",
      "who owns the code",
      "source code",
      "code delivery",
      "open source",
    ],
    category: "faq",
    response:
      "You own the code. We deliver all source code, documentation, and assets as part of our engagement. Our principle is explicit ownership — no hidden dependencies or locked-in deliverables.",
  },
  {
    id: "faq-team",
    patterns: [
      "team size",
      "how many people",
      "your team",
      "developers",
      "engineers",
      "staff",
    ],
    category: "faq",
    response:
      "We operate with a focused, engineering-led team. The exact team composition depends on your project requirements. We match the right expertise to your needs.",
  },
  {
    id: "faq-working-model",
    patterns: [
      "how to start",
      "getting started",
      "first step",
      "next steps",
      "how to work together",
      "begin engagement",
    ],
    category: "faq",
    response:
      "Getting started is simple:\n\n1. **Book a Discovery Call** — Tell us about your project and requirements.\n2. **Assessment** — We review your needs and provide an honest assessment with a clear plan.\n3. **Phased Delivery** — We start with a defined phase that produces something concrete.\n\nNo long sales process — we get to the technical discussion quickly.",
    links: [
      { label: "Book a Discovery Call", href: "/contact" },
    ],
  },

  // ═══════════════════════════════════════════════════
  // CONTACT
  // ═══════════════════════════════════════════════════
  {
    id: "contact",
    patterns: [
      "contact",
      "get in touch",
      "email",
      "phone",
      "reach you",
      "talk to someone",
      "speak with",
      "human agent",
      "real person",
      "talk to sales",
      "talk to team",
    ],
    category: "contact",
    priority: 7,
    response:
      "I'd be happy to connect you with our team.\n\n**Email:** hello@osystic.com\n**Book a Call:** You can schedule a technical discovery call directly.\n\nWould you like me to help capture your requirements so our team can prepare for the conversation?",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Book a Call", href: "/contact" },
    ],
    followUp: [
      "Yes, capture my requirements",
      "I'll reach out directly",
    ],
  },

  // ═══════════════════════════════════════════════════
  // CAPABILITIES
  // ═══════════════════════════════════════════════════
  {
    id: "cap-ai-systems",
    patterns: [
      "ai systems",
      "ai capabilities",
      "artificial intelligence",
      "machine learning capabilities",
      "ai solutions",
    ],
    category: "services",
    response:
      "Our AI Systems capability includes:\n\n• AI Agents & Workflow Automation\n• Enterprise RAG & Knowledge Systems\n• AI Reliability & LLMOps\n• Generative AI & Machine Learning\n• Computer Vision & NLP\n• Predictive Analytics\n• Edge AI Deployment\n\nWe build production AI connected to real data, tools, and operating controls.",
    links: [{ label: "AI Systems", href: "/capabilities/ai-systems" }],
  },
  {
    id: "cap-product-engineering",
    patterns: [
      "product engineering",
      "software development",
      "application development",
      "digital products",
      "build products",
    ],
    category: "services",
    response:
      "Our Product Engineering capability covers the full stack:\n\n• SaaS Platforms\n• Web Applications\n• Mobile Apps\n• Backend & APIs\n• Enterprise Software\n• System Modernization\n\nWe engineer secure digital products from interface to production infrastructure.",
    links: [
      { label: "Product Engineering", href: "/capabilities/product-engineering" },
    ],
  },
  {
    id: "cap-data-cloud",
    patterns: [
      "data and cloud",
      "data cloud",
      "cloud infrastructure",
      "data platform",
      "cloud platform",
    ],
    category: "services",
    response:
      "Our Data & Cloud capability includes:\n\n• Data Engineering\n• Analytics & BI\n• AI/ML Platform Operations\n• Cloud Engineering\n• DevOps & Platform Engineering\n\nWe build the foundations that make software and AI reliable.",
    links: [{ label: "Data & Cloud", href: "/capabilities/data-cloud" }],
  },

  // ═══════════════════════════════════════════════════
  // CASE STUDIES / WORK
  // ═══════════════════════════════════════════════════
  {
    id: "case-studies",
    patterns: [
      "case studies",
      "portfolio",
      "previous work",
      "examples",
      "projects",
      "past projects",
      "work samples",
      "show me your work",
    ],
    category: "general",
    response:
      "We showcase our work in our Case Studies section. Each case study details the problem, approach, and outcomes for client projects.",
    links: [{ label: "View Case Studies", href: "/case-studies" }],
  },

  // ═══════════════════════════════════════════════════
  // CAREERS
  // ═══════════════════════════════════════════════════
  {
    id: "careers",
    patterns: [
      "careers",
      "jobs",
      "hiring",
      "join the team",
      "open positions",
      "work at osystic",
      "employment",
    ],
    category: "general",
    response:
      "We're always interested in talented engineers and technologists. Check our Careers page for current openings and how to apply.",
    links: [{ label: "Careers at OSYSTIC", href: "/careers" }],
  },

  // ═══════════════════════════════════════════════════
  // GREETING / CHITCHAT
  // ═══════════════════════════════════════════════════
  {
    id: "greeting",
    patterns: [
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "howdy",
      "greetings",
      "yo",
      "sup",
    ],
    category: "general",
    priority: 5,
    response:
      "Hello! Welcome to OSYSTIC. I'm here to help you learn about our AI and software engineering services.\n\nHow can I assist you today?",
    followUp: [
      "What services do you offer?",
      "Tell me about OSYSTIC",
      "I have a project in mind",
    ],
  },
  {
    id: "thanks",
    patterns: [
      "thank you",
      "thanks",
      "thx",
      "appreciate it",
      "helpful",
    ],
    category: "general",
    response:
      "You're welcome! Is there anything else I can help you with?",
    followUp: [
      "What services do you offer?",
      "I'd like to book a call",
    ],
  },
  {
    id: "how-are-you",
    patterns: [
      "how are you",
      "how's it going",
      "what's up",
      "how do you do",
      "you okay",
    ],
    category: "general",
    response:
      "I'm doing well, thank you! I'm the OSYSTIC assistant, ready to help you with questions about our services, capabilities, or how we can help with your project.\n\nWhat would you like to know?",
    followUp: [
      "What services do you offer?",
      "Tell me about OSYSTIC",
    ],
  },

  // ═══════════════════════════════════════════════════
  // TRUST & SECURITY
  // ═══════════════════════════════════════════════════
  {
    id: "trust",
    patterns: [
      "trust",
      "reliability",
      "quality",
      "how do i know",
      "guarantee",
      "certification",
      "compliance certification",
    ],
    category: "faq",
    response:
      "Our trust foundation is built on:\n\n• **Data stays under your control** — You own everything.\n• **Critical behavior is observable** — Full transparency.\n• **Delivery is explicit** — Defined milestones and evidence.\n• **Honest assessment** — We say what will and won't work.\n\nWe don't claim certifications we don't hold. Security is scoped per engagement.",
    links: [{ label: "Trust & Security", href: "/trust" }],
  },

  // ═══════════════════════════════════════════════════
  // PRICING / ESTIMATES
  // ═══════════════════════════════════════════════════
  {
    id: "free-consultation",
    patterns: [
      "free consultation",
      "free call",
      "free assessment",
      "no cost",
      "trial",
      "demo",
    ],
    category: "contact",
    response:
      "Our initial technical discovery call is free and no-obligation. We'll discuss your requirements, provide an honest assessment of feasibility, and outline a potential approach.\n\nBook a call directly or share your requirements here.",
    links: [
      { label: "Book a Free Discovery Call", href: "/contact" },
    ],
  },
];

export const fallbackResponses = {
  default:
    "I'm not sure I understand that question fully. I can help you with:\n\n• Our services and capabilities\n• Industry-specific solutions\n• Technical approaches and technologies\n• Getting started and next steps\n• Pricing and timelines\n\nCould you rephrase your question, or would you like me to connect you with our team?",
  technical:
    "That's a great technical question. While I can provide general information, our engineering team would be best positioned to give you a detailed answer.\n\nWould you like to book a technical discovery call?",
  pricing:
    "Pricing depends on your specific requirements. Let me help you get in touch with our team for an accurate assessment.",
};
