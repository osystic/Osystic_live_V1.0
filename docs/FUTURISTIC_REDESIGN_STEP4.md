# OSYSTIC Home Step 04 — AI Runtime Experience

This patch upgrades only the homepage AI workflow section on top of the Step 03 master.

## What changed
- Replaced the old six static workflow boxes with a unique `HomeAIWorkflowExperience` client component.
- Added a desktop scroll-controlled 6-stage runtime sequence: Input → Retrieval → Reasoning → Guardrails → Output → Audit Trail.
- Added a moving execution packet, stage states, policy/observability control planes, runtime payload inspector, and per-stage telemetry.
- Added manual stage inspection controls for mouse/keyboard users.
- Added responsive tablet/mobile composition without sticky-scroll trapping.
- Added reduced-motion behavior.
- Added the visual handoff `05 / AI Runtime → 06 / Industry Context`.
- Preserved the homepage as an async Server Component; only this animated experience hydrates as a client island.

## Files
- `app/components/home/HomeAIWorkflowExperience.tsx` — new
- `app/page.tsx` — updated
- `app/future-home.css` — updated

## Dependencies
No new dependencies beyond the Step 03 master. It uses the already-added:
- `framer-motion`
- `gsap`
- `@gsap/react`
- `lucide-react`

## Validation performed
- TSX parse validation passed for the new component and updated homepage.
- CSS brace/structure validation passed.

## Apply
Copy these files over the corresponding paths in the Step 03 project. If starting from the Full Source ZIP, no manual merge is required.
