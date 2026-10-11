CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'developer',
	`status` text DEFAULT 'pending',
	`permissions` text DEFAULT '[]',
	`org_id` text,
	`scope` text DEFAULT 'ALL',
	`mfa_enabled` integer DEFAULT false,
	`mfa_secret` text,
	`last_login_at` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `ai_case_studies` (
	`id` text PRIMARY KEY NOT NULL,
	`github_url` text NOT NULL,
	`project_title` text,
	`generated_content` text NOT NULL,
	`analysis` text,
	`published_id` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ai_case_studies_github_url_unique` ON `ai_case_studies` (`github_url`);--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` text,
	`author` text NOT NULL,
	`tags` text DEFAULT '[]',
	`category` text,
	`status` text DEFAULT 'draft',
	`view_count` integer DEFAULT 0,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blogs_slug_unique` ON `blogs` (`slug`);--> statement-breakpoint
CREATE TABLE `booking_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL,
	`duration` integer DEFAULT 30,
	`available` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`phone` text,
	`service` text NOT NULL,
	`message` text,
	`preferred_date` text NOT NULL,
	`preferred_time` text NOT NULL,
	`timezone` text DEFAULT 'UTC',
	`status` text DEFAULT 'pending',
	`slot_id` text,
	`confirmed_date` text,
	`confirmed_time` text,
	`meeting_link` text,
	`admin_notes` text,
	`ip` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`slot_id`) REFERENCES `booking_slots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `case_studies` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` text,
	`client` text NOT NULL,
	`challenge` text NOT NULL,
	`solution` text NOT NULL,
	`results` text DEFAULT '[]',
	`technologies` text DEFAULT '[]',
	`status` text DEFAULT 'draft',
	`view_count` integer DEFAULT 0,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `case_studies_slug_unique` ON `case_studies` (`slug`);--> statement-breakpoint
