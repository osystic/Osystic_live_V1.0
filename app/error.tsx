"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="main-content" className="route-state section-light">
    <div className="container-shell"><span className="eyebrow">OSYSTIC</span><h1>This page couldn’t load.</h1>
      <p role="alert">Please try again. If the problem continues, contact us and we’ll help.</p>
      <div className="hero-actions"><button className="button button-primary" onClick={reset}>Try again</button><Link className="text-link" href="/contact">Contact OSYSTIC</Link></div>
    </div>
  </main>;
}
