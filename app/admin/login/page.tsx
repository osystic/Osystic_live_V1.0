"use client";

/* ══════════════════════════════════════════════════════════
   app/(admin)/login/page.tsx
   Admin sign in page. Clean, minimal, professional.
══════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

const FONT = "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";
const BLK  = "#08090A";
const BLU  = "#2563EB";
const WHT  = "#FFFFFF";
const BORD = "#E2E8F0";
const GRAY = "#64748B";
const GRAY_L = "#94A3B8";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => { requestRef.current?.abort(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const res  = await fetch("/api/admin/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (data?.code === "PENDING") router.push("/admin/pending");
        else setError(data?.error || "Login failed");
        return;
      }
      router.push("/admin/content");
    } catch {
      if (controller.signal.aborted) return;
      setError("Something went wrong. Please try again.");
    } finally {
      requestRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout" style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: FONT }}>
      <style suppressHydrationWarning>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .login-card { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .input-field { width:100%; box-sizing:border-box; padding:11px 14px; font-size:14px; font-family:${FONT}; color:${BLK}; background:${WHT}; border:1.5px solid ${BORD}; border-radius:10px; outline:none; transition:border-color 0.15s,box-shadow 0.15s; }
        .input-field:focus { border-color:${BLU}; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .submit-btn { width:100%; height:44px; background:${BLK}; color:${WHT}; border:none; border-radius:10px; font-size:14px; font-weight:600; font-family:${FONT}; cursor:pointer; transition:background 0.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .submit-btn:hover:not(:disabled) { background:#1a1b1e; }
        .submit-btn:disabled { background:${GRAY_L}; cursor:not-allowed; }
        :focus-visible { outline:2px solid ${BLU}; outline-offset:3px; border-radius:4px; }
      `}</style>

      <div className="login-card" style={{ width: "100%", maxWidth: 400 }}>

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
        <div className="auth-card-body" style={{ background: WHT, borderRadius: 20, border: `1px solid ${BORD}`, padding: "36px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: BLK, margin: "0 0 6px", letterSpacing: "-0.03em" }}>Sign in</h1>
          <p style={{ fontSize: 13, color: GRAY, margin: "0 0 28px" }}>Access the OSYSTIC admin panel.</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: 20, fontSize: 13, color: "#DC2626" }}>
              <AlertCircle size={14}/> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="email" style={{ fontSize: 11, fontWeight: 700, color: BLK, letterSpacing: "0.04em" }}>
                EMAIL ADDRESS
              </label>
              <input id="email" type="email" required autoComplete="email"
                className="input-field" placeholder="you@osystic.com"
                value={email} onChange={e => setEmail(e.target.value)}/>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label htmlFor="password" style={{ fontSize: 11, fontWeight: 700, color: BLK, letterSpacing: "0.04em" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <input id="password" type={showPw ? "text" : "password"} required autoComplete="current-password"
                  className="input-field" placeholder="••••••••" style={{ paddingRight: 44 }}
                  value={password} onChange={e => setPassword(e.target.value)}/>
                <button type="button" onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY_L, display: "flex", alignItems: "center" }}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/> Signing in…</> : "Sign in"}
            </button>
          </form>
        </div>

      </div>

      <style suppressHydrationWarning>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}