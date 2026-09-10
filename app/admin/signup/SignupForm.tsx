"use client";

/* ══════════════════════════════════════════════════════════
   app/(admin)/signup/page.tsx
   Request access — creates pending account.
   Super Admin receives email + approves from /admin/team.
══════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect }    from "react";
import { useRouter }   from "next/navigation";
import Link            from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";

const FONT   = "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO   = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";
const BLK    = "#08090A";
const BLU    = "#2563EB";
const WHT    = "#FFFFFF";
const BORD   = "#E2E8F0";
const GRAY   = "#64748B";
const GRAY_L = "#94A3B8";

export default function AdminSignupForm() {
  const router = useRouter();
  const [form, setForm]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [done, setDone]     = useState(false);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => { requestRef.current?.abort(); }, []);

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 12) { setError("Password must be at least 12 characters"); return; }
    setLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const res  = await fetch("/api/admin/auth/signup", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: form.name, email: form.email, password: form.password }),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { setError(data?.error || "Signup failed"); return; }
      setDone(true);
      setTimeout(() => { if (!controller.signal.aborted) router.push("/admin/pending"); }, 1500);
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
        .card { animation:fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .ifield { width:100%; box-sizing:border-box; padding:11px 14px; font-size:14px; font-family:${FONT}; color:${BLK}; background:${WHT}; border:1.5px solid ${BORD}; border-radius:10px; outline:none; transition:border-color 0.15s,box-shadow 0.15s; }
        .ifield:focus { border-color:${BLU}; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
        .sbtn { width:100%; height:44px; background:${BLK}; color:${WHT}; border:none; border-radius:10px; font-size:14px; font-weight:600; font-family:${FONT}; cursor:pointer; transition:background 0.15s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .sbtn:hover:not(:disabled) { background:#1a1b1e; }
        .sbtn:disabled { background:${GRAY_L}; cursor:not-allowed; }
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
      `}</style>

      <div className="card" style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: BLK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: WHT, fontSize: 16, fontWeight: 800 }}>O</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: BLK, letterSpacing: "-0.03em" }}>OSYSTIC</span>
          </div>
          <p style={{ fontSize: 12, color: GRAY_L, margin: 0, fontFamily: MONO, letterSpacing: "0.08em" }}>ADMIN PANEL</p>
        </div>

        {done ? (
          /* Success state */
          <div className="auth-card-body" style={{ background: WHT, borderRadius: 20, border: `1px solid ${BORD}`, padding: "40px 36px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Check size={22} color="#16A34A" strokeWidth={2.5}/>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: BLK, margin: "0 0 10px", letterSpacing: "-0.03em" }}>Request submitted</h2>
            <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: "0 0 24px" }}>
              Your access request has been sent. You will receive an email once a Super Admin approves your account and assigns your role.
            </p>
            <Link href="/admin/login" style={{ fontSize: 13, color: BLU, textDecoration: "none", fontWeight: 600 }}>
              Back to sign in →
            </Link>
          </div>
        ) : (
          <div className="auth-card-body" style={{ background: WHT, borderRadius: 20, border: `1px solid ${BORD}`, padding: "36px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: BLK, margin: "0 0 6px", letterSpacing: "-0.03em" }}>Request access</h1>
            <p style={{ fontSize: 13, color: GRAY, margin: "0 0 28px" }}>
              Submit your details. A Super Admin will review and assign your role.
            </p>

            {error && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: 20, fontSize: 13, color: "#DC2626" }}>
                <AlertCircle size={14}/> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { id:"name",    label:"FULL NAME",    type:"text",     placeholder:"Alex Johnson",         ac:"name" },
                { id:"email",   label:"WORK EMAIL",   type:"email",    placeholder:"you@osystic.com",    ac:"email" },
              ].map(f => (
                <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label htmlFor={f.id} style={{ fontSize: 11, fontWeight: 700, color: BLK, letterSpacing: "0.04em" }}>{f.label}</label>
                  <input id={f.id} type={f.type} required autoComplete={f.ac}
                    className="ifield" placeholder={f.placeholder}
                    value={form[f.id as keyof typeof form]} onChange={e => set(f.id as keyof typeof form)(e.target.value)}/>
                </div>
              ))}

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="password" style={{ fontSize: 11, fontWeight: 700, color: BLK, letterSpacing: "0.04em" }}>PASSWORD</label>
                <div style={{ position: "relative" }}>
                  <input id="password" type={showPw ? "text" : "password"} required
                    className="ifield" placeholder="Min 12 characters" style={{ paddingRight: 44 }}
                    value={form.password} onChange={e => set("password")(e.target.value)}/>
                  <button type="button" onClick={() => setShowPw(p => !p)}
                    aria-label={showPw ? "Hide password" : "Show password"}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: GRAY_L, display: "flex", alignItems: "center" }}>
                    {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>

              {/* Confirm */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label htmlFor="confirm" style={{ fontSize: 11, fontWeight: 700, color: BLK, letterSpacing: "0.04em" }}>CONFIRM PASSWORD</label>
                <input id="confirm" type="password" required
                  className="ifield" placeholder="••••••••"
                  value={form.confirm} onChange={e => set("confirm")(e.target.value)}/>
              </div>

              <button type="submit" className="sbtn" disabled={loading} style={{ marginTop: 8 }}>
                {loading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/> Submitting…</> : "Request access"}
              </button>
            </form>
          </div>
        )}

        <p style={{ textAlign: "center", fontSize: 13, color: GRAY_L, marginTop: 20 }}>
          Already have access?{" "}
          <Link href="/admin/login" style={{ color: BLU, textDecoration: "none", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}