import { createSeoMetadata } from "@/lib/seo";
import { permanentRedirect } from "next/navigation";
export const metadata = createSeoMetadata({
  title: 'Contact',
  description: 'Start an enterprise AI or software engineering conversation with OSYSTIC.',
  path: '/contact',
  noIndex: true,
});

export default function LegacyBookingsPage(){ permanentRedirect("/contact"); }
