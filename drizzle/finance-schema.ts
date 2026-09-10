/* ══════════════════════════════════════════════════════════
   drizzle/finance-schema.ts
   Finance Management System — SQLite Schema
   Merged from Javeria-5091/Finance-Management-System
════════════════════════════════════════════════════════════ */

import {
  sqliteTable, text, integer, real, index, uniqueIndex,
} from "drizzle-orm/sqlite-core";

/* ══════════════════════════════════════════════════════════
   CORE — ORGANISATIONS
════════════════════════════════════════════════════════════ */
export const organisations = sqliteTable("organisations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  settings: text("settings").default("{}"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   CORE — ROLES & PERMISSIONS
════════════════════════════════════════════════════════════ */
export const roles = sqliteTable("finance_roles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
});

export const permissions = sqliteTable("finance_permissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull().unique(),
  description: text("description"),
  module: text("module"),
});

export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  roleId: text("role_id").references(() => roles.id),
  permissionId: text("permission_id").references(() => permissions.id),
  amountLimit: real("amount_limit"),
  currency: text("currency").default("PKR"),
  scope: text("scope").default("ALL"),
  effectiveFrom: text("effective_from").default("(date('now'))"),
  effectiveTo: text("effective_to"),
});

export const userRoles = sqliteTable("finance_user_roles", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  roleId: text("role_id").references(() => roles.id),
  effectiveFrom: text("effective_from").default("(date('now'))"),
  effectiveTo: text("effective_to"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — CHART OF ACCOUNTS
════════════════════════════════════════════════════════════ */
export const accounts = sqliteTable("finance_accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  code: text("code").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  parentId: text("parent_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  description: text("description"),
  currency: text("currency").default("PKR"),
  openingBalance: real("opening_balance").default(0),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
}, (t) => [
  uniqueIndex("finance_accounts_code_org_idx").on(t.code, t.organisationId),
]);

/* ══════════════════════════════════════════════════════════
   FINANCE — FISCAL YEARS & PERIODS
════════════════════════════════════════════════════════════ */
export const fiscalYears = sqliteTable("finance_fiscal_years", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  organisationId: text("organisation_id").references(() => organisations.id),
  isOpen: integer("is_open", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
});

export const fiscalPeriods = sqliteTable("finance_fiscal_periods", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fiscalYearId: text("fiscal_year_id").references(() => fiscalYears.id),
  name: text("name").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").default("OPEN"),
  organisationId: text("organisation_id").references(() => organisations.id),
  closedBy: text("closed_by"),
  closedAt: text("closed_at"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — JOURNAL ENTRIES & LINES
════════════════════════════════════════════════════════════ */
export const journalEntries = sqliteTable("finance_journal_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  entryNumber: text("entry_number").notNull().unique(),
  description: text("description").notNull(),
  entryDate: text("entry_date").notNull(),
  status: text("status").default("DRAFT"),
  organisationId: text("organisation_id").references(() => organisations.id),
  projectId: text("project_id"),
  totalDebit: real("total_debit").default(0),
  totalCredit: real("total_credit").default(0),
  currency: text("currency").default("PKR"),
  exchangeRate: real("exchange_rate").default(1),
  reversalOf: text("reversal_of"),
  postedAt: text("posted_at"),
  postedBy: text("posted_by"),
  approvedBy: text("approved_by"),
  approvedAt: text("approved_at"),
  rejectionReason: text("rejection_reason"),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const journalLines = sqliteTable("finance_journal_lines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  journalEntryId: text("journal_entry_id").references(() => journalEntries.id),
  accountId: text("account_id").references(() => accounts.id),
  description: text("description"),
  debit: real("debit").default(0),
  credit: real("credit").default(0),
  currency: text("currency").default("PKR"),
  exchangeRate: real("exchange_rate").default(1),
  baseAmount: real("base_amount"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — INVOICES (AR)
════════════════════════════════════════════════════════════ */
export const financeInvoices = sqliteTable("finance_invoices", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceNumber: text("invoice_number").notNull().unique(),
  clientId: text("client_id"),
  clientName: text("client_name").notNull(),
  projectId: text("project_id"),
  description: text("description"),
  status: text("status").default("DRAFT"),
  issueDate: text("issue_date").notNull(),
  dueDate: text("due_date"),
  currency: text("currency").default("USD"),
  exchangeRate: real("exchange_rate").default(1),
  subtotal: real("subtotal").default(0),
  taxAmount: real("tax_amount").default(0),
  discountAmount: real("discount_amount").default(0),
  totalAmount: real("total_amount").default(0),
  amountPaid: real("amount_paid").default(0),
  outstandingAmount: real("outstanding_amount").default(0),
  journalEntryId: text("journal_entry_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const invoiceLines = sqliteTable("finance_invoice_lines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  invoiceId: text("invoice_id").references(() => financeInvoices.id),
  description: text("description").notNull(),
  quantity: real("quantity").default(1),
  unitPrice: real("unit_price").notNull(),
  amount: real("amount").notNull(),
  taxRate: real("tax_rate").default(0),
  taxAmount: real("tax_amount").default(0),
  accountId: text("account_id"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — VENDORS (AP)
════════════════════════════════════════════════════════════ */
export const vendors = sqliteTable("finance_vendors", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  taxRegistration: text("tax_registration"),
  ntn: text("ntn"),
  paymentTerms: text("payment_terms").default("Net 30"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const vendorBills = sqliteTable("finance_vendor_bills", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  billNumber: text("bill_number").notNull().unique(),
  vendorId: text("vendor_id").references(() => vendors.id),
  vendorName: text("vendor_name").notNull(),
  projectId: text("project_id"),
  description: text("description"),
  status: text("status").default("DRAFT"),
  billDate: text("bill_date").notNull(),
  dueDate: text("due_date"),
  currency: text("currency").default("PKR"),
  subtotal: real("subtotal").default(0),
  taxAmount: real("tax_amount").default(0),
  withholdingTax: real("withholding_tax").default(0),
  totalAmount: real("total_amount").default(0),
  amountPaid: real("amount_paid").default(0),
  journalEntryId: text("journal_entry_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  notes: text("notes"),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const vendorBillLines = sqliteTable("finance_vendor_bill_lines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  billId: text("bill_id").references(() => vendorBills.id),
  description: text("description").notNull(),
  quantity: real("quantity").default(1),
  unitPrice: real("unit_price").notNull(),
  amount: real("amount").notNull(),
  taxRate: real("tax_rate").default(0),
  taxAmount: real("tax_amount").default(0),
  accountId: text("account_id"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — PAYMENTS
════════════════════════════════════════════════════════════ */
export const payments = sqliteTable("finance_payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  paymentNumber: text("payment_number").notNull().unique(),
  type: text("type").notNull(),
  entityId: text("entity_id"),
  entityType: text("entity_type"),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  exchangeRate: real("exchange_rate").default(1),
  paymentDate: text("payment_date").notNull(),
  paymentMethod: text("payment_method"),
  bankAccountId: text("bank_account_id"),
  reference: text("reference"),
  notes: text("notes"),
  status: text("status").default("DRAFT"),
  journalEntryId: text("journal_entry_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const paymentAllocations = sqliteTable("finance_payment_allocations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  paymentId: text("payment_id").references(() => payments.id),
  invoiceId: text("invoice_id"),
  amount: real("amount").notNull(),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — CREDIT NOTES
════════════════════════════════════════════════════════════ */
export const creditNotes = sqliteTable("finance_credit_notes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  creditNoteNumber: text("credit_note_number").notNull().unique(),
  clientId: text("client_id"),
  clientName: text("client_name").notNull(),
  invoiceId: text("invoice_id"),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  reason: text("reason"),
  status: text("status").default("DRAFT"),
  journalEntryId: text("journal_entry_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — FINANCIAL ACCOUNTS (BANKING)
════════════════════════════════════════════════════════════ */
export const financialAccounts = sqliteTable("finance_financial_accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  type: text("type").notNull(),
  accountId: text("account_id").references(() => accounts.id),
  currency: text("currency").default("PKR"),
  openingBalance: real("opening_balance").default(0),
  currentBalance: real("current_balance").default(0),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  swiftCode: text("swift_code"),
  iban: text("iban"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const bankTransfers = sqliteTable("finance_bank_transfers", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fromAccountId: text("from_account_id").references(() => financialAccounts.id),
  toAccountId: text("to_account_id").references(() => financialAccounts.id),
  amount: real("amount").notNull(),
  exchangeRate: real("exchange_rate").default(1),
  convertedAmount: real("converted_amount"),
  transferDate: text("transfer_date").notNull(),
  reference: text("reference"),
  notes: text("notes"),
  status: text("status").default("DRAFT"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — BUDGETS
════════════════════════════════════════════════════════════ */
export const budgets = sqliteTable("finance_budgets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  totalAmount: real("total_amount").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  projectId: text("project_id"),
  department: text("department"),
  controlAccountId: text("control_account_id"),
  varianceAlertThreshold: real("variance_alert_threshold").default(0.1),
  status: text("status").default("DRAFT"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const budgetLines = sqliteTable("finance_budget_lines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  budgetId: text("budget_id").references(() => budgets.id),
  accountId: text("account_id").references(() => accounts.id),
  description: text("description"),
  plannedAmount: real("planned_amount").notNull(),
  revisedAmount: real("revised_amount"),
  committedAmount: real("committed_amount").default(0),
  actualAmount: real("actual_amount").default(0),
  forecastAmount: real("forecast_amount").default(0),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — CLIENTS (CRM)
════════════════════════════════════════════════════════════ */
export const financeClients = sqliteTable("finance_clients", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  contactPerson: text("contact_person"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  taxRegistration: text("tax_registration"),
  currency: text("currency").default("USD"),
  paymentTerms: text("payment_terms").default("Net 30"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — FIXED ASSETS
════════════════════════════════════════════════════════════ */
export const fixedAssets = sqliteTable("finance_fixed_assets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  assetCode: text("asset_code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  categoryId: text("category_id"),
  purchaseDate: text("purchase_date").notNull(),
  purchaseCost: real("purchase_cost").notNull(),
  residualValue: real("residual_value").default(0),
  usefulLifeMonths: integer("useful_life_months").notNull(),
  depreciationMethod: text("depreciation_method").default("straight_line"),
  accumulatedDepreciation: real("accumulated_depreciation").default(0),
  netBookValue: real("net_book_value"),
  status: text("status").default("ACTIVE"),
  accountId: text("account_id"),
  depreciationAccountId: text("depreciation_account_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const depreciationEntries = sqliteTable("finance_depreciation_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  assetId: text("asset_id").references(() => fixedAssets.id),
  periodId: text("period_id"),
  amount: real("amount").notNull(),
  journalEntryId: text("journal_entry_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — TAX
════════════════════════════════════════════════════════════ */
export const taxConfig = sqliteTable("finance_tax_config", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  rate: real("rate").notNull(),
  type: text("type").default("percentage"),
  accountId: text("account_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
});

export const taxEntries = sqliteTable("finance_tax_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  taxConfigId: text("tax_config_id").references(() => taxConfig.id),
  entityId: text("entity_id"),
  entityType: text("entity_type"),
  baseAmount: real("base_amount").notNull(),
  taxAmount: real("tax_amount").notNull(),
  status: text("status").default("pending"),
  periodId: text("period_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — PAYROLL
════════════════════════════════════════════════════════════ */
export const employees = sqliteTable("finance_employees", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  employeeCode: text("employee_code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email"),
  department: text("department"),
  designation: text("designation"),
  basicSalary: real("basic_salary"),
  currency: text("currency").default("PKR"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const payrollRuns = sqliteTable("finance_payroll_runs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  runNumber: text("run_number").notNull().unique(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  status: text("status").default("DRAFT"),
  totalGross: real("total_gross").default(0),
  totalDeductions: real("total_deductions").default(0),
  totalNet: real("total_net").default(0),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

export const payrollLines = sqliteTable("finance_payroll_lines", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  payrollRunId: text("payroll_run_id").references(() => payrollRuns.id),
  employeeId: text("employee_id").references(() => employees.id),
  basicSalary: real("basic_salary"),
  allowances: real("allowances").default(0),
  deductions: real("deductions").default(0),
  netPay: real("net_pay").notNull(),
  currency: text("currency").default("PKR"),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — EXCHANGE RATES
════════════════════════════════════════════════════════════ */
export const exchangeRates = sqliteTable("finance_exchange_rates", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  rate: real("rate").notNull(),
  effectiveDate: text("effective_date").notNull(),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — NOTIFICATIONS
════════════════════════════════════════════════════════════ */
export const financeNotifications = sqliteTable("finance_notifications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type"),
  priority: text("priority").default("normal"),
  isRead: integer("is_read", { mode: "boolean" }).default(false),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdAt: text("created_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   AUDIT — AUDIT LOG
════════════════════════════════════════════════════════════ */
export const auditLog = sqliteTable("audit_audit_log", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id"),
  userEmail: text("user_email"),
  userName: text("user_name"),
  roleSnapshot: text("role_snapshot"),
  organisationId: text("organisation_id"),
  sessionId: text("session_id"),
  authMethod: text("auth_method"),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  status: text("status").default("success"),
  severity: text("severity").default("info"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  requestId: text("request_id"),
  description: text("description"),
  oldValues: text("old_values"),
  newValues: text("new_values"),
  changedColumns: text("changed_columns"),
  reason: text("reason"),
  approvalLevel: text("approval_level"),
  sourceModule: text("source_module"),
  sourceSchema: text("source_schema"),
  sourceTable: text("source_table"),
  projectId: text("project_id"),
  amount: real("amount"),
  amountCurrency: text("amount_currency"),
  prevHash: text("prev_hash"),
  entryHash: text("entry_hash"),
  createdAt: text("created_at").default("(datetime('now'))"),
}, (t) => [
  index("audit_log_org_idx").on(t.organisationId),
  index("audit_log_user_idx").on(t.userId),
  index("audit_log_action_idx").on(t.action),
  index("audit_log_entity_idx").on(t.entityType, t.entityId),
]);

/* ══════════════════════════════════════════════════════════
   FINANCE — SUBSCRIPTIONS
════════════════════════════════════════════════════════════ */
export const subscriptions = sqliteTable("finance_subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  vendorId: text("vendor_id"),
  amount: real("amount").notNull(),
  currency: text("currency").default("USD"),
  billingCycle: text("billing_cycle").default("monthly"),
  nextRenewalDate: text("next_renewal_date"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  accountId: text("account_id"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — CONTRACTORS
════════════════════════════════════════════════════════════ */
export const contractors = sqliteTable("finance_contractors", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dailyRate: real("daily_rate"),
  currency: text("currency").default("USD"),
  contractStart: text("contract_start"),
  contractEnd: text("contract_end"),
  department: text("department"),
  organisationId: text("organisation_id").references(() => organisations.id),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — COMMISSIONS
════════════════════════════════════════════════════════════ */
export const commissions = sqliteTable("finance_commissions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  personName: text("person_name").notNull(),
  projectId: text("project_id"),
  clientId: text("client_id"),
  type: text("type").default("percentage"),
  rate: real("rate"),
  baseAmount: real("base_amount"),
  commissionAmount: real("commission_amount").notNull(),
  status: text("status").default("DRAFT"),
  organisationId: text("organisation_id").references(() => organisations.id),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   APPROVAL REQUESTS
════════════════════════════════════════════════════════════ */
export const approvalRequests = sqliteTable("finance_approval_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  organisationId: text("organisation_id").references(() => organisations.id),
  status: text("status").default("PENDING"),
  currentStep: integer("current_step").default(1),
  createdBy: text("created_by"),
  createdAt: text("created_at").default("(datetime('now'))"),
  updatedAt: text("updated_at").default("(datetime('now'))"),
});

/* ══════════════════════════════════════════════════════════
   FINANCE — TYPE EXPORTS
════════════════════════════════════════════════════════════ */
export type Organisation = typeof organisations.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type FiscalYear = typeof fiscalYears.$inferSelect;
export type FiscalPeriod = typeof fiscalPeriods.$inferSelect;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type JournalLine = typeof journalLines.$inferSelect;
export type FinanceInvoice = typeof financeInvoices.$inferSelect;
export type InvoiceLine = typeof invoiceLines.$inferSelect;
export type Vendor = typeof vendors.$inferSelect;
export type VendorBill = typeof vendorBills.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type CreditNote = typeof creditNotes.$inferSelect;
export type FinancialAccount = typeof financialAccounts.$inferSelect;
export type BankTransfer = typeof bankTransfers.$inferSelect;
export type Budget = typeof budgets.$inferSelect;
export type BudgetLine = typeof budgetLines.$inferSelect;
export type FinanceClient = typeof financeClients.$inferSelect;
export type FixedAsset = typeof fixedAssets.$inferSelect;
export type DepreciationEntry = typeof depreciationEntries.$inferSelect;
export type TaxConfig = typeof taxConfig.$inferSelect;
export type TaxEntry = typeof taxEntries.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type PayrollRun = typeof payrollRuns.$inferSelect;
export type PayrollLine = typeof payrollLines.$inferSelect;
export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type FinanceNotification = typeof financeNotifications.$inferSelect;
export type AuditLogEntry = typeof auditLog.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Contractor = typeof contractors.$inferSelect;
export type Commission = typeof commissions.$inferSelect;
export type ApprovalRequest = typeof approvalRequests.$inferSelect;
