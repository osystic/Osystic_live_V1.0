# Pre-edit responsive audit (recovered from recorded review)

The review preceded product edits in the preceding execution. Workspace maintenance removed that execution's unsaved files; the implementation has been reconstructed from its recorded edits against the saved premium package. Current validation is reported separately.

| Page/template | Exact source of issue | Responsive correction |
| --- | --- | --- |
| All pages | globals.css/premium.css overlapping breakpoints and fixed gutters | Final shared responsive layer, fluid gutters and spacing |
| Navbar | Navbar.tsx disclosure without modal focus containment or scroll locking; 28px toggle | Native modal drawer; 44px controls |
| Homepage | Absolute .visual-label elements on narrow visual; abrupt hero breakpoint | Phone legend below image; tablet collapse |
| Capabilities/home | .capability-grid switches 3 directly to 1 at 900px | 3/2/1 columns and tablet service-link grid |
| Work/index/detail | .work-grid only collapses at 640px; miniature SVG hero | Intrinsic 2/1 cards; stacked HTML diagram |
| Workflow/about/capabilities | nth-child borders conflict across grid sizes | Connected mobile numbered timeline |
| Industries | 4 columns remain at 1024px | 4/2/1 composition |
| Service templates | Two cramped diagram nodes; five process columns; rigid tech label | Stacked nodes and smaller-screen process layouts |
| Insights | Inline 12px arrow paragraph and 40px padding | Wrapped/stacked semantic topic rows |
| Blog/news details | CMS media and long prose | Responsive media and readable prose; real record acceptance pending |
| About/leadership | Inline portrait minimum height and tight principle tiles | Stable aspect ratio and narrow tile stack |
| Contact | Page-width rather than form-width column switching | Container-aware single-column fields |
| Careers | 10px nowrap progress labels, 28px remove control, fixed action height | Mobile progress panels, wrapped actions, 44px removal |
| Footer | Five columns squeezed beside brand at 1280px; small link targets | Full-row links, 3/2/1 tablet/mobile columns |
| Cal modal | Safe-area padding outside 100dvh panel | Safe padding inside bounded mobile panel; setup unchanged |
| Privacy/terms/support | Prose/link wrapping and rigid card density | Shared intrinsic widths and local code/table scrolling |
| Auth pages/unauthorized/404 | Large inline card padding; 100vh | Fluid padding, 16px inputs, svh |
| Admin content | Protected form layout, small controls/tabs | Container fields and touch targets; authenticated checks pending |
| Legacy pages | Redirect-only | Preserve destinations; review destination templates |
