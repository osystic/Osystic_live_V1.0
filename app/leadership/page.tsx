import { permanentRedirect } from "next/navigation";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Leadership & Governance",
  description:
    "Learn how OSYSTIC structures engineering leadership, governance, and delivery accountability.",
  path: "/about",
  noIndex: true,
});

export default function LeadershipPage() {
  permanentRedirect("/about#leadership");
}
