-- ============================================================
-- Migration 0001: Finance Management System Tables
-- Source: drizzle/finance-schema.ts
-- ============================================================

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE "finance_account_type" AS ENUM (
  'asset', 'liability', 'equity', 'revenue', 'expense',
  'bank', 'cash', 'wallet', 'platform', 'gateway', 'card', 'clearing'
);

CREATE TYPE "journal_status" AS ENUM (
  'DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'POSTED', 'REVERSED', 'REJECTED'
);

CREATE TYPE "period_status" AS ENUM (
  'OPEN', 'SOFT_CLOSED', 'HARD_CLOSED'
);

CREATE TYPE "workflow_status" AS ENUM (
  'DRAFT', 'SUBMITTED', 'VERIFIED', 'APPROVED', 'POSTED', 'REJECTED', 'REVERSED', 'VOID'
);

CREATE TYPE "budget_status" AS ENUM (
  'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'
);

CREATE TYPE "approval_status" AS ENUM (
  'PENDING', 'ESCALATED', 'APPROVED', 'REJECTED'
);

CREATE TYPE "asset_status" AS ENUM (
  'ACTIVE', 'DISPOSED', 'FULLY_DEPRECIATED', 'UNDER_VERIFICATION'
);

-- ============================================================
-- CORE — ORGANISATIONS
-- ============================================================

CREATE TABLE "organisations" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"        TEXT NOT NULL,
  "slug"        TEXT NOT NULL UNIQUE,
  "settings"    JSONB DEFAULT '{}',
  "created_at"  TIMESTAMP DEFAULT now(),
  "updated_at"  TIMESTAMP DEFAULT now()
);

-- ============================================================
-- CORE — ROLES & PERMISSIONS
-- ============================================================

CREATE TABLE "finance_roles" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"            TEXT NOT NULL,
  "description"     TEXT,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "created_at"      TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_permissions" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code"        TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "module"      TEXT
);

CREATE TABLE "role_permissions" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "role_id"         UUID REFERENCES "finance_roles"("id"),
  "permission_id"   UUID REFERENCES "finance_permissions"("id"),
  "amount_limit"    NUMERIC(12, 2),
  "currency"        TEXT DEFAULT 'PKR',
  "scope"           TEXT DEFAULT 'ALL',
  "effective_from"  DATE DEFAULT now(),
  "effective_to"    DATE
);

CREATE TABLE "finance_user_roles" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"         UUID NOT NULL,
  "role_id"         UUID REFERENCES "finance_roles"("id"),
  "effective_from"  DATE DEFAULT now(),
  "effective_to"    DATE,
  "is_active"       BOOLEAN DEFAULT true,
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — CHART OF ACCOUNTS
-- ============================================================

CREATE TABLE "finance_accounts" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "code"            TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "type"            "finance_account_type" NOT NULL,
  "parent_id"       UUID,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "is_active"       BOOLEAN DEFAULT true,
  "description"     TEXT,
  "currency"        TEXT DEFAULT 'PKR',
  "opening_balance" NUMERIC(12, 2) DEFAULT '0',
  "created_at"      TIMESTAMP DEFAULT now(),
  "updated_at"      TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX "finance_accounts_code_org_idx"
  ON "finance_accounts" ("code", "organisation_id");

-- ============================================================
-- FINANCE — FISCAL YEARS & PERIODS
-- ============================================================

CREATE TABLE "finance_fiscal_years" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"            TEXT NOT NULL,
  "start_date"      DATE NOT NULL,
  "end_date"        DATE NOT NULL,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "is_open"         BOOLEAN DEFAULT true,
  "created_at"      TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_fiscal_periods" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "fiscal_year_id"  UUID REFERENCES "finance_fiscal_years"("id"),
  "name"            TEXT NOT NULL,
  "start_date"      DATE NOT NULL,
  "end_date"        DATE NOT NULL,
  "status"          "period_status" DEFAULT 'OPEN',
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "closed_by"       UUID,
  "closed_at"       TIMESTAMP,
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — JOURNAL ENTRIES & LINES
-- ============================================================

