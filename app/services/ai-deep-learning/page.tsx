import { createSeoMetadata } from "@/lib/seo";
import { ServiceDetailPage, type ServiceDetailData } from "../../components/marketing/ServiceDetailPage";
import { ServiceStructuredData } from "../../components/marketing/ServiceStructuredData";
import { FAQS, INDUSTRIES, SERVICES, STEPS, TECH_STACK } from "./_data";

export const metadata = createSeoMetadata({
  title: "AI & Machine Learning Engineering",
  description:
    "OSYSTIC designs, trains, integrates, evaluates, and deploys machine learning, NLP, computer vision, predictive, and edge AI systems for production environments.",
  path: "/services/ai-deep-learning",
  keywords: ["machine learning engineering", "AI development company", "deep learning engineering", "NLP engineering"],
});

const data: ServiceDetailData = {
  slug: "ai-deep-learning",
  name: "AI & Machine Learning",
  category: "AI Systems",
  heroH1: "AI systems built for the environment they must operate in.",
  heroSub:
    "From custom models and document intelligence to computer vision and edge inference, OSYSTIC builds AI around your data, constraints, integration points, and ownership requirements.",
  services: SERVICES,
  steps: STEPS,
  techStack: TECH_STACK,
  industries: INDUSTRIES,
  faqs: FAQS,
  ctaH2: "Have an AI system worth building?",
  ctaDesc:
    "Tell us about the problem, the data available, and the environment the system needs to run in. We will help turn that into a practical technical plan.",
};

export default function AIMachineLearningPage() {
  return (
    <>
      <ServiceStructuredData data={data} path="/services/ai-deep-learning" />
      <ServiceDetailPage data={data} />
    </>
  );
}
