import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { aiCaseStudies, caseStudies } from "@/drizzle/schema";
import { parseStoredAnalysis } from "./metadata";

export async function listAiCaseStudies() {
  return db.select().from(aiCaseStudies).orderBy(desc(aiCaseStudies.updatedAt), desc(aiCaseStudies.createdAt));
}

export async function getAiCaseStudy(id: string) {
  const rows = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getAiCaseStudyByGithubUrl(githubUrl: string) {
  const rows = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.githubUrl, githubUrl)).limit(1);
  return rows[0] ?? null;
}

export async function getAiCaseStudyByPublishedId(publishedId: string) {
  const rows = await db.select().from(aiCaseStudies).where(eq(aiCaseStudies.publishedId, publishedId)).limit(1);
  return rows[0] ?? null;
}


export async function findAiCaseStudyByRepositoryId(repositoryId: number) {
  const rows = await listAiCaseStudies();
  return rows.find((row) => parseStoredAnalysis(row.analysis).automation?.repositoryId === repositoryId) ?? null;
}

export async function findAiCaseStudyByProjectKey(projectKey: string, excludeId?: string) {
  const rows = await listAiCaseStudies();
  return rows.find((row) => {
    if (excludeId && row.id === excludeId) return false;
    return parseStoredAnalysis(row.analysis).automation?.projectKey === projectKey;
  }) ?? null;
}

export async function findPublishedCaseStudyBySlug(slug: string) {
  const rows = await db.select().from(caseStudies).where(eq(caseStudies.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function upsertAiCaseStudy(input: {
  githubUrl: string;
  projectTitle: string;
  generatedContent: string;
  analysis: unknown;
  publishedId?: string | null;
}) {
  const existing = await getAiCaseStudyByGithubUrl(input.githubUrl);
  const analysis = JSON.stringify(input.analysis ?? null);

  if (existing) {
    await db
      .update(aiCaseStudies)
      .set({
        projectTitle: input.projectTitle,
        generatedContent: input.generatedContent,
        analysis,
        ...(input.publishedId !== undefined ? { publishedId: input.publishedId } : {}),
        updatedAt: sql`(datetime('now'))`,
      })
      .where(eq(aiCaseStudies.id, existing.id));
    return getAiCaseStudy(existing.id);
  }

  const inserted = await db
    .insert(aiCaseStudies)
    .values({
      githubUrl: input.githubUrl,
      projectTitle: input.projectTitle,
      generatedContent: input.generatedContent,
      analysis,
      publishedId: input.publishedId ?? null,
    })
    .returning();
  return inserted[0] ?? null;
}

export async function updateAiCaseStudy(id: string, patch: {
  githubUrl?: string;
  projectTitle?: string;
  generatedContent?: string;
  analysis?: unknown;
  publishedId?: string | null;
}) {
  const values: Record<string, unknown> = { updatedAt: sql`(datetime('now'))` };
  if (patch.githubUrl !== undefined) values.githubUrl = patch.githubUrl;
  if (patch.projectTitle !== undefined) values.projectTitle = patch.projectTitle;
  if (patch.generatedContent !== undefined) values.generatedContent = patch.generatedContent;
  if (patch.analysis !== undefined) values.analysis = JSON.stringify(patch.analysis);
  if (patch.publishedId !== undefined) values.publishedId = patch.publishedId;

  await db.update(aiCaseStudies).set(values).where(eq(aiCaseStudies.id, id));
  return getAiCaseStudy(id);
}

export async function updateAiCaseStudyContent(id: string, generatedContent: string, analysis?: unknown) {
  return updateAiCaseStudy(id, { generatedContent, ...(analysis !== undefined ? { analysis } : {}) });
}

export async function setAiCaseStudyPublishedId(id: string, publishedId: string | null) {
  await updateAiCaseStudy(id, { publishedId });
}

export { caseStudies };
