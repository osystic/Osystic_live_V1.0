const CASE_STUDY_PROMPT = `
You are an expert technical writer and software architect. Your task is to write a highly professional, structured Case Study based on the provided GitHub repository analysis and user description.

INPUT DATA PROVIDED:
1. Repository Metadata: {{repo_data}}
2. README Content: {{readme_content}}
3. Technologies Detected: {{technologies}}
4. Project Structure: {{project_structure}}
5. Configuration/Dependencies: {{config_files}}
6. User's Additional Description: {{user_description}}

INSTRUCTIONS:
- Write in a professional, corporate tone.
- Use Markdown formatting (Headings, bullet points, bold text).
- If some information is missing (e.g., empty README), intelligently infer details from the folder structure, dependencies, and repository name. If you absolutely cannot infer, write "Information not explicitly provided" but keep the structure intact.
- Do NOT make up fake metrics (like "increased revenue by 50%"). Keep it factual to the code.

Generate the Case Study with EXACTLY these sections:

### Project Overview
A compelling 2-3 paragraph summary of what this project is, its purpose, and its target audience.

### Problem Statement
What problem does this software solve? Why was this project built in the first place? (Infer from README or tech stack if not explicitly stated).

### Solution
How does this project solve the problem? What approach did the developers take?

### Key Features
List the top 5-7 core features of the software. (Use bullet points).

### Technology Stack
List the programming languages, frameworks, libraries, and tools used. Present this in a clean, readable format.

### Architecture Overview
Based on the folder structure and files, describe the architectural pattern used (e.g., MVC, Microservices, Monolith, Serverless) and how the code is organized.

### Implementation Highlights
Pick 2-3 interesting technical implementations. For example: "Uses Redis for caching to improve read speeds", or "Implements a custom middleware for authentication".

### Challenges & Solutions
Based on the tech stack and structure, identify 2 likely technical challenges the developers faced and how the current architecture solves them (e.g., "Challenge: Managing complex state -> Solution: Implemented Redux/Zustand").

### Results / Impact
What is the current status of the project? (e.g., Stars, forks, community adoption based on repo data).

### Future Enhancements
Suggest 3-4 logical next steps or features that would make sense for this project based on its current state.
`;

const REGENERATE_PROMPT = `
Rewrite the following case study. Make it more concise, engaging, and polished. Keep the exact same Markdown structure and sections. Do not invent fake metrics.

Current Case Study:
{{current_case_study}}

Repository Context: {{repo_data}}
`;

function fill(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.split(`{{${key}}}`).join(value);
  }
  return result;
}

export function buildGeneratePrompt(
  analysis: {
    repository: unknown;
    readme: { content: string | null };
    technologies: unknown;
    project_structure: { file_structure: string };
    configuration_files: Array<{ parsed_data: unknown }>;
  },
  userDescription?: string | null,
): string {
  return fill(CASE_STUDY_PROMPT, {
    repo_data: JSON.stringify(analysis.repository, null, 2),
    readme_content: (analysis.readme.content || "No README found.").slice(0, 8000),
    technologies: JSON.stringify(analysis.technologies, null, 2),
    project_structure: (analysis.project_structure.file_structure || "No structure found.").slice(0, 3000),
    config_files: JSON.stringify(
      analysis.configuration_files.map((item) => item.parsed_data).filter(Boolean),
      null,
      2,
    ).slice(0, 3000),
    user_description: userDescription || "No additional description provided.",
  });
}

export function buildRegeneratePrompt(currentCaseStudy: string, repository: unknown): string {
  return fill(REGENERATE_PROMPT, {
    current_case_study: currentCaseStudy,
    repo_data: JSON.stringify(repository, null, 2),
  });
}
