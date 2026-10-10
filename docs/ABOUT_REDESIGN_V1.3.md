# OSYSTIC About Page Redesign — v1.3

## Scope
The public `/about` experience was rebuilt from the ground up to remove person-centric presentation and replace it with an enterprise company narrative.

## Personal-data cleanup
- Removed founder name, biography, and portrait from `/about`.
- Removed the public personal-profile leadership page; `/leadership` now redirects to the governance section on `/about`.
- Removed the founder name from chatbot public knowledge copy.
- Deleted the previous public founder portrait asset from `public/team/`.
- Removed hard-coded teammate identity from admin authentication source by moving the authorized admin address to `ADMIN_ALLOWED_EMAIL`.
- No previous founder or teammate name literal remains in the release source.
- The OSYSTIC company LinkedIn URL remains because it is a corporate social link, not a personal profile.
- The Careers LinkedIn field remains because it collects optional applicant profile data and is unrelated to company leadership profiles.

## New About experience
1. Trust Network 3D hero — procedural React Three Fiber network representing trust, scale, ownership, and global delivery.
2. Company Thesis — Vision, Mission, and Standard as large narrative rows.
3. Engineering Excellence — GSAP-driven evidence rail for framing, architecture, engineering, and proof.
4. Scale Architecture — visual operating-system map focused on modularity, controls, delivery protocol, and handover.
5. Leadership & Governance — neutral premium placeholder roles with no people or personal imagery.
6. Delivery Fabric — verified operating presence and distributed engineering network.

## Motion/performance
- `AboutNetwork3D` is dynamically imported with `ssr: false`.
- WebGL mounts during browser idle time.
- IntersectionObserver pauses the R3F frame loop when the hero is outside the relevant viewport range.
- GSAP ScrollTrigger owns scroll-linked transforms; Framer Motion owns entrance/reveal motion.
- Desktop sticky storytelling collapses to a standard responsive flow on tablet/mobile.
- `prefers-reduced-motion` disables the sticky cinematic sequence.

## Deployment note
Admin authorization now reads the allowed login address from:

```env
ADMIN_ALLOWED_EMAIL=
```

Set this to the existing authorized admin email before deploying this source. `ADMIN_JWT_SECRET` remains required as before.

## Validation
- Changed TypeScript/TSX files: syntax transpile PASS.
- CSS brace validation: PASS.
- Static QA: all checks pass except the already-known missing `package-lock.json`.
