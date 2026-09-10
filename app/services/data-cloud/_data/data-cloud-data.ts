/* ══════════════════════════════════════════════════════════
   data-cloud-data.ts
   Data for all 5 Data & Cloud service pages.
   No fake stats, no fabricated numbers, no promises.
══════════════════════════════════════════════════════════ */

import type { DataCloudPageData } from "./types";

export const DATA_CLOUD_PAGES: DataCloudPageData[] = [

  /* ═══════════════════════════════════════════════════════
     1. DATA ANALYSIS & BI
  ═══════════════════════════════════════════════════════ */
  {
    slug:         "data-analysis",
    name:         "Data Analysis & BI",
    tagline:      "Dashboards and analytics platforms that turn raw data into decisions.",
    heroH1:       "The right numbers, in front of the right people.",
    heroSub:      "We build the pipelines, models, and dashboards that give your teams reliable self-serve access to the metrics that drive their decisions.",
    breadcrumb:   "Data Analysis & BI",
    metaTitle:    "Data Analysis & Business Intelligence Services",
    metaDesc:     "OSYSTIC builds BI platforms, analytics dashboards, and dbt data models — giving business teams reliable self-serve access to the metrics they need.",
    keywords:     ["business intelligence", "BI dashboard", "data analytics", "dbt", "Looker", "Tableau", "Power BI", "data modelling"],
    diagramTitle: "BI pipeline: Sources → Ingest → Stage → Transform → Data Mart → Semantic Layer → Dashboard → Distribute",
    pipeNodes: [
      { id: "source",   label: "Sources",       sub: "DB / APIs / files",  x: 90,  y: 220 },
      { id: "ingest",   label: "Ingest",         sub: "ELT pipeline",       x: 260, y: 130 },
      { id: "stage",    label: "Stage",          sub: "Raw warehouse",      x: 260, y: 310 },
      { id: "transform",label: "Transform",      sub: "dbt models",         x: 430, y: 220 },
      { id: "mart",     label: "Data Mart",      sub: "Business metrics",   x: 600, y: 130 },
      { id: "semantic", label: "Semantic Layer",  sub: "Looker / Cube",      x: 600, y: 310 },
      { id: "dash",     label: "Dashboard",      sub: "Self-serve BI",      x: 770, y: 130 },
      { id: "alerts",   label: "Distribute",     sub: "Alerts & reports",   x: 770, y: 310, dark: true },
    ],
    pipeEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Requirements",    tag: "01", desc: "Map the decisions each dashboard needs to support and the data sources available to answer them — before touching any data.", from: "Business Needs",   fromSub: "Decisions · Questions · Sources", to: "Requirements Doc", checks: ["Decision map", "Source inventory", "Metric glossary"] },
      { title: "Data Audit",      tag: "02", desc: "Assess data quality, freshness, and completeness. Surface issues now — not after building dashboards on bad data.", from: "Source Systems",  fromSub: "Quality · Freshness · Gaps",     to: "Audit Report",     checks: ["Null rates", "Freshness SLAs", "Join key integrity"] },
      { title: "dbt Modelling",   tag: "03", desc: "Build staging, intermediate, and mart models with tests at each layer. Every metric defined once, documented, tested.", from: "Raw Warehouse",   fromSub: "Staging → Marts → Tests",        to: "Trusted Models",   checks: ["Data tests passing", "Docs generated", "Lineage verified"] },
      { title: "Dashboard Build", tag: "04", desc: "Iterative delivery of dashboard views — reviewed with end users at each milestone, not just at the end.", from: "Trusted Models",  fromSub: "Dashboard iterations · UAT",     to: "Dashboard",        checks: ["End-user review", "Mobile tested", "Filter logic"] },
      { title: "Semantic Layer",  tag: "05", desc: "Self-serve analytics layer so non-technical users can explore data without engineering support.", from: "Dashboard",       fromSub: "LookML / Cube / MetricFlow",     to: "Self-serve",       checks: ["Explore tested", "Permissions set", "Caching configured"] },
      { title: "Alerts & Reports",tag: "06", desc: "Scheduled reports and threshold-based alerts replacing manual export-and-send workflows.", from: "Self-serve",      fromSub: "Email · Slack · Threshold alerts", to: "Distributed BI",  checks: ["Alert accuracy", "Distribution list", "Unsubscribe option"] },
    ],
    services: [
      { title: "Dashboard Development",  desc: "Custom dashboards in Tableau, Looker, Power BI, or custom-built React — designed around the specific decisions they need to support.", points: ["Decision-first design", "Mobile-friendly", "Drill-through capability"] },
      { title: "dbt Data Modelling",     desc: "dbt models transforming raw data into reliable, documented, tested metrics — the single source of truth every downstream system depends on.", points: ["Staging → mart layers", "Data tests at each layer", "Auto-documentation"] },
      { title: "Self-Serve Analytics",   desc: "Semantic layers letting non-technical users answer their own questions without opening engineering tickets.", points: ["LookML / Cube.js", "Governed metric definitions", "Row-level security"] },
      { title: "Reporting Automation",   desc: "Scheduled report generation and distribution replacing manual export workflows — delivered to email, Slack, or any destination.", points: ["Scheduled delivery", "Threshold alerts", "Distribution management"] },
      { title: "KPI Framework Design",   desc: "Working with your team to define, agree, and implement the metrics that matter — with a single documented definition for each.", points: ["Metric glossary", "Single source of truth", "Stakeholder sign-off"] },
    ],
    techStack: [
      { category: "Transformation", items: ["dbt Core", "dbt Cloud", "SQL", "Python"] },
      { category: "Warehouses",     items: ["BigQuery", "Snowflake", "Redshift", "DuckDB"] },
      { category: "BI Tools",       items: ["Looker", "Tableau", "Power BI", "Metabase"] },
      { category: "Orchestration",  items: ["Airflow", "dbt Cloud", "Prefect"] },
    ],
    industries: [
      { name: "Retail",        detail: "Sales performance, inventory analytics, customer segmentation, promotion effectiveness." },
      { name: "Finance",       detail: "P&L reporting, risk dashboards, regulatory reporting, cost centre analytics." },
      { name: "Healthcare",    detail: "Clinical performance metrics, operational dashboards, population health analytics." },
      { name: "Manufacturing", detail: "OEE dashboards, quality metrics, supply chain analytics, cost tracking." },
    ],
    faqs: [
      { q: "Our data is messy — can you still build dashboards?",      a: "Yes, but we do not hide the problem. We surface data quality issues and build the dbt tests and transformations to address them. Dashboards on bad data produce bad decisions." },
      { q: "What BI tools do you work with?",                          a: "Looker, Tableau, Power BI, and Metabase most frequently. For custom requirements we build on React with charting libraries. The right tool depends on your existing stack and user base." },
      { q: "How do you ensure metric consistency across dashboards?",  a: "By building a semantic layer where metrics are defined once and referenced everywhere. When the definition changes, it changes in one place." },
      { q: "Do you help define what metrics we should track?",         a: "Yes. We run a metric definition workshop to agree on what matters, how each metric is calculated, and who owns it — before building anything." },
    ],
    ctaH2:       "Need better analytics?",
    ctaDesc:     "Tell us what decisions your team needs to make faster. We will come back with an honest data and BI plan.",
    relatedSlugs: ["data", "cloud", "devops"],
  },

  /* ═══════════════════════════════════════════════════════
     2. CLOUD AWS / GCP
  ═══════════════════════════════════════════════════════ */
  {
    slug:         "cloud",
    name:         "Cloud AWS / GCP",
    tagline:      "Cloud infrastructure built for reliability, cost efficiency, and developer productivity.",
    heroH1:       "Cloud infrastructure that holds up when it matters.",
    heroSub:      "We design and implement cloud infrastructure on AWS and GCP — from initial architecture through Kubernetes, CI/CD, and the observability stack your team needs to operate confidently.",
    breadcrumb:   "Cloud AWS / GCP",
    metaTitle:    "Cloud Infrastructure Services — AWS & GCP",
    metaDesc:     "OSYSTIC designs and implements cloud infrastructure on AWS and GCP — Terraform IaC, Kubernetes, CI/CD pipelines, cost optimisation, and full observability stack.",
    keywords:     ["AWS cloud", "GCP cloud", "cloud infrastructure", "Terraform", "Kubernetes", "EKS", "GKE", "cloud cost optimisation"],
    diagramTitle: "Cloud infrastructure flow: Architecture → IaC → Security → Environments → CI/CD → Migration → Cost Tuning → Operate",
    pipeNodes: [
      { id: "design",   label: "Architecture",  sub: "Design & review",    x: 90,  y: 220 },
      { id: "iac",      label: "IaC",           sub: "Terraform / CDK",    x: 260, y: 130 },
      { id: "security", label: "Security",      sub: "IAM & network",      x: 260, y: 310 },
      { id: "envs",     label: "Environments",  sub: "Dev / stg / prod",   x: 430, y: 220 },
      { id: "cicd",     label: "CI/CD",         sub: "Build & deploy",     x: 600, y: 130 },
      { id: "migrate",  label: "Migrate",       sub: "Controlled cutover",      x: 600, y: 310 },
      { id: "cost",     label: "Cost Tuning",   sub: "Right-size & RI",    x: 770, y: 130 },
      { id: "operate",  label: "Operate",       sub: "Monitor & alert",    x: 770, y: 310, dark: true },
    ],
    pipeEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Architecture Design",    tag: "01", desc: "Current state assessment, target architecture definition, and agreement on non-functional requirements and cost envelope.", from: "Current State",    fromSub: "NFRs · Scale · Cost target",     to: "Architecture Doc",  checks: ["NFR sign-off", "Cost estimate", "Risk register"] },
      { title: "Security Baseline",      tag: "02", desc: "IAM role design, VPC network architecture, secret management, and a client-defined security-control baseline before production provisioning.", from: "Architecture",     fromSub: "IAM · VPC · Secrets · Compliance", to: "Security Baseline", checks: ["Least-privilege IAM", "Network segmentation", "Secret manager"] },
      { title: "IaC Implementation",     tag: "03", desc: "Terraform or CDK implementation of all infrastructure — reproducible, version-controlled, and reviewable via pull request.", from: "Security Baseline", fromSub: "Terraform · CDK · Review gates",  to: "IaC Complete",      checks: ["Plan reviewed", "State backend configured", "Lock file"] },
      { title: "Environment Parity",     tag: "04", desc: "Dev, staging, and production environments provisioned identically via the same IaC — reducing environment drift and 'works in dev' failure modes.", from: "IaC Complete",     fromSub: "Dev / Staging / Prod parity",    to: "Environments",      checks: ["Env parity verified", "Secrets isolated", "RBAC per env"] },
      { title: "Migration & Cutover",    tag: "05", desc: "Phased migration plan with rollback capability and low/zero-downtime techniques where required and technically feasible. Runbooks are written before execution.", from: "Environments",     fromSub: "Migration plan · Rollback",      to: "Migrated",          checks: ["Rollback tested", "Traffic shifting plan", "Cutover sign-off"] },
      { title: "Cost Optimisation",      tag: "06", desc: "Right-sizing, Graviton/ARM migration, Reserved Instance planning, and architectural changes to reduce spend without sacrificing reliability.", from: "Migrated",     fromSub: "Right-size · RI · Savings plan", to: "Optimised Infra",   checks: ["Savings measured", "RI committed", "Monitoring live"] },
    ],
    services: [
      { title: "Infrastructure as Code",    desc: "Terraform and CDK configurations making your infrastructure reproducible, version-controlled, and reviewable — no more manual console changes.", points: ["Terraform / CDK", "State management", "Module reuse"] },
      { title: "Kubernetes Orchestration",  desc: "EKS and GKE cluster design, workload configuration, Helm chart development, and operational runbooks for container-based deployments.", points: ["EKS / GKE cluster design", "Helm charts", "Operational runbooks"] },
      { title: "Security Architecture",     desc: "IAM role design, VPC network segmentation, secret management, and security controls mapped to client-defined requirements across AWS and GCP.", points: ["Least-privilege IAM", "VPC design", "Secret management"] },
      { title: "Cost Optimisation",         desc: "Right-sizing analysis, Graviton/ARM migration, Reserved Instance planning, and architectural changes that reduce cloud spend.", points: ["Right-sizing audit", "RI planning", "Graviton migration"] },
      { title: "Observability Stack",       desc: "Metrics, logs, and traces in a coherent operational view — with alerting that surfaces real problems before users report them.", points: ["Prometheus + Grafana", "Distributed tracing", "Runbook-linked alerts"] },
    ],
    techStack: [
      { category: "Cloud",         items: ["AWS", "GCP", "Terraform", "AWS CDK"] },
      { category: "Containers",    items: ["Kubernetes", "EKS", "GKE", "Helm", "Docker"] },
      { category: "CI/CD",         items: ["GitHub Actions", "ArgoCD", "GitLab CI"] },
      { category: "Observability", items: ["Prometheus", "Grafana", "Datadog", "CloudWatch"] },
    ],
    industries: [
      { name: "Technology",     detail: "SaaS platform infrastructure, multi-region deployments, developer productivity infrastructure." },
      { name: "Finance",        detail: "Cloud architecture designed to support regulated workloads, with encryption, audit logging, and disaster-recovery controls." },
      { name: "Healthcare",     detail: "Healthcare cloud architecture designed around privacy, access control, encrypted storage, secure networking, and auditability requirements." },
      { name: "Manufacturing",  detail: "IoT data ingestion infrastructure, edge-to-cloud pipelines, OT/IT integration." },
    ],
    faqs: [
      { q: "Do you work with AWS or GCP?",                       a: "Both. Most teams are committed to one cloud and we work within that. For greenfield projects we can advise on the tradeoffs, but both are mature enough that the choice matters less than how you use either." },
      { q: "How do you approach zero-downtime migrations?",      a: "Where low/zero-downtime cutover is required and feasible, we use patterns such as additive infrastructure changes, blue/green deployments, and controlled traffic shifting, with a documented rollback procedure." },
      { q: "Can you reduce our existing cloud bill?",            a: "Usually yes, but we audit first. Common wins include right-sizing, switching to Graviton/ARM, and Reserved Instance planning. We give you a written estimate before starting optimisation work." },
      { q: "Do you hand over all Terraform code?",               a: "Yes. All IaC code, state configuration, runbooks, and architecture documentation are yours. No ongoing dependency on us to make infrastructure changes." },
    ],
    ctaH2:       "Need better cloud infrastructure?",
    ctaDesc:     "Tell us your current setup and what is causing pain. We will come back with a clear picture of what to fix and in what order.",
    relatedSlugs: ["devops", "data", "backend"],
  },

  /* ═══════════════════════════════════════════════════════
     3. DATA INFRASTRUCTURE
  ═══════════════════════════════════════════════════════ */
  {
    slug:         "data",
    name:         "Data Infrastructure",
    tagline:      "Pipelines, warehouses, and lakehouse architectures that make your data reliable.",
    heroH1:       "Data infrastructure the rest of the organisation can build on.",
    heroSub:      "When data infrastructure is unreliable or undocumented, every analytics and ML project becomes slower. We build pipelines that are tested, monitored, and structured for the teams that maintain them.",
    breadcrumb:   "Data Infrastructure",
    metaTitle:    "Data Infrastructure Services",
    metaDesc:     "OSYSTIC builds data pipelines, warehouses, and lakehouse architectures — Airflow, dbt, Kafka, Snowflake, BigQuery. Tested, monitored, and documented.",
    keywords:     ["data infrastructure", "data pipeline", "data warehouse", "dbt", "Apache Kafka", "Snowflake", "BigQuery", "Airflow"],
    diagramTitle: "Data infrastructure: Sources → Ingest → Stream → Stage → Transform → Quality → Serve → Monitor",
    pipeNodes: [
      { id: "source",   label: "Sources",    sub: "DB / events / files",  x: 90,  y: 220 },
      { id: "ingest",   label: "Ingest",     sub: "Fivetran / custom",    x: 260, y: 130 },
      { id: "stream",   label: "Stream",     sub: "Kafka / Kinesis",      x: 260, y: 310 },
      { id: "stage",    label: "Stage",      sub: "Raw / bronze layer",   x: 430, y: 220 },
      { id: "transform",label: "Transform",  sub: "dbt / Spark",          x: 600, y: 130 },
      { id: "quality",  label: "Quality",    sub: "Tests & alerts",       x: 600, y: 310 },
      { id: "serve",    label: "Serve",      sub: "Warehouse / lake",     x: 770, y: 130 },
      { id: "monitor",  label: "Monitor",    sub: "Freshness & volume",   x: 770, y: 310, dark: true },
    ],
    pipeEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Data Audit",          tag: "01", desc: "Map your data sources, assess quality and completeness, and identify the gaps blocking downstream analytics and ML use cases.", from: "All Data Sources",  fromSub: "Quality · Gaps · Owners",         to: "Audit Report",      checks: ["Source inventory", "Quality scores", "Gap map"] },
      { title: "Architecture Design", tag: "02", desc: "Warehouse structure, pipeline design, and tooling selection — documented and reviewed before any build work begins.", from: "Audit Report",      fromSub: "Warehouse · Pipeline · Tooling",   to: "Architecture Doc",  checks: ["Warehouse choice", "Ingestion method", "Streaming need"] },
      { title: "Ingestion Pipelines", tag: "03", desc: "Build ingestion from all sources — batch via Fivetran or custom ETL, streaming via Kafka or Kinesis — into the raw layer.", from: "Architecture",      fromSub: "Fivetran / Custom / Kafka",        to: "Raw Layer",         checks: ["All sources ingesting", "Schema detection", "Error handling"] },
      { title: "Transformation",      tag: "04", desc: "dbt or Spark models transforming raw data into staging and mart layers. Data tests at every layer catch issues before they reach consumers.", from: "Raw Layer",         fromSub: "dbt Staging → Mart · Tests",      to: "Mart Layer",        checks: ["dbt tests passing", "Docs generated", "Lineage tracked"] },
      { title: "Data Quality",        tag: "05", desc: "Automated quality tests — null rates, referential integrity, volume anomaly detection, freshness checks — with alerts before SLAs are missed.", from: "Mart Layer",        fromSub: "Great Expectations / dbt tests",  to: "Quality Framework", checks: ["Freshness alerts", "Volume anomaly", "Null rate thresholds"] },
      { title: "Serve & Monitor",     tag: "06", desc: "Warehouse and lake served to BI tools, ML pipelines, and applications. Pipeline monitoring dashboard tracks every run.", from: "Quality Layer",     fromSub: "BI · ML · API · Monitoring",      to: "Stable Infrastructure", checks: ["BI connected", "ML pipeline working", "Monitoring live"] },
    ],
    services: [
      { title: "Data Pipeline Development", desc: "Ingestion, transformation, and loading pipelines built with Airflow, dbt, and the orchestration tools appropriate to your stack.", points: ["Batch & streaming", "Idempotent execution", "Full observability"] },
      { title: "Data Warehouse Design",     desc: "Dimensional modelling, partitioning strategy, and query optimisation for Snowflake, BigQuery, and Redshift.", points: ["Dimensional modelling", "Partition strategy", "Query optimisation"] },
      { title: "Streaming Pipelines",       desc: "Real-time event processing with Kafka and Flink for use cases that cannot wait for batch refresh cycles.", points: ["Apache Kafka", "Apache Flink", "Late-event handling"] },
      { title: "Data Quality Framework",    desc: "Automated quality tests, volume anomaly detection, freshness monitoring, and alerting — catching issues before they reach consumers.", points: ["dbt tests", "Great Expectations", "Freshness SLAs"] },
      { title: "Data Catalogue & Lineage",  desc: "Documentation of datasets, owners, and transformation lineage — so your team knows what exists and where it comes from.", points: ["Column-level lineage", "Dataset ownership", "Freshness docs"] },
    ],
    techStack: [
      { category: "Ingestion",      items: ["Fivetran", "Airbyte", "Stitch", "Custom Python"] },
      { category: "Transformation", items: ["dbt Core", "Apache Spark", "SQL", "PySpark"] },
      { category: "Streaming",      items: ["Apache Kafka", "AWS Kinesis", "Apache Flink"] },
      { category: "Warehouses",     items: ["Snowflake", "BigQuery", "Redshift", "Databricks"] },
    ],
    industries: [
      { name: "Finance",       detail: "Transaction data pipelines, regulatory data warehouses, real-time fraud feature stores." },
      { name: "Healthcare",    detail: "Clinical data lakes, FHIR pipeline integration, population health data infrastructure." },
      { name: "Retail",        detail: "Unified commerce data platform, real-time inventory pipelines, personalisation feature stores." },
      { name: "Telecom",       detail: "Network event streaming, CDR processing pipelines, usage data warehouse." },
    ],
    faqs: [
      { q: "What is the difference between a warehouse and a data lake?",  a: "A warehouse stores structured, processed data optimised for querying. A lake stores raw data in any format — optimised for cost and flexibility. Lakehouses combine both. We recommend the right architecture for your actual use cases." },
      { q: "Do you use dbt for transformations?",                          a: "Yes, for most warehouse transformation work. dbt provides version control, documentation, testing, and lineage that makes transformation logic maintainable. We use it with your warehouse of choice." },
      { q: "How do you handle late-arriving data in streaming pipelines?", a: "With watermarks and late-event handling in Flink or Spark Structured Streaming. The tolerance window is defined based on your business rules and documented explicitly." },
      { q: "What is handed over at project end?",                         a: "All pipeline code, dbt models, orchestration DAGs, data quality tests, architecture documentation, and runbooks. Your team can maintain and extend the infrastructure without us." },
    ],
    ctaH2:       "Need reliable data infrastructure?",
    ctaDesc:     "Tell us what data you have and what downstream teams are trying to do with it. We will come back with an architecture proposal.",
    relatedSlugs: ["data-analysis", "cloud", "devops"],
  },

  /* ═══════════════════════════════════════════════════════
     4. ERP SYSTEMS
  ═══════════════════════════════════════════════════════ */
  {
    slug:         "erp",
    name:         "ERP Systems",
    tagline:      "ERP implementation, integration, and custom development for your operational processes.",
    heroH1:       "ERP systems configured for how your business actually works.",
    heroSub:      "We implement, customise, and integrate ERP systems — connecting finance, operations, inventory, and HR into a coherent operational backbone without the bloat of features you will never use.",
    breadcrumb:   "ERP Systems",
    metaTitle:    "ERP Implementation & Integration Services",
    metaDesc:     "OSYSTIC implements, customises, and integrates ERP systems — connecting finance, operations, inventory, and HR into a coherent operational backbone.",
    keywords:     ["ERP implementation", "ERP integration", "ERP customisation", "Odoo", "SAP integration", "NetSuite", "ERP development", "business system integration"],
    diagramTitle: "ERP implementation flow: Assessment → Design → Configure → Integrate → Migrate → Test → Go-Live → Support",
    pipeNodes: [
      { id: "assess",    label: "Assessment",   sub: "Process mapping",    x: 90,  y: 220 },
      { id: "design",    label: "Solution Design",sub: "Gaps & config",    x: 260, y: 130 },
      { id: "custom",    label: "Customisation", sub: "Custom modules",    x: 260, y: 310 },
      { id: "config",    label: "Configure",     sub: "Workflows & rules", x: 430, y: 220 },
      { id: "integrate", label: "Integrate",     sub: "APIs & connectors", x: 600, y: 130 },
      { id: "migrate",   label: "Data Migration",sub: "Clean & load",      x: 600, y: 310 },
      { id: "test",      label: "UAT",           sub: "User acceptance",   x: 770, y: 130 },
      { id: "live",      label: "Go-Live",       sub: "Cutover & support", x: 770, y: 310, dark: true },
    ],
    pipeEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Process Assessment",  tag: "01", desc: "Document your current processes — finance, procurement, inventory, HR — including exceptions and workarounds. This is where most ERP projects fail if rushed.", from: "Current State",    fromSub: "Finance · Ops · Inventory · HR",  to: "Process Map",      checks: ["All processes documented", "Exceptions captured", "Gap analysis done"] },
      { title: "Solution Design",     tag: "02", desc: "Define what the ERP will handle natively, what requires configuration, what requires custom development, and what should remain outside the ERP.", from: "Process Map",      fromSub: "Native · Config · Custom · External", to: "Solution Design", checks: ["Scope agreed", "Custom dev scoped", "Integration list"] },
      { title: "Configuration",       tag: "03", desc: "Configure the ERP to match your approved processes — chart of accounts, approval workflows, inventory rules, tax settings.", from: "Solution Design",  fromSub: "COA · Workflows · Rules · Tax",   to: "Configured System", checks: ["Config reviewed", "Workflows tested", "Tax validated"] },
      { title: "Custom Development",  tag: "04", desc: "Build custom modules and integrations for the requirements that cannot be met by configuration alone.", from: "Configured System", fromSub: "Custom modules · API connectors",  to: "Extended System",   checks: ["Module tests", "API integration tested", "Edge cases covered"] },
      { title: "Data Migration",      tag: "05", desc: "Extract, clean, transform, and load your existing data. Data quality issues are surfaced and resolved before go-live, not after.", from: "Extended System",  fromSub: "Extract · Clean · Transform · Load", to: "Data Loaded",     checks: ["Reconciliation done", "Sample verified", "Rollback plan"] },
      { title: "UAT & Go-Live",       tag: "06", desc: "User acceptance testing with real users on real data, followed by a managed cutover with parallel running where required.", from: "Data Loaded",       fromSub: "UAT · Parallel run · Cutover",    to: "Live ERP",          checks: ["UAT sign-off", "Cutover plan", "Rollback ready"] },
    ],
    services: [
      { title: "ERP Implementation",    desc: "End-to-end ERP implementation — from process assessment through configuration, testing, data migration, and go-live support.", points: ["Process-led approach", "Data migration included", "Go-live support"] },
      { title: "Custom Module Development", desc: "Custom ERP modules for requirements that cannot be met by standard configuration — built with maintainability and upgrade compatibility in mind.", points: ["Upgrade-compatible design", "Full test suite", "Documentation included"] },
      { title: "System Integration",    desc: "Connecting your ERP to CRM, e-commerce, logistics, and other business systems via APIs and middleware.", points: ["REST / SOAP connectors", "Error handling & retry", "Reconciliation tools"] },
      { title: "Data Migration",        desc: "Extract, clean, transform, and load data from legacy systems — with reconciliation reports and a tested rollback plan.", points: ["Data quality validation", "Reconciliation reports", "Rollback plan"] },
      { title: "ERP Audit & Optimisation", desc: "Review of an existing ERP implementation to identify configuration issues, unused features, performance bottlenecks, and integration gaps.", points: ["Configuration review", "Performance audit", "Gap analysis"] },
    ],
    techStack: [
      { category: "ERP Platforms",  items: ["Odoo", "NetSuite", "SAP Business One", "Microsoft Dynamics"] },
      { category: "Integration",    items: ["REST APIs", "SOAP", "MuleSoft", "Custom middleware"] },
      { category: "Data Migration", items: ["Python", "SQL", "Talend", "Custom ETL"] },
      { category: "Reporting",      items: ["Power BI", "Odoo Reporting", "Crystal Reports"] },
    ],
    industries: [
      { name: "Manufacturing",  detail: "Production planning, BOM management, inventory control, supplier management, quality tracking." },
      { name: "Retail",         detail: "Multi-channel inventory, purchase order management, supplier integration, margin reporting." },
      { name: "Distribution",   detail: "Warehouse management, route planning, 3PL integration, customer portal." },
      { name: "Professional Services", detail: "Project accounting, resource planning, time tracking, billing automation." },
    ],
    faqs: [
      { q: "How do you scope an ERP project?",                   a: "We start with process documentation — mapping what you actually do, not what the ideal state is. Only after that do we define what the ERP will and will not handle. Scope creep in ERP projects almost always starts with under-documented processes." },
      { q: "How long does a typical ERP implementation take?",   a: "That depends entirely on the scope, number of modules, data migration complexity, and integration requirements. We do not give timelines before we have documented the processes — any estimate before that is not reliable." },
      { q: "Can you take over a failed or incomplete implementation?", a: "Yes. We have done this. We start with an audit of what was built and why it is not working, document what needs to change, and agree on a remediation plan before making any changes." },
      { q: "Do you provide post-go-live support?",              a: "Yes. We include a stabilisation period after go-live and can provide ongoing support under a separate agreement. The handover documentation we produce means your team can handle most issues independently." },
    ],
    ctaH2:       "Need ERP help?",
    ctaDesc:     "Tell us your current system, what is not working, and what you need to achieve. We will come back with an honest assessment.",
    relatedSlugs: ["data", "data-analysis", "cloud"],
  },

  /* ═══════════════════════════════════════════════════════
     5. CYBERSECURITY
  ═══════════════════════════════════════════════════════ */
  {
    slug:         "security",
    name:         "Cybersecurity",
    tagline:      "Security assessments, architecture reviews, and implementation for engineering teams.",
    heroH1:       "Security built in — not bolted on at the end.",
    heroSub:      "We conduct security assessments, review architecture for vulnerabilities, and help engineering teams implement the controls that reduce real risk — without theatre.",
    breadcrumb:   "Cybersecurity",
    metaTitle:    "Cybersecurity Services | Security Assessment & Architecture",
    metaDesc:     "OSYSTIC provides security assessments, architecture reviews, penetration testing, and DevSecOps implementation for engineering teams building production systems.",
    keywords:     ["security", "security assessment", "penetration testing", "security architecture", "DevSecOps", "OWASP", "cloud security", "application security"],
    diagramTitle: "Security assessment flow: Scope → Recon → Vulnerability Scan → Manual Testing → Reporting → Remediation → Verify → Monitor",
    pipeNodes: [
      { id: "scope",     label: "Scope",         sub: "Assets & rules",     x: 90,  y: 220 },
      { id: "recon",     label: "Reconnaissance",sub: "Attack surface",     x: 260, y: 130 },
      { id: "scan",      label: "Vuln Scan",     sub: "Automated tools",    x: 260, y: 310 },
      { id: "manual",    label: "Manual Test",   sub: "Expert analysis",    x: 430, y: 220 },
      { id: "report",    label: "Report",        sub: "CVSS · Priority",    x: 600, y: 130 },
      { id: "remediate", label: "Remediation",   sub: "Fix & verify",       x: 600, y: 310 },
      { id: "verify",    label: "Verify",        sub: "Retest findings",    x: 770, y: 130 },
      { id: "monitor",   label: "Monitor",       sub: "Ongoing detection",  x: 770, y: 310, dark: true },
    ],
    pipeEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Scope Definition",    tag: "01", desc: "Define the assessment scope — in-scope assets, testing rules of engagement, excluded systems, and success criteria — before any testing begins.", from: "Asset List",       fromSub: "Assets · Rules · Exclusions",    to: "Scope Agreement",   checks: ["Assets documented", "Rules of engagement signed", "Exclusions agreed"] },
      { title: "Reconnaissance",      tag: "02", desc: "Map the attack surface — exposed services, subdomains, technology fingerprinting, and publicly available information that an attacker would use.", from: "Scope Agreement",  fromSub: "OSINT · Port scan · Tech stack",  to: "Attack Surface Map", checks: ["Exposed services mapped", "Subdomains enumerated", "Tech stack identified"] },
      { title: "Vulnerability Scan",  tag: "03", desc: "Automated scanning of web applications, APIs, and infrastructure using industry-standard tools. Results are triaged to remove false positives before reporting.", from: "Attack Surface",   fromSub: "OWASP ZAP · Nessus · Nuclei",    to: "Scan Results",      checks: ["False positives removed", "CVSS scores assigned", "Duplicates merged"] },
      { title: "Manual Testing",      tag: "04", desc: "Expert manual testing of business logic flaws, authentication bypasses, privilege escalation paths, and other vulnerabilities that automated tools miss.", from: "Scan Results",     fromSub: "Logic · Auth · Privilege · Injection", to: "Findings",      checks: ["Business logic tested", "Auth flows tested", "Privilege paths tested"] },
      { title: "Report & Prioritise", tag: "05", desc: "Findings reported with CVSS scores, business impact assessment, and prioritised remediation roadmap — written for both technical and non-technical audiences.", from: "Findings",         fromSub: "CVSS · Impact · Remediation",    to: "Security Report",   checks: ["CVSS scored", "Business impact clear", "Priorities agreed"] },
      { title: "Remediate & Verify",  tag: "06", desc: "Verify that findings have been correctly remediated through targeted retesting. Deliver a remediation verification summary for issues confirmed fixed.", from: "Security Report",   fromSub: "Fix · Retest · Verification",     to: "Secured System",    checks: ["Critical fixes verified", "Retest complete", "Verification summary delivered"] },
    ],
    services: [
      { title: "Web Application Penetration Testing", desc: "Manual and automated testing of web applications and APIs against OWASP Top 10 and business-specific threat models.", points: ["OWASP Top 10", "Business logic testing", "API security testing"] },
      { title: "Cloud Security Assessment",           desc: "Review of AWS and GCP configurations — IAM policies, network exposure, storage permissions, logging gaps, and security-control posture.", points: ["IAM policy review", "Network exposure audit", "Control gap report"] },
      { title: "Security Architecture Review",        desc: "Structured review of your system architecture to identify design-level vulnerabilities before they are built into production.", points: ["Threat modelling", "Design-level findings", "Remediation roadmap"] },
      { title: "DevSecOps Implementation",            desc: "Integrating security into your CI/CD pipeline — SAST, DAST, dependency scanning, and secret detection built into every deployment.", points: ["SAST / DAST in CI/CD", "Dependency scanning", "Secret detection"] },
      { title: "Security Training for Engineers",     desc: "Practical security training for engineering teams — covering OWASP vulnerabilities, secure coding patterns, and common implementation mistakes.", points: ["OWASP coverage", "Hands-on exercises", "Code review techniques"] },
    ],
    techStack: [
      { category: "Web App Testing",  items: ["Burp Suite", "OWASP ZAP", "Nuclei", "SQLMap"] },
      { category: "Infrastructure",   items: ["Nessus", "OpenVAS", "Nmap", "Metasploit"] },
      { category: "Cloud Security",   items: ["ScoutSuite", "Prowler", "CloudSploit", "Checkov"] },
      { category: "DevSecOps",        items: ["Semgrep", "Snyk", "Trivy", "GitLeaks", "Gitleaks"] },
    ],
    industries: [
      { name: "Finance",     detail: "Payment-security scoping support, financial application penetration testing, and privileged-access review within the client’s compliance programme." },
      { name: "Healthcare",  detail: "Healthcare security assessments, EHR application testing, and medical-device network security designed around the client’s privacy and compliance obligations." },
      { name: "Technology",  detail: "SaaS application pen testing, API security, CI/CD security integration, cloud posture review." },
      { name: "Retail",      detail: "E-commerce application testing, payment-flow security, payment-security scoping support, and third-party risk review." },
    ],
    faqs: [
      { q: "What is the difference between a vulnerability scan and a penetration test?", a: "A vulnerability scan uses automated tools to identify known issues. A penetration test includes manual expert analysis to find business logic flaws, chained vulnerabilities, and issues that automated tools cannot detect. We always recommend including manual testing for any production system." },
      { q: "Do you provide a remediation report?",                                        a: "Yes. Every finding includes a clear description, CVSS score, business impact assessment, and specific remediation guidance. We also provide a retest to verify that fixes have been correctly implemented." },
      { q: "Can you work within our existing compliance programme?",                      a: "Yes. We can work within client-defined security and compliance requirements and support the technical controls, evidence, and remediation work your programme requires. OSYSTIC does not represent this work as certification or legal compliance advice." },
      { q: "How do you handle sensitive findings?",                                       a: "All findings are communicated through agreed secure channels. We do not retain copies of sensitive data discovered during testing beyond the agreed assessment period." },
    ],
    ctaH2:       "Need a security assessment?",
    ctaDesc:     "Tell us what systems you need tested and what security, control, or regulatory requirements need to be considered. We will come back with a scoping proposal.",
    relatedSlugs: ["cloud", "devops", "data"],
  },
];

export function getDataCloudPage(slug: string) {
  return DATA_CLOUD_PAGES.find(p => p.slug === slug);
}
export const DATA_CLOUD_SLUGS = DATA_CLOUD_PAGES.map(p => p.slug);