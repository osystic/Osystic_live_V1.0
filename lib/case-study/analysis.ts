import {
  getFileContent,
  getLanguages,
  getReadmeContent,
  getRepositoryInfo,
  getRepositoryTree,
  parseAndValidateUrl,
} from "./github";

const CONFIG_FILES = [
  "package.json",
  "requirements.txt",
  "pyproject.toml",
  "setup.py",
  "composer.json",
  "pom.xml",
  "build.gradle",
  "Cargo.toml",
  "go.mod",
  "Gemfile",
  "pubspec.yaml",
  "mix.exs",
  "package.yaml",
  "build.sbt",
];

export type RepositoryAnalysis = {
  repository: Record<string, unknown>;
  readme: { found: boolean; filename: string | null; content: string | null; size: number | null };
  project_structure: {
    total_files: number;
    total_directories: number;
    file_structure: string;
    important_files: Record<string, string[]>;
  };
  technologies: {
    primary_language: string | null;
    languages: Record<string, number>;
    frameworks: string[];
    libraries: string[];
    tools: string[];
    package_manager: string | null;
  };
  configuration_files: Array<{ filename: string; content: string; parsed_data: Record<string, unknown> | null }>;
  user_provided_description: string | null;
};

function cleanReadmeContent(content: string): string {
  if (!content) return "";
  return content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncateContent(content: string, maxLength: number): string {
  if (!content || content.length <= maxLength) return content;
  const truncated = content.slice(0, maxLength);
  const breakpoints = [truncated.lastIndexOf("."), truncated.lastIndexOf("\n"), truncated.lastIndexOf(" ")]
    .filter((index) => index > maxLength * 0.8);
  if (breakpoints.length) {
    return truncated.slice(0, Math.max(...breakpoints) + 1) + "\n\n... [Content truncated]";
  }
  return truncated + "... [Content truncated]";
}

function formatFileStructure(paths: string[], maxDepth = 3): string {
  const lines: string[] = [];
  const seenPrefixes = new Set<string>();

  for (const path of [...paths].sort()) {
    const parts = path.split("/");
    if (parts.length > maxDepth) {
      const truncatedPath = parts.slice(0, maxDepth).join("/");
      if (!seenPrefixes.has(truncatedPath)) {
        lines.push(`├── ${truncatedPath}/...`);
        seenPrefixes.add(truncatedPath);
      }
      continue;
    }
    const indent = parts.length > 1 ? "│   ".repeat(parts.length - 2) : "";
    const connector = parts.length > 1 ? "├── " : "";
    lines.push(`${indent}${connector}${parts[parts.length - 1]}`);
  }

  return lines.length ? lines.join("\n") : "No files found";
}

function extractImportantFiles(paths: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    config_files: [],
    documentation: [],
    source_code: [],
    tests: [],
    ci_cd: [],
    docker: [],
    other: [],
  };

  const configPatterns = [
    "package.json", "requirements.txt", "pyproject.toml", "composer.json",
    "pom.xml", "Cargo.toml", "go.mod", "build.gradle", "Gemfile",
    "setup.py", "setup.cfg", "tsconfig.json", ".eslintrc", ".prettierrc",
    "webpack.config.js", "vite.config.js", "next.config.js",
  ];
  const docPatterns = ["README", "CHANGELOG", "LICENSE", "CONTRIBUTING", "docs/"];
  const testPatterns = ["test", "spec", "__tests__", "_test", ".test."];
  const ciPatterns = [".github/workflows/", ".gitlab-ci.yml", "Jenkinsfile", ".travis.yml", ".circleci/"];
  const dockerPatterns = ["Dockerfile", "docker-compose", ".dockerignore"];
  const sourceExtensions = [".py", ".js", ".ts", ".jsx", ".tsx", ".java", ".go", ".rs", ".rb", ".php", ".cpp", ".c", ".h", ".cs", ".swift", ".kt"];

  for (const path of paths) {
    const lowerPath = path.toLowerCase();
    const filename = path.split("/").pop() || path;

    if (configPatterns.includes(filename) || filename.startsWith(".env") || filename.startsWith("config")) {
      categories.config_files.push(path);
    } else if (docPatterns.some((pattern) => lowerPath.includes(pattern.toLowerCase()))) {
      categories.documentation.push(path);
    } else if (testPatterns.some((pattern) => lowerPath.includes(pattern))) {
      categories.tests.push(path);
    } else if (ciPatterns.some((pattern) => lowerPath.includes(pattern.toLowerCase()))) {
      categories.ci_cd.push(path);
    } else if (dockerPatterns.some((pattern) => filename.toLowerCase().includes(pattern.toLowerCase()))) {
      categories.docker.push(path);
    } else if (sourceExtensions.some((ext) => lowerPath.endsWith(ext))) {
      categories.source_code.push(path);
    } else {
      categories.other.push(path);
    }
  }

  return categories;
}

