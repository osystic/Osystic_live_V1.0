# Smooth experience pass: implemented, awaiting interaction acceptance

This is a frontend polish checkpoint, not a completed end-to-end pass. It supersedes any earlier implication of interaction readiness. The approved visual direction is retained. No deployment has been performed.

## Before / after implementation

| Area | Before | After in source | Verification |
|---|---|---|---|
| Calendar loading | Shared provider eagerly imports SDK | Separate dynamic calendar module; immediate dialog, loading status, 12-second slow notice, SDK linkReady/linkFailed events | Lint/type analysis only; configured embed still needs manual testing |
| Calendar accessibility | Handwritten focus trap excludes embedded iframe | Native modal dialog makes background inert; close/Escape/backdrop; focus restoration with mobile-toggle fallback | Manual keyboard and cross-origin iframe checks blocked |
| Calendar failure | No readiness/failure UI | Local error boundary covers dynamic import/render failure; persistent verified email escape route; bounded status area | Network failure and slow-load simulation pending |
| Drawer → calendar | Independent body overflow restoration | Reference-counted shared scroll lock, preserving original overflow value | Isolated ownership test; real handoff pending |
| Contact | Duplicate guard relies on render, fields editable during send, raw JSON parse errors | Synchronous request guard; fields disabled only during send; 30-second timeout, unmount cancellation, no automatic retry; retained details; readable failure/uncertain-receipt copy | Lint/type analysis; actual success/error submissions blocked |
| Contact stability/accessibility | Conditional feedback shifts lower content | Reserved feedback area, live status and response focus; input length hints match existing server schema | Browser layout and screen-reader check pending; very long text can still expand naturally |
| Careers | Silent file rejection, mouse-only drop surface, unfocused step changes | Keyboard upload, explicit rejection feedback with unchanged MIME/size rules, field/error associations, pressed states, step/error focus, autofill hints | Lint/type analysis; complete application flow pending |
| Career submission | No immediate request guard or timeout | Request guard, 60-second timeout for upload, cancel on unmount; review edit buttons disabled while sending; preserved details; reserved feedback | Actual upload/storage/email not tested |
| Navigation | No explicit link-pending feedback | Thin stationary progress line via Next useLinkStatus on primary nav links, portalled outside hidden mobile drawer; no artificial delay or fake percentage | Manual fast/slow transitions and Back/Forward pending |
| Route failures/loading | No root error/loading UI | Calm loading fallback; recoverable route error with retry/contact, no raw exception text | Route build/type analysis only |
| Images | Missing responsive sizes on insight and article images | Grid/prose sizes supplied; existing Next image optimizer/aspect dimensions/hero priority retained | Asset source inspection only; decoded images need manual verification |
| Fonts | Both variable fonts preloaded | Sans stays preloaded; mono loads when CSS needs it | No measured transfer or LCP comparison yet |
| Touch/motion | Decorative hover transforms can persist on touch | Hover transforms neutralized on touch, subtle press feedback, manipulation touch action, stable scrollbar gutter; existing reduced-motion overrides preserved | Physical Safari/Android and reduced-motion checks pending |

The React review guided conditional loading, effect cleanup, accessible feedback and request guards. No dependency was added. No backend/API, database, auth/security, route destination, SEO metadata, logo, service taxonomy, verified business details or publication rules was intentionally changed. Cal.com booking URL normalization, month_view and dark theme remain the same; only its frontend wrapper and event namespace changed.

## Checks run

- Focused ESLint on changed TS/TSX files: passed with zero errors/warnings after fixes.
- Production bundle compilation: succeeded in 3.9 seconds during this pass. This is compiler duration, **not** page performance. Later frontend corrections received focused lint and TypeScript analysis.
- Full build and `npm run typecheck`: blocked by the existing `lib/resend.ts:80` `reply_to` field, unsupported by the installed Resend SDK (`replyTo` expected). No other TypeScript error was reported. This protected backend helper remains unchanged; no type errors were suppressed.
- Preview: supervised server stopped; first browser navigation returned `ERR_CONNECTION_REFUSED`. Status still reports stopped. Previous responsive measurements are not reused as evidence of current interaction correctness.
- Protected-file comparison and isolated scroll-lock ownership test are recorded separately in this folder. These do not replace browser tests.
- The byte comparison covers all 162 files in the previous responsive ZIP. Only eight existing frontend files and Next's generated route-type reference changed before packaging; the integrity manifest is regenerated for this checkpoint. No unexpected source changes or missing original files were found. The shared scroll lock passed seven isolated assertions, including both release orders and repeated cleanup.

## Performance targets: not yet measured

| Metric | Target | Before | After |
|---|---|---|---|
| LCP | <2.5 seconds | Not measured | Not measured |
| CLS | <0.1 | Not measured | Not measured |
| INP | <200 milliseconds | Not measured | Not measured |

Measure a production build with identical device/network/CPU conditions, both cold and warm navigation. Use several runs per representative template and keep individual results, not only the best run. Production field p75 should be reported separately from lab results; a short interaction session is not field INP. No analytics collector was added without approval.

The homepage still awaits published case studies before returning its content. This potential server latency remains documented rather than introducing an unverified streaming fallback that could increase CLS. CMS database latency, external Cal latency, image-host behavior and production caching need real measurements. No fabricated publications or client records were added for testing.

## Mandatory manual acceptance gate — all outstanding

| Gate | Required checks | Status |
|---|---|---|
| Navigation | Every primary destination; capabilities hover/click/keyboard; Back/Forward; slow route; footer links | Blocked |
| Mobile menu | Open/close; Escape; keyboard loop; background inert/scroll; menu → route; menu → Cal → close | Blocked |
| Contact | Native validation; one controlled successful inquiry; 400/429/500; offline/timeout; double click; retained details | Blocked |
| Careers | All steps; invalid/valid CV; remove/reselect; keyboard; controlled successful application and confirmation; failed upload | Blocked |
| Cal.com | Configured calendar ready; slot selection/timezone; scrolling; iframe keyboard access; failure fallback; dismissal and focus restoration | Blocked |
| Images | Homepage hero/logo; lists and populated details; slow images; errors; no unexpected shifts | Blocked |
| Transitions | Home ↔ major templates, pending/retry states, rapid consecutive navigation, no hydration/console errors | Blocked |
| Real devices | iOS Safari and Android touch; software keyboard; browser chrome; portrait/landscape; VoiceOver and reduced motion | Not available |

No new viewport interaction results are claimed. Retest 320, 360, 375, 390, 430, 768, 820, 1024, 1280, 1440, 1536, 1920, 2560 and 3840px plus landscape states after the runtime is healthy. The earlier responsive report remains historical layout evidence only.

Representative URLs: `/`, `/capabilities`, `/services/ai-deep-learning`, `/services/engineering/backend`, `/services/data-cloud/data`, `/industries`, `/industries/finance`, `/case-studies`, `/insights`, `/about`, `/leadership`, `/trust`, `/privacy`, `/terms`, `/support`, `/contact`, `/careers`, `/admin/login`, `/admin/signup`. CMS detail pages require actual approved case-study/blog/news slugs. Authenticated admin requires authorized test access. Booking aliases retain their existing contact redirect.

## Required to finish

Resolve the existing one-field email SDK incompatibility with owner approval, then provide a functioning production-equivalent preview/staging setup with Cal.com and permitted test integrations. Do not send real applications/inquiries or book a real slot just to test without confirming suitable test destinations. Complete the manual gates, record console/network and before/after metric evidence, and only then sign off.
