import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const self = path.resolve(root, "scripts/qa-static.mjs");
const ignoredDirs = new Set(["node_modules", ".next", ".git", ".turbo", ".cache", "coverage", "__pycache__"]);
const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);

function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirs.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(abs));
    else out.push(abs);
  }
  return out;
}
const files = walk(root);
const rel = (p) => path.relative(root, p).replaceAll(path.sep, "/");
const read = (p) => fs.readFileSync(p, "utf8");
const errors = [];
const notes = [];

function report(name, failures, detail = "") {
  const unique = [...new Set(failures)];
  if (unique.length) {
    errors.push(...unique.map((x) => `${name}: ${x}`));
    console.log(`FAIL ${name} (${unique.length})`);
    unique.slice(0, 40).forEach((x) => console.log(`  - ${x}`));
  } else {
    console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

// Delivery hygiene.
const badNames = files.filter((p) => {
  const r = rel(p);
  const b = path.basename(p);
  return ((/(^|\/)(\.env|\.env\..+)$/.test(r) && b !== ".env.example") || /(^|\/)(\.DS_Store|Thumbs\.db)$/.test(r));
}).map(rel);
for (const d of ["node_modules", ".next", ".git", ".turbo", ".cache", "coverage", "__pycache__"]) {
  if (fs.existsSync(path.join(root, d))) badNames.push(`${d}/`);
}
report("delivery hygiene", badNames, "no private env/caches/build directories");

// Brand/content sentinels. Exclude this checker so the sentinel expressions do not self-match.
const forbidden = [
  ["VisionGen", /VisionGen/gi],
  ["old email", /hello@osystic\.net/gi],
  ["legacy purple", /#(?:7c3aed|8b5cf6|9333ea|6d28d9|a855f7|c084fc|4f46e5|5b21b6|7e22ce|581c87)\b/gi],
  ["absolute IP claim", /\b(?:Full IP Ownership|full client ownership|fully yours|No vendor lock-in|No ongoing licence fees)\b/gi],
  ["old accessibility claim", /WCAG 2\.1 AA compliance/gi],
];
const contentFiles = files.filter((p) => p !== self && (sourceExts.has(path.extname(p)) || [".md", ".json"].includes(path.extname(p))));
const forbiddenHits = [];
for (const p of contentFiles) {
  const text = read(p);
  for (const [label, rx] of forbidden) {
    rx.lastIndex = 0;
    if (rx.test(text)) forbiddenHits.push(`${rel(p)}: ${label}`);
  }
}
report("branding/claim sentinels", forbiddenHits, "no VisionGen, old email, legacy purple, or prohibited absolute claims");

// Common secret/token literals. Documented placeholder connection strings are explicitly ignored.
const directSecretPatterns = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  ["OpenAI-style key", /\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/g],
  ["JWT literal", /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/g],
];
const credentialUrl = /(?:postgres(?:ql)?|mysql):\/\/[^\s:@/]+:[^\s@/]+@[^\s"'`]+/gi;
const secretHits = [];
for (const p of files.filter((p) => p !== self && !rel(p).endsWith(".env.example") && !/\.(png|jpe?g|webp|avif|ico|woff2?|zip)$/i.test(p))) {
  let text;
  try { text = read(p); } catch { continue; }
  for (const [label, rx] of directSecretPatterns) {
    rx.lastIndex = 0;
    if (rx.test(text)) secretHits.push(`${rel(p)}: ${label}`);
  }
  credentialUrl.lastIndex = 0;
  for (const match of text.matchAll(credentialUrl)) {
    const value = match[0];
    if (/PROJECT(?:_ID)?|PASSWORD|PASS(?:@|\b)|USERNAME|USER(?:@|:)|example\.(?:com|org|net)/i.test(value)) continue;
    secretHits.push(`${rel(p)}: credentialed database URL`);
  }
}
report("hard-coded secret scan", secretHits, "no common secret/token literals detected");

// Static source imports only. This deliberately ignores import-looking strings inside documentation/code examples.
const importFailures = [];
function resolvesImport(fromFile, spec) {
  let base;
  if (spec.startsWith("./") || spec.startsWith("../")) base = path.resolve(path.dirname(fromFile), spec);
  else if (spec.startsWith("@/")) base = path.resolve(root, spec.slice(2));
  else return true;
  const candidates = [
    base,
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".json", ".css"].map((e) => base + e),
    ...[".ts", ".tsx", ".js", ".jsx", ".mjs", ".json"].map((e) => path.join(base, "index" + e)),
  ];
  return candidates.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}
const staticImportRx = /^\s*(?:import\s+(?:[^"'\n]+?\s+from\s+)?|export\s+[^"'\n]+?\s+from\s+)["']([^"']+)["']/gm;
for (const p of files.filter((p) => p !== self && rel(p) !== "next-env.d.ts" && [".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(path.extname(p)))) {
  const text = read(p);
  staticImportRx.lastIndex = 0;
  for (const m of text.matchAll(staticImportRx)) {
    if (!resolvesImport(p, m[1])) importFailures.push(`${rel(p)} -> ${m[1]}`);
  }
}
report("source import resolution", importFailures, "all static relative/@ imports resolve to source files");

// Build application route patterns from App Router source.
const staticRoutes = new Set(["/"]);
const routePatterns = [];
function routeFromAppFile(r) {
  let value = r.replace(/^app\//, "").replace(/\/(?:page\.tsx|route\.tsx?)$/, "").replace(/^(?:page\.tsx|route\.ts)$/, "");
  value = "/" + value;
  return value === "/" ? "/" : value.replace(/\/$/, "");
}
function compileRoutePattern(route) {
  const parts = route.split("/").filter(Boolean);
  return (candidate) => {
    const cparts = candidate.split("/").filter(Boolean);
    let ci = 0;
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i];
      if (/^\[\.\.\..+\]$/.test(part)) return ci < cparts.length;
      if (ci >= cparts.length) return false;
      if (/^\[.+\]$/.test(part)) { ci += 1; continue; }
      if (part !== cparts[ci]) return false;
      ci += 1;
    }
    return ci === cparts.length;
  };
}
for (const p of files) {
  const r = rel(p);
  if (!r.startsWith("app/") || !(r.endsWith("/page.tsx") || r.endsWith("/route.ts") || r.endsWith("/route.tsx") || r === "app/page.tsx")) continue;
  const route = routeFromAppFile(r);
  if (route.includes("[")) routePatterns.push(compileRoutePattern(route));
  else staticRoutes.add(route);
}
const nextConfig = read(path.join(root, "next.config.ts"));
const redirectPairs = [...nextConfig.matchAll(/source:\s*["'](\/[^"']+)["']\s*,\s*destination:\s*["'](\/[^"']+)["']/g)].map((m) => [m[1], m[2]]);
redirectPairs.forEach(([src]) => staticRoutes.add(src));
const routeExists = (candidate) => {
  if (staticRoutes.has(candidate)) return true;
  // Parent admin is intentionally protected by proxy while concrete /admin/* pages exist.
  if (candidate === "/admin" && [...staticRoutes].some((x) => x.startsWith("/admin/"))) return true;
  return routePatterns.some((fn) => fn(candidate));
};

// Only inspect syntactically route-bearing values rather than every slash-prefixed string in source/data examples.
const routeRefs = [];
const assetFailures = [];
const routeBearingPatterns = [
  /\b(?:href|canonical|destination|source)\s*[:=]\s*["'`](\/[^"'`\s$]*)["'`]/g,
  /\b(?:redirect|permanentRedirect|fetch|router\.push|router\.replace)\s*\(\s*["'`](\/[^"'`\s$]*)["'`]/g,
];
for (const p of files.filter((p) => p !== self && rel(p) !== "app/robots.ts" && [".ts", ".tsx", ".js", ".jsx", ".mjs"].includes(path.extname(p)))) {
  const text = read(p);
  for (let i = 0; i < routeBearingPatterns.length; i += 1) {
    // Service data contains literal code examples (for example router.push('/detail'));
    // validate their href metadata, but do not treat code-example function calls as live app navigation.
    if (i === 1 && rel(p).includes('/_data/')) continue;
    const rx = routeBearingPatterns[i];
    rx.lastIndex = 0;
    for (const m of text.matchAll(rx)) routeRefs.push([rel(p), m[1]]);
  }
}
const unresolved = [];
for (const [file, raw] of routeRefs) {
  if (!raw || raw === "/" || raw.includes(":") || raw.includes("*") || raw.includes("{") || raw.startsWith("//")) continue;
  const clean = raw.split(/[?#]/)[0] || "/";
  if (/\.(?:png|jpe?g|webp|avif|svg|ico|woff2?|pdf|txt|xml)$/i.test(clean)) {
    if (!fs.existsSync(path.join(root, "public", clean.slice(1))) && !fs.existsSync(path.join(root, "app", clean.slice(1)))) assetFailures.push(`${file}: ${clean}`);
    continue;
  }
  if (!routeExists(clean)) unresolved.push(`${file}: ${clean}`);
}
for (const [, dest] of redirectPairs) {
  const clean = dest.split(/[?#]/)[0];
  if (!routeExists(clean)) unresolved.push(`next.config.ts redirect destination: ${dest}`);
}
report("internal route references", unresolved, `${new Set(routeRefs.map((x) => x[1])).size} route-bearing hard-coded paths checked`);
report("referenced local assets", assetFailures, "all route-bearing local asset paths exist");

// Also ensure every literal public asset reference found anywhere in TS/JS/CSS has a file.
const allAssetRefs = [];
for (const p of contentFiles.filter((p) => sourceExts.has(path.extname(p)))) {
  const text = read(p);
  for (const m of text.matchAll(/["'`](\/(?:[^"'`\s$]+)\.(?:png|jpe?g|webp|avif|svg|ico|woff2?|pdf))["'`]/gi)) allAssetRefs.push([rel(p), m[1]]);
}
const missingAssets = allAssetRefs.filter(([, a]) => !fs.existsSync(path.join(root, "public", a.slice(1)))).map(([f, a]) => `${f}: ${a}`);
report("all literal public assets", missingAssets, `${new Set(allAssetRefs.map((x) => x[1])).size} literal asset paths checked`);

// Service consolidation checks.
const aliasSlugs = ["frontend", "backend-apis", "mobile", "saas-dev", "uiux-design", "data-bi", "cloud", "data-infrastructure"];
const mainData = read(path.join(root, "app/_data/all-services-data.ts"));
const duplicateFailures = aliasSlugs.filter((slug) => new RegExp(`slug:\\s*["']${slug}["']`).test(mainData)).map((s) => `obsolete alias remains in ALL_SERVICES: ${s}`);
for (const required of ["intelligent-automation", "devops-cloud"]) if (!new RegExp(`slug:\\s*["']${required}["']`).test(mainData)) duplicateFailures.push(`required canonical service missing: ${required}`);
const p2Data = read(path.join(root, "app/_data/p2-services-data.ts"));
for (const required of ["enterprise-rag", "ai-reliability"]) if (!new RegExp(`slug:\\s*["']${required}["']`).test(p2Data)) duplicateFailures.push(`P2 service missing: ${required}`);
for (const alias of aliasSlugs) if (!redirectPairs.some(([src]) => src === `/services/${alias}`)) duplicateFailures.push(`legacy alias redirect missing: /services/${alias}`);
report("service consolidation", duplicateFailures, "legacy aliases redirect; canonical/P2 entries present");

// Sitemap/metadata hygiene for consolidated public routes.
const seoFailures = [];
const sitemapText = read(path.join(root, "app/sitemap.ts"));
for (const alias of aliasSlugs) {
  if (sitemapText.includes(`/services/${alias}`)) seoFailures.push(`obsolete alias appears directly in sitemap: /services/${alias}`);
}
if (!/ENGINEERING_SLUGS\.filter\(\(slug\)\s*=>\s*slug\s*!==\s*["']blockchain["']\)/.test(sitemapText)) {
  seoFailures.push("blockchain is not explicitly de-emphasized from sitemap discovery");
}
for (const p of contentFiles.filter((p) => [".ts", ".tsx"].includes(path.extname(p)))) {
  const text = read(p);
  if (/(?:metaTitle|title)\s*:\s*["'`][^"'`\n]*\|\s*OSYSTIC/.test(text)) seoFailures.push(`${rel(p)}: title already includes OSYSTIC while root metadata template appends it`);
}
report("SEO consolidation hygiene", seoFailures, "redirected aliases excluded; de-emphasized service excluded; no duplicate title suffixes");

// Ensure the three pillar routes are physically present.
const pillarFailures = ["ai-systems", "product-engineering", "data-cloud"].filter((slug) => !fs.existsSync(path.join(root, `app/capabilities/${slug}/page.tsx`))).map((slug) => `pillar route missing: /capabilities/${slug}`);
report("capability pillar routes", pillarFailures, "AI Systems, Product Engineering, and Data & Cloud routes present");

// Lockfile sanity: preserve the existing lock rather than fabricate a new one.
const pkg = JSON.parse(read(path.join(root, "package.json")));
const lockPath = path.join(root, "package-lock.json");
const lockFailures = [];
if (!fs.existsSync(lockPath)) lockFailures.push("package-lock.json missing");
else {
  const lock = JSON.parse(read(lockPath));
  if (!lock.lockfileVersion) lockFailures.push("package-lock.json has no lockfileVersion");
  if (lock.name && lock.name !== pkg.name) lockFailures.push(`lock name ${lock.name} != package name ${pkg.name}`);
  const rootPkg = lock.packages?.[""] ?? {};
  for (const key of ["dependencies", "devDependencies"]) {
    const a = pkg[key] ?? {};
    const b = rootPkg[key] ?? {};
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (JSON.stringify(aKeys) !== JSON.stringify(bKeys)) lockFailures.push(`lock root ${key} names differ from package.json`);
    for (const dep of aKeys) if (a[dep] !== b[dep]) lockFailures.push(`lock root ${key}.${dep} ${b[dep] ?? "missing"} != package.json ${a[dep]}`);
  }
}
report("lockfile sanity", lockFailures, "existing package-lock root dependency declarations match package.json");

const digest = crypto.createHash("sha256").update(files.map(rel).sort().join("\n")).digest("hex").slice(0, 12);
notes.push(`source-file-list digest ${digest}`);
console.log(`\nStatic QA ${errors.length ? "FAILED" : "PASSED"}: ${errors.length} issue(s).`);
notes.forEach((x) => console.log(`NOTE ${x}`));
if (errors.length) process.exitCode = 1;