function parseJsonConfig(content: string): Record<string, unknown> {
  const data = JSON.parse(content) as Record<string, unknown>;
  const result: Record<string, unknown> = {};
  if (typeof data.name === "string") result.name = data.name;
  if (typeof data.version === "string") result.version = data.version;
  if (typeof data.description === "string") result.description = data.description;
  if (data.dependencies && typeof data.dependencies === "object") result.dependencies = Object.keys(data.dependencies as object);
  if (data.devDependencies && typeof data.devDependencies === "object") result.dev_dependencies = Object.keys(data.devDependencies as object);
  if (data.scripts && typeof data.scripts === "object") result.scripts = data.scripts;
  if (data.require && typeof data.require === "object") result.dependencies = Object.keys(data.require as object);
  if (data["require-dev"] && typeof data["require-dev"] === "object") result.dev_dependencies = Object.keys(data["require-dev"] as object);
  return result;
}

function parseRequirementsTxt(content: string): string[] {
  const dependencies: string[] = [];
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("-")) continue;
    const match = line.match(/^([a-zA-Z0-9_.-]+)/);
    if (match) dependencies.push(match[1]);
    if (dependencies.length >= 50) break;
  }
  return dependencies;
}

function parseToml(content: string): { dependencies: string[]; dev_dependencies: string[] } {
  const result = { dependencies: [] as string[], dev_dependencies: [] as string[] };
  let section = "";
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("[")) {
      section = line.toLowerCase();
      continue;
    }
    if (!line.includes("=") || line.startsWith("#")) continue;
    const pkgName = line.split("=")[0].trim().replace(/^["']|["']$/g, "");
    if (!pkgName) continue;
    if (section.includes("dev")) result.dev_dependencies.push(pkgName);
    else if (section.includes("dependenc")) result.dependencies.push(pkgName);
  }
  return result;
}

function parseGoMod(content: string): { module: string | null; go_version: string | null; dependencies: string[] } {
  const result = { module: null as string | null, go_version: null as string | null, dependencies: [] as string[] };
  let inRequireBlock = false;
  for (const rawLine of content.split("\n")) {
    const line = rawLine.trim();
    if (line.startsWith("module ")) result.module = line.slice(7).trim();
    else if (line.startsWith("go ")) result.go_version = line.slice(3).trim();
    else if (line.startsWith("require (")) inRequireBlock = true;
    else if (line === ")") inRequireBlock = false;
    else if (line.startsWith("require ")) {
      const parts = line.slice(8).split(/\s+/);
      if (parts[0]) result.dependencies.push(parts[0]);
    } else if (inRequireBlock && line && !line.startsWith("//") && /^[a-zA-Z]/.test(line)) {
      const parts = line.split(/\s+/);
      if (parts[0]) result.dependencies.push(parts[0]);
    }
  }
  return result;
}

function parseGemfile(content: string): string[] {
  const dependencies: string[] = [];
  for (const rawLine of content.split("\n")) {
    const match = rawLine.trim().match(/^gem\s+['"]([^'"]+)['"]/);
    if (match?.[1]) dependencies.push(match[1]);
  }
  return dependencies;
}

function parsePomXml(content: string): Record<string, unknown> {
  const groupMatch = content.match(/<groupId>([^<]+)<\/groupId>/);
  const artifactMatch = content.match(/<artifactId>([^<]+)<\/artifactId>/);
  const versionMatch = content.match(/<version>([^<]+)<\/version>/);
  const depMatches = [...content.matchAll(/<dependency>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<\/dependency>/g)];
  return {
    group_id: groupMatch?.[1] ?? null,
    artifact_id: artifactMatch?.[1] ?? null,
    version: versionMatch?.[1] ?? null,
    dependencies: [...new Set(depMatches.map((match) => match[1]))],
  };
}

function parseGradle(content: string): string[] {
  const patterns = [
    /(?:implementation|api|compile|runtimeOnly|testImplementation)\s+['"]([^'"]+)['"]/g,
    /(?:implementation|api|compile|runtimeOnly|testImplementation)\s*\([^)]+['"]([^'"]+)['"]/g,
  ];
  const dependencies = new Set<string>();
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      if (match[1]) dependencies.add(match[1]);
    }
  }
  return [...dependencies].slice(0, 50);
}

