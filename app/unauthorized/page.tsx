"use client";

import Link from "next/link";
import { ArrowLeft, LifeBuoy, ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <main id="main-content" className="fp-unauthorized">
      <div className="fp-denied-grid" />
      <section>
        <div className="fp-denied-icon">
          <ShieldAlert size={38} />
          <span className="pulse" />
        </div>
        <span className="future-kicker">SECURITY PROTOCOL / 403</span>
        <h1>Access boundary reached.</h1>
        <p>This route requires an authorized OSYSTIC account. Return to the public site or contact support if you need assistance.</p>
        <div>
          <Link href="/" className="button button-primary"><ArrowLeft size={17} />Public Homepage</Link>
          <Link href="/support" className="button button-secondary-dark"><LifeBuoy size={18} />Contact Support</Link>
        </div>
        <small>OSYSTIC / ACCESS CONTROL</small>
      </section>
    </main>
  );
}
