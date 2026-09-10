# OSYSTIC Security Notes

## Credential rotation required

The legacy source archive contained a real-looking database connection credential hard-coded inside obsolete table-creation helper scripts. Those scripts were removed from the final distribution and the credential is not reproduced in this documentation.

Because a credential existed in source, treat it as exposed and rotate it before production deployment.

## Final source package hygiene

The handoff ZIP intentionally excludes:

- `.env`
- `.git`
- `.next`
- `node_modules`
- local SQLite databases
- temporary build/audit caches
- the private pre-redesign backup patch

## Admin

- Keep `ADMIN_SIGNUP_ENABLED=false` except during controlled bootstrap.
- Use a long random `ADMIN_JWT_SECRET`.
- Do not reuse database or email credentials as JWT secrets.
- Admin and content API routes are protected both at proxy level and by server-side token checks.

## Forms

Contact/careers form rate limiting in this code is process-memory based. On multi-instance/serverless production infrastructure, use a shared rate-limit store/WAF if abuse protection needs to be consistent across instances.

## Uploaded CVs

CVs can contain personal information. Configure retention, access controls, and storage visibility intentionally. Do not expose the service-role key to the browser.
