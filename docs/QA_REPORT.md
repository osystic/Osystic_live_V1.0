# OSYSTIC P1/P2 Final QA Report

## Status

Dependency-independent source validation passed for this checkpoint. Dependency-backed compilation/runtime validation remains a local release gate and is not represented as passed here.

## Checks completed in the finalization environment

- Delivery hygiene: no private environment files, dependency directories, Next build output, common caches, or OS metadata files; `.env.example` retained.
- Deprecated-brand / obsolete-email / legacy-accent sentinels: no matches in deliverable source/content.
- Marketing/content sentinels: no prohibited blanket IP-ownership wording or obsolete accessibility-compliance wording detected.
- Common hard-coded secret scan: no private-key blocks, common provider tokens, JWT literals, AWS access-key patterns, or non-placeholder credentialed database URLs detected.
- Static import resolution: all relative and `@/` static imports resolve to files in the source tree.
- Internal route references: route-bearing hard-coded paths resolve to App Router routes or configured redirects.
- Local asset references: all literal public asset paths detected by the source scan exist.
- Service consolidation: obsolete aliases are absent from canonical service data and have permanent redirects.
- SEO consolidation: redirected aliases are excluded from sitemap generation; the deliberately de-emphasized legacy service is excluded from sitemap discovery; no page/service title was found pre-appending the root OSYSTIC suffix.
- Capability architecture: AI Systems, Product Engineering, and Data & Cloud pillar routes exist; Enterprise RAG and AI Reliability service entries exist.
- Lockfile sanity: the existing `package-lock.json` parses and its root dependency/devDependency declarations match `package.json`.
- Parser syntax check: all TypeScript/TSX/JavaScript/JSX/MJS source/config/script files parsed with zero syntax diagnostics using the available global TypeScript parser.
- JSON check: all JSON files in the clean source tree parse successfully.
- P0 preservation: 46 baseline protected files covering Careers, admin, APIs, contact, Cal.com/scroll-lock, backend/data libraries, database schema/migrations, proxy/auth-related routing, scripts present in P0, and `.env.example` matched the pre-finalization hashes byte-for-byte. The new static QA script is additive and not part of that baseline set.
- Targeted claim sweep: remaining risk-sensitive wording is scoped/qualified; no blanket certification promise or unqualified zero-downtime/IP guarantee is claimed by the finalized public content.

## Post-local visual QA correction

- Footer density corrected after desktop localhost review: desktop-only 44px link-row inflation removed, spacing/padding tightened, contact row compacted, social control reduced, and duplicate Privacy/Terms links removed from the Resources column while remaining in the legal bottom bar. Mobile touch targets remain unchanged.
- Dependency-independent static QA was rerun after this correction and passed.

## Not verified in this environment

A fresh local dependency install was unavailable during this session. The earlier install attempt for this working session could not resolve the npm registry, and the required dependency tarballs were not fully available offline. Therefore the following are intentionally **not marked passed**:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- hydrated browser runtime / console checks
- full responsive browser matrix after the final source changes
- real-device Mobile Safari behavior
- live Contact submission
- live Careers vacancy → application → CV upload → storage → database → admin retrieval/status workflow
- live admin authentication/content operations
- live email delivery
- live Cal.com booking completion
- production Core Web Vitals (LCP, CLS, INP)

## Exact local commands to run next

From the extracted project root:

```bash
npm ci
npm run qa:static
npm run typecheck
npm run lint
npm run build
npm run dev
```

Do not replace `npm ci` with a lockfile-regenerating install unless you intentionally decide to update dependencies. The supplied lockfile was preserved rather than fabricated/regenerated.

## Manual browser acceptance after `npm run dev`

Check at minimum: 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1536, 1920, and 2560+ px, plus relevant mobile/tablet landscape states.

Verify:

- no unintended horizontal overflow;
- desktop navigation and mobile drawer, keyboard/focus/Escape behavior and scroll locking;
- homepage technical visuals and pillar/service layouts recompose rather than simply shrink;
- Work/case studies, industries, Insights, Trust, About/Leadership, Careers, Contact, legal, 404, footer and CTAs;
- Cal.com modal sizing, focus return, background scroll lock and mobile Safari viewport behavior;
- Contact loading/error/success/duplicate-submit behavior;
- Careers vacancy listing, job detail, Apply flow, CV upload validation/storage, database insertion, admin Applications access, CV retrieval/download, status workflow, and configured notifications;
- admin auth and content CMS behavior;
- redirects for legacy service aliases and canonical/sitemap/robots behavior;
- browser console/hydration errors and missing assets;
- Lighthouse/Core Web Vitals on representative public pages.

Production release should remain blocked until dependency-backed commands and required live/staging smoke tests pass.
