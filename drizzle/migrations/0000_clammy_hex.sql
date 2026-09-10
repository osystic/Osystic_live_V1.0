CREATE TYPE "public"."application_status" AS ENUM('new', 'reviewing', 'shortlisted', 'interview', 'offered', 'rejected', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."currency_type" AS ENUM('USD', 'CAD', 'GBP', 'EUR', 'PKR');--> statement-breakpoint
CREATE TYPE "public"."expense_category" AS ENUM('Hosting', 'Software Tools', 'Platform Memberships', 'Fines & Penalties', 'Payroll', 'Marketing', 'Office', 'General');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('Draft', 'Sent', 'Paid', 'Closed', 'Overdue');--> statement-breakpoint
CREATE TYPE "public"."payroll_status" AS ENUM('Paid', 'Pending', 'Processing');--> statement-breakpoint
CREATE TYPE "public"."platform_type" AS ENUM('Upwork', 'Freelancer', 'Direct', 'LinkedIn', 'Referral');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('In Progress', 'Completed / Paid', 'Delayed / Overdue / Disputed', 'On Hold', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('Fixed Price', 'Milestone Based', 'Hourly', 'Retainer');--> statement-breakpoint
CREATE TYPE "public"."service_category" AS ENUM('AI & Machine Learning', 'Web Development', 'Mobile App', 'Cloud & DevOps', 'Data Engineering', 'Automation', 'Consulting', 'Other');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('todo', 'in_progress', 'review', 'done', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('super_admin', 'admin', 'project_manager', 'content_manager', 'finance_manager', 'developer');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('pending', 'active', 'rejected', 'suspended');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'developer',
	"status" "user_status" DEFAULT 'pending',
	"last_login_at" timestamp,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featured_image" text,
	"author" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"category" text,
	"status" "content_status" DEFAULT 'draft',
	"view_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "booking_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"duration" integer DEFAULT 30,
	"available" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"service" text NOT NULL,
	"message" text,
	"preferred_date" text NOT NULL,
	"preferred_time" text NOT NULL,
	"timezone" text DEFAULT 'UTC',
	"status" "booking_status" DEFAULT 'pending',
	"slot_id" uuid,
	"confirmed_date" text,
	"confirmed_time" text,
	"meeting_link" text,
	"admin_notes" text,
	"ip" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"featured_image" text,
	"client" text NOT NULL,
	"challenge" text NOT NULL,
	"solution" text NOT NULL,
	"results" jsonb DEFAULT '[]'::jsonb,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"status" "content_status" DEFAULT 'draft',
	"view_count" integer DEFAULT 0,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "case_studies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"service" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new',
	"ip" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"category" "expense_category" NOT NULL,
	"project_id" uuid,
	"project_code" text,
	"description" text NOT NULL,
	"paid_to" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" "currency_type" DEFAULT 'USD',
	"rate" numeric(10, 6) DEFAULT '1',
	"amount_usd" numeric(12, 2),
	"ref" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finance_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_code" text NOT NULL,
	"name" text NOT NULL,
	"client" text NOT NULL,
	"type" "project_type" DEFAULT 'Fixed Price',
	"platform" "platform_type" DEFAULT 'Direct',
	"category" "service_category" DEFAULT 'Web Development',
	"currency" "currency_type" DEFAULT 'USD',
	"status" "project_status" DEFAULT 'In Progress',
	"revenue" numeric(12, 2) DEFAULT '0',
	"agreed" numeric(12, 2) DEFAULT '0',
	"balance" numeric(12, 2) DEFAULT '0',
	"commission_rate" numeric(5, 4) DEFAULT '0',
	"dev_payout" numeric(12, 2) DEFAULT '0',
	"platform_fee" numeric(12, 2) DEFAULT '0',
	"net_profit" numeric(12, 2) DEFAULT '0',
	"margin" numeric(5, 4) DEFAULT '0',
	"start_date" date,
	"end_date" date,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "finance_projects_project_code_unique" UNIQUE("project_code")
);
--> statement-breakpoint
CREATE TABLE "income" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"project_id" uuid,
	"project_code" text,
	"project_name" text,
	"invoice_num" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" "currency_type" DEFAULT 'USD',
	"rate" numeric(10, 6) DEFAULT '1',
	"amount_usd" numeric(12, 2),
	"platform_fee" numeric(12, 2) DEFAULT '0',
	"net_usd" numeric(12, 2),
	"method" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"client" text NOT NULL,
	"project_id" uuid,
	"project_code" text,
	"description" text NOT NULL,
	"issued_date" date NOT NULL,
	"due_date" date,
	"amount" numeric(12, 2) NOT NULL,
	"currency" "currency_type" DEFAULT 'USD',
	"commission_rate" numeric(5, 4) DEFAULT '0',
	"method" text,
	"status" "invoice_status" DEFAULT 'Draft',
	"notes" text,
	"bank_name" text,
	"bank_account" text,
	"bank_swift" text,
	"signatory" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"city" text,
	"country" text NOT NULL,
	"linkedin" text,
	"portfolio" text,
	"position" text NOT NULL,
	"job_id" uuid,
	"years_exp" text NOT NULL,
	"current_role" text,
	"current_company" text,
	"skills" jsonb DEFAULT '[]'::jsonb,
	"cover_letter" text NOT NULL,
	"cv_url" text NOT NULL,
	"cv_path" text NOT NULL,
	"cv_file_name" text NOT NULL,
	"cv_text_content" text,
	"status" "application_status" DEFAULT 'new',
	"admin_notes" text,
	"ip" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"requirements" jsonb DEFAULT '[]'::jsonb,
	"nice_to_have" jsonb DEFAULT '[]'::jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payroll" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" date NOT NULL,
	"developer_name" text NOT NULL,
	"project_id" uuid,
	"project_code" text,
	"description" text,
	"amount" numeric(12, 2) NOT NULL,
	"currency" "currency_type" DEFAULT 'USD',
	"rate" numeric(10, 6) DEFAULT '1',
	"amount_usd" numeric(12, 2),
	"method" text,
	"status" "payroll_status" DEFAULT 'Pending',
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"client" text,
	"description" text,
	"status" text DEFAULT 'active',
	"priority" text DEFAULT 'medium',
	"start_date" date,
	"due_date" date,
	"budget" numeric(12, 2),
	"assigned_to" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"status" "task_status" DEFAULT 'todo',
	"priority" "task_priority" DEFAULT 'medium',
	"assigned_to" uuid,
	"due_date" date,
	"order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_slot_id_booking_slots_id_fk" FOREIGN KEY ("slot_id") REFERENCES "public"."booking_slots"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_project_id_finance_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."finance_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "income" ADD CONSTRAINT "income_project_id_finance_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."finance_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_project_id_finance_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."finance_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payroll" ADD CONSTRAINT "payroll_project_id_finance_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."finance_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_admin_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."admin_users"("id") ON DELETE no action ON UPDATE no action;