/* ══════════════════════════════════════════════════════════
   shared/types.ts
   Shared types, constants, and interfaces for all
   Engineering + Data & Cloud service pages.
   No fake stats. No fabricated numbers.
══════════════════════════════════════════════════════════ */

export const FONT =
  "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
export const MONO =
  "'Geist Mono','JetBrains Mono','Fira Code',ui-monospace,monospace";

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

/* Engineering accent — OSYSTIC blue */
export const ENG = {
  ACC:   "#3B6CFF",
  ACC_D: "#2563EB",
  LIGHT: "#EEF3FF",
  BORD:  "#DDE6FF",
} as const;

/* Data & Cloud accent — cyan */
export const DAT = {
  ACC:   "#0891B2",
  ACC_D: "#0E7490",
  LIGHT: "#ECFEFF",
  BORD:  "#A5F3FC",
} as const;

/* ── Shared interfaces ── */
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

/* ── Engineering CodeBlock line type ── */
export interface CodeLine {
  type:    "comment" | "keyword" | "string" | "fn" | "plain" | "indent" | "blank";
  content: string;
}

/* ── Data pipeline node type ── */
export interface PipeNode {
  id:    string;
  label: string;
  sub:   string;
  x:     number;
  y:     number;
  dark?: boolean;
}

export interface PipeEdge {
  from: number;
  to:   number;
}

/* ── Full page data shape ── */
export interface EngineeringPageData {
  slug:          string;
  name:          string;
  tagline:       string;
  heroH1:        string;
  heroSub:       string;
  breadcrumb:    string;
  metaTitle:     string;
  metaDesc:      string;
  keywords:      string[];
  codeLines:     CodeLine[];   /* animated code in hero right */
  codeLabel:     string;       /* filename label above code */
  steps:         Step[];
  services:      ServiceItem[];
  techStack:     TechCategory[];
  industries:    Industry[];
  faqs:          FAQ[];
  ctaH2:         string;
  ctaDesc:       string;
  relatedSlugs:  string[];
}

export interface DataCloudPageData {
  slug:          string;
  name:          string;
  tagline:       string;
  heroH1:        string;
  heroSub:       string;
  breadcrumb:    string;
  metaTitle:     string;
  metaDesc:      string;
  keywords:      string[];
  pipeNodes:     PipeNode[];   /* animated pipeline in hero right */
  pipeEdges:     PipeEdge[];
  diagramTitle:  string;
  steps:         Step[];
  services:      ServiceItem[];
  techStack:     TechCategory[];
  industries:    Industry[];
  faqs:          FAQ[];
  ctaH2:         string;
  ctaDesc:       string;
  relatedSlugs:  string[];
}