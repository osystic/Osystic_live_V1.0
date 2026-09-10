/* ═══════════════════════════════════════════════════════════
   types.ts — Shared types for all 14 dynamic service pages
   Mirrors the exact shape of ai-deep-learning/_data.ts
═══════════════════════════════════════════════════════════ */

/* ── Design tokens (same as ai-deep-learning) ── */
export const FONT =
  "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

export const C = {
  BLK:    "#0A0A0A",
  BLU:    "#2563EB",
  BLU_D:  "#1D4ED8",
  WHT:    "#FFFFFF",
  PANEL:  "#F7F9FC",
  BORD:   "#E2E8F0",
  GRAY:   "#64748B",
  GRAY_L: "#94A3B8",
} as const;

/* ── Category accent overrides ── */
export const CAT_COLOR: Record<string, string> = {
  "AI & Automation": "#2563EB",
  "Engineering":     "#3B6CFF",
  "Data & Cloud":    "#0891B2",
};

/* ── Interfaces ── */
export interface ServiceItem {
  title:           string;
  desc:            string;
  points:          [string, string, string];
  learnMoreHref?:  string;
  learnMoreLabel?: string;
}

export interface TechCategory {
  category: string;
  items:    string[];
}

export interface Industry {
  name:   string;
  detail: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Step {
  title:   string;
  tag:     string;
  desc:    string;
  from:    string;
  fromSub: string;
  to:      string;
  checks:  [string, string, string];
}

export interface WFNode {
  id:    string;
  label: string;
  sub:   string;
  x:     number;
  y:     number;
  dark:  boolean;
}

export interface WFEdge {
  from: number;
  to:   number;
}

/* ── Full service page data shape ── */
export interface ServicePageData {
  slug:          string;
  category:      "AI & Automation" | "Engineering" | "Data & Cloud";
  name:          string;          // page H1 main name
  tagline:       string;          // hero sub paragraph
  breadcrumbLabel: string;        // shown in breadcrumb
  heroH1:        string;          // full H1 text
  heroSub:       string;          // hero subtitle paragraph
  metaTitle:     string;
  metaDesc:      string;
  keywords:      string[];
  diagramTitle:  string;          // SVG aria-label
  wfNodes:       WFNode[];        // 8 nodes
  wfEdges:       WFEdge[];        // edges
  steps:         Step[];          // 6 lifecycle steps
  services:      ServiceItem[];   // 4-6 capability accordion rows
  techStack:     TechCategory[];  // 4-6 tech groups
  industries:    Industry[];      // 4-6 industries
  faqs:          FAQ[];           // 4 FAQs
  ctaH2:         string;
  ctaDesc:       string;
  relatedSlugs:  string[];
}