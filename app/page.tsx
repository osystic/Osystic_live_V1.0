import { createSeoMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHero } from "./components/home/HomeHero";
import { HomeWorkTransition } from "./components/home/HomeWorkTransition";
import { HomeCapabilitiesExperience } from "./components/home/HomeCapabilitiesExperience";
import { HomeAIWorkflowExperience } from "./components/home/HomeAIWorkflowExperience";
import { HomeIndustriesExperience } from "./components/home/HomeIndustriesExperience";
import { HomeTrustExperience } from "./components/home/HomeTrustExperience";
import { HomeInsightsExperience } from "./components/home/HomeInsightsExperience";
import { HomeDeliveryNetworkExperience } from "./components/home/HomeDeliveryNetworkExperience";
import { FinalCTA } from "./components/marketing/FinalCTA";
import { SectionHeading } from "./components/marketing/SectionHeading";
import { fetchCaseStudies } from "./case-studies/actions";

export const metadata = createSeoMetadata({
  title: 'AI & Software Engineering',
  description: 'OSYSTIC designs and deploys enterprise AI systems, agentic workflows, custom software, data platforms, and cloud infrastructure for production environments.',
  path: '/',
  keywords: ['enterprise AI engineering','AI software development','agentic AI systems','custom software engineering'],
});

function caseImage(index: number, provided: string | null) {
  if (provided) return provided;
  return index % 2 === 0 ? "/media/visuals/diagram-work.svg" : "/media/visuals/diagram-work.svg";
}

export default async function Home() {
  const publishedWork = await fetchCaseStudies(2);

  return (
    <main id="main-content" className="home-page">
      <HomeHero />

      <HomeWorkTransition>
      <section id="selected-work" className="section section-light home-work future-selected-work">
        <div className="container-shell">
          <div className="section-topline">
            <SectionHeading eyebrow="SELECTED WORK" title="Real systems. Clear engineering outcomes." body="Public case studies are shown only when the underlying project information has been approved for publication." />
            <Link className="text-link" href="/case-studies">View all work <ArrowRight size={15} /></Link>
          </div>

          <div className="work-grid">
            {publishedWork.length ? publishedWork.map((item, index) => (
              <Link className="work-card" data-home-work-card href={`/case-studies/${item.slug}`} key={item.id}>
                <div className="work-media">
                  <Image src={caseImage(index, item.featuredImage)} alt="" fill sizes="(max-width:800px) 94vw, (min-width:1440px) 624px, 48vw" />
                </div>
                <div className="work-card-body">
                  <span className="work-kicker">CASE STUDY</span>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt || item.challenge}</p>
                  {item.results.length ? (
                    <div className="work-results">{item.results.slice(0, 2).map(result => <span key={result}>{result}</span>)}</div>
                  ) : null}
                </div>
              </Link>
            )) : (
              <div className="work-empty confidentiality-panel" data-home-work-card>
                <span className="eyebrow">CLIENT CONFIDENTIALITY</span>
                <h3>Relevant project examples are available during discovery.</h3>
                <p>
                  Many engagements involve private systems, proprietary data, or non-public product work. We publish case studies only when the details and outcomes are cleared for public use. Tell us what you are building and we can discuss relevant experience without exposing client-confidential information.
                </p>
                <Link href="/contact" className="text-link" style={{ marginTop: 22 }}>Discuss your project <ArrowRight size={15} /></Link>
              </div>
            )}
          </div>
        </div>
      </section>
      </HomeWorkTransition>

      <HomeCapabilitiesExperience />

      <HomeAIWorkflowExperience />

      <HomeIndustriesExperience />

      <HomeTrustExperience />

      <HomeInsightsExperience />

      <HomeDeliveryNetworkExperience />

      <FinalCTA step="10 / START A PROJECT" />
    </main>
  );
}
