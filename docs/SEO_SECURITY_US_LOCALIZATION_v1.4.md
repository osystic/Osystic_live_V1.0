# OSYSTIC v1.4 — US Localization, SEO, and Security Hardening

## Release objective

This release makes the public website consistently US-based, expands App Router SEO coverage across every public route, adds structured data, and hardens the application boundary for browser/API traffic.

## Canonical company identity

Public business address used by the website and structured data:

**OSYSTIC**  
102 Gold Ave SW, PMB 734  
Albuquerque, NM 87102  
United States

Canonical origin: `https://www.osystic.com`

A static regression check now fails if legacy non-US company-location terms or the previous non-US timezone reappear in public source/content files.

## SEO architecture

- `lib/seo.ts` centralizes titles, descriptions, canonical URLs, keyword sets, Open Graph, Twitter cards, and robot directives.
- Every public `app/**/page.tsx` now exports metadata directly or uses `generateMetadata` for dynamic content.
- Legacy aliases are permanent redirects and explicitly `noindex`.
- `app/layout.tsx` defines the global metadata baseline and `en-US` document language.
- Default social preview: `/public/brand/osystic-og.png`.
- Dynamic blog/newsroom/case-study pages use their own featured images when available.
- `app/sitemap.ts` produces canonical static, service, industry, case-study, blog, and newsroom URLs.
- `app/robots.ts` allows normal search crawling while excluding `/admin`, `/api`, and unauthorized surfaces.
- The apex host redirects permanently to `https://www.osystic.com`.

### Structured data

Global JSON-LD in `app/layout.tsx` includes:

- `Organization`
- `LocalBusiness` + `ProfessionalService`
- `WebSite`
- US `PostalAddress`
- Company LinkedIn identity
- Contact point and worldwide service area

Contextual pages additionally emit:

- `BreadcrumbList`
- `Service`
- `Article`
- `CreativeWork` for case studies

`StructuredData.tsx` serializes JSON-LD safely and escapes literal `<` characters before writing a script block.

## Semantic HTML and accessibility

Marketing experiences preserve one page-level `<main>` and use `<section>`, `<article>`, `<header>`, `<aside>`, `<time>`, and ordered heading levels around animated/3D visuals. WebGL canvases remain visual enhancements rather than the only representation of page meaning. Existing skip navigation and reduced-motion behavior remain intact.

## Security hardening

### HTTP headers (`next.config.ts`)

- Content-Security-Policy
- Strict-Transport-Security (2 years, includeSubDomains, preload)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy with camera/microphone/geolocation/payment/USB/browsing topics disabled
- Cross-Origin-Opener-Policy
- Cross-Origin-Resource-Policy
- Origin-Agent-Cluster
- X-DNS-Prefetch-Control
- X-Permitted-Cross-Domain-Policies
- X-Download-Options
- modern `X-XSS-Protection: 0`
- `poweredByHeader: false`
- production browser source maps disabled

Production CSP does **not** include `unsafe-eval`. `unsafe-inline` remains for script/style compatibility with the current Next.js hydration runtime and Cal.com embed. Moving to a nonce/hash CSP is possible, but it should be done as a deliberate rendering architecture change because Next.js nonce CSP requires per-request nonce handling and can affect static optimization/caching.

### CSRF

`proxy.ts` now covers `/api/:path*` as well as `/admin/:path*`.

Every state-changing API method (`POST`, `PUT`, `PATCH`, `DELETE`) requires an exact trusted `Origin`; cross-site requests and requests without Origin are rejected. Production trusts the canonical OSYSTIC origin. Optional staging origins can be added with `CSRF_TRUSTED_ORIGINS` as an exact comma-separated HTTPS allow-list.

Admin cookies remain `HttpOnly`, production `Secure`, and `SameSite=Strict`.

### Input and XSS controls

- `lib/input-security.ts` normalizes and sanitizes plain-text single-line and multiline input.
- Contact and Careers APIs use Zod schemas, strict size limits, rate limiting, honeypots, normalized email fields, and text sanitation.
- Career URLs must be valid HTTPS URLs.
- CV uploads enforce size, MIME type, and magic-byte signatures before storage.
- Admin CMS fields are sanitized; rich published HTML uses the `sanitize-html` allow-list sanitizer.
- Public article/case-study rendering only receives sanitized HTML.
- Chatbot HTML formatting escapes all input before reintroducing a tiny controlled tag set.
- Drizzle queries remain parameterized.

### Runtime data hygiene

Runtime SQLite files are ignored by Git (`local.db`, WAL/SHM, `*.sqlite*`). The clean source release should not be used to overwrite an existing production database. Back up production data and apply schema changes separately.

The current SQLite layer now honors `DATABASE_URL=file:...`, enables foreign keys, WAL mode, and a busy timeout. US localization also changes current accounting defaults to USD while retaining multi-currency support.

## Known production gates

The source is statically validated, but the container could not reach the npm registry. Therefore a trustworthy regenerated `package-lock.json` could not be produced after adding `sanitize-html` and the earlier animation dependencies.

On a networked development/staging machine, run:

```bash
npm install
npm run qa:static
npm run typecheck
npm run lint
npm run build
```

Commit the newly generated `package-lock.json`, then perform a clean reproducibility pass:

```bash
rm -rf node_modules .next
npm ci
npm run qa:static
npm run typecheck
npm run lint
npm run build
```

### Distributed production rate limiting

Contact, Careers, and admin-login rate limiting currently uses in-process maps. That works for a single long-lived Node process but is not globally consistent across horizontally scaled/serverless instances. Production should additionally enforce rate limiting at the CDN/WAF/reverse-proxy layer or move counters to a shared store such as Redis.

## Search-engine launch checklist

1. Deploy the canonical `www` host and verify apex → `www` 308 redirect.
2. Verify `/robots.txt` and `/sitemap.xml` after deployment.
3. Validate Organization/LocalBusiness/Service/Article JSON-LD in Google Rich Results Test / Schema.org validator.
4. Confirm social previews for Home, About, Capabilities, an industry page, one service, one case study, and one article.
5. Submit `https://www.osystic.com/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
6. Run a production crawl and verify no redirect aliases are indexable.
7. Verify response security headers on HTML and API routes.
8. Run Lighthouse and real-device Core Web Vitals checks after CDN/DNS deployment.
