# OSYSTIC Production UI / Next.js Audit — 2026-10-10

## Executive verdict

The public frontend is visually coherent and the core Next.js architecture is generally sound, but the current source must **not** be described as fully compliant with the literal “zero replication / unique 3D on every page” requirement or as build-verified production-ready yet.

### Status by requirement

- **Static primary marketing pages:** PASS with qualifications. About, Capabilities index, Industries index, Case Studies index, Trust, Insights, Contact, Careers, Leadership, Support and the legal surfaces use distinct page-specific compositions rather than one shared inner-page shell.
- **Capability pillar pages:** PASS. AI Systems, Product Engineering and Data & Cloud share a renderer file but branch into three materially different page architectures.
- **Dynamic service detail pages:** FAIL against literal zero-replication. Multiple canonical services are rendered by `ServiceDetailPage.tsx`. Data changes and three layout classes produce variation, but the section skeleton remains shared.
- **Dynamic industry detail pages:** FAIL against literal zero-replication. Eight industry slugs use one route/component skeleton with industry colors and several per-sector CSS variations.
- **Case-study detail pages:** FAIL against literal zero-replication if every individual case-study slug must have a distinct architecture. The content type intentionally uses one evidence-detail template.
- **Blog/news article slugs:** FAIL against literal zero-replication if every article slug must have a unique page architecture. Blog and newsroom are distinct from each other, but each content type uses a repeatable reading template.
- **Unique 3D on every page:** FAIL. Actual React Three Fiber/WebGL currently exists only in the homepage hero. Other pages use CSS/SVG spatial visuals, not unique WebGL scenes.
- **Homepage motion system:** PASS with fixes in this audit. Scroll-linked GSAP and Framer Motion are used in scoped client islands; major performance/ownership issues found during review were refactored.
- **Server / client separation:** PASS. Data-bearing route pages remain Server Components; browser animation, dialog and interaction logic is isolated in Client Components.
- **Build reproducibility:** BLOCKED. `package-lock.json` is missing and registry access was unavailable in the audit environment, so `npm ci`, a clean dependency install, lint and `next build` could not be honestly certified.

## Important fixes applied during this audit

### 1. Homepage Three.js render loop now pauses off-screen

Before: `HeroScene3D` used a continuously running R3F frame loop for the lifetime of the homepage, even after the hero scrolled far outside the viewport.

After:
- `HomeHero` uses `IntersectionObserver` to track the hero near the viewport.
- `HeroScene3D` receives an `active` prop.
- R3F switches between `frameloop="always"` and `frameloop="never"`.
- Initial WebGL mounting remains deferred with `requestIdleCallback` / timeout fallback.
- Reduced-motion users never mount the WebGL scene.

### 2. 3D draw-call pressure reduced

Before: the network used many individual Drei `Line` objects for radial and inner links.

After:
- Radial links are combined into one `THREE.LineSegments` geometry.
- Inner links are combined into a second line-segment geometry.
- Torus segment counts, sphere segment counts and sparkle count were reduced modestly.
- The inner physical/transmission material was replaced by a cheaper standard material.
- DPR ceiling was lowered from 1.45 to 1.35.

This preserves the visual language while reducing GPU and CPU overhead.

### 3. GSAP and Framer Motion no longer own the same hero transform targets

Before: Framer Motion entrance animation and GSAP scroll transforms both wrote `transform` / `opacity` on the same hero copy, visual and telemetry elements. This can produce timing races, transform replacement and difficult-to-debug scroll jitter.

After:
- GSAP owns the parent scroll-transition targets.
- Framer Motion entrance animations are applied to child content/orbit/telemetry items.
- The expensive animated CSS `filter: saturate(...)` was removed from the scroll timeline.

### 4. Infinite Framer animations pause outside the viewport

Before: the homepage Industry radar sweep and Trust pulse repeated indefinitely while mounted.

After:
- both sections use `useInView`;
- infinite motion runs only while the section intersects the viewport;
- reduced-motion remains honored.

### 5. Chat widget timer/unmount cleanup improved

Before:
- the first-open focus timeout was not cancelled;
- the simulated thinking delay could continue and write state after a future unmount.

After:
- the focus timer is cleared in effect cleanup;
- a mounted ref prevents state updates after unmount.

## Animation / ScrollTrigger review

### What is good

