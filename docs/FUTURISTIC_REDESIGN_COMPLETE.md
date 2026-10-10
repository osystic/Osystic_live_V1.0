# OSYSTIC Futuristic Redesign — Complete Frontend Release

## Release goal

This release converts the public OSYSTIC website into a cohesive enterprise AI/software engineering experience while avoiding a generic repeated inner-page template. Shared components are restricted to primitives and system-level chrome; public-page composition, information hierarchy and centerpiece visualisation are selected for the content of each route.

## 10-stage connected homepage

1. **Intelligence Core** — interactive React Three Fiber network hero with pointer response and telemetry.
2. **Delivery Principles** — ownership, deployment, phased delivery and security emerge inside the same cinematic scene.
3. **Evidence / Selected Work** — approved case-study outcomes and confidentiality-aware fallback.
4. **Capability System** — scroll-driven engineering-system topology across AI Systems, Product Engineering and Data & Cloud.
5. **AI Runtime** — request packet progresses through Input, Retrieval, Reasoning, Guardrails, Output and Audit.
6. **Industry Context** — operational industry radar rather than a generic card grid.
7. **Trust Control** — security/governance control-plane presentation.
8. **Knowledge Signal** — editorial/insights signal board.
9. **Global Delivery** — distributed delivery/network layer.
10. **Start a Project** — final project-entry CTA.

Desktop uses cinematic sticky/scroll-linked behavior where it adds meaning. Tablet/mobile collapse to readable sequential experiences rather than forcing desktop pinning. Reduced-motion preferences are respected.

## Public page architecture

- `/capabilities` — Capability Atlas / engineering system map.
- `/capabilities/ai-systems` — reasoning mesh visual language.
- `/capabilities/product-engineering` — product stack / delivery blueprint.
- `/capabilities/data-cloud` — pipeline and topology model.
- `/industries` — operational industry radar and context matrix.
- `/industries/[slug]` — sector-context console with industry-specific accent/visual behavior.
- `/case-studies` — evidence ledger and outcome-oriented work index.
- `/case-studies/[slug]` — evidence file with challenge → system response → outcomes.
- `/about` — operating manifesto and global operations model.
- `/trust` — security/control room.
- `/insights` — knowledge signal board.
- `/blogs/[slug]` — long-form technical reading mode.
- `/newsroom/[slug]` — dispatch/wire treatment.
- `/contact` — project intake console.
- `/careers` — mission / role terminal.
- `/leadership` — leadership/accountability profile.
- `/support` — support routing console.
- `/privacy` and `/terms` — distinct legal-ledger treatments.
- `/unauthorized` — security boundary state.
- Canonical service routes use the actual service dataset as their visual system: AI workflow graphs, data/cloud pipeline graphs, engineering code systems, or a specialized fallback constellation. Route-derived layout variants prevent the service catalogue from presenting as one identical page shell.
- Legacy aliases continue to redirect to canonical routes and intentionally do not render duplicate visual pages.

## Global navigation and portal gateway

The global header includes:

- scroll-aware enterprise glass/navigation treatment,
- active-route state,
- capabilities mega-navigation,
- responsive dialog-based mobile navigation,
- footer-only **Admin Login** gateway,
- **Book a Technical Call** CTA.

Backend access is intentionally not configurable from the public header. The only public gateway is the footer utility link `Admin Login`, which opens `https://www.osystic.com/admin/`.

Configure booking with:

```env
NEXT_PUBLIC_CALCOM_BOOKING_URL=osystic/technical-call
```

## Performance approach

- The homepage remains a Server Component and retains server-side case-study fetching.
- WebGL is isolated to a client-only hero scene rather than turning the full page into a client bundle.
- The 3D scene is procedural: no heavyweight GLB/HDR/texture payload is required for the main hero.
- Device pixel ratio is capped and antialiasing is intentionally conservative.
- 3D loading is deferred from the initial server HTML path.
- Mobile/reduced-motion states avoid expensive sticky choreography.

## Design-system files

- `app/future-home.css` — home/header/3D/connected-scroll system.
- `app/future-pages.css` — bespoke public-page systems and responsive variants.
- `app/components/future/FutureReveal.tsx` — reusable motion primitive only, not a page template.

## Required packages

The redesign declarations are already in `package.json`:

- `framer-motion`
- `gsap`
- `@gsap/react`
- `three`
- `@react-three/fiber`
- `@react-three/drei`
- `@types/three` (development)

Run `npm install` once on a machine with npm registry access.

## Release / lockfile note

The build environment used to prepare this archive had DNS access to the npm registry disabled, so it could not truthfully regenerate a dependency lock containing the newly added animation/3D dependency graph. Do **not** use an inherited stale lock for `npm ci`. Run `npm install` once in a networked development environment and commit the newly generated `package-lock.json` before CI/deployment if your pipeline requires a lockfile.

## Security hygiene performed

- Runtime SQLite `-wal` / `-shm` sidecars were checkpointed/removed from the release.
- Setup documentation was scrubbed of embedded live-looking credentials and old brand identifiers.
- `.env.example` contains placeholders only.
- No `.env`, build cache, `node_modules`, or Next.js output is included.

The existing `local.db` is retained because it belongs to the supplied application/data layer. Treat the source archive as private because that database can contain operational/admin records.

## QA performed offline

Because npm packages could not be downloaded in the preparation environment, a full `next build` was not claimed. The following offline checks were run instead:

- TS/TSX syntax parse across the source tree.
- static relative-import resolution.
- internal route-reference validation.
- referenced public-asset existence validation.
- CSS structural/braces validation.
- service alias/canonical-route hygiene checks.
- runtime/cache artifact cleanup.

After `npm install`, run:

```bash
npm run typecheck
npm run lint
npm run qa:static
npm run build
```

before production deployment.
