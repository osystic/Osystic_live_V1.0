import { createSeoMetadata } from "@/lib/seo";
import { HomeApprovedExperience } from "./components/home/HomeApprovedExperience";

export const metadata = createSeoMetadata({
  title: "AI & Software Engineering",
  description: "OSYSTIC designs and deploys enterprise AI systems, agentic workflows, custom software, data platforms, and cloud infrastructure for production environments.",
  path: "/",
  keywords: ["enterprise AI engineering", "AI software development", "agentic AI systems", "custom software engineering"],
});

export default function Home() {
  return (
    <main id="main-content" className="home-page">
      <HomeApprovedExperience />
    </main>
  );
}