function parseYamlBasic(content: string): Record<string, unknown> {
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  const versionMatch = content.match(/^version:\s*(.+)$/m);
  const deps: string[] = [];
  let inDeps = false;
  for (const rawLine of content.split("\n")) {
    if (/^dependencies:/.test(rawLine)) { inDeps = true; continue; }
    if (/^[a-zA-Z]/.test(rawLine)) { inDeps = false; continue; }
    if (inDeps) {
      const match = rawLine.match(/^\s{2}([a-zA-Z0-9_-]+):/);
      if (match?.[1]) deps.push(match[1]);
    }
  }
  return {
    name: nameMatch?.[1]?.trim() ?? null,
    version: versionMatch?.[1]?.trim() ?? null,
    dependencies: deps,
  };
}

function parseConfigFile(filename: string, content: string): Record<string, unknown> | null {
  try {
    switch (filename) {
      case "package.json":
      case "composer.json":
        return parseJsonConfig(content);
      case "pubspec.yaml":
        return parseYamlBasic(content);
      case "requirements.txt":
        return { dependencies: parseRequirementsTxt(content) };
      case "pyproject.toml":
      case "Cargo.toml":
        return parseToml(content);
      case "go.mod":
        return parseGoMod(content);
      case "Gemfile":
        return { dependencies: parseGemfile(content) };
      case "pom.xml":
        return parsePomXml(content);
      case "build.gradle":
        return { raw_dependencies: parseGradle(content) };
      default:
        return { raw_content: content.slice(0, 1000) };
    }
  } catch (error) {
    return { parse_error: error instanceof Error ? error.message : String(error) };
  }
}

function detectTechnologies(
  repoInfo: Record<string, unknown>,
  languages: Record<string, number>,
  configFiles: Array<{ filename: string; parsed_data: Record<string, unknown> | null }>,
  filePaths: string[],
): RepositoryAnalysis["technologies"] {
  const technologies: RepositoryAnalysis["technologies"] = {
    primary_language: typeof repoInfo.language === "string" ? repoInfo.language : null,
    languages,
    frameworks: [],
    libraries: [],
    tools: [],
    package_manager: null,
  };

  const fileNames = filePaths.map((path) => path.split("/").pop() || path);
  const joinedPaths = filePaths.join(" ");

  const jsFrameworks: Record<string, string> = {
    react: "React", next: "Next.js", vue: "Vue.js", nuxt: "Nuxt.js", angular: "Angular",
    svelte: "Svelte", express: "Express.js", fastify: "Fastify", nest: "NestJS",
    gatsby: "Gatsby", remix: "Remix", astro: "Astro",
  };
  const jsTools: Record<string, string> = {
    typescript: "TypeScript", eslint: "ESLint", prettier: "Prettier", jest: "Jest",
    vitest: "Vitest", webpack: "Webpack", vite: "Vite", rollup: "Rollup",
    babel: "Babel", tailwindcss: "Tailwind CSS", storybook: "Storybook",
    cypress: "Cypress", playwright: "Playwright",
  };
  const pyFrameworks: Record<string, string> = {
    django: "Django", flask: "Flask", fastapi: "FastAPI", starlette: "Starlette",
    pyramid: "Pyramid", tornado: "Tornado", aiohttp: "aiohttp", sanic: "Sanic",
  };
  const pyTools: Record<string, string> = {
    pytest: "Pytest", black: "Black", flake8: "Flake8", mypy: "mypy",
    celery: "Celery", gunicorn: "Gunicorn", uvicorn: "Uvicorn",
    sqlalchemy: "SQLAlchemy", pandas: "Pandas", numpy: "NumPy",
  };

  for (const config of configFiles) {
    const parsed = (config.parsed_data || {}) as Record<string, unknown>;

    if (config.filename === "package.json") {
      technologies.package_manager = "npm/yarn/pnpm";
      const deps = [...(parsed.dependencies as string[] || []), ...(parsed.dev_dependencies as string[] || [])];
      const frameworks: string[] = [];
      const tools: string[] = [];
      const libraries: string[] = [];
      for (const dep of deps) {
        const lower = String(dep).toLowerCase();
        const framework = Object.entries(jsFrameworks).find(([key]) => lower.includes(key))?.[1];
        const tool = Object.entries(jsTools).find(([key]) => lower.includes(key))?.[1];
        if (framework) frameworks.push(framework);
        else if (tool) tools.push(tool);
        else libraries.push(dep);
      }
      technologies.frameworks.push(...frameworks);
      technologies.tools.push(...tools);
      technologies.libraries.push(...libraries);
    } else if (config.filename === "requirements.txt" || config.filename === "pyproject.toml") {
      technologies.package_manager = "pip/poetry";
      const deps = (parsed.dependencies as string[]) || [];
      for (const dep of deps) {
        const lower = String(dep).toLowerCase();
        const framework = Object.entries(pyFrameworks).find(([key]) => lower.includes(key))?.[1];
        const tool = Object.entries(pyTools).find(([key]) => lower.includes(key))?.[1];
        if (framework) technologies.frameworks.push(framework);
        if (tool) technologies.tools.push(tool);
      }
    } else if (config.filename === "composer.json") {
      technologies.package_manager = "Composer";
      const depsText = JSON.stringify(parsed.dependencies || []).toLowerCase();
      if (depsText.includes("laravel")) technologies.frameworks.push("Laravel");
      if (depsText.includes("symfony")) technologies.frameworks.push("Symfony");
    } else if (config.filename === "pom.xml" || config.filename === "build.gradle") {
      technologies.package_manager = config.filename === "pom.xml" ? "Maven" : "Gradle";
      const depsText = JSON.stringify(parsed.dependencies || []).toLowerCase();
      if (depsText.includes("spring")) technologies.frameworks.push("Spring");
      if (depsText.includes("hibernate")) technologies.libraries.push("Hibernate");
    } else if (config.filename === "Cargo.toml") {
      technologies.package_manager = "Cargo";
    } else if (config.filename === "go.mod") {
      technologies.package_manager = "Go Modules";
    } else if (config.filename === "Gemfile") {
      technologies.package_manager = "Bundler";
      if (JSON.stringify(parsed.dependencies || []).toLowerCase().includes("rails")) {
        technologies.frameworks.push("Ruby on Rails");
      }
    }
  }

  if (fileNames.includes("Dockerfile")) technologies.tools.push("Docker");
  if (fileNames.some((name) => name.includes("docker-compose"))) technologies.tools.push("Docker Compose");
  if (joinedPaths.includes(".github/workflows")) technologies.tools.push("GitHub Actions");
  if (fileNames.includes(".gitlab-ci.yml")) technologies.tools.push("GitLab CI");
  if (fileNames.includes("Jenkinsfile")) technologies.tools.push("Jenkins");
  if (/kubernetes|k8s/i.test(joinedPaths)) technologies.tools.push("Kubernetes");
  if (joinedPaths.toLowerCase().includes("terraform")) technologies.tools.push("Terraform");

  technologies.frameworks = [...new Set(technologies.frameworks)];
  technologies.tools = [...new Set(technologies.tools)];
  technologies.libraries = [...new Set(technologies.libraries)].slice(0, 20);

  return technologies;
}

