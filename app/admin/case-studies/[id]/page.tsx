"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { marked } from "marked";
import {
  ArrowLeft, ExternalLink, Eye, Loader2, Pencil, RefreshCw, Save, Sparkles, X,
} from "lucide-react";
import { sanitizePublishedHtml } from "@/lib/content-security";

type AiStudy = {
  id: string;
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
  publishedId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

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

  const [regenerating, setRegenerating] = useState(false);
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);

  const [publishing, setPublishing] = useState(false);

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
      setEditContent(data.study.generated_content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load case study");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state via async callbacks, not synchronously
    load();
  }, [load]);

  const renderedHtml = useMemo(() => {
    if (!study) return "";
    try {
      const html = marked.parse(study.generatedContent, { async: false, gfm: true, breaks: false }) as string;
      return sanitizePublishedHtml(html);
    } catch {
      return "";
    }
  }, [study]);

  const handleSave = async () => {
    if (saving) return;
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
      setMessage("Changes saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setShowRegenerateModal(false);
    setRegenerating(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/case-studies/${id}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "AI regeneration failed");
      setStudy(data.study);
      setEditContent(data.study.generated_content);
      setIsEditing(false);
      setMessage("Case study regenerated with AI.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI regeneration failed");
    } finally {
      setRegenerating(false);
    }
  };

  const handlePublishToggle = async () => {
    if (publishing) return;
    setPublishing(true);
    setError("");
    setMessage("");
    try {
      const unpublishing = Boolean(study?.publishedId);
      const response = await fetch(`/api/admin/case-studies/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(unpublishing ? { action: "unpublish" } : {}),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to update publish state");
      if (unpublishing) {
        setStudy(study ? { ...study, publishedId: null } : study);
        setMessage("Case study unpublished (moved to draft).");
      } else {
        setStudy(study ? { ...study, publishedId: data.slug } : study);
        setMessage("Case study published to the public site.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update publish state");
    } finally {
      setPublishing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-sm gap-2">
        <Loader2 size={16} className="animate-spin" /> Loading case study…
      </div>
    );
  }

  if (!study) {
    return (
      <div className="p-6 max-w-3xl">
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error || "Case study not found."}
        </div>
        <Link href="/admin/case-studies" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mt-4">
          <ArrowLeft size={14} /> Back to case studies
        </Link>
      </div>
    );
  }

  const isPublished = Boolean(study.publishedId);

  return (
    <div className="p-6 space-y-4">
      <Link
        href="/admin/case-studies"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft size={14} /> Back to case studies
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-gray-900">{study.projectTitle || "Case Study"}</h1>
            {isPublished && (
              <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                Published
              </span>
            )}
          </div>
          <a
            href={study.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1 break-all"
          >
            {study.githubUrl} <ExternalLink size={12} />
          </a>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setEditContent(study.generatedContent);
              setError("");
              setMessage("");
            }}
            disabled={regenerating || publishing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {isEditing ? <X size={14} /> : <Pencil size={14} />}
            {isEditing ? "Cancel" : "Edit"}
          </button>
          <button
            onClick={() => setShowRegenerateModal(true)}
            disabled={regenerating || isEditing || publishing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {regenerating ? (
              <><Loader2 size={14} className="animate-spin" /> Generating…</>
            ) : (
              <><RefreshCw size={14} /> Regenerate</>
            )}
          </button>
          <button
            onClick={handlePublishToggle}
            disabled={publishing || regenerating}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
              isPublished
                ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {publishing ? (
              <><Loader2 size={14} className="animate-spin" /> Saving…</>
            ) : isPublished ? (
              "Unpublish"
            ) : (
              <><Eye size={14} /> Publish</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}
      {message && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 px-4 py-3 rounded text-sm">{message}</div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editContent}
              onChange={(event) => setEditContent(event.target.value)}
              className="w-full h-[560px] p-4 border border-gray-300 rounded-lg font-mono text-sm text-gray-800 focus:ring-2 focus:ring-violet-500 outline-none resize-y"
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:bg-gray-400"
            >
              {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        ) : (
          <article
            className="admin-markdown"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        )}
      </div>

      {showRegenerateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-violet-600" />
              <h3 className="text-lg font-bold text-gray-900">Regenerate content?</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              This will overwrite the current case study with a new AI generation. Any manual edits will be lost.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRegenerateModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition text-sm font-medium"
              >
                Yes, Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
