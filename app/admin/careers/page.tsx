import Link from "next/link";
import { desc } from "drizzle-orm";
import { jobApplications } from "@/drizzle/schema";
import { db } from "@/lib/db";
import { canReadApplications } from "@/lib/careers-admin";

export const dynamic = "force-dynamic";
export default async function CareersInbox({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  if (!(await canReadApplications())) return <main id="main-content" className="admin-shell"><div className="admin-container section"><h1>Access restricted</h1><p>Applications are available to active super-admins only.</p><Link href="/admin/content">Back to administration</Link></div></main>;
  const params = await searchParams;
  const page = Math.min(10000, Math.max(1, Number.parseInt(params.page || "1", 10) || 1));
  const items = await db.select({ id: jobApplications.id, firstName: jobApplications.firstName,
    lastName: jobApplications.lastName, email: jobApplications.email, phone: jobApplications.phone,
    city: jobApplications.city, country: jobApplications.country, position: jobApplications.position,
    yearsExp: jobApplications.yearsExp, skills: jobApplications.skills, coverLetter: jobApplications.coverLetter,
    cvFileName: jobApplications.cvFileName, status: jobApplications.status, createdAt: jobApplications.createdAt,
  }).from(jobApplications).orderBy(desc(jobApplications.createdAt), desc(jobApplications.id)).limit(21).offset((page - 1) * 20);
  return <main id="main-content" className="admin-shell">
    <div className="admin-topbar"><strong>OSYSTIC · Careers</strong><Link className="admin-quiet-button" href="/admin/content">Content administration</Link></div>
    <div className="admin-container section"><div className="admin-heading-row"><div><span className="eyebrow">Private recruitment inbox</span><h1>Received applications</h1><p>CV access is authorized on each download. Handle candidate information confidentially.</p></div></div>
      {items.length ? items.slice(0, 20).map(item => <article key={item.id} className="admin-card" style={{ padding: "clamp(1rem,3vw,2rem)", marginBottom: 20, overflowWrap: "anywhere" }}>
        <h2>{item.firstName} {item.lastName}</h2><p>{item.position} · {item.status || "new"}</p>
        <p>{item.createdAt?.slice(0, 10)} · Reference: {item.id}</p>
        <details><summary style={{ minHeight: 44 }}>Application details</summary>
          <p>Email: {item.email}<br />Phone: {item.phone}<br />Location: {[item.city, item.country].filter(Boolean).join(", ")}<br />Experience: {item.yearsExp} years</p>
          <p>Skills: {(JSON.parse(item.skills || "[]") as string[]).join(", ") || "Not supplied"}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{item.coverLetter}</p>
        </details>
        <a className="button button-primary" href={`/api/admin/careers/${item.id}/cv`}>Download CV</a><p>{item.cvFileName}</p>
      </article>) : <p role="status">No applications on this page.</p>}
      <nav aria-label="Application pages" className="hero-actions">{page > 1 ? <Link className="admin-quiet-button" href={`/admin/careers?page=${page - 1}`}>Previous</Link> : null}<span>Page {page}</span>{items.length > 20 ? <Link className="admin-quiet-button" href={`/admin/careers?page=${page + 1}`}>Next</Link> : null}</nav>
    </div>
  </main>;
}
