import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Finance AI & Software Engineering',
  description: 'Explore OSYSTIC engineering for finance and banking systems.',
  path: '/industries/finance',
  noIndex: true,
});

export default function FintechLegacyPage(){ permanentRedirect("/industries/finance"); }
