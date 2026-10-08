"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Loader2, Plus, Sparkles } from "lucide-react";

type AiStudyItem = {
  id: string;
  githubUrl: string;
  projectTitle: string | null;
  generatedContent: string;
  publishedId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function AdminCaseStudiesPage() {
  const router = useRouter();
  const [items, setItems] = useState<AiStudyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state via async callbacks, not synchronously
    load();
  }, [load]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-2"
          >
            <ArrowLeft size={14} /> Modules
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles size={22} className="text-violet-600" /> Case Studies Generate
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate professional case studies from public GitHub repositories using AI.
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus size={16} /> New Case Study
        </Link>
      </div>

      {message && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-gray-500 text-sm">
          <Loader2 size={16} className="animate-spin" /> Loading case studies…
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-3" />
          <h2 className="text-lg font-semibold text-gray-900">No case studies yet</h2>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Paste a GitHub repository URL and let AI write the case study for you.
          </p>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={16} /> Generate your first case study
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/case-studies/${item.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {item.projectTitle || "Untitled project"}
                  </span>
                  {item.publishedId && (
                    <span className="text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Published
                    </span>
                  )}
                </div>
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline truncate block mt-0.5"
                >
                  {item.githubUrl}
                </a>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-gray-500">
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : ""}
                </div>
                <span className="text-xs text-gray-400">
                  {item.generatedContent.length.toLocaleString()} chars
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
