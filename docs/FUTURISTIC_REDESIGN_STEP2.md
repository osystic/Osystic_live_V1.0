# OSYSTIC Futuristic Redesign - Step 2

## Scope
Step 2 connects the home hero, delivery principles, and selected work into one continuous scroll story while preserving server-rendered case-study data.

## Implemented
- Extended desktop hero into a 218svh storytelling sequence with a sticky viewport.
- Reuses the Step 1 interactive R3F intelligence core through the transition instead of replacing it with another asset.
- GSAP ScrollTrigger moves the hero copy out, repositions/scales the 3D system, and introduces the delivery-principles layer.
- Moved the former static proof strip into the hero story as four glass engineering-principle cards.
- Added a visual handoff from step 02 (Delivery Principles) to step 03 (Proven Outcomes).
- Added `HomeWorkTransition` to animate the Selected Work heading and case-study cards without moving case-study fetching into a client component.
- Added a subtle light-section grid/energy transition so the dark 3D scene and white case-study surface feel connected.
- Tablet/mobile automatically use a normal stacked composition instead of a pinned long-scroll sequence.
- `prefers-reduced-motion` disables the cinematic transforms and keeps all content immediately visible.

## Architecture
- `app/page.tsx` remains an async Server Component.
- `HomeHero.tsx` is the client animation island for steps 01-02.
- `HomeWorkTransition.tsx` is a thin client wrapper around server-rendered Selected Work content.
- No new dependencies were added in Step 2; it uses the Step 1 Framer Motion, GSAP, R3F, Drei, and Three.js setup.

## Changed files
- `app/page.tsx`
- `app/components/home/HomeHero.tsx`
- `app/components/home/HomeWorkTransition.tsx` (new)
- `app/future-home.css`
- `docs/FUTURISTIC_REDESIGN_STEP2.md` (new)