CREATE TABLE "finance_journal_entries" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entry_number"      TEXT NOT NULL UNIQUE,
  "description"       TEXT NOT NULL,
  "entry_date"        DATE NOT NULL,
  "status"            "journal_status" DEFAULT 'DRAFT',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "project_id"        UUID,
  "total_debit"       NUMERIC(12, 2) DEFAULT '0',
  "total_credit"      NUMERIC(12, 2) DEFAULT '0',
  "currency"          TEXT DEFAULT 'PKR',
  "exchange_rate"     NUMERIC(10, 6) DEFAULT '1',
  "reversal_of"       UUID,
  "posted_at"         TIMESTAMP,
  "posted_by"         UUID,
  "approved_by"       UUID,
  "approved_at"       TIMESTAMP,
  "rejection_reason"  TEXT,
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_journal_lines" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "journal_entry_id"  UUID REFERENCES "finance_journal_entries"("id"),
  "account_id"        UUID REFERENCES "finance_accounts"("id"),
  "description"       TEXT,
  "debit"             NUMERIC(12, 2) DEFAULT '0',
  "credit"            NUMERIC(12, 2) DEFAULT '0',
  "currency"          TEXT DEFAULT 'PKR',
  "exchange_rate"     NUMERIC(10, 6) DEFAULT '1',
  "base_amount"       NUMERIC(12, 2),
  "created_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — INVOICES (AR)
-- ============================================================