- GSAP code is isolated to client components.
- `useGSAP` scopes selectors to section refs.
- desktop-only sticky choreography is guarded by media queries.
- `gsap.matchMedia().revert()` is returned from the GSAP hooks.
- primary explicit ScrollTriggers are killed on cleanup.
- reduced-motion short-circuits major scroll choreography.
- React state changes in scroll handlers happen only when the active stage changes, not for every scroll frame.

### Remaining architectural limitation

The ten homepage stages do **not** use one master GSAP timeline. They are a set of coordinated section-level timelines / triggers plus visual handoff components. This is a valid modular implementation, but it is not literally one mathematically continuous timeline. On unusual viewport heights or after major content-height changes, section boundaries depend on each trigger recalculating correctly.

Before calling it “perfectly linked,” final browser QA should include:
- Chrome / Edge / Firefox / Safari desktop;
- 1366×768, 1440×900, 1920×1080, ultrawide;
- iOS Safari and Android Chrome;
- browser zoom at 90%, 100%, 125%;
- resize/orientation changes after page load;
- back/forward navigation with restored scroll position.

## Next.js App Router review

### Correct decisions

- `app/page.tsx` is a Server Component and fetches case studies server-side.
- dynamic content pages fetch data on the server.
- animation-heavy homepage components are client islands.
- R3F is imported with `next/dynamic({ ssr: false })`.
- Cal.com is also dynamically loaded client-side.
- root metadata, OpenGraph metadata and structured data remain server-rendered.
- admin navigation/footer visibility is route-aware without converting all route pages to client components.

### Hydration / effect review

No deterministic server/client markup mismatch was found in the audited public components. Browser globals are used inside client components/effects or inside helper functions called by client code. Dialog listeners, scroll listeners, matchMedia listeners, observers and explicit timers have cleanup paths after the audit fixes.

## Performance findings that remain

### A. Root-level CSS payload — MEDIUM

Root layout imports approximately 245 KB of uncompressed global CSS source across `globals.css`, `premium.css`, `responsive.css`, `interaction.css`, `future-home.css`, and `future-pages.css`. Because homepage and page-specific futuristic rules live in root-imported globals, non-home routes can receive CSS they do not use.

Recommended production refactor: split global design tokens/chrome from route-specific styles and move route families into CSS Modules or nested route-group layouts. Do this after visual lock because it is a broad regression-sensitive change.

### B. Missing lockfile / unverified clean build — BLOCKER

A production release should have a committed `package-lock.json` and pass:

```bash
npm ci
npm run qa:static
npm run typecheck
npm run lint
npm run build
```

The audit environment could not access the npm registry, so the lock could not be regenerated here. Do not deploy solely on the basis of source-level checks.

### C. CMS HTML sanitizer — MEDIUM, security hardening

Published CMS HTML is sanitized before `dangerouslySetInnerHTML`, which is good, but the current sanitizer is regex-based. A mature production CMS should use a maintained allow-list sanitizer rather than relying on regex for hostile/malformed HTML.

## Zero-replication remediation required

To meet the requirement literally, do not merely add different gradients to shared templates. The following need hand-authored experience architecture:

1. Every canonical service page currently routed through `ServiceDetailPage.tsx` needs a service-specific scene / section grammar (examples: agent execution graph, vision frame inspector, retrieval index explorer, cloud topology, security threat plane, mobile device matrix, SaaS tenant map, ERP process graph).
2. All eight industry detail pages need industry-specific interaction models rather than the same challenge/solution structure with different skinning.
3. If “every single page” includes CMS entries, each case study and article would need an authored layout schema stored with the content. Without that schema, a CMS necessarily repeats a content template.
4. Every page requiring unique 3D must have a page-specific WebGL scene or an explicit scene schema. Current CSS/SVG pseudo-3D does not satisfy that statement.

## Source-level validation completed

- TypeScript transpile/syntax pass across 205 `.ts` / `.tsx` source files in the audited tree.
- Static QA passes every existing check except lockfile sanity.
- Public source imports/routes/assets had already been covered by `qa:static` and remain clean.
- R3F is client-only and SSR-disabled at the hero boundary.

## Production verdict

**Architecture quality:** strong foundation.

**Homepage implementation after audit fixes:** production-oriented, pending real-browser performance/build verification.

**Literal zero-replication requirement:** not yet met.

**Safe to call fully production-ready today:** no, until the lockfile/build gate and zero-replication scope are completed and browser-tested.
