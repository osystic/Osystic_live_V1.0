"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");
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
        body: JSON.stringify({ github_url: url, project_description: desc || undefined }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(data?.error || "Generation failed. Please try again.");
      if (!data?.study?.id) throw new Error("Generation failed. Please try again.");
      router.push(`/admin/case-studies/${data.study.id}`);
    } catch (err) {
      if (controller.signal.aborted) {
        setError("Generation timed out. Please try again with a smaller repository.");
      } else {
        setError(err instanceof Error ? err.message : "Generation failed. Please try again.");
      }
    } finally {
      window.clearTimeout(timeout);
      requestRef.current = null;
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl">
      <Link
        href="/admin/case-studies"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
      >
        <ArrowLeft size={14} /> Back to case studies
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={22} className="text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">AI Case Study Generator</h1>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          Enter a public GitHub repository URL. The repository is analyzed, then AI writes a structured
          case study you can edit and publish.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Repository URL *
            </label>
            <input
              id="github_url"
              type="text"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition disabled:bg-gray-50"
            />
          </div>

          <div>
            <label htmlFor="project_description" className="block text-sm font-medium text-gray-700 mb-1">
              Project Description (optional)
            </label>
            <textarea
              id="project_description"
              value={desc}
              onChange={(event) => setDesc(event.target.value)}
              placeholder="Any specific details you want the case study to include…"
              rows={4}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition resize-none disabled:bg-gray-50"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing repository &amp; generating with AI… (up to 2 minutes)
              </>
            ) : (
              "Generate Case Study"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
