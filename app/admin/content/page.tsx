"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit3, LogOut, RefreshCw, Save, Trash2 } from "lucide-react";

type Kind = "blog" | "case-study" | "news";
type Status = "draft" | "published" | "archived";

type ContentItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  author?: string | null;
  category?: string | null;
  featuredImage?: string | null;
  status?: Status | null;
  tags?: string[] | null;
  client?: string | null;
  challenge?: string | null;
  solution?: string | null;
  results?: string[] | null;
  technologies?: string[] | null;
  updatedAt?: string | null;
};

const empty = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "OSYSTIC",
  category: "Engineering",
  featuredImage: "",
  status: "draft" as Status,
  tags: "",
  client: "Confidential",
  challenge: "",
  solution: "",
  results: "",
  technologies: "",
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function lines(value: string) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

export default function AdminContentPage() {
  const router = useRouter();
  const [kind, setKind] = useState<Kind>("blog");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [editing, setEditing] = useState<ContentItem | null>(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const label = useMemo(() => kind === "blog" ? "Insights" : kind === "case-study" ? "Case Studies" : "Newsroom", [kind]);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/content?kind=${kind}`, { cache: "no-store" });
      if (response.status === 401) { router.replace("/admin/login"); return; }
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load content");
      setItems(data.items ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load content");
    } finally {
      setLoading(false);
    }
  }, [kind, router]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- load() sets state via async callbacks, not synchronously
  useEffect(() => { load(); }, [load]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return items.slice(start, start + PAGE_SIZE);
  }, [items, page]);

  function reset() {
    setEditing(null);
    setForm(empty);
    setMessage("");
  }

  function edit(item: ContentItem) {
    setEditing(item);
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? "",
      content: item.content ?? "",
      author: item.author ?? "OSYSTIC",
      category: item.category ?? "Engineering",
      featuredImage: item.featuredImage ?? "",
      status: item.status ?? "draft",
      tags: (item.tags ?? []).join(", "),
      client: item.client ?? "Confidential",
      challenge: item.challenge ?? "",
      solution: item.solution ?? "",
      results: (item.results ?? []).join("\n"),
      technologies: (item.technologies ?? []).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        ...(editing ? { id: editing.id } : {}),
        kind,
        ...form,
        slug: form.slug || slugify(form.title),
        tags: lines(form.tags),
        results: lines(form.results),
        technologies: lines(form.technologies),
      };
      const response = await fetch("/api/admin/content", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save content");
      setMessage(editing ? "Content updated." : "Content created.");
      reset();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save content");
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: ContentItem) {
    if (deleting) return;
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setDeleting(item.id);
    try {
      const response = await fetch(`/api/admin/content?kind=${kind}&id=${item.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) { setMessage(data.error || "Unable to delete content"); return; }
      await load();
    } finally {
      setDeleting(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main id="main-content" className="admin-shell">
      <div className="admin-topbar">
        <div>
          <strong>OSYSTIC</strong>
          <span>Content Administration</span>
        </div>
        <Link className="admin-quiet-button" href="/admin/careers">Careers inbox</Link>
        <button className="admin-quiet-button" onClick={logout}><LogOut size={15}/> Sign out</button>
      </div>

      <div className="admin-container">
        <div className="admin-heading-row">
          <div><div className="eyebrow">Internal</div><h1>Content Management</h1><p>Publish only verified OSYSTIC work, insights, and company news.</p></div>
          <button className="admin-quiet-button" onClick={load}><RefreshCw size={15}/> Refresh</button>
        </div>

        <div className="admin-tabs" role="tablist" aria-label="Content type">
          {(["blog", "case-study", "news"] as Kind[]).map((tab) => (
            <button key={tab} role="tab" aria-selected={kind === tab} className={kind === tab ? "active" : ""} onClick={() => { setKind(tab); reset(); setPage(1); }}>
              {tab === "blog" ? "Insights" : tab === "case-study" ? "Case Studies" : "Newsroom"}
            </button>
          ))}
        </div>

        <div className="admin-grid">
          <form className="admin-card admin-editor" onSubmit={save}>
            <div className="admin-card-head"><h2>{editing ? `Edit ${label}` : `New ${label}`}</h2><span>{editing ? "Editing existing content" : "Draft first, publish when verified"}</span></div>
            <div className="admin-form-grid">
              <label>Title<input required value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})}/></label>
              <label>Slug<input value={form.slug} placeholder={slugify(form.title) || "url-slug"} onChange={(e)=>setForm({...form,slug:e.target.value})}/></label>
              <label className="full">Excerpt<textarea rows={3} value={form.excerpt} onChange={(e)=>setForm({...form,excerpt:e.target.value})}/></label>
              <label className="full">Content<textarea required rows={10} value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})}/></label>
              {kind !== "case-study" ? <>
                <label>Author<input value={form.author} onChange={(e)=>setForm({...form,author:e.target.value})}/></label>
                <label>Category<input value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})}/></label>
                <label className="full">Tags<input value={form.tags} placeholder="AI, Engineering, MLOps" onChange={(e)=>setForm({...form,tags:e.target.value})}/></label>
              </> : <>
                <label>Client / disclosure label<input value={form.client} onChange={(e)=>setForm({...form,client:e.target.value})}/></label>
                <label>Technologies<input value={form.technologies} placeholder="Python, FastAPI, AWS" onChange={(e)=>setForm({...form,technologies:e.target.value})}/></label>
                <label className="full">Challenge<textarea rows={4} value={form.challenge} onChange={(e)=>setForm({...form,challenge:e.target.value})}/></label>
                <label className="full">Solution<textarea rows={5} value={form.solution} onChange={(e)=>setForm({...form,solution:e.target.value})}/></label>
                <label className="full">Verified results, one per line<textarea rows={4} value={form.results} onChange={(e)=>setForm({...form,results:e.target.value})}/></label>
              </>}
              <label className="full">Featured image URL<input value={form.featuredImage} onChange={(e)=>setForm({...form,featuredImage:e.target.value})}/></label>
              <label>Status<select value={form.status} onChange={(e)=>setForm({...form,status:e.target.value as Status})}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
            </div>
            <div className="admin-form-actions">
              <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : <><Save size={15}/> {editing ? "Update" : "Create"}</>}</button>
              {editing ? <button className="admin-quiet-button" type="button" onClick={reset}>Cancel</button> : null}
            </div>
            {message ? <p className="admin-message">{message}</p> : null}
          </form>

          <section className="admin-card admin-list">
            <div className="admin-card-head"><h2>{label}</h2><span>{items.length} items</span></div>
            {loading ? <p className="admin-empty">Loading…</p> : items.length === 0 ? <p className="admin-empty">No content yet. Create a verified draft when ready.</p> : (
              <div className="admin-items">
                {pagedItems.map((item) => (
                  <article key={item.id}>
                    <div><span className={`admin-status ${item.status}`}>{item.status}</span><h3>{item.title}</h3><p>/{item.slug}</p></div>
                    <div className="admin-item-actions"><button onClick={()=>edit(item)} aria-label={`Edit ${item.title}`}><Edit3 size={15}/></button><button onClick={()=>remove(item)} disabled={deleting===item.id} aria-label={`Delete ${item.title}`}><Trash2 size={15}/></button></div>
                  </article>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:12, marginTop:16 }}>
                <button className="admin-quiet-button" disabled={page<=1} onClick={()=>setPage(p=>p-1)}>Previous</button>
                <span style={{ fontSize:12, color:"#64748B" }}>Page {page} of {totalPages}</span>
                <button className="admin-quiet-button" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}>Next</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