CREATE TABLE "finance_invoices" (
  "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoice_number"      TEXT NOT NULL UNIQUE,
  "client_id"           UUID,
  "client_name"         TEXT NOT NULL,
  "project_id"          UUID,
  "description"         TEXT,
  "status"              "workflow_status" DEFAULT 'DRAFT',
  "issue_date"          DATE NOT NULL,
  "due_date"            DATE,
  "currency"            TEXT DEFAULT 'USD',
  "exchange_rate"       NUMERIC(10, 6) DEFAULT '1',
  "subtotal"            NUMERIC(12, 2) DEFAULT '0',
  "tax_amount"          NUMERIC(12, 2) DEFAULT '0',
  "discount_amount"     NUMERIC(12, 2) DEFAULT '0',
  "total_amount"        NUMERIC(12, 2) DEFAULT '0',
  "amount_paid"         NUMERIC(12, 2) DEFAULT '0',
  "outstanding_amount"  NUMERIC(12, 2) DEFAULT '0',
  "journal_entry_id"    UUID,
  "organisation_id"     UUID REFERENCES "organisations"("id"),
  "notes"               TEXT,
  "created_by"          UUID,
  "created_at"          TIMESTAMP DEFAULT now(),
  "updated_at"          TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_invoice_lines" (
  "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "invoice_id"    UUID REFERENCES "finance_invoices"("id"),
  "description"   TEXT NOT NULL,
  "quantity"      NUMERIC(10, 2) DEFAULT '1',
  "unit_price"    NUMERIC(12, 2) NOT NULL,
  "amount"        NUMERIC(12, 2) NOT NULL,
  "tax_rate"      NUMERIC(5, 4) DEFAULT '0',
  "tax_amount"    NUMERIC(12, 2) DEFAULT '0',
  "account_id"    UUID,
  "created_at"    TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — VENDORS (AP)
-- ============================================================

CREATE TABLE "finance_vendors" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"              TEXT NOT NULL,
  "contact_person"    TEXT,
  "email"             TEXT,
  "phone"             TEXT,
  "address"           TEXT,
  "tax_registration"  TEXT,
  "ntn"               TEXT,
  "payment_terms"     TEXT DEFAULT 'Net 30',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "is_active"         BOOLEAN DEFAULT true,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_vendor_bills" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "bill_number"       TEXT NOT NULL UNIQUE,
  "vendor_id"         UUID REFERENCES "finance_vendors"("id"),
  "vendor_name"       TEXT NOT NULL,
  "project_id"        UUID,
  "description"       TEXT,
  "status"            "workflow_status" DEFAULT 'DRAFT',
  "bill_date"         DATE NOT NULL,
  "due_date"          DATE,
  "currency"          TEXT DEFAULT 'PKR',
  "subtotal"          NUMERIC(12, 2) DEFAULT '0',
  "tax_amount"        NUMERIC(12, 2) DEFAULT '0',
  "withholding_tax"   NUMERIC(12, 2) DEFAULT '0',
  "total_amount"      NUMERIC(12, 2) DEFAULT '0',
  "amount_paid"       NUMERIC(12, 2) DEFAULT '0',
  "journal_entry_id"  UUID,
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "notes"             TEXT,
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_vendor_bill_lines" (
  "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "bill_id"       UUID REFERENCES "finance_vendor_bills"("id"),
  "description"   TEXT NOT NULL,
  "quantity"      NUMERIC(10, 2) DEFAULT '1',
  "unit_price"    NUMERIC(12, 2) NOT NULL,
  "amount"        NUMERIC(12, 2) NOT NULL,
  "tax_rate"      NUMERIC(5, 4) DEFAULT '0',
  "tax_amount"    NUMERIC(12, 2) DEFAULT '0',
  "account_id"    UUID,
  "created_at"    TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — PAYMENTS
-- ============================================================

CREATE TABLE "finance_payments" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "payment_number"    TEXT NOT NULL UNIQUE,
  "type"              TEXT NOT NULL,
  "entity_id"         UUID,
  "entity_type"       TEXT,
  "amount"            NUMERIC(12, 2) NOT NULL,
  "currency"          TEXT DEFAULT 'USD',
  "exchange_rate"     NUMERIC(10, 6) DEFAULT '1',
  "payment_date"      DATE NOT NULL,
  "payment_method"    TEXT,
  "bank_account_id"   UUID,
  "reference"         TEXT,
  "notes"             TEXT,
  "status"            "workflow_status" DEFAULT 'DRAFT',
  "journal_entry_id"  UUID,
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_payment_allocations" (
  "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "payment_id"  UUID REFERENCES "finance_payments"("id"),
  "invoice_id"  UUID,
  "amount"      NUMERIC(12, 2) NOT NULL,
  "created_at"  TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — CREDIT NOTES
-- ============================================================

CREATE TABLE "finance_credit_notes" (
  "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "credit_note_number"  TEXT NOT NULL UNIQUE,
  "client_id"           UUID,
  "client_name"         TEXT NOT NULL,
  "invoice_id"          UUID,
  "amount"              NUMERIC(12, 2) NOT NULL,
  "currency"            TEXT DEFAULT 'USD',
  "reason"              TEXT,
  "status"              "workflow_status" DEFAULT 'DRAFT',
  "journal_entry_id"    UUID,
  "organisation_id"     UUID REFERENCES "organisations"("id"),
  "created_by"          UUID,
  "created_at"          TIMESTAMP DEFAULT now(),
  "updated_at"          TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — FINANCIAL ACCOUNTS (BANKING)
-- ============================================================

CREATE TABLE "finance_financial_accounts" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"              TEXT NOT NULL,
  "type"              "finance_account_type" NOT NULL,
  "account_id"        UUID REFERENCES "finance_accounts"("id"),
  "currency"          TEXT DEFAULT 'PKR',
  "opening_balance"   NUMERIC(12, 2) DEFAULT '0',
  "current_balance"   NUMERIC(12, 2) DEFAULT '0',
  "bank_name"         TEXT,
  "account_number"    TEXT,
  "swift_code"        TEXT,
  "iban"              TEXT,
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "is_active"         BOOLEAN DEFAULT true,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_bank_transfers" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "from_account_id"   UUID REFERENCES "finance_financial_accounts"("id"),
  "to_account_id"     UUID REFERENCES "finance_financial_accounts"("id"),
  "amount"            NUMERIC(12, 2) NOT NULL,
  "exchange_rate"     NUMERIC(10, 6) DEFAULT '1',
  "converted_amount"  NUMERIC(12, 2),
  "transfer_date"     DATE NOT NULL,
  "reference"         TEXT,
  "notes"             TEXT,
  "status"            "workflow_status" DEFAULT 'DRAFT',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — BUDGETS
-- ============================================================

CREATE TABLE "finance_budgets" (
  "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"                      TEXT NOT NULL,
  "description"               TEXT,
  "category"                  TEXT,
  "total_amount"              NUMERIC(12, 2) NOT NULL,
  "start_date"                DATE NOT NULL,
  "end_date"                  DATE NOT NULL,
  "project_id"                UUID,
  "department"                TEXT,
  "control_account_id"        UUID,
  "variance_alert_threshold"  NUMERIC(5, 4) DEFAULT '0.1',
  "status"                    "budget_status" DEFAULT 'DRAFT',
  "organisation_id"           UUID REFERENCES "organisations"("id"),
  "created_by"                UUID,
  "created_at"                TIMESTAMP DEFAULT now(),
  "updated_at"                TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_budget_lines" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "budget_id"         UUID REFERENCES "finance_budgets"("id"),
  "account_id"        UUID REFERENCES "finance_accounts"("id"),
  "description"       TEXT,
  "planned_amount"    NUMERIC(12, 2) NOT NULL,
  "revised_amount"    NUMERIC(12, 2),
  "committed_amount"  NUMERIC(12, 2) DEFAULT '0',
  "actual_amount"     NUMERIC(12, 2) DEFAULT '0',
  "forecast_amount"   NUMERIC(12, 2) DEFAULT '0',
  "created_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — CLIENTS (CRM)
-- ============================================================

CREATE TABLE "finance_clients" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"              TEXT NOT NULL,
  "contact_person"    TEXT,
  "email"             TEXT,
  "phone"             TEXT,
  "address"           TEXT,
  "tax_registration"  TEXT,
  "currency"          TEXT DEFAULT 'USD',
  "payment_terms"     TEXT DEFAULT 'Net 30',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "is_active"         BOOLEAN DEFAULT true,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — FIXED ASSETS
-- ============================================================

CREATE TABLE "finance_fixed_assets" (
  "id"                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "asset_code"                TEXT NOT NULL UNIQUE,
  "name"                      TEXT NOT NULL,
  "description"               TEXT,
  "category_id"               UUID,
  "purchase_date"             DATE NOT NULL,
  "purchase_cost"             NUMERIC(12, 2) NOT NULL,
  "residual_value"            NUMERIC(12, 2) DEFAULT '0',
  "useful_life_months"        INTEGER NOT NULL,
  "depreciation_method"       TEXT DEFAULT 'straight_line',
  "accumulated_depreciation"  NUMERIC(12, 2) DEFAULT '0',
  "net_book_value"            NUMERIC(12, 2),
  "status"                    "asset_status" DEFAULT 'ACTIVE',
  "account_id"                UUID,
  "depreciation_account_id"   UUID,
  "organisation_id"           UUID REFERENCES "organisations"("id"),
  "created_at"                TIMESTAMP DEFAULT now(),
  "updated_at"                TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_depreciation_entries" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "asset_id"          UUID REFERENCES "finance_fixed_assets"("id"),
  "period_id"         UUID,
  "amount"            NUMERIC(12, 2) NOT NULL,
  "journal_entry_id"  UUID,
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "created_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — TAX
-- ============================================================

CREATE TABLE "finance_tax_config" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"            TEXT NOT NULL,
  "rate"            NUMERIC(5, 4) NOT NULL,
  "type"            TEXT DEFAULT 'percentage',
  "account_id"      UUID,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "is_active"       BOOLEAN DEFAULT true,
  "created_at"      TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_tax_entries" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tax_config_id"   UUID REFERENCES "finance_tax_config"("id"),
  "entity_id"       UUID,
  "entity_type"     TEXT,
  "base_amount"     NUMERIC(12, 2) NOT NULL,
  "tax_amount"      NUMERIC(12, 2) NOT NULL,
  "status"          TEXT DEFAULT 'pending',
  "period_id"       UUID,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — PAYROLL
-- ============================================================

CREATE TABLE "finance_employees" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "employee_code"   TEXT NOT NULL UNIQUE,
  "name"            TEXT NOT NULL,
  "email"           TEXT,
  "department"      TEXT,
  "designation"     TEXT,
  "basic_salary"    NUMERIC(12, 2),
  "currency"        TEXT DEFAULT 'PKR',
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "is_active"       BOOLEAN DEFAULT true,
  "created_at"      TIMESTAMP DEFAULT now(),
  "updated_at"      TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_payroll_runs" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "run_number"        TEXT NOT NULL UNIQUE,
  "period_start"      DATE NOT NULL,
  "period_end"        DATE NOT NULL,
  "status"            "workflow_status" DEFAULT 'DRAFT',
  "total_gross"       NUMERIC(12, 2) DEFAULT '0',
  "total_deductions"  NUMERIC(12, 2) DEFAULT '0',
  "total_net"         NUMERIC(12, 2) DEFAULT '0',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

CREATE TABLE "finance_payroll_lines" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "payroll_run_id"  UUID REFERENCES "finance_payroll_runs"("id"),
  "employee_id"     UUID REFERENCES "finance_employees"("id"),
  "basic_salary"    NUMERIC(12, 2),
  "allowances"      NUMERIC(12, 2) DEFAULT '0',
  "deductions"      NUMERIC(12, 2) DEFAULT '0',
  "net_pay"         NUMERIC(12, 2) NOT NULL,
  "currency"        TEXT DEFAULT 'PKR',
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — EXCHANGE RATES
-- ============================================================

CREATE TABLE "finance_exchange_rates" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "from_currency"   TEXT NOT NULL,
  "to_currency"     TEXT NOT NULL,
  "rate"            NUMERIC(10, 6) NOT NULL,
  "effective_date"  DATE NOT NULL,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — NOTIFICATIONS
-- ============================================================

CREATE TABLE "finance_notifications" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"         UUID NOT NULL,
  "title"           TEXT NOT NULL,
  "message"         TEXT NOT NULL,
  "type"            TEXT,
  "priority"        TEXT DEFAULT 'normal',
  "is_read"         BOOLEAN DEFAULT false,
  "entity_type"     TEXT,
  "entity_id"       UUID,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "created_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- AUDIT — AUDIT LOG
-- ============================================================

CREATE TABLE "audit_audit_log" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id"           UUID,
  "user_email"        TEXT,
  "user_name"         TEXT,
  "role_snapshot"     TEXT,
  "organisation_id"   UUID,
  "session_id"        TEXT,
  "auth_method"       TEXT,
  "action"            TEXT NOT NULL,
  "entity_type"       TEXT,
  "entity_id"         UUID,
  "status"            TEXT DEFAULT 'success',
  "severity"          TEXT DEFAULT 'info',
  "ip_address"        TEXT,
  "user_agent"        TEXT,
  "request_id"        TEXT,
  "description"       TEXT,
  "old_values"        JSONB,
  "new_values"        JSONB,
  "changed_columns"   JSONB,
  "reason"            TEXT,
  "approval_level"    TEXT,
  "source_module"     TEXT,
  "source_schema"     TEXT,
  "source_table"      TEXT,
  "project_id"        UUID,
  "amount"            NUMERIC(12, 2),
  "amount_currency"   TEXT,
  "prev_hash"         TEXT,
  "entry_hash"        TEXT,
  "created_at"        TIMESTAMP DEFAULT now()
);

CREATE INDEX "audit_log_org_idx" ON "audit_audit_log" ("organisation_id");
CREATE INDEX "audit_log_user_idx" ON "audit_audit_log" ("user_id");
CREATE INDEX "audit_log_action_idx" ON "audit_audit_log" ("action");
CREATE INDEX "audit_log_entity_idx" ON "audit_audit_log" ("entity_type", "entity_id");

-- ============================================================
-- FINANCE — SUBSCRIPTIONS
-- ============================================================

CREATE TABLE "finance_subscriptions" (
  "id"                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"                TEXT NOT NULL,
  "vendor_id"           UUID,
  "amount"              NUMERIC(12, 2) NOT NULL,
  "currency"            TEXT DEFAULT 'USD',
  "billing_cycle"       TEXT DEFAULT 'monthly',
  "next_renewal_date"   DATE,
  "start_date"          DATE NOT NULL,
  "end_date"            DATE,
  "account_id"          UUID,
  "organisation_id"     UUID REFERENCES "organisations"("id"),
  "is_active"           BOOLEAN DEFAULT true,
  "created_at"          TIMESTAMP DEFAULT now(),
  "updated_at"          TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — CONTRACTORS
-- ============================================================

CREATE TABLE "finance_contractors" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name"            TEXT NOT NULL,
  "email"           TEXT,
  "phone"           TEXT,
  "daily_rate"      NUMERIC(12, 2),
  "currency"        TEXT DEFAULT 'USD',
  "contract_start"  DATE,
  "contract_end"    DATE,
  "department"      TEXT,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "is_active"       BOOLEAN DEFAULT true,
  "created_at"      TIMESTAMP DEFAULT now(),
  "updated_at"      TIMESTAMP DEFAULT now()
);

-- ============================================================
-- FINANCE — COMMISSIONS
-- ============================================================

CREATE TABLE "finance_commissions" (
  "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "person_name"       TEXT NOT NULL,
  "project_id"        UUID,
  "client_id"         UUID,
  "type"              TEXT DEFAULT 'percentage',
  "rate"              NUMERIC(5, 4),
  "base_amount"       NUMERIC(12, 2),
  "commission_amount" NUMERIC(12, 2) NOT NULL,
  "status"            "workflow_status" DEFAULT 'DRAFT',
  "organisation_id"   UUID REFERENCES "organisations"("id"),
  "created_by"        UUID,
  "created_at"        TIMESTAMP DEFAULT now(),
  "updated_at"        TIMESTAMP DEFAULT now()
);

-- ============================================================
-- APPROVAL REQUESTS
-- ============================================================

CREATE TABLE "finance_approval_requests" (
  "id"              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entity_type"     TEXT NOT NULL,
  "entity_id"       UUID NOT NULL,
  "organisation_id" UUID REFERENCES "organisations"("id"),
  "status"          "approval_status" DEFAULT 'PENDING',
  "current_step"    INTEGER DEFAULT 1,
  "created_by"      UUID,
  "created_at"      TIMESTAMP DEFAULT now(),
  "updated_at"      TIMESTAMP DEFAULT now()
);
