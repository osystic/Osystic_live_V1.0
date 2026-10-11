import type { PublicShowcaseBundle } from "./github";
import type { StructuredCaseStudySummary } from "./summary";

function compactDocs(bundle: PublicShowcaseBundle) {
  let remaining = 12000;
  const output: string[] = [];
  for (const doc of bundle.docs) {
    if (remaining <= 0) break;
    const slice = doc.content.slice(0, remaining);
    output.push(`\n--- ${doc.path} ---\n${slice}`);
    remaining -= slice.length;
  }
  return output.join("\n");
}

export function buildWebsiteSummaryPrompt(bundle: PublicShowcaseBundle, fallback: StructuredCaseStudySummary) {
  const clientIdentityPublic = bundle.manifest.clientIdentityPublic;
  return `
You are preparing the concise public website version of an OSYSTIC engineering case study.
The complete technical case study already exists in a sanitized PUBLIC GitHub showcase repository.
The OSYSTIC website should contain a premium executive summary, while the GitHub repository remains the full technical evidence source.

NON-NEGOTIABLE RULES:
- Use ONLY facts explicitly supported by the supplied public repository evidence.
- Do not invent metrics, percentages, revenue impact, client identity, deployment claims, certifications, production claims, or technologies.
- The project is complete because it passed the OSYSTIC public-showcase publication gate. Do not add "future enhancements".
- Do not expose or infer a client identity when clientIdentityPublic is false.
- Keep language direct, professional and suitable for an international technology company.
- Avoid marketing hype, unsupported superlatives, and vague filler.
- "outcomes" may contain measurable values only when the exact values are present in the evidence.
- "heroVisualPath" must be either null or EXACTLY one path from AVAILABLE PUBLIC ASSETS.
- Return JSON only. No Markdown fences and no explanatory text.

OUTPUT JSON SHAPE:
{
  "title": "4-10 word project title without the words Case Study",
  "executiveSummary": "2-3 concise sentences, approximately 220-500 characters",
  "industry": "one concise industry/category",
  "capabilities": ["2-6 OSYSTIC capability labels supported by evidence"],
  "challenge": "2-4 concise sentences describing the actual technical/business challenge",
  "solution": "2-4 concise sentences describing what OSYSTIC delivered",
  "engineeringHighlights": ["3-6 concrete engineering highlights"],
  "technologies": ["3-16 exact technologies explicitly present in the evidence"],
  "outcomes": ["1-5 verified or clearly evidenced outcomes"],
  "confidentialityNote": "one short public/private boundary statement",
  "heroVisualPath": null
}

PUBLICATION CONTEXT:
Repository: ${bundle.repository.fullName}
Repository URL: ${bundle.repository.htmlUrl}
Client identity public: ${clientIdentityPublic ? "yes" : "no"}
Project key: ${bundle.manifest.projectKey}
Project name: ${bundle.manifest.projectName}
Project status: ${bundle.manifest.projectStatus || "completed public showcase"}

AVAILABLE PUBLIC ASSETS:
${bundle.assetPaths.join("\n") || "None"}

MANIFEST:
${bundle.manifestText.slice(0, 9000)}

README:
${bundle.readme.slice(0, 9000)}

FULL PUBLIC CASE STUDY:
${bundle.caseStudy.slice(0, 26000)}

SELECTED PUBLIC DOCS:
${compactDocs(bundle)}

DETERMINISTIC FALLBACK SUMMARY FOR ORIENTATION ONLY:
${JSON.stringify(fallback, null, 2)}
`;
}
