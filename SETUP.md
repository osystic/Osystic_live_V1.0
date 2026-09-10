# OSYSTIC — Complete Setup & Documentation

> AI & Software Engineering Company Website with Integrated Finance Management System

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Requirements](#2-system-requirements)
3. [Installation](#3-installation)
4. [Configuration](#4-configuration)
5. [Database Setup](#5-database-setup)
6. [Running the Application](#6-running-the-application)
7. [Admin Panel](#7-admin-panel)
8. [Finance Modules](#8-finance-modules)
9. [API Reference](#9-api-reference)
10. [Architecture](#10-architecture)
11. [Project Structure](#11-project-structure)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Project Overview

OSYSTIC is a full-stack Next.js 16 application serving as the company website for an AI & Software Engineering firm. It includes:

- **Public Website** — Landing pages, services, industries, case studies, blogs, newsroom, careers, contact
- **Admin Panel** — Content management, finance management, user management
- **Finance Management System** — Complete double-entry bookkeeping with 35+ database tables
- **Authentication** — JWT-based auth with email-restricted access

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict mode) |
| UI | React 19, Tailwind CSS 4 |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Auth | Custom JWT (HMAC-SHA256) |
| State | React Query (TanStack) |
| Email | Resend |
| Charts | Chart.js + react-chartjs-2 |
| PDF | jsPDF + jsPDF-AutoTable |

---

## 2. System Requirements

### Minimum Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18.17+ (20+ recommended) |
| npm | 9+ |
| OS | Windows 10+, macOS 12+, Ubuntu 20+ |
| RAM | 4GB minimum, 8GB recommended |
| Disk | 2GB free space |

### Optional

| Tool | Purpose |
|------|---------|
| Git | Version control |
| VS Code | IDE (recommended) |

---

## 3. Installation

### Step 1: Clone or Copy the Project

```bash
cd D:\Osystic\Revamped Website
```

### Step 2: Install Dependencies

```bash
cd OSYSTIC_P1_P2_Final_Checkpoint\OSYSTIC_P1_P2_Final_Checkpoint
npm install
```

This installs 450+ packages including:
- `next` — Framework
- `react` / `react-dom` — UI library
- `drizzle-orm` + `better-sqlite3` — Database
- `@tanstack/react-query` — Data fetching
- `bcrypt` — Password hashing
- `jsonwebtoken` — JWT auth
- `resend` — Email service
- `chart.js` + `react-chartjs-2` — Charts
- `jspdf` + `jspdf-autotable` — PDF generation
- `zod` — Validation
- `lucide-react` — Icons
- `react-hot-toast` — Notifications

### Step 3: Verify Installation

```bash
node -v    # Should show v18.17+ or v20+
npm -v     # Should show 9+
```

---

## 4. Configuration

### Environment Variables

The `.env.local` file is pre-configured. Here's what each variable does:

```env
# ── Site ──
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ── Database (SQLite) ──
DATABASE_URL=file:./local.db

# ── Auth ──
ADMIN_JWT_SECRET=cacbaRYzVv8wVOI/x0Qe4KsVubdP58ebMohgAC+XVG+uRgMDLkGUX7zTvhwTZ1jC

# ── Email (Resend) ──
RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE
RESEND_FROM=Osystic <onboarding@resend.dev>
ADMIN_EMAIL=osystic@gmail.com

# ── Cal.com Booking ──
CALCOM_USERNAME=visiongen
CAL_EVENT_TYPE_SLUG=discovery-call
NEXT_PUBLIC_CALCOM_USERNAME="visiongen-q7aj1r"
CAL_API_KEY=cal_live_ee0b01d319cae86a8b4295fcf8cf2f86
CAL_TIMEZONE=Asia/Karachi
```

### Key Configuration Notes

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | SQLite file path. Default: `file:./local.db` |
| `ADMIN_JWT_SECRET` | Must be 32+ characters. Used for JWT signing |
| `ADMIN_JWT_SECRET` | **Change this in production!** Generate with: `openssl rand -base64 48` |
| `RESEND_API_KEY` | Get from [resend.com](https://resend.com) |
| `CAL_API_KEY` | Cal.com API key for booking integration |

### Access Restriction

Only `OsysticArslan@osystic.com` can access the admin panel. This is enforced at 3 layers:
1. **Middleware** (`proxy.ts`) — Blocks unauthenticated requests
2. **Login API** — Rejects non-allowed emails
3. **Signup API** — Rejects non-allowed emails

To change the allowed email, edit these 3 files:
- `proxy.ts` (line 4)
- `app/api/admin/auth/login/route.ts` (line 14)
- `app/api/admin/auth/signup/route.ts` (line 14)

---

## 5. Database Setup

The project uses **SQLite** — zero configuration required.

### Automatic Setup

The database is created automatically when you first run the server. The file `local.db` will appear in the project root.

### Manual Setup (if needed)

```bash
# Push schema to database
npx drizzle-kit push

# Open Drizzle Studio (visual database browser)
npx drizzle-kit studio
```

### Database Tables

**53 tables** across 5 groups:

| Group | Tables | Purpose |
|-------|--------|---------|
| Core | `admin_users`, `organisations`, `roles`, `permissions` | Auth & RBAC |
| OSYSTIC | `bookings`, `jobs`, `job_applications`, `contact_submissions`, `blogs`, `case_studies`, `newsroom`, `portfolio_projects`, `projects`, `finance_projects`, `invoices`, `income`, `expenses`, `payroll` | Website & basic finance |
| Finance System | `finance_accounts`, `finance_journal_entries`, `finance_journal_lines`, `finance_invoices`, `finance_invoice_lines`, `finance_vendors`, `finance_vendor_bills`, `finance_payments`, `finance_credit_notes`, `finance_financial_accounts`, `finance_bank_transfers`, `finance_budgets`, `finance_budget_lines`, `finance_clients`, `finance_fixed_assets`, `finance_tax_config`, `finance_tax_entries`, `finance_employees`, `finance_payroll_runs`, `finance_payroll_lines`, `finance_exchange_rates`, `finance_subscriptions`, `finance_contractors`, `finance_commissions` | Full accounting |
| Audit | `audit_audit_log` | Activity logging |
| Workflow | `finance_approval_requests`, `finance_notifications` | Approvals & alerts |

### Reset Database

```bash
# Delete the database file
rm local.db

# Recreate from schema
npx drizzle-kit push
```

---

## 6. Running the Application

### Development Server

```bash
npm run dev
```

Opens at: **http://localhost:3000**

First compile takes ~10 seconds. Subsequent hot reloads are near-instant.

### Production Build

```bash
# Build
npm run build

# Start production server
npm run start
```

Production server runs at: **http://localhost:3000**

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start development server |
| `build` | `npm run build` | Create production build |
| `start` | `npm run start` | Start production server |
| `lint` | `npm run lint` | Run ESLint |
| `typecheck` | `npm run typecheck` | Run TypeScript check |

---

## 7. Admin Panel

### Access

1. Start the server: `npm run dev`
2. Open: **http://localhost:3000/admin/login**
3. Login with:
   - **Email:** `OsysticArslan@osystic.com`
   - **Password:** `Admin123!`

### Admin Pages

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/admin/dashboard` | Financial KPI overview |
| Content | `/admin/content` | Manage blogs, case studies, newsroom |
| Careers | `/admin/careers` | Manage job postings & applications |
| Settings | `/admin/settings` | Exchange rates configuration |

### Finance Pages

| Page | URL | Description |
|------|-----|-------------|
| Chart of Accounts | `/admin/finance/chart-of-accounts` | GL account master |
| Journal Entries | `/admin/finance/journal-entries` | Double-entry bookkeeping |
| General Ledger | `/admin/finance/general-ledger` | All journal line entries |
| Trial Balance | `/admin/finance/trial-balance` | Debit/credit balances |
| Fiscal Calendar | `/admin/finance/fiscal-calendar` | Fiscal years & periods |
| Invoices | `/admin/finance/invoices` | Customer invoices (AR) |
| Payments | `/admin/finance/payments` | Customer payments |
| Credit Notes | `/admin/finance/credit-notes` | AR credit notes |
| Expenses | `/admin/finance/expenses` | Business expenses |
| Vendors | `/admin/finance/vendors` | Vendor master data |
| Vendor Bills | `/admin/finance/vendor-bills` | AP bills |
| Vendor Payments | `/admin/finance/vendor-payments` | Payments to vendors |
| Banking | `/admin/finance/banking` | Financial accounts |
| Transfers | `/admin/finance/transfers` | Inter-account transfers |
| Budgets | `/admin/finance/budgets` | Budget planning |
| Clients | `/admin/finance/clients` | Client CRM |
| Fixed Assets | `/admin/finance/fixed-assets` | Asset register |
| Payroll | `/admin/finance/payroll` | Employee payroll |
| Tax | `/admin/finance/tax` | Tax rules & entries |
| Income | `/admin/finance/income` | Revenue tracking |
| Subscriptions | `/admin/finance/subscriptions` | Recurring costs |
| Contractors | `/admin/finance/contractors` | Contractor management |
| Commissions | `/admin/finance/commissions` | Commission tracking |
| Reports | `/admin/finance/reports` | P&L, AR/AP aging |

---

## 8. Finance Modules

### Typical Workflow

```
1. Setup    → Create Chart of Accounts
2. Record   → Create Invoices, Expenses, Vendor Bills
3. Pay      → Record Payments (customer & vendor)
4. Journal  → Create Journal Entries (double-entry)
5. Close    → Trial Balance, Reports
```

### Chart of Accounts

Create accounts with types:
- **Asset** — Cash, Bank, Receivables
- **Liability** — Payables, Loans
- **Equity** — Capital, Retained Earnings
- **Revenue** — Sales, Services
- **Expense** — Operating, Marketing

### Double-Entry Bookkeeping

Every transaction has equal debits and credits:
```
Debit:  Bank Account      $1,000
Credit: Revenue Account   $1,000
```

### Dashboard KPIs

| Metric | Description |
|--------|-------------|
| Total Revenue | Sum of all invoice amounts |
| Total Expenses | Sum of all expense amounts |
| Outstanding AR | Unpaid customer invoices |
| Outstanding AP | Unpaid vendor bills |
| Net Profit | Revenue - Expenses |
| Active Projects | Projects in progress |
| Pending Approvals | Items awaiting approval |
| Overdue Invoices | Past-due invoices |

---

## 9. API Reference

### Authentication

All `/api/admin/*` endpoints require a valid JWT token in the `admin-auth-token` cookie.

### Finance API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/finance/dashboard` | Financial summary |
| GET | `/api/admin/finance/accounts` | List accounts |
| POST | `/api/admin/finance/accounts` | Create account |
| GET | `/api/admin/finance/journal-entries` | List journal entries |
| POST | `/api/admin/finance/journal-entries` | Create journal entry |
| GET | `/api/admin/finance/invoices` | List invoices |
| POST | `/api/admin/finance/invoices` | Create invoice |
| GET | `/api/admin/finance/expenses` | List expenses |
| POST | `/api/admin/finance/expenses` | Create expense |
| GET | `/api/admin/finance/vendors` | List vendors |
| POST | `/api/admin/finance/vendors` | Create vendor |
| GET | `/api/admin/finance/vendor-bills` | List vendor bills |
| POST | `/api/admin/finance/vendor-bills` | Create vendor bill |
| GET | `/api/admin/finance/vendor-payments` | List vendor payments |
| POST | `/api/admin/finance/vendor-payments` | Create vendor payment |
| GET | `/api/admin/finance/payments` | List customer payments |
| POST | `/api/admin/finance/payments` | Create customer payment |
| GET | `/api/admin/finance/credit-notes` | List credit notes |
| POST | `/api/admin/finance/credit-notes` | Create credit note |
| GET | `/api/admin/finance/banking` | List bank accounts |
| POST | `/api/admin/finance/banking` | Create bank account |
| GET | `/api/admin/finance/transfers` | List transfers |
| POST | `/api/admin/finance/transfers` | Create transfer |
| GET | `/api/admin/finance/budgets` | List budgets |
| POST | `/api/admin/finance/budgets` | Create budget |
| GET | `/api/admin/finance/clients` | List clients |
| POST | `/api/admin/finance/clients` | Create client |
| GET | `/api/admin/finance/fixed-assets` | List assets |
| POST | `/api/admin/finance/fixed-assets` | Create asset |
| GET | `/api/admin/finance/payroll` | List runs & employees |
| POST | `/api/admin/finance/payroll` | Create run or employee |
| GET | `/api/admin/finance/tax` | List tax config & entries |
| POST | `/api/admin/finance/tax` | Create tax config |
| GET | `/api/admin/finance/income` | List income records |
| POST | `/api/admin/finance/income` | Create income record |
| GET | `/api/admin/finance/subscriptions` | List subscriptions |
| POST | `/api/admin/finance/subscriptions` | Create subscription |
| GET | `/api/admin/finance/contractors` | List contractors |
| POST | `/api/admin/finance/contractors` | Create contractor |
| GET | `/api/admin/finance/commissions` | List commissions |
| POST | `/api/admin/finance/commissions` | Create commission |
| GET | `/api/admin/finance/exchange-rates` | List exchange rates |
| POST | `/api/admin/finance/exchange-rates` | Create exchange rate |
| GET | `/api/admin/finance/audit` | List audit logs |
| GET | `/api/admin/finance/notifications` | List notifications |
| POST | `/api/admin/finance/notifications` | Create notification |
| GET | `/api/admin/finance/trial-balance` | Account balances |
| GET | `/api/admin/finance/general-ledger` | All journal lines |
| GET | `/api/admin/finance/fiscal-calendar` | Fiscal years & periods |
| POST | `/api/admin/finance/fiscal-calendar` | Create fiscal year |
| GET | `/api/admin/finance/reports?type=pnl` | Profit & Loss report |
| GET | `/api/admin/finance/reports?type=ar_aging` | AR aging report |
| GET | `/api/admin/finance/reports?type=ap_aging` | AP aging report |
| POST | `/api/admin/finance/workflow` | Status transitions |

### Content API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/content?kind=blog` | List blogs |
| GET | `/api/admin/content?kind=case-study` | List case studies |
| GET | `/api/admin/content?kind=news` | List news articles |
| POST | `/api/admin/content` | Create content |
| PATCH | `/api/admin/content` | Update content |
| DELETE | `/api/admin/content?kind=blog&id=xxx` | Delete content |

---

## 10. Architecture

### Request Flow

```
Browser → proxy.ts (middleware) → Route Handler → Drizzle ORM → SQLite
                ↓
         JWT validation
         Email restriction
         Path protection
```

### File Structure Overview

```
├── app/
│   ├── admin/                    # Admin panel pages
│   │   ├── layout.tsx           # Admin layout with providers
│   │   ├── dashboard/           # Finance dashboard
│   │   ├── finance/             # All finance module pages
│   │   ├── content/             # Content management
│   │   ├── settings/            # System settings
│   │   ├── login/               # Admin login
│   │   └── signup/              # Admin signup
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/            # Login, logout, signup
│   │   │   ├── content/         # Content CRUD
│   │   │   └── finance/         # All finance APIs (30 routes)
│   │   ├── booking/             # Public booking API
│   │   ├── careers/             # Career applications
│   │   ├── contact/             # Contact form
│   │   └── ...                  # Other public APIs
│   ├── (public pages)/          # Public website pages
│   └── layout.tsx               # Root layout
├── components/
│   ├── admin/                   # Admin components (Sidebar)
│   └── ...                      # Public components
├── context/
│   ├── AuthContext.tsx           # JWT auth context
│   └── PermissionContext.tsx     # Permission codes
├── drizzle/
│   ├── schema.ts                # OSYSTIC tables (SQLite)
│   ├── finance-schema.ts        # Finance tables (SQLite)
│   └── migrations/              # SQL migrations
├── lib/
│   ├── db.ts                    # SQLite database connection
│   ├── admin-auth.ts            # JWT sign/verify
│   ├── finance/                 # Finance helpers
│   └── ...                      # Other utilities
├── providers/
│   └── QueryProvider.tsx        # React Query provider
├── proxy.ts                     # Middleware (auth + routing)
├── drizzle.config.ts            # Drizzle Kit config
├── local.db                     # SQLite database (auto-created)
└── .env.local                   # Environment variables
```

### Authentication Flow

```
1. User enters email + password
2. Login API validates against admin_users table
3. bcrypt compares password hash
4. JWT token created with user info
5. Token set as httpOnly cookie
6. Proxy validates JWT on every /admin/* request
7. Proxy checks email matches allowed list
```

---

## 11. Project Structure

### Key Directories

| Directory | Purpose |
|-----------|---------|
| `app/admin/` | Admin panel pages (28 pages) |
| `app/api/admin/finance/` | Finance API routes (30 endpoints) |
| `components/admin/` | Admin UI components |
| `context/` | React contexts (Auth, Permissions) |
| `drizzle/` | Database schema & migrations |
| `lib/` | Shared utilities & database |
| `providers/` | React Query provider |

### Key Files

| File | Purpose |
|------|---------|
| `proxy.ts` | Middleware — auth, email restriction, routing |
| `lib/db.ts` | SQLite database connection |
| `lib/admin-auth.ts` | JWT token operations |
| `drizzle/schema.ts` | OSYSTIC table definitions |
| `drizzle/finance-schema.ts` | Finance table definitions |
| `drizzle.config.ts` | Drizzle Kit configuration |
| `.env.local` | Environment variables |
| `local.db` | SQLite database file |

---

## 12. Troubleshooting

### Common Issues

#### "DATABASE_URL is not set"
```bash
# Ensure .env.local exists and contains:
DATABASE_URL=file:./local.db
```

#### "ADMIN_JWT_SECRET is missing or too short"
```bash
# Ensure .env.local contains a secret with 32+ characters:
ADMIN_JWT_SECRET=your-secret-here-must-be-32-chars-minimum
```

#### Tables don't exist
```bash
# Push schema to database
npx drizzle-kit push
```

#### Build fails with TypeScript errors
```bash
# Check for errors
npx tsc --noEmit

# If errors found, fix them then rebuild
npm run build
```

#### Port 3000 already in use
```bash
# Kill existing process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

#### Database is locked
```bash
# Only one process can write to SQLite at a time
# Kill all node processes and restart
taskkill /F /IM node.exe   # Windows
pkill node                  # macOS/Linux
```

### Reset Everything

```bash
# Delete database
rm local.db

# Reinstall dependencies
rm -rf node_modules
npm install

# Push schema
npx drizzle-kit push

# Start fresh
npm run dev
```

### Useful Commands

```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Browse database visually
npx drizzle-kit studio

# Generate SQL migration
npx drizzle-kit generate

# Check server logs
# Look at terminal where npm run dev is running
```

---

## Support

For issues or questions, check:
- Server terminal output for error messages
- Browser Developer Console (F12) for client errors
- `local.db` can be opened with any SQLite browser

---

*Last updated: September 2026*
