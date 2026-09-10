"use client";

/* ══════════════════════════════════════════════════════════
   app/careers/_components/CareersClient.tsx
   Multi-step job application form:
   Step 1 — Personal info (name, email, phone, location, LinkedIn)
   Step 2 — Experience (position, years, skills, cover letter)
   Step 3 — CV upload (PDF/DOC via Cloudinary)
   Step 4 — Review & submit
   Step 5 — Confirmation

   Submissions → /api/careers/apply → Supabase Storage + Drizzle + Resend
══════════════════════════════════════════════════════════ */

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, Check, Upload, X, ArrowRight, Loader2, FileText, Briefcase, User, AlertCircle } from "lucide-react";

/* ── Design tokens ── */
const FONT   = "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO   = "'Geist Mono','JetBrains Mono',ui-monospace,monospace";
const BLK    = "#08090A";
const BLU    = "#2563EB";
const WHT    = "#FFFFFF";
const BORD   = "#E2E8F0";
const GRAY   = "#64748B";
const GRAY_L = "#94A3B8";
const PANEL  = "#F8FAFC";

/* ── Open positions ── */
const POSITIONS = [
  "AI / ML Engineer",
  "Backend Engineer (Node.js / Python)",
  "Frontend Engineer (Next.js / React)",
  "Full Stack Engineer",
  "Mobile Developer (React Native)",
  "DevOps / Cloud Engineer",
  "Data Engineer",
  "Blockchain Developer",
  "UI/UX Designer",
  "Project Manager",
  "Business Development",
  "Other / General Application",
];

const SKILLS_LIST = [
  "Python", "TypeScript", "JavaScript", "Node.js", "React", "Next.js",
  "React Native", "Solidity", "Go", "Rust", "PostgreSQL", "MongoDB",
  "AWS", "GCP", "Docker", "Kubernetes", "TensorFlow", "PyTorch",
  "LangChain", "OpenAI API", "Figma", "dbt", "Spark", "Kafka",
];

const EXP_OPTIONS = [
  { value: "0-1",   label: "0 – 1 years" },
  { value: "1-3",   label: "1 – 3 years" },
  { value: "3-5",   label: "3 – 5 years" },
  { value: "5-8",   label: "5 – 8 years" },
  { value: "8+",    label: "8+ years" },
];

/* ── Step data ── */
interface Step1 { firstName: string; lastName: string; email: string; phone: string; city: string; country: string; linkedIn: string; portfolio: string; }
interface Step2 { position: string; yearsExp: string; currentRole: string; currentCompany: string; skills: string[]; coverLetter: string; }
interface Step3 { file: File | null; }

