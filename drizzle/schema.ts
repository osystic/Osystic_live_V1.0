/* ══════════════════════════════════════════════════════════
   drizzle/schema.ts  —  SQLite Schema
   OSYSTIC — application tables
════════════════════════════════════════════════════════════ */

import {
  sqliteTable, text, integer, real,
} from "drizzle-orm/sqlite-core";

/* ══════════════════════════════════════════════════════════
   BOOKING SLOTS  — admin defines available times
════════════════════════════════════════════════════════════ */
export const bookingSlots = sqliteTable("booking_slots", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date:      text("date").notNull(),
  time:      text("time").notNull(),
  duration:  integer("duration").default(30),
  available: integer("available", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   BOOKINGS  — user booking requests
════════════════════════════════════════════════════════════ */
export const bookings = sqliteTable("bookings", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:          text("name").notNull(),
  email:         text("email").notNull(),
  company:       text("company"),
  phone:         text("phone"),
  service:       text("service").notNull(),
  message:       text("message"),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  timezone:      text("timezone").default("UTC"),
  status:        text("status").default("pending"),
  slotId:        text("slot_id").references(() => bookingSlots.id),
  confirmedDate: text("confirmed_date"),
  confirmedTime: text("confirmed_time"),
  meetingLink:   text("meeting_link"),
  adminNotes:    text("admin_notes"),
  ip:            text("ip"),
  createdAt:     text("created_at").default("(datetime('now'))"),
  updatedAt:     text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   JOBS  — job postings (admin creates)
════════════════════════════════════════════════════════════ */
export const jobs = sqliteTable("jobs", {
  id:           text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:        text("title").notNull(),
  department:   text("department").notNull(),
  type:         text("type").notNull(),
  location:     text("location").notNull(),
  description:  text("description").notNull(),
  requirements: text("requirements").default("[]"),
  niceToHave:   text("nice_to_have").default("[]"),
  isActive:     integer("is_active", { mode: "boolean" }).default(true),
  createdAt:    text("created_at").default("(datetime('now'))"),
  updatedAt:    text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   JOB APPLICATIONS  — careers form submissions
════════════════════════════════════════════════════════════ */
export const jobApplications = sqliteTable("job_applications", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  firstName:      text("first_name").notNull(),
  lastName:       text("last_name").notNull(),
  email:          text("email").notNull(),
  phone:          text("phone").notNull(),
  city:           text("city"),
  country:        text("country").notNull(),
  linkedIn:       text("linkedin"),
  portfolio:      text("portfolio"),
  position:       text("position").notNull(),
  jobId:          text("job_id").references(() => jobs.id),
  yearsExp:       text("years_exp").notNull(),
  currentRole:    text("current_role"),
  currentCompany: text("current_company"),
  skills:         text("skills").default("[]"),
  coverLetter:    text("cover_letter").notNull(),
  cvUrl:          text("cv_url").notNull(),
  cvPath:         text("cv_path").notNull(),
  cvFileName:     text("cv_file_name").notNull(),
  cvTextContent:  text("cv_text_content"),
  status:         text("status").default("new"),
  adminNotes:     text("admin_notes"),
  ip:             text("ip"),
  createdAt:      text("created_at").default("(datetime('now'))"),
  updatedAt:      text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CONTACT SUBMISSIONS
════════════════════════════════════════════════════════════ */
export const contactSubmissions = sqliteTable("contact_submissions", {
  id:        text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:      text("name").notNull(),
  email:     text("email").notNull(),
  company:   text("company"),
  service:   text("service"),
  message:   text("message").notNull(),
  status:    text("status").default("new"),
  ip:        text("ip"),
  userAgent: text("user_agent"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   ADMIN USERS
════════════════════════════════════════════════════════════ */
export const adminUsers = sqliteTable("admin_users", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text("name").notNull(),
  email:       text("email").notNull().unique(),
  password:    text("password").notNull(),
  role:        text("role").default("developer"),
  status:      text("status").default("pending"),
  permissions: text("permissions").default("[]"),
  orgId:       text("org_id"),
  scope:       text("scope").default("ALL"),
  mfaEnabled:  integer("mfa_enabled", { mode: "boolean" }).default(false),
  mfaSecret:   text("mfa_secret"),
  lastLoginAt: text("last_login_at"),
  createdBy:   text("created_by"),
  createdAt:   text("created_at").default("(datetime('now'))"),
  updatedAt:   text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — PROJECTS
════════════════════════════════════════════════════════════ */
export const financeProjects = sqliteTable("finance_projects", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectCode:    text("project_code").notNull().unique(),
  name:           text("name").notNull(),
  client:         text("client").notNull(),
  type:           text("type").default("Fixed Price"),
  platform:       text("platform").default("Direct"),
  category:       text("category").default("Web Development"),
  currency:       text("currency").default("USD"),
  status:         text("status").default("In Progress"),
  revenue:        real("revenue").default(0),
  agreed:         real("agreed").default(0),
  balance:        real("balance").default(0),
  commissionRate: real("commission_rate").default(0),
  devPayout:      real("dev_payout").default(0),
  platformFee:    real("platform_fee").default(0),
  netProfit:      real("net_profit").default(0),
  margin:         real("margin").default(0),
  startDate:      text("start_date"),
  endDate:        text("end_date"),
  notes:          text("notes"),
  createdAt:      text("created_at").default("(datetime('now'))"),
  updatedAt:      text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — INVOICES
════════════════════════════════════════════════════════════ */
export const invoices = sqliteTable("invoices", {
  id:             text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceNumber:  text("invoice_number").notNull().unique(),
  client:         text("client").notNull(),
  projectId:      text("project_id").references(() => financeProjects.id),
  projectCode:    text("project_code"),
  description:    text("description").notNull(),
  issuedDate:     text("issued_date").notNull(),
  dueDate:        text("due_date"),
  amount:         real("amount").notNull(),
  currency:       text("currency").default("USD"),
  commissionRate: real("commission_rate").default(0),
  method:         text("method"),
  status:         text("status").default("Draft"),
  notes:          text("notes"),
  bankName:       text("bank_name"),
  bankAccount:    text("bank_account"),
  bankSwift:      text("bank_swift"),
  signatory:      text("signatory"),
  createdAt:      text("created_at").default("(datetime('now'))"),
  updatedAt:      text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — INCOME
════════════════════════════════════════════════════════════ */
export const income = sqliteTable("income", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date:        text("date").notNull(),
  projectId:   text("project_id").references(() => financeProjects.id),
  projectCode: text("project_code"),
  projectName: text("project_name"),
  invoiceNum:  text("invoice_num"),
  amount:      real("amount").notNull(),
  currency:    text("currency").default("USD"),
  rate:        real("rate").default(1),
  amountUSD:   real("amount_usd"),
  platformFee: real("platform_fee").default(0),
  netUSD:      real("net_usd"),
  method:      text("method"),
  notes:       text("notes"),
  createdAt:   text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — EXPENSES
════════════════════════════════════════════════════════════ */
export const expenses = sqliteTable("expenses", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date:        text("date").notNull(),
  category:    text("category").notNull(),
  projectId:   text("project_id").references(() => financeProjects.id),
  projectCode: text("project_code"),
  description: text("description").notNull(),
  paidTo:      text("paid_to"),
  amount:      real("amount").notNull(),
  currency:    text("currency").default("USD"),
  rate:        real("rate").default(1),
  amountUSD:   real("amount_usd"),
  ref:         text("ref"),
  createdAt:   text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — PAYROLL
════════════════════════════════════════════════════════════ */
export const payroll = sqliteTable("payroll", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  date:          text("date").notNull(),
  developerName: text("developer_name").notNull(),
  projectId:     text("project_id").references(() => financeProjects.id),
  projectCode:   text("project_code"),
  description:   text("description"),
  amount:        real("amount").notNull(),
  currency:      text("currency").default("USD"),
  rate:          real("rate").default(1),
  amountUSD:     real("amount_usd"),
  method:        text("method"),
  status:        text("status").default("Pending"),
  notes:         text("notes"),
  createdAt:     text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CONTENT — BLOGS
════════════════════════════════════════════════════════════ */
export const blogs = sqliteTable("blogs", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:         text("title").notNull(),
  slug:          text("slug").notNull().unique(),
  excerpt:       text("excerpt"),
  content:       text("content").notNull(),
  featuredImage: text("featured_image"),
  author:        text("author").notNull(),
  tags:          text("tags").default("[]"),
  category:      text("category"),
  status:        text("status").default("draft"),
  viewCount:     integer("view_count").default(0),
  publishedAt:   text("published_at"),
  createdAt:     text("created_at").default("(datetime('now'))"),
  updatedAt:     text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CONTENT — CASE STUDIES
════════════════════════════════════════════════════════════ */
export const caseStudies = sqliteTable("case_studies", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:         text("title").notNull(),
  slug:          text("slug").notNull().unique(),
  excerpt:       text("excerpt"),
  content:       text("content").notNull(),
  featuredImage: text("featured_image"),
  client:        text("client").notNull(),
  challenge:     text("challenge").notNull(),
  solution:      text("solution").notNull(),
  results:       text("results").default("[]"),
  technologies:  text("technologies").default("[]"),
  status:        text("status").default("draft"),
  viewCount:     integer("view_count").default(0),
  publishedAt:   text("published_at"),
  createdAt:     text("created_at").default("(datetime('now'))"),
  updatedAt:     text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   PROJECT MANAGEMENT — PROJECTS (internal)
════════════════════════════════════════════════════════════ */
export const projects = sqliteTable("projects", {
  id:          text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name:        text("name").notNull(),
  client:      text("client"),
  description: text("description"),
  status:      text("status").default("active"),
  priority:    text("priority").default("medium"),
  startDate:   text("start_date"),
  dueDate:     text("due_date"),
  budget:      real("budget"),
  assignedTo:  text("assigned_to").default("[]"),
  tags:        text("tags").default("[]"),
  createdBy:   text("created_by").references(() => adminUsers.id),
  createdAt:   text("created_at").default("(datetime('now'))"),
  updatedAt:   text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CONTENT — NEWSROOM
════════════════════════════════════════════════════════════ */
export const newsroom = sqliteTable("newsroom", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:         text("title").notNull(),
  slug:          text("slug").notNull().unique(),
  excerpt:       text("excerpt"),
  content:       text("content").notNull(),
  featuredImage: text("featured_image"),
  author:        text("author").notNull(),
  tags:          text("tags").default("[]"),
  category:      text("category"),
  status:        text("status").default("draft"),
  viewCount:     integer("view_count").default(0),
  publishedAt:   text("published_at"),
  createdAt:     text("created_at").default("(datetime('now'))"),
  updatedAt:     text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   PORTFOLIO PROJECTS
════════════════════════════════════════════════════════════ */
export const portfolioProjects = sqliteTable("portfolio_projects", {
  id:            text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title:         text("title").notNull(),
  slug:          text("slug").notNull().unique(),
  description:   text("description").notNull(),
  longDescription: text("long_description"),
  featuredImage: text("featured_image"),
  images:        text("images").default("[]"),
  technologies:  text("technologies").default("[]"),
  category:      text("category"),
  client:        text("client"),
  projectUrl:    text("project_url"),
  githubUrl:     text("github_url"),
  status:        text("status").default("draft"),
  featured:      integer("featured", { mode: "boolean" }).default(false),
  order:         integer("order").default(0),
  publishedAt:   text("published_at"),
  createdAt:     text("created_at").default("(datetime('now'))"),
  updatedAt:     text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CALCULATION HELPERS
════════════════════════════════════════════════════════════ */

export function calcProjectFinancials(revenue: number, commissionRate: number, devPayout: number) {
  const rate   = commissionRate > 1 ? commissionRate / 100 : commissionRate;
  const fee    = +(revenue * rate).toFixed(2);
  const profit = +(revenue - fee - devPayout).toFixed(2);
  const margin = revenue > 0 ? +(profit / revenue).toFixed(4) : 0;
  return { platformFee: fee, netProfit: profit, margin };
}

export function calcIncomeUSD(amount: number, rate: number): number {
  return +(amount * rate).toFixed(2);
}

export function calcExpenseUSD(amount: number, rate: number, currency: string): number {
  if (currency === "USD") return +amount.toFixed(2);
  return +(amount / rate).toFixed(2);
}

export function calcNetPL(cashIn: number, platformFees: number, expenses: number, payroll: number): number {
  return +(cashIn - platformFees - expenses - payroll).toFixed(2);
}

/* ══════════════════════════════════════════════════════════
   TYPE EXPORTS
════════════════════════════════════════════════════════════ */
export type Booking          = typeof bookings.$inferSelect;
export type NewBooking       = typeof bookings.$inferInsert;
export type BookingSlot      = typeof bookingSlots.$inferSelect;
export type JobApplication   = typeof jobApplications.$inferSelect;
export type NewApplication   = typeof jobApplications.$inferInsert;
export type Job              = typeof jobs.$inferSelect;
export type ContactSubmission= typeof contactSubmissions.$inferSelect;
export type AdminUser        = typeof adminUsers.$inferSelect;
export type FinanceProject   = typeof financeProjects.$inferSelect;
export type NewFinanceProject= typeof financeProjects.$inferInsert;
export type Invoice          = typeof invoices.$inferSelect;
export type Income           = typeof income.$inferSelect;
export type Expense          = typeof expenses.$inferSelect;
export type Payroll          = typeof payroll.$inferSelect;
export type Blog             = typeof blogs.$inferSelect;
export type CaseStudy        = typeof caseStudies.$inferSelect;
export type NewsItem         = typeof newsroom.$inferSelect;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type Project          = typeof projects.$inferSelect;
