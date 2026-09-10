import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" className="not-found-shell">
      <div className="not-found-card">
        <div className="capability-icon"><Search size={20}/></div>
        <span className="eyebrow">404 / NOT FOUND</span>
        <h1>This route has moved, or never existed.</h1>
        <p>Use the main navigation to continue, or return to the OSYSTIC homepage.</p>
        <div className="page-hero-actions"><Link className="button button-primary" href="/">Back to Home <ArrowRight size={15}/></Link><Link className="button button-secondary-dark" href="/contact">Contact OSYSTIC</Link></div>
      </div>
    </main>
  );
}