CREATE TABLE `contact_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text,
	`service` text,
	`message` text NOT NULL,
	`status` text DEFAULT 'new',
	`ip` text,
	`user_agent` text,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`category` text NOT NULL,
	`project_id` text,
	`project_code` text,
	`description` text NOT NULL,
	`paid_to` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`rate` real DEFAULT 1,
	`amount_usd` real,
	`ref` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`project_id`) REFERENCES `finance_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`project_code` text NOT NULL,
	`name` text NOT NULL,
	`client` text NOT NULL,
	`type` text DEFAULT 'Fixed Price',
	`platform` text DEFAULT 'Direct',
	`category` text DEFAULT 'Web Development',
	`currency` text DEFAULT 'USD',
	`status` text DEFAULT 'In Progress',
	`revenue` real DEFAULT 0,
	`agreed` real DEFAULT 0,
	`balance` real DEFAULT 0,
	`commission_rate` real DEFAULT 0,
	`dev_payout` real DEFAULT 0,
	`platform_fee` real DEFAULT 0,
	`net_profit` real DEFAULT 0,
	`margin` real DEFAULT 0,
	`start_date` text,
	`end_date` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_projects_project_code_unique` ON `finance_projects` (`project_code`);--> statement-breakpoint
CREATE TABLE `income` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`project_id` text,
	`project_code` text,
	`project_name` text,
	`invoice_num` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`rate` real DEFAULT 1,
	`amount_usd` real,
	`platform_fee` real DEFAULT 0,
	`net_usd` real,
	`method` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`project_id`) REFERENCES `finance_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`client` text NOT NULL,
	`project_id` text,
	`project_code` text,
	`description` text NOT NULL,
	`issued_date` text NOT NULL,
	`due_date` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`commission_rate` real DEFAULT 0,
	`method` text,
	`status` text DEFAULT 'Draft',
	`notes` text,
	`bank_name` text,
	`bank_account` text,
	`bank_swift` text,
	`signatory` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`project_id`) REFERENCES `finance_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_invoice_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`city` text,
	`country` text NOT NULL,
	`linkedin` text,
	`portfolio` text,
	`position` text NOT NULL,
	`job_id` text,
	`years_exp` text NOT NULL,
	`current_role` text,
	`current_company` text,
	`skills` text DEFAULT '[]',
	`cover_letter` text NOT NULL,
	`cv_url` text NOT NULL,
	`cv_path` text NOT NULL,
	`cv_file_name` text NOT NULL,
	`cv_text_content` text,
	`status` text DEFAULT 'new',
	`admin_notes` text,
	`ip` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`department` text NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`requirements` text DEFAULT '[]',
	`nice_to_have` text DEFAULT '[]',
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE TABLE `newsroom` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text,
	`content` text NOT NULL,
	`featured_image` text,
	`author` text NOT NULL,
	`tags` text DEFAULT '[]',
	`category` text,
	`status` text DEFAULT 'draft',
	`view_count` integer DEFAULT 0,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsroom_slug_unique` ON `newsroom` (`slug`);--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`developer_name` text NOT NULL,
	`project_id` text,
	`project_code` text,
	`description` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`rate` real DEFAULT 1,
	`amount_usd` real,
	`method` text,
	`status` text DEFAULT 'Pending',
	`notes` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`project_id`) REFERENCES `finance_projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `portfolio_projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`featured_image` text,
	`images` text DEFAULT '[]',
	`technologies` text DEFAULT '[]',
	`category` text,
	`client` text,
	`project_url` text,
	`github_url` text,
	`status` text DEFAULT 'draft',
	`featured` integer DEFAULT false,
	`order` integer DEFAULT 0,
	`published_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portfolio_projects_slug_unique` ON `portfolio_projects` (`slug`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`client` text,
	`description` text,
	`status` text DEFAULT 'active',
	`priority` text DEFAULT 'medium',
	`start_date` text,
	`due_date` text,
	`budget` real,
	`assigned_to` text DEFAULT '[]',
	`tags` text DEFAULT '[]',
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`created_by`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`parent_id` text,
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`description` text,
	`currency` text DEFAULT 'USD',
	`opening_balance` real DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_accounts_code_org_idx` ON `finance_accounts` (`code`,`organisation_id`);--> statement-breakpoint
CREATE TABLE `finance_approval_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`organisation_id` text,
	`status` text DEFAULT 'PENDING',
	`current_step` integer DEFAULT 1,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `audit_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`user_email` text,
	`user_name` text,
	`role_snapshot` text,
	`organisation_id` text,
	`session_id` text,
	`auth_method` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`status` text DEFAULT 'success',
	`severity` text DEFAULT 'info',
	`ip_address` text,
	`user_agent` text,
	`request_id` text,
	`description` text,
	`old_values` text,
	`new_values` text,
	`changed_columns` text,
	`reason` text,
	`approval_level` text,
	`source_module` text,
	`source_schema` text,
	`source_table` text,
	`project_id` text,
	`amount` real,
	`amount_currency` text,
	`prev_hash` text,
	`entry_hash` text,
	`created_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE INDEX `audit_log_org_idx` ON `audit_audit_log` (`organisation_id`);--> statement-breakpoint
CREATE INDEX `audit_log_user_idx` ON `audit_audit_log` (`user_id`);--> statement-breakpoint
CREATE INDEX `audit_log_action_idx` ON `audit_audit_log` (`action`);--> statement-breakpoint
CREATE INDEX `audit_log_entity_idx` ON `audit_audit_log` (`entity_type`,`entity_id`);--> statement-breakpoint
CREATE TABLE `finance_bank_transfers` (
	`id` text PRIMARY KEY NOT NULL,
	`from_account_id` text,
	`to_account_id` text,
	`amount` real NOT NULL,
	`exchange_rate` real DEFAULT 1,
	`converted_amount` real,
	`transfer_date` text NOT NULL,
	`reference` text,
	`notes` text,
	`status` text DEFAULT 'DRAFT',
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`from_account_id`) REFERENCES `finance_financial_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_account_id`) REFERENCES `finance_financial_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_budget_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`budget_id` text,
	`account_id` text,
	`description` text,
	`planned_amount` real NOT NULL,
	`revised_amount` real,
	`committed_amount` real DEFAULT 0,
	`actual_amount` real DEFAULT 0,
	`forecast_amount` real DEFAULT 0,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`budget_id`) REFERENCES `finance_budgets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `finance_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_budgets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category` text,
	`total_amount` real NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`project_id` text,
	`department` text,
	`control_account_id` text,
	`variance_alert_threshold` real DEFAULT 0.1,
	`status` text DEFAULT 'DRAFT',
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_commissions` (
	`id` text PRIMARY KEY NOT NULL,
	`person_name` text NOT NULL,
	`project_id` text,
	`client_id` text,
	`type` text DEFAULT 'percentage',
	`rate` real,
	`base_amount` real,
	`commission_amount` real NOT NULL,
	`status` text DEFAULT 'DRAFT',
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_contractors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`daily_rate` real,
	`currency` text DEFAULT 'USD',
	`contract_start` text,
	`contract_end` text,
	`department` text,
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_credit_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`credit_note_number` text NOT NULL,
	`client_id` text,
	`client_name` text NOT NULL,
	`invoice_id` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`reason` text,
	`status` text DEFAULT 'DRAFT',
	`journal_entry_id` text,
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_credit_notes_credit_note_number_unique` ON `finance_credit_notes` (`credit_note_number`);--> statement-breakpoint
CREATE TABLE `finance_depreciation_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_id` text,
	`period_id` text,
	`amount` real NOT NULL,
	`journal_entry_id` text,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`asset_id`) REFERENCES `finance_fixed_assets`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_employees` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_code` text NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`department` text,
	`designation` text,
	`basic_salary` real,
	`currency` text DEFAULT 'USD',
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_employees_employee_code_unique` ON `finance_employees` (`employee_code`);--> statement-breakpoint
CREATE TABLE `finance_exchange_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`from_currency` text NOT NULL,
	`to_currency` text NOT NULL,
	`rate` real NOT NULL,
	`effective_date` text NOT NULL,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_clients` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address` text,
	`tax_registration` text,
	`currency` text DEFAULT 'USD',
	`payment_terms` text DEFAULT 'Net 30',
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text NOT NULL,
	`client_id` text,
	`client_name` text NOT NULL,
	`project_id` text,
	`description` text,
	`status` text DEFAULT 'DRAFT',
	`issue_date` text NOT NULL,
	`due_date` text,
	`currency` text DEFAULT 'USD',
	`exchange_rate` real DEFAULT 1,
	`subtotal` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`discount_amount` real DEFAULT 0,
	`total_amount` real DEFAULT 0,
	`amount_paid` real DEFAULT 0,
	`outstanding_amount` real DEFAULT 0,
	`journal_entry_id` text,
	`organisation_id` text,
	`notes` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_invoices_invoice_number_unique` ON `finance_invoices` (`invoice_number`);--> statement-breakpoint
CREATE TABLE `finance_notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`type` text,
	`priority` text DEFAULT 'normal',
	`is_read` integer DEFAULT false,
	`entity_type` text,
	`entity_id` text,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_financial_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`account_id` text,
	`currency` text DEFAULT 'USD',
	`opening_balance` real DEFAULT 0,
	`current_balance` real DEFAULT 0,
	`bank_name` text,
	`account_number` text,
	`swift_code` text,
	`iban` text,
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`account_id`) REFERENCES `finance_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_fiscal_periods` (
	`id` text PRIMARY KEY NOT NULL,
	`fiscal_year_id` text,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`status` text DEFAULT 'OPEN',
	`organisation_id` text,
	`closed_by` text,
	`closed_at` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`fiscal_year_id`) REFERENCES `finance_fiscal_years`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_fiscal_years` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`organisation_id` text,
	`is_open` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_fixed_assets` (
	`id` text PRIMARY KEY NOT NULL,
	`asset_code` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`category_id` text,
	`purchase_date` text NOT NULL,
	`purchase_cost` real NOT NULL,
	`residual_value` real DEFAULT 0,
	`useful_life_months` integer NOT NULL,
	`depreciation_method` text DEFAULT 'straight_line',
	`accumulated_depreciation` real DEFAULT 0,
	`net_book_value` real,
	`status` text DEFAULT 'ACTIVE',
	`account_id` text,
	`depreciation_account_id` text,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_fixed_assets_asset_code_unique` ON `finance_fixed_assets` (`asset_code`);--> statement-breakpoint
CREATE TABLE `finance_invoice_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text,
	`description` text NOT NULL,
	`quantity` real DEFAULT 1,
	`unit_price` real NOT NULL,
	`amount` real NOT NULL,
	`tax_rate` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`account_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`invoice_id`) REFERENCES `finance_invoices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_journal_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`entry_number` text NOT NULL,
	`description` text NOT NULL,
	`entry_date` text NOT NULL,
	`status` text DEFAULT 'DRAFT',
	`organisation_id` text,
	`project_id` text,
	`total_debit` real DEFAULT 0,
	`total_credit` real DEFAULT 0,
	`currency` text DEFAULT 'USD',
	`exchange_rate` real DEFAULT 1,
	`reversal_of` text,
	`posted_at` text,
	`posted_by` text,
	`approved_by` text,
	`approved_at` text,
	`rejection_reason` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_journal_entries_entry_number_unique` ON `finance_journal_entries` (`entry_number`);--> statement-breakpoint
CREATE TABLE `finance_journal_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`journal_entry_id` text,
	`account_id` text,
	`description` text,
	`debit` real DEFAULT 0,
	`credit` real DEFAULT 0,
	`currency` text DEFAULT 'USD',
	`exchange_rate` real DEFAULT 1,
	`base_amount` real,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`journal_entry_id`) REFERENCES `finance_journal_entries`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`account_id`) REFERENCES `finance_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `organisations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`settings` text DEFAULT '{}',
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `organisations_slug_unique` ON `organisations` (`slug`);--> statement-breakpoint
CREATE TABLE `finance_payment_allocations` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_id` text,
	`invoice_id` text,
	`amount` real NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`payment_id`) REFERENCES `finance_payments`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`payment_number` text NOT NULL,
	`type` text NOT NULL,
	`entity_id` text,
	`entity_type` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`exchange_rate` real DEFAULT 1,
	`payment_date` text NOT NULL,
	`payment_method` text,
	`bank_account_id` text,
	`reference` text,
	`notes` text,
	`status` text DEFAULT 'DRAFT',
	`journal_entry_id` text,
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_payments_payment_number_unique` ON `finance_payments` (`payment_number`);--> statement-breakpoint
CREATE TABLE `finance_payroll_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`payroll_run_id` text,
	`employee_id` text,
	`basic_salary` real,
	`allowances` real DEFAULT 0,
	`deductions` real DEFAULT 0,
	`net_pay` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`payroll_run_id`) REFERENCES `finance_payroll_runs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`employee_id`) REFERENCES `finance_employees`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_payroll_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`run_number` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`status` text DEFAULT 'DRAFT',
	`total_gross` real DEFAULT 0,
	`total_deductions` real DEFAULT 0,
	`total_net` real DEFAULT 0,
	`organisation_id` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_payroll_runs_run_number_unique` ON `finance_payroll_runs` (`run_number`);--> statement-breakpoint
CREATE TABLE `finance_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`description` text,
	`module` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_permissions_code_unique` ON `finance_permissions` (`code`);--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`role_id` text,
	`permission_id` text,
	`amount_limit` real,
	`currency` text DEFAULT 'USD',
	`scope` text DEFAULT 'ALL',
	`effective_from` text DEFAULT '(date(''now''))',
	`effective_to` text,
	FOREIGN KEY (`role_id`) REFERENCES `finance_roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `finance_permissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`vendor_id` text,
	`amount` real NOT NULL,
	`currency` text DEFAULT 'USD',
	`billing_cycle` text DEFAULT 'monthly',
	`next_renewal_date` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`account_id` text,
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_tax_config` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rate` real NOT NULL,
	`type` text DEFAULT 'percentage',
	`account_id` text,
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_tax_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`tax_config_id` text,
	`entity_id` text,
	`entity_type` text,
	`base_amount` real NOT NULL,
	`tax_amount` real NOT NULL,
	`status` text DEFAULT 'pending',
	`period_id` text,
	`organisation_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`tax_config_id`) REFERENCES `finance_tax_config`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_user_roles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`role_id` text,
	`effective_from` text DEFAULT '(date(''now''))',
	`effective_to` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`role_id`) REFERENCES `finance_roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_vendor_bill_lines` (
	`id` text PRIMARY KEY NOT NULL,
	`bill_id` text,
	`description` text NOT NULL,
	`quantity` real DEFAULT 1,
	`unit_price` real NOT NULL,
	`amount` real NOT NULL,
	`tax_rate` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`account_id` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`bill_id`) REFERENCES `finance_vendor_bills`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `finance_vendor_bills` (
	`id` text PRIMARY KEY NOT NULL,
	`bill_number` text NOT NULL,
	`vendor_id` text,
	`vendor_name` text NOT NULL,
	`project_id` text,
	`description` text,
	`status` text DEFAULT 'DRAFT',
	`bill_date` text NOT NULL,
	`due_date` text,
	`currency` text DEFAULT 'USD',
	`subtotal` real DEFAULT 0,
	`tax_amount` real DEFAULT 0,
	`withholding_tax` real DEFAULT 0,
	`total_amount` real DEFAULT 0,
	`amount_paid` real DEFAULT 0,
	`journal_entry_id` text,
	`organisation_id` text,
	`notes` text,
	`created_by` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`vendor_id`) REFERENCES `finance_vendors`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `finance_vendor_bills_bill_number_unique` ON `finance_vendor_bills` (`bill_number`);--> statement-breakpoint
CREATE TABLE `finance_vendors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_person` text,
	`email` text,
	`phone` text,
	`address` text,
	`tax_registration` text,
	`ntn` text,
	`payment_terms` text DEFAULT 'Net 30',
	`organisation_id` text,
	`is_active` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`organisation_id`) REFERENCES `organisations`(`id`) ON UPDATE no action ON DELETE no action
);
