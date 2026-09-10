# P0 follow-up: latest status

Supersedes the earlier report's build/preview blockers and its statement that no backend code changed. The user subsequently requested required functionality fixes, prioritizing Careers receipt over new capabilities. The 2026 capability review is deferred; no trend research or public marketing additions were made.

## Important findings and fixes

| Finding | Fix |
|---|---|
| Resend option prevented type checking | Changed `reply_to` to the installed SDK's `replyTo` |
| Eager Supabase credential checks prevented production build | Server-only, request-time storage initialization; unconfigured Careers returns 503 |
| No admin application inbox | Added `/admin/careers`, paginated read-only application details, linked from content administration |
| Content-admin access is too broad for recruitment data | New inbox and download endpoint recheck the database for an active `super_admin` on every request; no recruitment access granted to other roles |
| Saved CV URL expires after seven days | New authenticated `/api/admin/careers/[id]/cv` issues a 60-second download URL using stored object path; private/no-store response |
| CV storage privacy and lifecycle | Reject public buckets, use random UUID keys without applicant names, remove newly uploaded object if signing or database insertion fails |
| Detached email promise can be terminated after response | Register notification work with Next `after()`; receipt remains based on successful storage/database insert, not email success |
| Client accepts values rejected by server | Added matching field-length limits, phone/country minima and HTTPS URL guidance |

The inbox is intentionally read-only: no deletion, candidate status change, bulk export or new role grant was introduced. No database schema or migration was changed. Existing CV paths remain supported. Existing service pages, brand/contact details and public routing remain unchanged. The new endpoints extend the existing Next architecture rather than replacing it.

## Verification

- Full `npm run build`: PASS, including TypeScript and generation of 88 static pages. Missing-database/email warnings remain expected in this unconfigured environment. The empty publication fallback is not evidence of an empty production database.
- Focused ESLint on new P0 server files/routes and inbox: PASS. Final frontend validation adjustments receive lint/typecheck separately.
- Production preview became functional using a temporary production launch command through the existing supervisor. The development runner was restored before packaging.
- Browser observed: homepage rendered, capabilities toggle expanded its menu; booking fallback dialog opened with focus on close and body scroll locked; close button worked; Contact and Careers navigation reached their pages; Careers empty-step validation marked five fields and focused firstName.
- Contact submission and subsequent Careers Continue clicks encountered browser-control protocol timeouts. No successful submission, request outcome, or later step transition is asserted from these attempts.
- Actual CV upload → private storage → database row → authenticated inbox → download → notification delivery remains **NOT VERIFIED**. No fake candidate record or test booking was inserted.
- Mobile menu, configured Cal iframe, image decoding, complete primary transitions, console/hydration error review, physical Safari/Android and Core Web Vitals remain incomplete. Earlier responsive layout measurements do not close these gates.

## Remaining P0 requirements

Configure test integrations through the normal secure environment setup: DATABASE_URL; NEXT_PUBLIC_SUPABASE_URL; SUPABASE_SERVICE_ROLE_KEY; a private `cv-uploads` bucket; RESEND_API_KEY and a verified RESEND_FROM; controlled ADMIN_EMAIL destination; ADMIN_JWT_SECRET; an existing active super-admin test account; NEXT_PUBLIC_CALCOM_BOOKING_URL. Do not paste secrets into reports or source. Rebuild after configuring public environment values. Approved CMS test content is required to test populated detail templates.

Security is not signed off. Remaining checks include storage access policies and pre-existing public URLs, file-content/malware validation beyond declared MIME, infrastructure request-body limits, shared/rate-limiting and trusted client-IP handling, broader admin role enforcement/token revocation, and end-to-end unauthorized access tests. The client Content-Length guard is preliminary, not a replacement for an infrastructure body limit. `after()` improves request lifetime handling but is not a durable retry queue; email errors are logged and delivery must be verified. No private bucket or production configuration was modified remotely.

New 2026 capability pages stay blocked until these P0/P1 checks are closed. Final positioning decisions will use only KEEP / ADD / MERGE / REMOVE-SKIP with brief evidence and approved additions.
