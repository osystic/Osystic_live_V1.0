import { createSeoMetadata } from "@/lib/seo";
import { AboutExperience } from "./AboutExperience";
import { FinalCTA } from "../components/marketing/FinalCTA";

export const metadata = createSeoMetadata({
  title: 'About',
  description: 'Learn how OSYSTIC approaches enterprise AI engineering through clear company vision, engineering excellence, accountable ownership, governance, and dependable delivery.',
  path: '/about',
  keywords: ['AI engineering company','enterprise software company','AI engineering team','engineering excellence'],
});

export default function AboutPage() {
  return (
    <>
      <AboutExperience />
      <FinalCTA
        eyebrow="BUILD WITH OSYSTIC"
        title="Bring the hard system problem."
        body="We will help turn the constraints, risks, and operating requirements into a technical path that can be reviewed before implementation begins."
        step="COMPANY / PROJECT CHANNEL"
      />
    </>
  );
}