/* ══════════════════════════════════════════════════════════
   STEP INDICATOR
══════════════════════════════════════════════════════════ */
function Steps({ current }: { current: number }) {
  const steps = [
    { label: "Personal",   icon: User },
    { label: "Experience", icon: Briefcase },
    { label: "CV Upload",  icon: FileText },
    { label: "Review",     icon: Check },
  ];
  return (
    <ol className="careers-steps" aria-label="Application progress">
      {steps.map(({ label, icon: Icon }, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <li key={label} className="careers-step" aria-current={active ? "step" : undefined}>
            <div className="careers-step-label">
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: done ? BLU : active ? BLK : WHT, border: `2px solid ${done ? BLU : active ? BLK : BORD}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", flexShrink: 0 }}>
                {done ? <Check size={14} color={WHT} strokeWidth={2.5}/> : <Icon size={14} color={active ? WHT : GRAY_L} strokeWidth={1.8}/>}
              </div>
              <span>{label}<span className="sr-only">{done ? ": completed" : active ? ": current step" : ": upcoming"}</span></span>
            </div>
            {i < steps.length - 1 && (
              <div className="careers-step-connector" aria-hidden="true" style={{ background: i < current ? BLU : BORD }}/>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ══════════════════════════════════════════════════════════
   INPUT
══════════════════════════════════════════════════════════ */
function Input({ id, label, type="text", required=false, placeholder="", value, onChange, error, hint }: {
  id: string; label: string; type?: string; required?: boolean; placeholder?: string;
  value: string; onChange: (v: string) => void; error?: string; hint?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <label htmlFor={id} style={{ fontSize: 11, fontWeight: 700, color: BLK, fontFamily: FONT, letterSpacing: "0.04em" }}>
          {label.toUpperCase()}{required && <span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>}
        </label>
        {hint && <span style={{ fontSize: 11, color: GRAY_L, fontFamily: FONT }}>{hint}</span>}
      </div>
      <input id={id} type={type} value={value} placeholder={placeholder} required={required}
        maxLength={({ firstName:80, lastName:80, email:254, phone:40, city:100, country:100, linkedIn:500, portfolio:500, currentRole:160, currentCompany:160 } as Record<string, number>)[id]}
        autoComplete={({ email: "email", firstName: "given-name", lastName: "family-name", phone: "tel", city: "address-level2", country: "country-name" } as Record<string, string>)[id] || "off"}
        aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ padding: "11px 14px", fontSize: 14, fontFamily: FONT, color: BLK, background: WHT,
          border: `1.5px solid ${error ? "#EF4444" : focused ? BLU : BORD}`, borderRadius: 10, outline: "none",
          boxShadow: focused && !error ? `0 0 0 3px rgba(37,99,235,0.08)` : "none",
          transition: "border-color 0.15s, box-shadow 0.15s" }}
      />
      {error && <span id={`${id}-error`} style={{ fontSize: 11, color: "#EF4444", fontFamily: FONT, display: "flex", alignItems: "center", gap: 3 }}><AlertCircle size={10}/>{error}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CV UPLOAD DROPZONE
══════════════════════════════════════════════════════════ */
function CVDropzone({ file, onFile, error }: { file: File | null; onFile: (f: File | null) => void; error?: string }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileError, setFileError] = useState("");
  const acceptFile = useCallback((f: File) => {
    const valid = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(f.type) && f.size <= 5 * 1024 * 1024;
    if (!valid) { setFileError("Choose a PDF or Word file no larger than 5 MB."); return; }
    setFileError("");
    onFile(f);
  }, [onFile]);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) acceptFile(f);
  }, [acceptFile]);

  const fmt = (bytes: number) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024*1024)).toFixed(1)} MB`;

  return (
    <div>
      {file ? (
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "#F0FDF4", border: "1.5px solid #86EFAC", borderRadius: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <FileText size={18} color="#16A34A"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: BLK, margin: 0, fontFamily: FONT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</p>
            <p style={{ fontSize: 11, color: GRAY, margin: 0, fontFamily: FONT }}>{fmt(file.size)}</p>
          </div>
          <button aria-label="Remove uploaded CV" className="cv-remove" onClick={() => onFile(null)} style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid #86EFAC`, background: WHT, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <X size={12} color={GRAY}/>
          </button>
        </div>
      ) : (
        <div role="button" tabIndex={0} data-invalid={!!error} aria-label="Choose a CV, PDF or Word, maximum 5 MB" aria-describedby="cv-upload-feedback"
          onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); inputRef.current?.click(); } }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          style={{ border: `2px dashed ${error ? "#EF4444" : dragging ? BLU : BORD}`, borderRadius: 14, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragging ? "#EFF6FF" : PANEL, transition: "all 0.15s" }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: WHT, border: `1px solid ${BORD}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <Upload size={20} color={GRAY} strokeWidth={1.5}/>
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: BLK, margin: "0 0 6px", fontFamily: FONT }}>
            Drop your CV here or <span style={{ color: BLU, textDecoration: "underline" }}>browse</span>
          </p>
          <p style={{ fontSize: 12, color: GRAY_L, margin: 0, fontFamily: FONT }}>PDF or Word · Max 5 MB</p>
          <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onClick={event => event.stopPropagation()}
            onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f); e.target.value = ""; }}/>
        </div>
      )}
      <p id="cv-upload-feedback" role="status" style={{ minHeight: 24, fontSize: 13, color: "#b91c1c", margin: "6px 0 0", fontFamily: FONT }}>{fileError || error || ""}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
export function CareersClient() {
  const applicationRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(0);
  const requestRef = useRef<AbortController | null>(null);
  const [step, setStep]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [appId, setAppId] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [s1, setS1] = useState<Step1>({ firstName:"", lastName:"", email:"", phone:"", city:"", country:"", linkedIn:"", portfolio:"" });
  const [s2, setS2] = useState<Step2>({ position:"", yearsExp:"", currentRole:"", currentCompany:"", skills:[], coverLetter:"" });
  const [s3, setS3] = useState<Step3>({ file: null });

  const [e1, setE1] = useState<Partial<Step1>>({});
  const [e2, setE2] = useState<Partial<Step2>>({});
  const [e3, setE3] = useState<{ file?: string }>({});

  useEffect(() => () => { requestRef.current?.abort(); }, []);
  useEffect(() => {
    if (previousStep.current !== step) applicationRef.current?.querySelector<HTMLElement>("h2")?.focus();
    previousStep.current = step;
  }, [step]);
  function focusInvalid() {
    requestAnimationFrame(() => applicationRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"]')?.focus());
  }

  const set1 = (k: keyof Step1) => (v: string) => { setS1(f => ({...f,[k]:v})); setE1(e => ({...e,[k]:undefined})); };
  const set2 = (k: keyof Step2) => (v: string) => { setS2(f => ({...f,[k]:v})); setE2(e => ({...e,[k]:undefined})); };

  const toggleSkill = (s: string) => setS2(f => ({
    ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s]
  }));

  const validateStep1 = () => {
    const e: Partial<Step1> = {};
    if (!s1.firstName.trim()) e.firstName = "Required";
    if (!s1.lastName.trim())  e.lastName  = "Required";
    if (!s1.email.trim())     e.email     = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s1.email)) e.email = "Invalid email";
    if (!s1.phone.trim()) e.phone = "Required";
    else if (!/^[+\d\s\-().]{5,40}$/.test(s1.phone.trim())) e.phone = "Enter a valid phone number";
    if (!s1.country.trim()) e.country = "Required";
    else if (!/^[a-zA-Z\s]{2,100}$/.test(s1.country.trim())) e.country = "Enter a valid country name";
    if (s1.linkedIn.trim() && !/^https:\/\//i.test(s1.linkedIn.trim())) e.linkedIn = "Use a full HTTPS URL";
    if (s1.portfolio.trim() && !/^https:\/\//i.test(s1.portfolio.trim())) e.portfolio = "Use a full HTTPS URL";
    setE1(e); if (Object.keys(e).length) focusInvalid(); return !Object.keys(e).length;
  };

  const validateStep2 = () => {
    const e: Partial<Step2> = {};
    if (!s2.position.trim())     e.position    = "Required";
    if (!s2.yearsExp.trim())     e.yearsExp    = "Required";
    if (!s2.coverLetter.trim())  e.coverLetter = "Required";
    else if (s2.coverLetter.trim().length < 50) e.coverLetter = "Please write at least 50 characters";
    setE2(e); if (Object.keys(e).length) focusInvalid(); return !Object.keys(e).length;
  };

  const validateStep3 = () => {
    const e: { file?: string } = {};
    if (!s3.file) e.file = "Please upload your CV";
    setE3(e); if (e.file) focusInvalid(); return !e.file;
  };

  const next = () => {
    setSubmitError("");
    if (step === 0 && !validateStep1()) return;
    if (step === 1 && !validateStep2()) return;
    if (step === 2 && !validateStep3()) return;
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 60000);
    setSubmitError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("firstName",      s1.firstName);
      fd.append("lastName",       s1.lastName);
      fd.append("email",          s1.email);
      fd.append("phone",          s1.phone);
      fd.append("city",           s1.city);
      fd.append("country",        s1.country);
      fd.append("linkedIn",       s1.linkedIn);
      fd.append("portfolio",      s1.portfolio);
      fd.append("position",       s2.position);
      fd.append("yearsExp",       s2.yearsExp);
      fd.append("currentRole",    s2.currentRole);
      fd.append("currentCompany", s2.currentCompany);
      fd.append("skills",         JSON.stringify(s2.skills));
      fd.append("coverLetter",    s2.coverLetter);
      fd.append("website",       ""); // honeypot field expected to remain empty
      fd.append("cv",             s3.file!);

      const res = await fetch("/api/careers/apply", { method: "POST", body: fd, signal: controller.signal });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(res.status === 429 ? "Too many attempts. Please wait before trying again." : "Unable to submit your application. Your details are still here; please try again or contact OSYSTIC.");
      if (!data?.applicationId) throw new Error("We could not confirm receipt. Please contact OSYSTIC before submitting again.");
      setAppId(data.applicationId);
      setStep(4);
    } catch (err) {
      if (controller.signal.aborted && !timedOut) return;
      setSubmitError(timedOut || err instanceof TypeError ? "We could not confirm receipt. Your details are still here. Please contact OSYSTIC before submitting again." : (err as Error).message || "Unable to submit. Please contact OSYSTIC.");
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      if (!controller.signal.aborted || timedOut) setSubmitting(false);
    }
  };

  return (
    <div ref={applicationRef} className="careers-application" style={{ fontFamily: FONT, background: "transparent" }}>
      <style suppressHydrationWarning>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .step-enter { animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both; }
        .skip { position:absolute;top:-999px;left:-999px;z-index:9999;padding:10px 22px;background:${BLU};color:#fff;font-size:13px;font-weight:600;border-radius:6px;text-decoration:none; }
        .skip:focus { top:16px;left:16px; }
        .skill-tag { padding:5px 12px; border:1.5px solid ${BORD}; border-radius:100px; font-size:12px; font-weight:500; color:${GRAY}; cursor:pointer; transition:all 0.15s; background:${WHT}; font-family:${FONT}; }
        .skill-tag.selected { background:${BLK}; border-color:${BLK}; color:${WHT}; font-weight:600; }
        .skill-tag:hover:not(.selected) { border-color:${BLU}; color:${BLU}; }
        .careers-two { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        @media(max-width:640px){ .careers-two { grid-template-columns:1fr !important; } }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>

      <a href="#main-content" className="skip">Skip to main content</a>

      {/* Header */}
      <div style={{ background: WHT, borderBottom: `1px solid ${BORD}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: GRAY_L }}>
            <Link href="/" style={{ color: GRAY_L, textDecoration: "none" }}
              onMouseEnter={e => e.currentTarget.style.color = GRAY}
              onMouseLeave={e => e.currentTarget.style.color = GRAY_L}>Home</Link>
            <ChevronRight size={10} strokeWidth={1.5}/>
            <span style={{ color: GRAY }}>Careers</span>
          </nav>
          {step < 4 && (
            <span style={{ fontSize: 12, color: GRAY_L, fontFamily: MONO }}>Step {step + 1} of 4</span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 32px" }}>

        {step < 4 && (
          <>
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: "clamp(26px,3.5vw,38px)", fontWeight: 800, letterSpacing: "-0.04em", color: BLK, margin: "0 0 8px", fontFamily: FONT }}>
                Application
              </h1>
              <p style={{ fontSize: 14, color: GRAY, margin: 0, fontFamily: FONT }}>
                We review every application personally. No automated filtering.
              </p>
            </div>
            <Steps current={step}/>
          </>
        )}

        {/* ── STEP 0: Personal ── */}
        {step === 0 && (
          <div className="step-enter" style={{ background: WHT, borderRadius: 20, padding: "36px", border: `1px solid ${BORD}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 tabIndex={-1} style={{ fontSize: 17, fontWeight: 700, color: BLK, margin: "0 0 24px", fontFamily: FONT }}>Personal information</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="careers-two">
                <Input id="firstName" label="First name" required placeholder="Alex"        value={s1.firstName} onChange={set1("firstName")} error={e1.firstName}/>
                <Input id="lastName"  label="Last name"  required placeholder="Johnson"     value={s1.lastName}  onChange={set1("lastName")}  error={e1.lastName}/>
              </div>
              <div className="careers-two">
                <Input id="email" label="Email" type="email" required placeholder="alex@email.com" value={s1.email} onChange={set1("email")} error={e1.email}/>
                <Input id="phone" label="Phone" type="tel"   required placeholder="+1 555 000 0000"   value={s1.phone} onChange={set1("phone")} error={e1.phone}/>
              </div>
              <div className="careers-two">
                <Input id="city"    label="City"    placeholder="Karachi"       value={s1.city}    onChange={set1("city")}/>
                <Input id="country" label="Country" required placeholder="Pakistan" value={s1.country} onChange={set1("country")} error={e1.country}/>
              </div>
              <div className="careers-two">
                <Input id="linkedIn"  label="LinkedIn"  placeholder="linkedin.com/in/..." value={s1.linkedIn}  onChange={set1("linkedIn")}  hint="optional"/>
                <Input id="portfolio" label="Portfolio" placeholder="github.com/..."      value={s1.portfolio} onChange={set1("portfolio")} hint="optional"/>
              </div>
            </div>
            <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={next}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 22px", background: BLK, color: WHT, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
                Continue <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Experience ── */}
        {step === 1 && (
          <div className="step-enter" style={{ background: WHT, borderRadius: 20, padding: "36px", border: `1px solid ${BORD}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 tabIndex={-1} style={{ fontSize: 17, fontWeight: 700, color: BLK, margin: "0 0 24px", fontFamily: FONT }}>Experience & role</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Position select */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label htmlFor="position" style={{ fontSize: 11, fontWeight: 700, color: BLK, fontFamily: FONT, letterSpacing: "0.04em" }}>
                  APPLYING FOR<span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>
                </label>
                <select aria-invalid={!!e2.position} aria-describedby={e2.position ? "position-error" : undefined} id="position" value={s2.position}
                  onChange={e => { set2("position")(e.target.value); }}
                  style={{ padding: "11px 14px", fontSize: 14, fontFamily: FONT, color: s2.position ? BLK : GRAY_L, background: WHT, border: `1.5px solid ${e2.position ? "#EF4444" : BORD}`, borderRadius: 10, outline: "none", cursor: "pointer" }}>
                  <option value="">Select a role</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                {e2.position && <span id="position-error" style={{ fontSize: 11, color: "#EF4444", fontFamily: FONT }}>{e2.position}</span>}
              </div>

              {/* Years experience */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: BLK, fontFamily: FONT, letterSpacing: "0.04em" }}>
                  YEARS OF EXPERIENCE<span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {EXP_OPTIONS.map(o => (
                    <button key={o.value} type="button"
                      aria-pressed={s2.yearsExp === o.value} data-invalid={!!e2.yearsExp} aria-describedby={e2.yearsExp ? "experience-error" : undefined} onClick={() => { set2("yearsExp")(o.value); }}
                      style={{ padding: "8px 16px", border: `1.5px solid ${s2.yearsExp === o.value ? BLK : BORD}`, borderRadius: 100, fontSize: 13, fontWeight: s2.yearsExp === o.value ? 700 : 400, background: s2.yearsExp === o.value ? BLK : WHT, color: s2.yearsExp === o.value ? WHT : BLK, cursor: "pointer", fontFamily: FONT, transition: "all 0.15s" }}>
                      {o.label}
                    </button>
                  ))}
                </div>
                {e2.yearsExp && <span id="experience-error" style={{ fontSize: 11, color: "#EF4444", fontFamily: FONT }}>{e2.yearsExp}</span>}
              </div>

              <div className="careers-two">
                <Input id="currentRole"    label="Current role"    placeholder="e.g. Senior Engineer" value={s2.currentRole}    onChange={set2("currentRole")}    hint="optional"/>
                <Input id="currentCompany" label="Current company" placeholder="e.g. Acme Corp"       value={s2.currentCompany} onChange={set2("currentCompany")} hint="optional"/>
              </div>

              {/* Skills */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: BLK, fontFamily: FONT, letterSpacing: "0.04em" }}>SKILLS</label>
                <p style={{ fontSize: 12, color: GRAY_L, margin: 0, fontFamily: FONT }}>Select all that apply</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SKILLS_LIST.map(s => (
                    <button key={s} type="button"
                      className={`skill-tag ${s2.skills.includes(s) ? "selected" : ""}`}
                      aria-pressed={s2.skills.includes(s)} onClick={() => toggleSkill(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cover letter */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <label htmlFor="coverLetter" style={{ fontSize: 11, fontWeight: 700, color: BLK, fontFamily: FONT, letterSpacing: "0.04em" }}>
                    COVER LETTER<span style={{ color: "#EF4444", marginLeft: 2 }}>*</span>
                  </label>
                  <span style={{ fontSize: 11, color: s2.coverLetter.length >= 50 ? "#16A34A" : GRAY_L, fontFamily: MONO }}>{s2.coverLetter.length} chars</span>
                </div>
                <textarea maxLength={8000} aria-invalid={!!e2.coverLetter} aria-describedby={e2.coverLetter ? "coverLetter-error" : undefined} id="coverLetter" value={s2.coverLetter}
                  placeholder="Tell us why you want to work at OSYSTIC, what you are proud of, and what you are looking to do next. Be specific — generic cover letters don't get far."
                  onChange={e => { set2("coverLetter")(e.target.value); }}
                  style={{ padding: "12px 14px", fontSize: 14, fontFamily: FONT, color: BLK, background: WHT, border: `1.5px solid ${e2.coverLetter ? "#EF4444" : BORD}`, borderRadius: 10, outline: "none", minHeight: 140, resize: "vertical", transition: "border-color 0.15s" }}
                  onFocus={e => e.currentTarget.style.borderColor = BLU}
                  onBlur={e => e.currentTarget.style.borderColor = e2.coverLetter ? "#EF4444" : BORD}/>
                {e2.coverLetter && <span id="coverLetter-error" style={{ fontSize: 11, color: "#EF4444", fontFamily: FONT, display: "flex", alignItems: "center", gap: 3 }}><AlertCircle size={10}/>{e2.coverLetter}</span>}
              </div>
            </div>

            <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between" }}>
              <button disabled={submitting} onClick={() => setStep(0)} style={{ fontSize: 13, color: GRAY, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 5 }}>
                <ChevronLeft size={13}/> Back
              </button>
              <button onClick={next}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 22px", background: BLK, color: WHT, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
                Continue <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: CV ── */}
        {step === 2 && (
          <div className="step-enter" style={{ background: WHT, borderRadius: 20, padding: "36px", border: `1px solid ${BORD}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 tabIndex={-1} style={{ fontSize: 17, fontWeight: 700, color: BLK, margin: "0 0 8px", fontFamily: FONT }}>Upload your CV</h2>
            <p style={{ fontSize: 13, color: GRAY_L, margin: "0 0 24px", fontFamily: FONT }}>PDF or Word document. Max 5 MB.</p>
            <CVDropzone file={s3.file} onFile={f => { setS3({ file: f }); setE3({}); }} error={e3.file}/>
            <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between" }}>
              <button disabled={submitting} onClick={() => setStep(1)} style={{ fontSize: 13, color: GRAY, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 5 }}>
                <ChevronLeft size={13}/> Back
              </button>
              <button onClick={next}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 22px", background: BLK, color: WHT, border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer" }}>
                Review application <ArrowRight size={13}/>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <div className="step-enter">
            <div style={{ background: WHT, borderRadius: 20, padding: "36px", border: `1px solid ${BORD}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 16 }}>
              <h2 tabIndex={-1} style={{ fontSize: 17, fontWeight: 700, color: BLK, margin: "0 0 24px", fontFamily: FONT }}>Review your application</h2>

              {/* Personal */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_L, margin: 0, fontFamily: FONT, letterSpacing: "0.06em" }}>PERSONAL</p>
                  <button disabled={submitting} onClick={() => setStep(0)} style={{ fontSize: 11, color: BLU, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>Edit</button>
                </div>
                <div className="careers-review-grid">
                  {[["Name", `${s1.firstName} ${s1.lastName}`],["Email", s1.email],["Phone", s1.phone],["Location", `${s1.city ? s1.city + ", " : ""}${s1.country}`]].map(([k,v]) => (
                    <div key={k}>
                      <p style={{ fontSize: 11, color: GRAY_L, margin: "0 0 2px", fontFamily: FONT }}>{k}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: BLK, margin: 0, fontFamily: FONT }}>{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: 1, background: BORD, margin: "20px 0" }}/>

              {/* Experience */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_L, margin: 0, fontFamily: FONT, letterSpacing: "0.06em" }}>EXPERIENCE</p>
                  <button disabled={submitting} onClick={() => setStep(1)} style={{ fontSize: 11, color: BLU, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>Edit</button>
                </div>
                <div className="careers-review-grid" style={{ marginBottom: 12 }}>
                  {[["Position", s2.position],["Experience", EXP_OPTIONS.find(o => o.value === s2.yearsExp)?.label || s2.yearsExp]].map(([k,v]) => (
                    <div key={k}>
                      <p style={{ fontSize: 11, color: GRAY_L, margin: "0 0 2px", fontFamily: FONT }}>{k}</p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: BLK, margin: 0, fontFamily: FONT }}>{v}</p>
                    </div>
                  ))}
                </div>
                {s2.skills.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s2.skills.map(s => (
                      <span key={s} style={{ padding: "3px 10px", background: PANEL, border: `1px solid ${BORD}`, borderRadius: 100, fontSize: 11, color: GRAY, fontFamily: FONT }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ height: 1, background: BORD, margin: "20px 0" }}/>

              {/* CV */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_L, margin: 0, fontFamily: FONT, letterSpacing: "0.06em" }}>CV</p>
                  <button disabled={submitting} onClick={() => setStep(2)} style={{ fontSize: 11, color: BLU, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>Change</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <FileText size={14} color={GRAY}/>
                  <span style={{ fontSize: 13, color: BLK, fontFamily: FONT }}>{s3.file?.name}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: GRAY_L, margin: "0 0 20px", fontFamily: FONT, lineHeight: 1.65, textAlign: "center" }}>
              By submitting, you confirm that all information provided is accurate.
              Your data is stored securely and only used for recruitment purposes.
            </p>
            <div className="career-submit-feedback" aria-live="polite" aria-atomic="true">
            {submitError ? (
              <div role="alert" style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, marginBottom: 16, fontSize: 13, color: "#DC2626", fontFamily: FONT }}>
                <AlertCircle size={14}/> {submitError}
              </div>
            ) : submitting ? <span className="sr-only">Submitting your application…</span> : null}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button disabled={submitting} onClick={() => setStep(2)} style={{ fontSize: 13, color: GRAY, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, display: "flex", alignItems: "center", gap: 5 }}>
                <ChevronLeft size={13}/> Back
              </button>
              <button disabled={submitting} onClick={handleSubmit}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 46, padding: "0 28px", background: submitting ? GRAY_L : BLU, color: WHT, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: FONT, cursor: submitting ? "not-allowed" : "pointer", transition: "background 0.15s", boxShadow: submitting ? "none" : `0 4px 16px rgba(37,99,235,0.30)` }}>
                {submitting ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }}/> Submitting…</> : <>Submit application <Check size={14}/></>}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <div className="step-enter" style={{ maxWidth: 480, margin: "0 auto", textAlign: "center", padding: "48px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Check size={28} color="#16A34A" strokeWidth={2.5}/>
            </div>
            <h2 tabIndex={-1} style={{ fontSize: 26, fontWeight: 800, color: BLK, margin: "0 0 12px", fontFamily: FONT, letterSpacing: "-0.04em" }}>
              Application submitted!
            </h2>
            <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.75, margin: "0 0 12px", fontFamily: FONT }}>
              Thank you, <strong style={{ color: BLK }}>{s1.firstName}</strong>. We have received your application for <strong style={{ color: BLK }}>{s2.position}</strong>.
            </p>
            <p style={{ fontSize: 14, color: GRAY_L, lineHeight: 1.7, margin: "0 0 36px", fontFamily: FONT }}>
              We review every application personally and will be in touch within five business days. Check your email for a confirmation.
            </p>
            {appId && <p style={{ fontSize: 11, color: GRAY_L, fontFamily: MONO, margin: "0 0 36px" }}>Reference: {appId}</p>}
            <Link href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 44, padding: "0 22px", background: BLK, color: WHT, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: FONT }}>
              Back to home <ArrowRight size={13}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
