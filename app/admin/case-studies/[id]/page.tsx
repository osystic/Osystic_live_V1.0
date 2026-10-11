"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Eye,
  GitBranch,
  History,
  Loader2,
  Pencil,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type StructuredSummary = {
  title?: string;
  executiveSummary?: string;
  challenge?: string;
  solution?: string;
  engineeringHighlights?: string[];
  technologies?: string[];
  outcomes?: string[];
};

type AutomationMeta = {
  projectKey?: string;
  canonicalSlug?: string;
  headSha?: string;
  lastAnalyzedSha?: string | null;
  lastPublishedSha?: string | null;
  workflowStatus?: string;
  legacyManifest?: boolean;
  eligibility?: { eligible?: boolean; reasons?: string[]; warnings?: string[] };
  quality?: { passed?: boolean; score?: number; issues?: string[] };
  safety?: { passed?: boolean; issues?: string[]; warnings?: string[] };
  summary?: StructuredSummary | null;
  pendingSummary?: StructuredSummary | null;
  manualEdited?: boolean;
  generationMode?: string;
  generationWarning?: string | null;
};

type AiStudy = {
  id: string;
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
  analysis: string | null;
  publishedId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

type HistoryEntry = {
  savedAt: string;
  reason: string;
  sourceSha: string | null;
  generatedContent: string;
  summary: StructuredSummary | null;
};

type ParsedAnalysis = {
  automation?: AutomationMeta;
  history?: HistoryEntry[];
};

function analysisFor(value: string | null): ParsedAnalysis {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as ParsedAnalysis;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function statusLabel(value?: string) {
  return (value || "legacy draft").replaceAll("_", " ");
}

function SummaryPreview({ summary }: { summary: StructuredSummary }) {
  return (
    <div className="space-y-4 text-sm text-gray-700">
      {summary.executiveSummary ? <div><b className="text-gray-900">Executive summary</b><p className="mt-1">{summary.executiveSummary}</p></div> : null}
      {summary.challenge ? <div><b className="text-gray-900">Challenge</b><p className="mt-1">{summary.challenge}</p></div> : null}
      {summary.solution ? <div><b className="text-gray-900">Solution</b><p className="mt-1">{summary.solution}</p></div> : null}
      {summary.engineeringHighlights?.length ? <div><b className="text-gray-900">Engineering highlights</b><ul className="list-disc pl-5 mt-1 space-y-1">{summary.engineeringHighlights.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
      {summary.outcomes?.length ? <div><b className="text-gray-900">Outcomes</b><ul className="list-disc pl-5 mt-1 space-y-1">{summary.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
    </div>
  );
}

export default function AdminCaseStudyDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [study, setStudy] = useState<AiStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, { cache: "no-store" });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load case study");
      setStudy(data.study);
      setEditContent(data.study.generatedContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case study");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() updates state asynchronously.
    load();
  }, [load]);

  const parsedAnalysis = useMemo(() => analysisFor(study?.analysis ?? null), [study?.analysis]);
  const automation = parsedAnalysis.automation ?? null;
  const history = parsedAnalysis.history ?? [];
  const save = async () => {
    if (!study || saving) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generated_content: editContent }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save changes");
      setStudy(data.study);
      setIsEditing(false);
      setMessage("Manual edits saved. Future GitHub refreshes will not overwrite them without explicit approval.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const refresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}/regenerate`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "GitHub refresh failed");
      if (data.study) {
        setStudy(data.study);
        setEditContent(data.study.generatedContent);
      }
      setMessage(data.action === "update_available"
        ? "GitHub changes were detected. Existing manual content was preserved and the suggested update is waiting below."
        : "Public GitHub evidence revalidated and the review draft was refreshed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "GitHub refresh failed");
    } finally {
      setRefreshing(false);
    }
  };

  const applyPending = async () => {
    if (applying) return;
    setApplying(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}/apply-update`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to apply update");
      setStudy(data.study);
      setEditContent(data.study.generatedContent);
      setMessage("Suggested GitHub update applied to the draft. Review it before publishing.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to apply update");
    } finally {
      setApplying(false);
    }
  };

  const restoreVersion = async (savedAt: string) => {
    if (restoring || refreshing || publishing || isEditing) return;
    setRestoring(savedAt);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}/rollback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedAt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to restore history version");
      setStudy(data.study);
      setEditContent(data.study.generatedContent);
      setMessage("Previous version restored to the review draft. Publish explicitly when you are ready to update the live page.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to restore history version");
    } finally {
      setRestoring(null);
    }
  };

  const publishToggle = async () => {
    if (!study || publishing) return;
    setPublishing(true);
    setError("");
    setMessage("");
    try {
      const unpublishing = Boolean(study.publishedId) && automation?.workflowStatus === "published";
      const response = await fetch(`/api/admin/case-studies/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unpublishing ? { action: "unpublish" } : {}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update publish state");
      setMessage(unpublishing ? "Case study moved back to draft." : "Case study published using the canonical website page.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update publish state");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-sm gap-2"><Loader2 size={16} className="animate-spin" /> Loading case study…</div>;
  if (!study) return <div className="p-6 max-w-3xl"><div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error || "Case study not found."}</div></div>;

  const status = automation?.workflowStatus || (study.publishedId ? "published" : "legacy draft");
  const isPublished = status === "published" && Boolean(study.publishedId);
  const issues = [
    ...(automation?.eligibility?.reasons || []),
    ...(automation?.safety?.issues || []),
    ...(automation?.quality?.issues || []),
  ];
  const warnings = [
    ...(automation?.eligibility?.warnings || []),
    ...(automation?.safety?.warnings || []),
    ...(automation?.generationWarning ? [automation.generationWarning] : []),
  ];

  return (
    <div className="p-6 space-y-5">
      <Link href="/admin/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"><ArrowLeft size={14} /> Back to case studies</Link>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{study.projectTitle || "Case Study"}</h1>
            <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">{statusLabel(status)}</span>
            {isPublished ? <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Live</span> : null}
          </div>
          <a href={study.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1 break-all">{study.githubUrl} <ExternalLink size={12} /></a>
          {automation?.projectKey ? <div className="text-xs text-gray-400 mt-1">Project key: {automation.projectKey} · Canonical slug: {automation.canonicalSlug}</div> : null}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button onClick={() => { setIsEditing(!isEditing); setEditContent(study.generatedContent); setError(""); setMessage(""); }} disabled={refreshing || publishing} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition disabled:opacity-50">{isEditing ? <X size={14} /> : <Pencil size={14} />}{isEditing ? "Cancel" : "Edit"}</button>
          <button onClick={refresh} disabled={refreshing || isEditing || publishing} className="inline-flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50">{refreshing ? <><Loader2 size={14} className="animate-spin" /> Refreshing…</> : <><RefreshCw size={14} /> Refresh from GitHub</>}</button>
          <button onClick={publishToggle} disabled={publishing || refreshing || isEditing} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${isPublished ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "bg-emerald-600 hover:bg-emerald-700 text-white"}`}>{publishing ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : isPublished ? "Unpublish" : <><Eye size={14} /> Publish</>}</button>
        </div>
      </div>

      {error && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">{error}</div>}
      {message && <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded text-sm">{message}</div>}

      {automation ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase text-gray-500">Eligibility</span><b className={`mt-1 flex items-center gap-1 ${automation.eligibility?.eligible ? "text-emerald-700" : "text-red-700"}`}>{automation.eligibility?.eligible ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}{automation.eligibility?.eligible ? "Pass" : "Blocked"}</b></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase text-gray-500">Safety</span><b className={`mt-1 flex items-center gap-1 ${automation.safety?.passed ? "text-emerald-700" : "text-red-700"}`}>{automation.safety?.passed ? <ShieldCheck size={15} /> : <AlertTriangle size={15} />}{automation.safety?.passed ? "Pass" : "Review"}</b></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase text-gray-500">Quality</span><b className="block text-gray-900 mt-1">{automation.quality?.score ?? 0}%</b></div>
          <div className="bg-white border border-gray-200 rounded-xl p-4"><span className="text-xs uppercase text-gray-500">Source</span><b className="mt-1 flex items-center gap-1 text-gray-900"><GitBranch size={14} /> {automation.lastAnalyzedSha?.slice(0, 8) || automation.headSha?.slice(0, 8) || "pending"}</b></div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">Legacy draft detected. Refresh from GitHub to run the new completion, duplicate, safety and quality gates before publishing.</div>
      )}

      {issues.length ? <div className="bg-red-50 border border-red-200 rounded-xl p-4"><b className="text-sm text-red-800">Publishing issues</b><ul className="list-disc pl-5 mt-2 text-sm text-red-700 space-y-1">{issues.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
      {warnings.length ? <div className="bg-amber-50 border border-amber-200 rounded-xl p-4"><b className="text-sm text-amber-800">Review notes</b><ul className="list-disc pl-5 mt-2 text-sm text-amber-700 space-y-1">{warnings.map((item) => <li key={item}>{item}</li>)}</ul></div> : null}

      {automation?.pendingSummary ? (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div><b className="text-blue-950">GitHub update waiting for approval</b><p className="text-sm text-blue-800 mt-1">Your manual website edits are still intact. Review this refreshed summary before replacing the draft.</p></div>
            <button onClick={applyPending} disabled={applying} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 disabled:opacity-50">{applying ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Apply Suggested Update</button>
          </div>
          <SummaryPreview summary={automation.pendingSummary} />
        </div>
      ) : null}

      {history.length ? (
        <section className="bg-white border border-gray-200 rounded-xl p-5" aria-labelledby="case-study-history-title">
          <div className="flex items-center gap-2 mb-4">
            <History size={17} className="text-gray-600" />
            <div>
              <h2 id="case-study-history-title" className="font-semibold text-gray-900">Version history</h2>
              <p className="text-xs text-gray-500 mt-0.5">Restoring creates a review draft only. The live page changes only after an explicit Publish action.</p>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {history.slice(0, 10).map((entry) => (
              <div key={`${entry.savedAt}-${entry.reason}`} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900">{entry.reason.replaceAll("-", " ")}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{new Date(entry.savedAt).toLocaleString()} {entry.sourceSha ? `· source ${entry.sourceSha.slice(0, 8)}` : ""}</div>
                </div>
                <button
                  onClick={() => restoreVersion(entry.savedAt)}
                  disabled={Boolean(restoring) || refreshing || publishing || isEditing}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium disabled:opacity-50"
                >
                  {restoring === entry.savedAt ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                  Restore to review draft
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
        {isEditing ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3 rounded-lg">Manual edits are protected. Automated GitHub refreshes will create a suggested update instead of overwriting this content.</div>
            <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} className="w-full h-[560px] p-4 border border-gray-300 rounded-lg font-mono text-sm text-gray-800 focus:ring-2 focus:ring-violet-500 outline-none resize-y" />
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Save Review Draft</button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-5"><Sparkles size={18} className="text-violet-600" /><h2 className="font-semibold text-gray-900">Website executive case study</h2></div>
            {automation?.summary ? (
              <SummaryPreview summary={automation.summary} />
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm leading-7 text-gray-700">{study.generatedContent}</pre>
            )}
          </>
        )}
      </div>
    </div>
  );
}
