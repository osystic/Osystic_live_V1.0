# Smooth experience audit — before implementation

Scope: frontend only, following the approved responsive package. Source review is evidence of implementation risks, not a measured performance baseline.

| Priority | Template/component | Before finding | Intended fix |
|---|---|---|---|
| High | Shared CalBooking | Eager SDK import; custom focus trap omits iframe; no external loading/failure feedback | Lazy SDK, native modal containment, SDK ready/failure feedback and email escape route |
| High | Header/mobile menu | Independent overflow restoration can conflict when opening booking from drawer | Shared, reference-counted scroll lock; retain native drawer |
| High | Contact | Raw response parsing errors, no immediate duplicate guard, edits can be lost while sending, conditional status shifts layout | Guard request, freeze submitted fields, readable uncertain/error feedback, reserved live status |
| High | Careers | Invalid uploads silently discarded; upload surface not keyboard operable; step changes do not move focus | Explicit rejection feedback, keyboard access, step focus and error associations |
| Medium | Shared navigation | Pending route has no immediate visual feedback | Next Link pending indicator in header, including mobile close-to-navigation feedback |
| Medium | Route recovery | No root route loading/error boundary | Calm loading state and retry/contact recovery with no raw exception details |
| Medium | Insights cards | Raster images lack responsive sizes | Declare actual grid sizes |
| Medium | Fonts | Mono preloaded alongside critical sans | Keep sans preload; defer mono preload |
| Medium | Shared interactions | Touch inherits decorative hover transforms; dialog scroll locks may shift width | Touch-neutral transforms, stable scrollbar gutter, explicit pressed feedback |
| Review | Homepage | Entire page awaits public case studies before hero | Keep data/content behavior intact for now; consider isolated streaming only with populated data and CLS measurement |

Major template coverage: homepage; capability/service and service-detail variants; industries/detail; case studies/list and CMS detail; insights/blog/news lists and details; about/mission/global reach/leadership; trust/legal/support; contact; careers; booking aliases; auth/admin. Existing responsive page inventory remains in ../responsive/PAGE_COVERAGE.md. Shared fixes reach templates through the root layout. CMS populated detail and authenticated admin require configured staging data/access; no records will be invented.

Execution blockers: the supervised Next development preview stops before the page can be exercised (connection refused on first navigation). Earlier responsive checks did not establish working hydration. Production build has a pre-existing lib/resend.ts SDK type incompatibility (reply_to versus replyTo). No production CWV, physical device, Safari or end-to-end interaction baseline is established. Do not claim these checks passed.
