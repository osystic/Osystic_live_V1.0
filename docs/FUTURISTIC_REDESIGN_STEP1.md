# OSYSTIC Futuristic Redesign - Step 1

This step implements the new global navigation/header and the home page 3D hero.

## What changed

- Premium translucent enterprise navigation.
- Active-route behavior and existing capability mega-menu preserved.
- Public header contains only the primary `Book a Call` CTA.
- Backend access is intentionally kept out of the header and mobile navigation.
- A discreet `Admin Login` gateway exists only in the global footer.
- New procedural React Three Fiber AI/network scene in the home hero.
- R3F canvas is client-only and mounted after the critical initial render.
- Framer Motion handles initial hero/header entrance motion.
- GSAP ScrollTrigger handles the hero's scroll-linked exit/parallax transition and establishes the animation architecture for the later connected 10-stage homepage sequence.
- `prefers-reduced-motion` is respected.
- Mobile navigation and mobile hero have dedicated responsive compositions.

## New runtime packages

```bash
npm install framer-motion@^13.4.5 gsap@^3.13.0 @gsap/react@^2.1.2 three@^0.186.1 @react-three/fiber@^9.7.0 @react-three/drei@^10.7.9
npm install -D @types/three@^0.186.0
```

The provided source `package.json` already contains these entries. Run `npm install` once so npm can update `package-lock.json` on a machine with registry access.

## Admin Access

The public website exposes backend access only through the footer utility link `Admin Login`, targeting `https://www.osystic.com/admin/`.

## Files added

- `app/components/home/HomeHero.tsx`
- `app/components/home/HeroScene3D.tsx`
- `app/future-home.css`
- `.env.example`

## Files changed

- `app/components/Navbar.tsx`
- `app/page.tsx`
- `app/layout.tsx`
- `package.json`

## Architectural rule for remaining redesign

The future redesign must not use one generic inner-page template. Capabilities, Industries, Case Studies, Insights, About/Company, Contact and their detail routes should each receive a content-specific visual system, interaction model, scroll narrative and data/3D treatment while retaining a consistent OSYSTIC brand language.
