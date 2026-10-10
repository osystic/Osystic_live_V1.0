# OSYSTIC Futuristic Enterprise Frontend — Release Manifest

This source checkpoint contains the complete supplied Next.js application plus the finished public-site futuristic redesign.

## Included

- Global futuristic navigation with booking CTA; backend Admin Login is exposed only in the footer utility bar.
- Procedural React Three Fiber hero scene.
- Ten-stage connected homepage narrative.
- Bespoke public-page architectures across capabilities, capability pillars, services, industries, case studies, company/about, trust, insights, article/newsroom reading modes, leadership, careers, contact, support, legal and security-boundary states.
- Context-driven dynamic service/industry visual systems.
- Futuristic footer and global public design tokens.
- Responsive and reduced-motion treatments.
- Existing server data-fetching contracts and admin/backend routes preserved.
- Sanitized `.env.example`, setup/release documentation and existing application database.

## Intentionally excluded

- `node_modules`
- `.next`
- private `.env` / `.env.local`
- caches and temporary build metadata
- SQLite WAL/SHM runtime sidecars
- stale pre-redesign `package-lock.json`

The dependency lock must be generated with one networked `npm install` because the preparation environment could not reach the npm registry after the animation/3D dependency declarations changed.

## Data note

`local.db` is retained because it is part of the supplied application/data layer and contains operational records. Keep this source archive private. A temporary signed CV URL token found in the supplied database was redacted while preserving its stored object path.

## Release gate

Follow `QA_REPORT.md`, `DEPLOYMENT_CHECKLIST.md`, and `FUTURISTIC_REDESIGN_COMPLETE.md` before production deployment.
