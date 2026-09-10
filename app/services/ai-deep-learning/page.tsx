import type { Metadata } from "next";
import { ServiceDetailPage } from "../../components/marketing/ServiceDetailPage";
import { FAQS, INDUSTRIES, SERVICES, STEPS, TECH_STACK } from "./_data";

export const metadata: Metadata = {
  title: "AI & Machine Learning Engineering",
  description:
    "OSYSTIC designs, trains, integrates, and deploys machine learning, NLP, computer vision, predictive, and edge AI systems for production environments.",
  alternates: { canonical: "https://osystic.com/services/ai-deep-learning" },
};

export default function AIMachineLearningPage() {
  return (
    <ServiceDetailPage
      data={{
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
      }}
    />
  );
}
