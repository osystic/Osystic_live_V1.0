"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Plus, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";

type AiStudyItem = {
  id: string;
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
  analysis: string | null;
  publishedId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type AutomationMeta = {
  workflowStatus?: string;
  projectKey?: string;
  quality?: { score?: number };
  safety?: { passed?: boolean };
};

function automationFor(value: string | null): AutomationMeta | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { automation?: AutomationMeta };
    return parsed.automation ?? null;
  } catch {
    return null;
  }
}

function statusLabel(value?: string) {
  return (value || "legacy draft").replaceAll("_", " ");
}

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const [items, setItems] = useState<AiStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/case-studies", { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load case studies");
      setItems(data.items ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load case studies");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() updates state asynchronously.
    load();
  }, [load]);

  const counts = useMemo(() => {
    let published = 0;
    let updates = 0;
    let blocked = 0;
    for (const item of items) {
      const status = automationFor(item.analysis)?.workflowStatus;
      if (item.publishedId) published += 1;
      if (status === "update_available") updates += 1;
      if (status === "blocked" || status === "not_eligible" || status === "fact_check_required") blocked += 1;
    }
    return { published, updates, blocked };
  }, [items]);

  const scan = async () => {
    if (scanning) return;
    setScanning(true);
    setMessage("");
    setSuccess("");
    try {
      const response = await fetch("/api/admin/case-studies/scan", { method: "POST" });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "GitHub scan failed");
      setSuccess(`GitHub scan complete: ${data.discovered ?? 0} public case-study repos found, ${data.processed ?? 0} processed.`);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "GitHub scan failed");
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2">
            <ArrowLeft size={14} /> Modules
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-violet-600" /> Case Study Publishing
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-3xl">
            Public OSYSTIC <code>*-Case-Study</code> repositories are the publication source. Private project repositories are never imported. Every website update remains review-gated.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={scan}
            disabled={scanning}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-800 text-sm font-medium rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {scanning ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Scan GitHub Now
          </button>
          <Link href="/admin/case-studies/new" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            <Plus size={16} /> Import Public Repo
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase tracking-wide text-gray-500">Published</span><b className="block text-2xl text-gray-900 mt-1">{counts.published}</b></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase tracking-wide text-gray-500">Updates waiting</span><b className="block text-2xl text-gray-900 mt-1">{counts.updates}</b></div>
        <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase tracking-wide text-gray-500">Needs attention</span><b className="block text-2xl text-gray-900 mt-1">{counts.blocked}</b></div>
      </div>

      {message && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{message}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">{success}</div>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm"><Loader2 size={16} className="animate-spin" /> Loading case studies…</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No publication records yet</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">Scan GitHub or import a completed public OSYSTIC case-study repository.</p>
          <button onClick={scan} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg"><RefreshCw size={16} /> Scan public case studies</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => {
            const automation = automationFor(item.analysis);
            const status = automation?.workflowStatus || (item.publishedId ? "published" : "legacy draft");
            return (
              <Link key={item.id} href={`/admin/case-studies/${item.id}`} className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 hover:bg-gray-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-900 truncate">{item.projectTitle || "Untitled project"}</span>
                    {item.publishedId && <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Published</span>}
                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-50 text-gray-600 border border-gray-200">{statusLabel(status)}</span>
                  </div>
                  <span className="text-xs text-blue-600 truncate block mt-1">{item.githubUrl}</span>
                  {automation?.projectKey ? <span className="text-xs text-gray-400 block mt-1">Project key: {automation.projectKey}</span> : null}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                  {automation?.safety?.passed ? <span className="inline-flex items-center gap-1 text-emerald-700"><ShieldCheck size={14} /> safety pass</span> : null}
                  {typeof automation?.quality?.score === "number" ? <span>quality {automation.quality.score}%</span> : null}
                  <span>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ""}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
