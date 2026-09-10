export const siteConfig = {
  name: "OSYSTIC",
  legalName: "OSYSTIC",
  url: "https://osystic.com",
  description:
    "OSYSTIC designs, builds, and deploys production AI systems, digital products, and data infrastructure for organizations where reliability, security, and ownership matter.",
  email: "hello@osystic.com",
  address: {
    line1: "102 Gold Ave SW, PMB 734",
    line2: "Albuquerque, NM 87102",
    country: "USA",
  },
  localOperations: "Lahore, Pakistan",
  social: {
    linkedin: "https://www.linkedin.com/company/osystic",
  },
  navigation: [
    { label: "Work", href: "/case-studies" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Industries", href: "/industries" },
    { label: "Insights", href: "/insights" },
    { label: "Company", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export const capabilityGroups = [
  {
    title: "AI Systems",
    href: "/capabilities/ai-systems",
    description: "Production AI systems that reason, retrieve, predict, perceive, and act.",
    items: [
      ["AI Agents & Workflow Automation", "/services/intelligent-automation"],
      ["Enterprise RAG & Knowledge Systems", "/services/enterprise-rag"],
      ["AI Reliability & LLMOps", "/services/ai-reliability"],
      ["Generative AI", "/services/ai-deep-learning"],
      ["Machine Learning", "/services/ai-deep-learning"],
      ["Computer Vision", "/services/computer-vision-nlp"],
      ["Predictive AI", "/services/predictive-analytics"],
      ["Edge AI", "/services/edge-ai"],
    ],
  },
  {
    title: "Product Engineering",
    href: "/capabilities/product-engineering",
    description: "Secure digital products engineered from interface to production infrastructure.",
    items: [
      ["SaaS Platforms", "/services/engineering/saas-development"],
      ["Web Applications", "/services/engineering/frontend-development"],
      ["Mobile Apps", "/services/engineering/mobile-development"],
      ["Backend & APIs", "/services/engineering/backend"],
      ["Enterprise Software", "/services/data-cloud/erp"],
      ["System Modernization", "/services/engineering/backend"],
    ],
  },
  {
    title: "Data & Cloud",
    href: "/capabilities/data-cloud",
    description: "Data foundations, cloud platforms, and delivery systems built for scale.",
    items: [
      ["Data Engineering", "/services/data-cloud/data"],
      ["Analytics", "/services/data-cloud/data-analysis"],
      ["AI / ML Platform Operations", "/services/devops-cloud"],
      ["Cloud Engineering", "/services/data-cloud/cloud"],
      ["DevOps", "/services/devops-cloud"],
      ["Platform Engineering", "/services/devops-cloud"],
    ],
  },
] as const;

export const primaryIndustries = [
  {
    name: "Finance",
    href: "/industries/finance",
    description: "Risk, research, compliance, decision systems, and customer experience.",
  },
  {
    name: "Manufacturing",
    href: "/industries/manufacturing",
    description: "Quality, predictive maintenance, operations, and industrial intelligence.",
  },
  {
    name: "Healthcare",
    href: "/industries/healthcare",
    description: "Clinical workflows, document intelligence, interoperability, and secure AI.",
  },
  {
    name: "Technology",
    href: "/industries/technology",
    description: "SaaS, AI products, developer platforms, and scalable digital infrastructure.",
  },
] as const;
