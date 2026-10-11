import { createSeoMetadata } from "@/lib/seo";
import { HomeApprovedExperience } from "./components/home/HomeApprovedExperience";

const homeMetadata = createSeoMetadata({
  title: "OSYSTIC | Enterprise AI & Software Engineering",
  description: "OSYSTIC designs and deploys enterprise AI systems, agentic workflows, custom software, data platforms, and cloud infrastructure for production environments.",
  path: "/",
  keywords: ["enterprise AI engineering", "AI software development", "agentic AI systems", "custom software engineering"],
});

export const metadata = {
  ...homeMetadata,
  title: { absolute: "OSYSTIC | Enterprise AI & Software Engineering" },
};

export default function Home() {
  return (
    <main id="main-content" className="home-page">
      <HomeApprovedExperience />
    </main>
  );
}
