import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiCaseStudies, caseStudies } from "@/drizzle/schema";

export async function ensureAiCaseStudiesTable() {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS ai_case_studies (
      id TEXT PRIMARY KEY,
      github_url TEXT NOT NULL UNIQUE,
      project_title TEXT,
      generated_content TEXT NOT NULL,
      analysis TEXT,
      published_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export async function listAiCaseStudies() {
  await ensureAiCaseStudiesTable();
  return db.select().from(aiCaseStudies).orderBy(desc(aiCaseStudies.createdAt));
}

export async function getAiCaseStudy(id: string) {
  await ensureAiCaseStudiesTable();
  const rows = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function upsertAiCaseStudy(input: {
  githubUrl: string;
  projectTitle: string;
  generatedContent: string;
  analysis: unknown;
}) {
  await ensureAiCaseStudiesTable();
  const existing = await db
    .select()
    .from(aiCaseStudies)
    .where(eq(aiCaseStudies.githubUrl, input.githubUrl))
    .limit(1);

  const analysis = JSON.stringify(input.analysis ?? null);

  if (existing[0]) {
    await db
      .update(aiCaseStudies)
      .set({
        projectTitle: input.projectTitle,
        generatedContent: input.generatedContent,
        analysis,
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(aiCaseStudies.id, existing[0].id));
    return getAiCaseStudy(existing[0].id);
  }

  const inserted = await db
    .insert(aiCaseStudies)
    .values({
      githubUrl: input.githubUrl,
      projectTitle: input.projectTitle,
      generatedContent: input.generatedContent,
      analysis,
    })
    .returning();
  return inserted[0] ?? null;
}

export async function updateAiCaseStudyContent(id: string, generatedContent: string) {
  await ensureAiCaseStudiesTable();
  await db
    .update(aiCaseStudies)
    .set({ generatedContent, updatedAt: sql`(datetime('now'))` })
    .where(eq(aiCaseStudies.id, id));
  return getAiCaseStudy(id);
}

export async function setAiCaseStudyPublishedId(id: string, publishedId: string | null) {
  await ensureAiCaseStudiesTable();
  await db
    .update(aiCaseStudies)
    .set({ publishedId, updatedAt: sql`(datetime('now'))` })
    .where(eq(aiCaseStudies.id, id));
}

export { caseStudies };