export async function analyzeRepository(
  githubUrl: string,
  projectDescription?: string,
): Promise<RepositoryAnalysis> {
  const { owner, repo } = parseAndValidateUrl(githubUrl);

  const repoInfo = await getRepositoryInfo(owner, repo);
  const defaultBranch = typeof repoInfo.default_branch === "string" ? repoInfo.default_branch : "main";

  const readmeData = await getReadmeContent(owner, repo, defaultBranch);
  const treeData = await getRepositoryTree(owner, repo, defaultBranch);
  const languages = await getLanguages(owner, repo);

  const filePaths = treeData.filter((item) => item.type === "blob").map((item) => item.path);

  const configurationFiles: RepositoryAnalysis["configuration_files"] = [];
  for (const configFile of CONFIG_FILES) {
    if (!filePaths.includes(configFile)) continue;
    const content = await getFileContent(owner, repo, configFile, defaultBranch);
    if (!content) continue;
    configurationFiles.push({
      filename: configFile,
      content: truncateContent(content, 5000),
      parsed_data: parseConfigFile(configFile, content),
    });
  }

  const technologies = detectTechnologies(repoInfo, languages, configurationFiles, filePaths);

  const cleanedReadme = readmeData.content ? cleanReadmeContent(readmeData.content) : "";

  return {
    repository: {
      name: repoInfo.name,
      full_name: repoInfo.full_name,
      description: repoInfo.description,
      html_url: repoInfo.html_url,
      language: repoInfo.language,
      stars: repoInfo.stargazers_count ?? 0,
      forks: repoInfo.forks_count ?? 0,
      watchers: repoInfo.watchers_count ?? 0,
      created_at: repoInfo.created_at,
      updated_at: repoInfo.updated_at,
      license: repoInfo.license,
      topics: repoInfo.topics ?? [],
      default_branch: defaultBranch,
    },
    readme: {
      found: readmeData.found,
      filename: readmeData.filename,
      content: cleanedReadme ? truncateContent(cleanedReadme, 15000) : null,
      size: readmeData.size,
    },
    project_structure: {
      total_files: filePaths.length,
      total_directories: treeData.filter((item) => item.type === "tree").length,
      file_structure: formatFileStructure(filePaths),
      important_files: extractImportantFiles(filePaths),
    },
    technologies,
    configuration_files: configurationFiles,
    user_provided_description: projectDescription || null,
  };
}
