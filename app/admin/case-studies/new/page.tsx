"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, LockKeyhole, Sparkles } from "lucide-react";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    const controller = new AbortController();
    requestRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 5 * 60 * 1000);

    try {
      const response = await fetch("/api/admin/case-studies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ github_url: url }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(data?.error || "Repository import failed.");
      if (!data?.study?.id) throw new Error("Repository import completed without a review record.");
      router.push(`/admin/case-studies/${data.study.id}`);
    } catch (err) {
      if (controller.signal.aborted) setError("Import timed out. Please try again.");
      else setError(err instanceof Error ? err.message : "Repository import failed.");
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <Link href="/admin/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"><ArrowLeft size={14} /> Back to case studies</Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-1"><Sparkles size={22} className="text-violet-600" /><h1 className="text-2xl font-bold text-gray-900">Import Completed Public Case Study</h1></div>
        <p className="text-sm text-gray-500 mb-6">Only completed, sanitized OSYSTIC public showcase repositories are accepted. The full private project repository is never used by this publication pipeline.</p>

        <div className="grid gap-2 mb-8 text-sm text-gray-700">
          <div className="flex items-center gap-2"><LockKeyhole size={15} className="text-gray-500" /> Private/ongoing repositories are rejected.</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" /> Public showcase manifest, case-study.md, README and visual evidence are validated.</div>
          <div className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" /> Duplicate, safety and quality gates run before website publishing can be approved.</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">Public GitHub Case-Study URL *</label>
            <input id="github_url" type="url" required value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://github.com/osystic/project-name-Case-Study" disabled={loading} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition disabled:bg-gray-50" />
          </div>

          {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}

          <button type="submit" disabled={loading} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Validating repository and preparing review draft…</> : "Validate & Import Case Study"}
          </button>
        </form>
      </div>
    </div>
  );
}
