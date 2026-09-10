"use client";

/* ══════════════════════════════════════════════════════════
   app/(admin)/pending/page.tsx
   Pending approval page — awaiting Super Admin review
══════════════════════════════════════════════════════════ */

import Link from "next/link";
import { Clock } from "lucide-react";

const FONT   = "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO   = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";
const BLK    = "#08090A";
const BLU    = "#2563EB";
const WHT    = "#FFFFFF";
const BORD   = "#E2E8F0";
const GRAY   = "#64748B";
const GRAY_L = "#94A3B8";

export default function PendingPage() {
  return (
    <div className="auth-layout" style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: FONT }}>
      <style suppressHydrationWarning>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .card { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="card" style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: BLK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: WHT, fontSize: 16, fontWeight: 800 }}>O</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: BLK, letterSpacing: "-0.03em" }}>OSYSTIC</span>
          </div>
          <p style={{ fontSize: 12, color: GRAY_L, margin: 0, fontFamily: MONO, letterSpacing: "0.08em" }}>ADMIN PANEL</p>
        </div>

        {/* Card */}
        <div className="auth-card-body" style={{ background: WHT, borderRadius: 20, border: `1px solid ${BORD}`, padding: "40px 36px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF3C7", border: "1.5px solid #FBBF24", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock size={24} color="#B45309" strokeWidth={2}/>
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: BLK, margin: "0 0 10px", letterSpacing: "-0.03em" }}>Pending Approval</h1>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: "0 0 24px" }}>
            Your access request has been submitted. A Super Admin will review your details and assign your role.
          </p>

          <div style={{ background: "#F0F9FF", border: `1px solid #BFDBFE`, borderRadius: 12, padding: "16px", marginBottom: "24px", textAlign: "left", fontSize: 13, color: "#1E40AF", lineHeight: 1.6 }}>
            <strong>What happens next:</strong>
            <div style={{ marginTop: 8 }}>
              ✓ Super Admin reviews your application<br/>
              ✓ Role assignment (Admin, Editor, Manager)<br/>
              ✓ Account activation<br/>
              ✓ Confirmation email sent to you
            </div>
          </div>

          <p style={{ fontSize: 12, color: GRAY_L, margin: "0 0 24px" }}>
            Expected approval time: 1-2 business days
          </p>

          <Link href="/admin/login" style={{
            display: "inline-block",
            padding: "11px 24px",
            background: BLU,
            color: WHT,
            borderRadius: 10,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: FONT,
            transition: "background 0.15s",
          }} onMouseEnter={e => (e.currentTarget.style.background = "#1D4ED8")} onMouseLeave={e => (e.currentTarget.style.background = BLU)}>
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
