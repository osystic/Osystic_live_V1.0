"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

const initialState = {
  name: "",
  email: "",
  company: "",
  projectType: "",
  budget: "",
  timeline: "",
  message: "",
  website: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const requestRef = useRef<AbortController | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => () => { requestRef.current?.abort(); }, []);

  const update = (key: keyof typeof initialState, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 30000);
    setStatus("sending");
    setMessage("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(response.status === 429 ? "Too many attempts. Please wait a few minutes before trying again." : "Unable to submit your inquiry. Your details are still here; please try again or email hello@osystic.com.");
      if (!data?.success) throw new Error("We could not confirm receipt. Please email hello@osystic.com before submitting again.");
      setStatus("success");
      setMessage("Thanks. Your project inquiry has been received. We will review the technical context and respond by email.");
      setForm(initialState);
    } catch (error) {
      if (controller.signal.aborted && !timedOut) return;
      setStatus("error");
      setMessage(timedOut || error instanceof TypeError
        ? "We could not confirm receipt. Your details are still here. Please email hello@osystic.com before submitting again."
        : error instanceof Error ? error.message : "Unable to submit your inquiry. Please email hello@osystic.com.");
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      if (!controller.signal.aborted || timedOut) requestAnimationFrame(() => statusRef.current?.focus({ preventScroll: true }));
    }
  }

  return (
    <form className="form-card" onSubmit={submit} aria-busy={status === "sending"}>
      <fieldset className="form-fields" disabled={status === "sending"}><legend className="sr-only">Project inquiry</legend>
      <div className="form-grid">
        <div className="form-field"><label htmlFor="name">Full name *</label><input id="name" minLength={2} maxLength={100} className="input" autoComplete="name" value={form.name} onChange={e => update("name", e.target.value)} required /></div>
        <div className="form-field"><label htmlFor="email">Work email *</label><input id="email" maxLength={200} className="input" type="email" autoComplete="email" value={form.email} onChange={e => update("email", e.target.value)} required /></div>
        <div className="form-field"><label htmlFor="company">Company</label><input id="company" maxLength={160} className="input" autoComplete="organization" value={form.company} onChange={e => update("company", e.target.value)} /></div>
        <div className="form-field"><label htmlFor="projectType">Project type</label><select id="projectType" className="select" value={form.projectType} onChange={e => update("projectType", e.target.value)}><option value="">Select</option><option>AI Systems</option><option>Product Engineering</option><option>Data & Cloud</option><option>System Modernization</option><option>Technical Consulting</option><option>Other</option></select></div>
        <div className="form-field"><label htmlFor="budget">Budget range</label><select id="budget" className="select" value={form.budget} onChange={e => update("budget", e.target.value)}><option value="">Select</option><option>Under $10k</option><option>$10k - $25k</option><option>$25k - $50k</option><option>$50k - $100k</option><option>$100k+</option><option>Not defined yet</option></select></div>
        <div className="form-field"><label htmlFor="timeline">Timeline</label><select id="timeline" className="select" value={form.timeline} onChange={e => update("timeline", e.target.value)}><option value="">Select</option><option>Immediately</option><option>1 - 2 months</option><option>3 - 6 months</option><option>6+ months</option><option>Exploring options</option></select></div>
        <div className="form-field form-field-full"><label htmlFor="message">Project details *</label><textarea id="message" className="textarea" minLength={20} maxLength={5000} placeholder="What are you building? Include the current system, users, data, integrations, constraints, and what success should look like." value={form.message} onChange={e => update("message", e.target.value)} required /></div>
        <div className="sr-only" aria-hidden="true"><label htmlFor="website">Website</label><input id="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e => update("website", e.target.value)} /></div>
      </div>
      </fieldset>
      <button className="button button-primary" type="submit" disabled={status === "sending"} style={{ marginTop:20 }}>
        {status === "sending" ? <><Loader2 size={16} className="animate-spin" /> Sending</> : <>Submit Project Inquiry <ArrowRight size={16}/></>}
      </button>
      <div className="form-status-space"><p ref={statusRef} tabIndex={-1} className={message ? `form-message ${status === "success" ? "success" : "error"}` : "sr-only"} role="status" aria-live="polite" aria-atomic="true">{status === "sending" ? "Sending your inquiry…" : message}</p></div>
    </form>
  );
}
