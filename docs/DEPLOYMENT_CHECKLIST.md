# OSYSTIC Deployment Checklist

## 1. Security before anything else

- [ ] Rotate the database credential that existed in the legacy source archive.
- [ ] Create a new `ADMIN_JWT_SECRET` with at least 32 random characters.
- [ ] Confirm no `.env` / `.env.local` file is committed or uploaded with the code.
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- [ ] Restrict production database network/access settings as appropriate.
- [ ] Confirm Supabase Storage policies for careers CV uploads.
- [ ] Verify runtime SQLite/database files are not committed or bundled with the deployment artifact.
- [ ] Confirm state-changing `/api/*` calls reject missing/cross-site `Origin` headers.
- [ ] Verify CSP, HSTS, DENY framing, nosniff, Referrer-Policy, and Permissions-Policy on production responses.

## 2. Environment

Copy `.env.example` to the deployment platform and set real values.

- [ ] `DATABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `RESEND_FROM`
- [ ] `ADMIN_EMAIL=hello@osystic.com`
- [ ] `ADMIN_JWT_SECRET`
- [ ] `ADMIN_ALLOWED_EMAIL`
- [ ] `CSRF_TRUSTED_ORIGINS` left blank unless an exact HTTPS staging frontend is required
- [ ] `ADMIN_SIGNUP_ENABLED=false` after initial admin setup
- [ ] `NEXT_PUBLIC_CALCOM_BOOKING_URL`

## 3. Install and validate

```bash
npm install
npm run qa:static
npm run typecheck
npm run lint
npm run build
```

The first networked `npm install` regenerates `package-lock.json` for the new animation/3D dependencies. Commit that generated lock, then static QA, typecheck, lint, and the production build must pass before production release.

## 4. Functional smoke test

- [ ] Home renders on desktop, tablet, and mobile
- [ ] Header/mobile menu works
- [ ] “Book a Technical Call” opens Cal.com modal
- [ ] Modal closes with button and Escape key
- [ ] Contact form inserts submission successfully
- [ ] Contact notification reaches `hello@osystic.com` if Resend is enabled
- [ ] Careers form accepts PDF/DOC/DOCX up to 5 MB
- [ ] Careers CV storage is private/appropriately controlled
- [ ] Admin login works
- [ ] Admin pages redirect unauthenticated users
- [ ] Content creation/edit/delete works for draft and published content
- [ ] Case studies display only published approved records
- [ ] Blog/newsroom pages display only published records

## 5. SEO / crawling

- [ ] `https://www.osystic.com/robots.txt`
- [ ] `https://www.osystic.com/sitemap.xml`
- [ ] canonical metadata on primary pages
- [ ] 404 page works
- [ ] old `/book` and `/bookings` routes redirect to Contact
- [ ] old service aliases redirect to current canonical routes
- [ ] no broken internal links from a production crawl
- [ ] Search Console property and sitemap submitted
- [ ] Organization + LocalBusiness JSON-LD validates with the Albuquerque, New Mexico US address only
- [ ] No legacy non-US company-location references or non-US company timezone remain in public source or rendered HTML
- [ ] Open Graph/Twitter previews render the configured OSYSTIC preview image

## 6. Content approval

Follow `CONTENT_APPROVAL_CHECKLIST.md` before marking any case study, newsroom item, metric, testimonial, certification, partner statement, or leadership biography as published.

## 7. Performance

- [ ] Verify responsive image generation through Next/Image
- [ ] Run Lighthouse on Home, Capabilities, Work, Contact
- [ ] Check LCP / CLS / INP on actual production hosting
- [ ] Avoid loading 3840×2160 originals directly outside the image pipeline
- [ ] Check mobile network performance

## 8. Release

- [ ] Create production release tag/commit
- [ ] Back up database before schema changes
- [ ] Deploy to staging first
- [ ] Complete stakeholder visual review
- [ ] Deploy production
- [ ] Re-run smoke test after DNS/CDN propagation
