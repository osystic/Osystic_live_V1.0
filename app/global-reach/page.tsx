import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'About',
  description: 'Learn about OSYSTIC company operations and delivery model.',
  path: '/about',
  noIndex: true,
});

export default function GlobalReachPage(){ permanentRedirect("/about#global-operations"); }
