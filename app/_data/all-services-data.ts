/* ═══════════════════════════════════════════════════════════
   all-services-data.ts
   Consolidated data for public dynamic service pages.
   Each service has UNIQUE:
     — workflow diagram (wfNodes + wfEdges)
     — lifecycle steps
     — capabilities (services accordion)
     — tech stack
     — industries
     — FAQs
   No fake stats, no fabricated numbers.
═══════════════════════════════════════════════════════════ */

import type { ServicePageData } from "./types";
import { P2_SERVICES } from "./p2-services-data";

export const ALL_SERVICES: ServicePageData[] = [

  /* ═══════════════════════════════════════════════════════
     1. INTELLIGENT AUTOMATION
  ═══════════════════════════════════════════════════════ */
  {
    slug:             "intelligent-automation",
    category:         "AI & Automation",
    name:             "AI Agents & Workflow Automation",
    tagline:          "Production AI agents and durable workflows that connect tools, data, and human review.",
    breadcrumbLabel:  "AI Agents & Workflow Automation",
    heroH1:           "AI agents and workflows designed to operate reliably in production.",
    heroSub:          "We build tool-connected agents and workflow automation with explicit state, retries, approvals, auditability, and operational fallback paths.",
    metaTitle:        "AI Agents & Workflow Automation",
    metaDesc:         "OSYSTIC builds production AI agents and workflow automation with tool integrations, orchestration, human review, monitoring, and defined operational controls.",
    keywords:         ["intelligent automation", "workflow automation", "RPA", "document processing", "system integration", "process automation"],
    diagramTitle:     "AI agent workflow: Trigger → Retrieve → Reason → Validate → Act → Audit → Monitor",
    wfNodes: [
      { id: "trigger",  label: "Trigger",       sub: "Event / schedule",   x: 90,  y: 220, dark: false },
      { id: "extract",  label: "Extract",        sub: "Doc / API / DB",     x: 260, y: 130, dark: false },
      { id: "validate", label: "Validate",       sub: "Rules & checks",     x: 260, y: 310, dark: false },
      { id: "route",    label: "Route",          sub: "Logic & branching",  x: 430, y: 220, dark: false },
      { id: "execute",  label: "Execute",        sub: "Action & notify",    x: 600, y: 130, dark: false },
      { id: "store",    label: "Store",          sub: "DB / warehouse",     x: 600, y: 310, dark: false },
      { id: "audit",    label: "Audit Log",      sub: "Full trace",         x: 770, y: 130, dark: false },
      { id: "monitor",  label: "Monitor",        sub: "Alert & retry",      x: 770, y: 310, dark: true  },
    ],
    wfEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Process Mapping",    tag: "01", desc: "We document every step of your current workflow — including exceptions and edge cases that most automation projects overlook.",               from: "Current Process",  fromSub: "Manual steps & exceptions",     to: "Process Map",       checks: ["Exception catalogue", "Stakeholder sign-off", "Volume baseline"] },
      { title: "Integration Audit",  tag: "02", desc: "Map all source systems, APIs, and data formats involved. Identify integration methods and authentication requirements.",                     from: "Systems List",     fromSub: "CRM · ERP · DB · APIs",         to: "Integration Plan",  checks: ["API inventory", "Auth methods", "Rate limits"] },
      { title: "Build & Test",       tag: "03", desc: "Iterative build against real data and edge cases. Every failure mode is handled explicitly — not left to default error behaviour.",          from: "Integration Plan", fromSub: "Real data & edge cases",        to: "Tested Pipeline",   checks: ["Edge case coverage", "Load test", "Rollback tested"] },
      { title: "Staging Validation", tag: "04", desc: "Run full end-to-end test in staging with production-representative data volumes before any live traffic.",                                   from: "Tested Pipeline",  fromSub: "Production-like environment",   to: "Approved Build",    checks: ["Volume validation", "Latency check", "Stakeholder UAT"] },
      { title: "Go-Live",            tag: "05", desc: "Phased cutover with parallel run against the manual process until confidence is established. Rollback plan in place.",                      from: "Approved Build",   fromSub: "Parallel run · Phased cutover", to: "Live Automation",   checks: ["Parallel run period", "Cutover sign-off", "Rollback ready"] },
      { title: "Monitor & Extend",   tag: "06", desc: "Operational dashboards track every run. Failure alerts are designed to surface operational issues early. Runbooks document expected recovery paths and escalation steps.",     from: "Live Traffic",     fromSub: "Alerts · Dashboards · Runbooks", to: "Stable System",    checks: ["Alert rules set", "Runbooks complete", "SLA defined"] },
    ],
    services: [
      { title: "Document Processing Pipelines",  desc: "OCR, classification, and structured extraction from invoices, contracts, forms, and reports — handling multi-column layouts and handwritten content.", points: ["Multi-format ingestion", "Confidence scoring", "Human-in-loop fallback"] },
      { title: "System Integration & APIs",       desc: "Connecting CRMs, ERPs, databases, and APIs into unified workflows. REST, GraphQL, SOAP, and database-level integration.", points: ["Real-time & batch modes", "Auth & rate limit handling", "Schema mapping"] },
      { title: "Workflow Orchestration",          desc: "Durable workflow engines with branching, retries, and failure recovery. Built on Temporal or Airflow depending on complexity.", points: ["Idempotent execution", "Retry & dead-letter queues", "Full audit trail"] },
      { title: "Monitoring & Observability",      desc: "Dashboards tracking every automation run, success rate, and processing time. Alerts are configured to surface failures and degraded behavior for operational response.", points: ["Per-step metrics", "SLA alerting", "Root cause dashboards"] },
      { title: "RPA for Legacy Systems",          desc: "UI-level automation for systems without APIs — safely scripted, brittle change detection included.", points: ["Screen change detection", "Session management", "Screenshot audit logs"] },
    ],
    techStack: [
      { category: "Orchestration",   items: ["Temporal", "Apache Airflow", "Prefect", "n8n"] },
      { category: "Document AI",     items: ["AWS Textract", "Azure Form Recognizer", "PaddleOCR", "Tesseract"] },
      { category: "Integration",     items: ["REST APIs", "GraphQL", "MuleSoft", "Custom ETL"] },
      { category: "Monitoring",      items: ["Grafana", "Datadog", "Sentry", "PagerDuty"] },
      { category: "RPA",             items: ["Playwright", "Pyppeteer", "UiPath SDK"] },
    ],
    industries: [
      { name: "Finance",         detail: "Invoice processing, loan document extraction, regulatory reporting automation, reconciliation pipelines." },
      { name: "Healthcare",      detail: "Patient referral routing, prior authorisation workflows, claims processing, lab result handling." },
      { name: "Logistics",       detail: "Order processing, carrier API integration, customs documentation, tracking update automation." },
      { name: "Manufacturing",   detail: "Purchase order processing, supplier integration, quality report routing, ERP data sync." },
      { name: "Legal",           detail: "Contract intake, clause extraction, deadline tracking, matter management system integration." },
    ],
    faqs: [
      { q: "Do we need to replace our existing tools?",            a: "No. We build automation around what you already have — connecting and orchestrating existing systems rather than replacing them." },
      { q: "What happens when an automated step fails?",           a: "Every workflow we build has explicit failure handling — retries, dead-letter queues, and alerting. Retries, dead-letter handling, and alerting are configured so failures can be surfaced and handled through defined operational paths." },
      { q: "How do you handle changes to source system layouts?",  a: "For API-based integrations, schema changes are caught at validation. For UI-level RPA, we implement change detection and alert on layout drift. Both approaches are documented in the runbooks we hand over." },
      { q: "Who maintains the automation after handover?",         a: "Your team does. We hand over all code, documentation, and runbooks. Everything is built for maintainability, not ongoing dependency." },
    ],
    ctaH2:       "Ready to automate?",
    ctaDesc:     "Tell us what process you want to automate. We will come back with an honest assessment of what is feasible and how long it will take.",
    relatedSlugs: ["ai-deep-learning", "backend-apis", "data-infrastructure"],
  },

  /* ═══════════════════════════════════════════════════════
     2. EDGE AI
  ═══════════════════════════════════════════════════════ */
  {
    slug:             "edge-ai",
    category:         "AI & Automation",
    name:             "Edge AI Deployment",
    tagline:          "On-device inference for low-latency, offline-capable AI on embedded hardware.",
    breadcrumbLabel:  "Edge AI",
    heroH1:           "AI that runs on the device, not the cloud.",
    heroSub:          "We optimise and deploy machine learning models to embedded systems, IoT hardware, and mobile — enabling real-time inference without cloud dependency.",
    metaTitle:        "Edge AI Deployment Services",
    metaDesc:         "OSYSTIC optimises and deploys ML models to embedded hardware — ONNX, TFLite, CoreML, TensorRT. On-device inference with no cloud dependency.",
    keywords:         ["edge AI", "on-device inference", "TensorFlow Lite", "ONNX", "embedded AI", "IoT AI", "model quantisation"],
    diagramTitle:     "Edge AI pipeline: Train → Quantise → Prune → Convert → Benchmark → Package → Deploy Fleet → Monitor",
    wfNodes: [
      { id: "train",    label: "Train",          sub: "Cloud / full prec.", x: 90,  y: 220, dark: false },
      { id: "quantise", label: "Quantise",       sub: "INT8 / FP16",        x: 260, y: 130, dark: false },
      { id: "prune",    label: "Prune",          sub: "Remove redundancy",  x: 260, y: 310, dark: false },
      { id: "convert",  label: "Convert",        sub: "ONNX / TFLite",      x: 430, y: 220, dark: false },
      { id: "bench",    label: "Benchmark",      sub: "Latency & accuracy",  x: 600, y: 130, dark: false },
      { id: "package",  label: "Package",        sub: "Firmware bundle",    x: 600, y: 310, dark: false },
      { id: "deploy",   label: "Deploy Fleet",   sub: "OTA update",         x: 770, y: 130, dark: false },
      { id: "monitor",  label: "Monitor",        sub: "Errors & drift",     x: 770, y: 310, dark: true  },
    ],
    wfEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Hardware Audit",      tag: "01", desc: "Assess your target device — memory, compute, power budget, OS — to define exactly what the model can cost and what performance is achievable.",       from: "Target Device",   fromSub: "RAM · TOPS · Power · OS",       to: "Hardware Spec",     checks: ["Memory budget", "Compute ceiling", "Power envelope"] },
      { title: "Model Optimisation",  tag: "02", desc: "Quantisation (INT8/FP16), structured pruning, and knowledge distillation to bring the model within hardware constraints with minimal accuracy loss.", from: "Full Model",      fromSub: "Quantise · Prune · Distil",     to: "Slim Model",        checks: ["Accuracy delta measured", "Size target met", "Latency projection"] },
      { title: "Runtime Conversion",  tag: "03", desc: "Convert to ONNX, TFLite, CoreML, or TensorRT based on your hardware target. Handle operator coverage gaps and custom op implementation.",            from: "Optimised Weights",fromSub: "ONNX / TFLite / CoreML / TRT",  to: "Device Runtime",    checks: ["Operator coverage", "Numerical equivalence", "Inference test"] },
      { title: "On-Device Test",      tag: "04", desc: "Run the full benchmark suite on real target hardware — latency, throughput, peak memory, and thermal behaviour under sustained load.",               from: "Device Runtime",  fromSub: "Real hardware benchmark",       to: "Benchmark Report",  checks: ["Latency p50/p99", "Peak memory", "Thermal test"] },
      { title: "Deployment Build",    tag: "05", desc: "Integrate the inference pipeline into your firmware or application. Handle preprocessing, I/O, and postprocessing on-device.",                        from: "Benchmark Report",fromSub: "Firmware / app integration",    to: "Device Build",      checks: ["End-to-end latency", "Memory footprint", "Integration test"] },
      { title: "Fleet & Monitoring",  tag: "06", desc: "OTA update pipeline for fleet deployment. Remote monitoring of inference errors and model accuracy metrics.",                                         from: "Device Build",    fromSub: "OTA · Telemetry · Alerts",      to: "Deployed Fleet",    checks: ["OTA pipeline tested", "Rollback ready", "Telemetry live"] },
    ],
    services: [
      { title: "Model Quantisation & Pruning",   desc: "Reducing model precision and removing redundant parameters to meet the memory and compute constraints of your target hardware without material accuracy loss.", points: ["INT8 / FP16 quantisation", "Structured & unstructured pruning", "Accuracy delta measurement"] },
      { title: "Runtime Conversion",             desc: "Converting trained models to ONNX, TFLite, CoreML, or TensorRT for deployment on your specific hardware target, including custom operator handling.", points: ["Multi-runtime support", "Custom op implementation", "Numerical equivalence testing"] },
      { title: "Embedded Integration",           desc: "Integrating inference pipelines into firmware and embedded Linux environments — handling I/O, preprocessing, and postprocessing on-device.", points: ["Firmware integration", "C++ inference wrapper", "Preprocessing on-device"] },
      { title: "IoT Fleet Deployment",           desc: "Deploying and managing models across fleets of IoT devices — with OTA update pipelines that do not require physical access to each device.", points: ["OTA update pipeline", "Rollback capability", "Version management"] },
      { title: "Performance Benchmarking",       desc: "Systematic measurement of latency, throughput, peak memory, and thermal behaviour under sustained load on real target hardware.", points: ["Real hardware testing", "p50 / p99 latency", "Thermal profiling"] },
    ],
    techStack: [
      { category: "Runtimes",     items: ["TensorFlow Lite", "ONNX Runtime", "CoreML", "TensorRT", "OpenVINO"] },
      { category: "Hardware",     items: ["NVIDIA Jetson", "Coral TPU", "Raspberry Pi", "STM32", "Apple Silicon"] },
      { category: "Optimisation", items: ["PyTorch", "TensorFlow", "NNCF", "Quanto", "AIMET"] },
      { category: "OTA & Fleet",  items: ["Mender", "Balena", "AWS IoT Greengrass", "Azure IoT Hub"] },
    ],
    industries: [
      { name: "Manufacturing",  detail: "Visual inspection systems, defect detection at line speed, predictive maintenance sensors — all offline-capable." },
      { name: "Healthcare",     detail: "Medical imaging at point of care, vital sign monitoring, surgical assistance — without data leaving the device." },
      { name: "Retail",         detail: "In-store shelf monitoring, cashierless checkout computer vision, traffic counting — no cloud latency." },
      { name: "Agriculture",    detail: "Crop disease detection, drone-based vision, soil sensor AI — operating in areas with no connectivity." },
      { name: "Automotive",     detail: "ADAS perception models, in-cabin monitoring, predictive diagnostics — safety-critical, low-latency." },
    ],
    faqs: [
      { q: "How much accuracy loss should we expect after quantisation?", a: "Quantisation impact varies by architecture, dataset, hardware, and target precision. We benchmark FP32 against the proposed optimised model on your own evaluation set before agreeing a deployment target." },
      { q: "Which hardware targets have you deployed to?",                 a: "NVIDIA Jetson, Coral TPU, Raspberry Pi, various ARM Cortex-M devices, Apple Silicon (CoreML), and Android/iOS. The approach differs significantly by hardware class." },
      { q: "Can you work with our existing embedded Linux setup?",         a: "Yes. We integrate into your existing firmware and build system rather than requiring you to change your hardware stack." },
      { q: "What if our target device doesn't support a standard runtime?",a: "We have implemented custom inference engines for non-standard targets. The feasibility depends on your device's compute and memory — we assess this in the hardware audit before committing." },
    ],
    ctaH2:       "Building for edge?",
    ctaDesc:     "Tell us your target hardware and the task you need to run on it. We will come back with an honest assessment of what is achievable.",
    relatedSlugs: ["ai-deep-learning", "computer-vision-nlp", "intelligent-automation"],
  },

  /* ═══════════════════════════════════════════════════════
     3. COMPUTER VISION & NLP
  ═══════════════════════════════════════════════════════ */
  {
    slug:             "computer-vision-nlp",
    category:         "AI & Automation",
    name:             "Computer Vision & NLP",
    tagline:          "Visual understanding and language intelligence built for your domain.",
    breadcrumbLabel:  "CV & NLP",
    heroH1:           "Vision and language models that understand your domain.",
    heroSub:          "General models are impressive. They are also wrong in domain-specific contexts. We fine-tune and build custom CV and NLP systems trained on your data.",
    metaTitle:        "Computer Vision & NLP Services",
    metaDesc:         "OSYSTIC builds domain-specific computer vision and NLP systems — object detection, document intelligence, semantic search, text classification, and multimodal pipelines.",
    keywords:         ["computer vision", "NLP", "natural language processing", "object detection", "document intelligence", "semantic search", "named entity recognition"],
    diagramTitle:     "CV & NLP pipeline: Ingest → Preprocess → Annotate → Train → Evaluate → Serve API → Monitor",
    wfNodes: [
      { id: "ingest",   label: "Ingest",         sub: "Image / text / doc",  x: 90,  y: 220, dark: false },
      { id: "preproc",  label: "Preprocess",      sub: "Resize / tokenise",   x: 260, y: 130, dark: false },
      { id: "annotate", label: "Annotate",        sub: "Label & review",      x: 260, y: 310, dark: false },
      { id: "train",    label: "Fine-tune",       sub: "Domain-specific",     x: 430, y: 220, dark: false },
      { id: "evaluate", label: "Evaluate",        sub: "Domain metrics",      x: 600, y: 130, dark: false },
      { id: "postproc", label: "Post-process",    sub: "NMS / decode",        x: 600, y: 310, dark: false },
      { id: "api",      label: "Serve API",       sub: "REST / gRPC",         x: 770, y: 130, dark: false },
      { id: "monitor",  label: "Monitor",         sub: "Drift & accuracy",    x: 770, y: 310, dark: true  },
    ],
    wfEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 6 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Data Assessment",   tag: "01", desc: "Review your existing labelled data, identify gaps and annotation quality issues, and define an annotation strategy if additional data is needed.", from: "Your Data",       fromSub: "Images · Text · Docs",          to: "Data Plan",         checks: ["Label quality audit", "Class balance check", "Annotation guide"] },
      { title: "Model Selection",   tag: "02", desc: "Choose the right architecture and pre-trained base — balancing accuracy, latency, and the maintenance burden your team can sustain.",            from: "Data Plan",       fromSub: "Architecture · Pretrained base", to: "Model Config",      checks: ["Latency target set", "Accuracy baseline", "Licence checked"] },
      { title: "Annotation",        tag: "03", desc: "Set up annotation pipelines for your data type — bounding boxes, polygons, NER spans, or document labels — with quality control built in.",     from: "Raw Data",        fromSub: "Label Studio / CVAT / Prodigy", to: "Labelled Dataset",  checks: ["Inter-annotator agreement", "Review pass", "Export verified"] },
      { title: "Fine-tuning",       tag: "04", desc: "Train on your domain data with evaluation against metrics that reflect real production requirements — not just benchmark scores.",                from: "Labelled Dataset", fromSub: "Domain training · Eval loop",   to: "Trained Model",     checks: ["Domain metric target", "Overfitting check", "Val set held out"] },
      { title: "Evaluation",        tag: "05", desc: "Test against held-out domain data. For CV: precision, recall, mAP. For NLP: F1, exact match, BLEU. Bias audit where relevant.",               from: "Trained Model",   fromSub: "Domain-specific eval metrics",  to: "Approved Model",    checks: ["Held-out test set", "Edge case review", "Bias audit"] },
      { title: "Serve & Monitor",   tag: "06", desc: "Package as REST or gRPC API. Monitor accuracy and data drift in production with automated alerting when performance degrades.",                  from: "Approved Model",  fromSub: "API · Drift detection · Alerts", to: "Live Service",     checks: ["Latency SLA", "Drift threshold set", "Retraining trigger"] },
    ],
    services: [
      { title: "Object Detection & Segmentation", desc: "Real-time detection, localisation, and segmentation models trained on your annotated image and video data — optimised for your inference environment.", points: ["Custom annotation pipeline", "Real-time inference", "Edge-optimised variants"] },
      { title: "Document Intelligence",            desc: "Layout-aware extraction from invoices, contracts, forms, and reports — handling multi-column, tabular, and handwritten content accurately.", points: ["Multi-format support", "Confidence scoring", "Human-in-loop fallback"] },
      { title: "Semantic Search",                  desc: "Embedding-based retrieval that returns conceptually relevant results rather than keyword matches — across documents, products, and content.", points: ["Domain-adapted embeddings", "Vector index setup", "Hybrid search option"] },
      { title: "Text Classification & NER",        desc: "Domain-specific classification and named entity recognition fine-tuned on your labelled data — including multi-label and hierarchical tasks.", points: ["Custom label taxonomy", "Multilingual support", "Explainability output"] },
      { title: "Multimodal Pipelines",             desc: "Systems combining visual and textual inputs — for product cataloguing, medical report generation, and content moderation at scale.", points: ["Vision-language fusion", "Structured output", "Audit trail"] },
    ],
    techStack: [
      { category: "Vision",      items: ["PyTorch", "YOLOv10", "Detectron2", "OpenCV", "Albumentations"] },
      { category: "NLP",         items: ["HuggingFace Transformers", "spaCy", "sentence-transformers", "LlamaIndex"] },
      { category: "Annotation",  items: ["Label Studio", "CVAT", "Roboflow", "Prodigy"] },
      { category: "Serving",     items: ["FastAPI", "TorchServe", "Triton Inference Server", "BentoML"] },
    ],
    industries: [
      { name: "Healthcare",    detail: "Medical image analysis, radiology report NLP, clinical NER, pathology slide classification." },
      { name: "Finance",       detail: "Document extraction from contracts and filings, fraud detection from transaction text, KYC document processing." },
      { name: "Retail",        detail: "Product catalogue enrichment, visual search, review sentiment NER, packaging defect detection." },
      { name: "Legal",         detail: "Contract clause extraction, case law semantic search, obligation NER, redaction pipelines." },
      { name: "Manufacturing", detail: "Visual quality inspection, defect classification, equipment label OCR, technical document parsing." },
    ],
    faqs: [
      { q: "How much labelled data do we need?",                    a: "For fine-tuning a pre-trained model, a few hundred labelled examples can produce a viable baseline. The amount depends on task complexity and class diversity. We assess your data in discovery before committing to a target." },
      { q: "Can you handle proprietary document formats?",          a: "Yes. We handle PDFs, scanned documents, Excel files, and custom formats. Layout-aware models work with multi-column and tabular structures that simpler extraction tools cannot." },
      { q: "What evaluation metrics do you use?",                   a: "We use metrics appropriate to the task — mAP for detection, F1 for classification and NER, BLEU/ROUGE for generation. Critically, we agree on the eval metric and threshold before training begins, not after." },
      { q: "Do you provide the trained model weights and pipeline?", a: "The engagement defines which model artifacts, training code, evaluation assets, and documentation are deliverables, subject to the licenses and restrictions of any third-party models or components." },
    ],
    ctaH2:       "Need vision or language AI?",
    ctaDesc:     "Tell us what you need to detect, classify, or extract. We will come back with an honest plan based on your actual data.",
    relatedSlugs: ["ai-deep-learning", "edge-ai", "data-infrastructure"],
  },

  /* ═══════════════════════════════════════════════════════
     4. PREDICTIVE ANALYTICS
  ═══════════════════════════════════════════════════════ */
  {
    slug:             "predictive-analytics",
    category:         "AI & Automation",
    name:             "Predictive Analytics",
    tagline:          "Forecasting and decision models that integrate into your existing workflows.",
    breadcrumbLabel:  "Predictive Analytics",
    heroH1:           "Predictive models that reach the people who act on them.",
    heroSub:          "We build forecasting, anomaly detection, and decision support models — and integrate them into the dashboards and workflows your team already uses.",
    metaTitle:        "Predictive Analytics Services",
    metaDesc:         "OSYSTIC builds demand forecasting, anomaly detection, churn prediction, and recommendation systems — integrated into your existing BI tools.",
    keywords:         ["predictive analytics", "demand forecasting", "anomaly detection", "churn prediction", "recommendation system", "machine learning forecasting"],
    diagramTitle:     "Predictive Analytics pipeline: Ingest → Feature Engineering → Train → Validate → Register → Serve → Monitor",
    wfNodes: [
      { id: "ingest",    label: "Data Ingest",    sub: "Historical + live",   x: 90,  y: 220, dark: false },
      { id: "features",  label: "Feature Eng.",   sub: "Transform & enrich",  x: 260, y: 130, dark: false },
      { id: "split",     label: "Train/Test",     sub: "Temporal split",      x: 260, y: 310, dark: false },
      { id: "train",     label: "Train",          sub: "XGB / LSTM / etc.",   x: 430, y: 220, dark: false },
      { id: "validate",  label: "Validate",       sub: "MAPE / AUC / F1",    x: 600, y: 130, dark: false },
      { id: "register",  label: "Register",       sub: "Model registry",      x: 600, y: 310, dark: false },
      { id: "serve",     label: "Serve",          sub: "BI / API / webhook",  x: 770, y: 130, dark: false },
      { id: "monitor",   label: "Monitor",        sub: "Drift & accuracy",    x: 770, y: 310, dark: true  },
    ],
    wfEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Data Audit",          tag: "01", desc: "Assess the quality, completeness, and relevance of your historical data before committing to any modelling approach.",                               from: "Historical Data",  fromSub: "Quality · Completeness · Gaps",  to: "Data Assessment",   checks: ["Missing data map", "Seasonality check", "Target variable defined"] },
      { title: "Feature Engineering", tag: "02", desc: "Transform raw data into predictive features — lag variables, rolling statistics, external signals, and domain-specific encodings.",                   from: "Raw Dataset",      fromSub: "Lags · Aggregates · Externals",  to: "Feature Store",     checks: ["Leakage test", "Feature importance", "Train/val split"] },
      { title: "Baseline Model",      tag: "03", desc: "A working prototype with measurable performance — giving you a concrete benchmark before full development investment.",                                from: "Feature Store",    fromSub: "Simple model · Baseline metrics", to: "Baseline Report",  checks: ["Eval metric agreed", "Baseline measured", "Business sign-off"] },
      { title: "Model Training",      tag: "04", desc: "Select and train the right architecture — XGBoost, LightGBM, Prophet, LSTM, or ensemble — tuned via cross-validation on your data.",               from: "Feature Store",    fromSub: "XGB · LightGBM · Prophet · LSTM", to: "Best Model",       checks: ["CV performance", "Hyperparameter log", "Test set held"] },
      { title: "Integration",         tag: "05", desc: "Surface model outputs inside your existing BI tools, databases, or applications via API, scheduled query, or webhook.",                              from: "Best Model",       fromSub: "API · SQL view · BI connector",   to: "Live Predictions",  checks: ["Output format agreed", "Latency checked", "Error handling"] },
      { title: "Drift Monitoring",    tag: "06", desc: "Automated drift detection triggers retraining when input distributions shift. Dashboard tracks accuracy over time.",                                  from: "Live Predictions", fromSub: "Drift detection · Retraining",    to: "Stable Model",      checks: ["Drift threshold set", "Retraining pipeline", "Alert rules"] },
    ],
    services: [
      { title: "Demand & Sales Forecasting",  desc: "Time-series models accounting for seasonality, external signals, and promotional effects — integrated into your planning tools.", points: ["Seasonal decomposition", "External signal integration", "Confidence intervals"] },
      { title: "Anomaly Detection",           desc: "Statistical and ML-based systems that flag outliers in operational, financial, and sensor data in real time with explainable alerts.", points: ["Threshold-free detection", "Explainable alerts", "Low false-positive tuning"] },
      { title: "Churn & Risk Prediction",     desc: "Classification models identifying at-risk customers, transactions, or assets before the outcome becomes visible — with probability scores.", points: ["Calibrated probabilities", "Feature importance report", "Bias audit"] },
      { title: "Recommendation Systems",      desc: "Collaborative and content-based filtering models that personalise product, content, or action recommendations at scale.", points: ["Cold-start handling", "Online & batch serving", "A/B test framework"] },
      { title: "BI Dashboard Integration",    desc: "Surfacing model outputs inside Tableau, Looker, Power BI, or Metabase rather than requiring a separate interface or context switch.", points: ["Native BI connector", "Scheduled refresh", "No separate tool required"] },
    ],
    techStack: [
      { category: "Modelling",      items: ["scikit-learn", "XGBoost", "LightGBM", "Prophet", "statsmodels"] },
      { category: "Deep Learning",  items: ["PyTorch", "TensorFlow", "Keras", "Darts"] },
      { category: "MLOps",          items: ["MLflow", "DVC", "Weights & Biases", "BentoML"] },
      { category: "BI & Serving",   items: ["Looker", "Tableau", "Power BI", "FastAPI", "Metabase"] },
    ],
    industries: [
      { name: "Retail",          detail: "Demand forecasting, dynamic pricing, recommendation engines, returns prediction, stock optimisation." },
      { name: "Finance",         detail: "Fraud scoring, credit risk, revenue forecasting, portfolio anomaly detection, AML signals." },
      { name: "Logistics",       detail: "Delivery time prediction, route demand forecasting, capacity planning, delay anomaly detection." },
      { name: "Manufacturing",   detail: "Yield prediction, predictive maintenance scheduling, defect rate forecasting, supply demand sensing." },
      { name: "Telecommunications", detail: "Churn prediction, network anomaly detection, usage forecasting, lifetime value modelling." },
    ],
    faqs: [
      { q: "How much historical data do we need for forecasting?", a: "For time-series forecasting, at least 2–3 full seasonal cycles gives a reasonable baseline. Less is workable but produces wider confidence intervals. We assess your specific data in discovery." },
      { q: "How often does the model need retraining?",            a: "That depends on how quickly your underlying patterns change. We set up drift monitoring so retraining is triggered by evidence rather than a fixed calendar." },
      { q: "Can predictions appear in our existing BI dashboards?", a: "Yes — this is a specific design goal. We surface outputs via API, scheduled database table, or direct BI connector rather than creating a separate interface." },
      { q: "How do you evaluate forecast accuracy?",               a: "We use task-appropriate metrics — MAPE or WMAPE for demand, AUC for classification, RMSE for continuous outputs — agreed before training begins. We also measure against a naive baseline so improvement is meaningful." },
    ],
    ctaH2:       "Need better predictions?",
    ctaDesc:     "Tell us what you are trying to forecast or detect. We will review your data and give you an honest picture of what is achievable.",
    relatedSlugs: ["ai-deep-learning", "data-infrastructure", "data-bi"],
  },

  /* ═══════════════════════════════════════════════════════
     13. DEVOPS & CLOUD
  ═══════════════════════════════════════════════════════ */
  {
    slug:             "devops-cloud",
    category:         "Data & Cloud",
    name:             "Platform Engineering & DevOps",
    tagline:          "CI/CD, Kubernetes, and the operational infrastructure your engineering team needs.",
    breadcrumbLabel:  "Platform Engineering & DevOps",
    heroH1:           "Ship reliably. Operate with confidence. Respond without firefighting.",
    heroSub:          "We build the CI/CD, deployment, and monitoring infrastructure that removes friction between writing code and running it in production — and gives your team the tools to operate it.",
    metaTitle:        "Platform Engineering & DevOps",
    metaDesc:         "OSYSTIC builds CI/CD pipelines, Kubernetes infrastructure, IaC, incident response tooling, and security baselines — so engineering teams can ship and operate confidently.",
    keywords:         ["DevOps", "CI/CD", "Kubernetes", "GitHub Actions", "ArgoCD", "Terraform", "infrastructure automation", "DevSecOps"],
    diagramTitle:     "DevOps pipeline: Commit → Build → Test → Promote → Staging → Security Scan → Deploy → Monitor",
    wfNodes: [
      { id: "commit",   label: "Commit",        sub: "PR / branch",         x: 90,  y: 220, dark: false },
      { id: "build",    label: "Build",         sub: "Docker image",        x: 260, y: 130, dark: false },
      { id: "test",     label: "Test",          sub: "Unit / integration",  x: 260, y: 310, dark: false },
      { id: "promote",  label: "Promote",       sub: "Gate & approve",      x: 430, y: 220, dark: false },
      { id: "staging",  label: "Staging",       sub: "Full stack test",     x: 600, y: 130, dark: false },
      { id: "security", label: "Scan",          sub: "SAST / DAST / deps",  x: 600, y: 310, dark: false },
      { id: "deploy",   label: "Deploy",        sub: "Blue/green / canary", x: 770, y: 130, dark: false },
      { id: "monitor",  label: "Monitor",       sub: "Alerts & runbooks",   x: 770, y: 310, dark: true  },
    ],
    wfEdges: [
      { from: 0, to: 1 }, { from: 0, to: 2 },
      { from: 1, to: 3 }, { from: 2, to: 3 },
      { from: 3, to: 4 }, { from: 3, to: 5 },
      { from: 4, to: 6 }, { from: 5, to: 7 },
      { from: 6, to: 7 },
    ],
    steps: [
      { title: "Current State Audit",  tag: "01", desc: "Map your existing deployment process, identify bottlenecks and failure points, and define the target state with your team.",                    from: "Current Process",  fromSub: "Deploy freq · MTTR · Bottlenecks", to: "Improvement Plan",  checks: ["Deploy frequency", "MTTR baseline", "Failure modes mapped"] },
      { title: "CI Pipeline",          tag: "02", desc: "Build, test, and security scanning pipeline with branch policies, fast feedback, and clear failure messages your team can act on.",              from: "Source Repo",      fromSub: "Build · Test · Scan · Branch policy", to: "CI Pipeline",      checks: ["Build time", "Test coverage gate", "Scan integrated"] },
      { title: "CD & Environments",    tag: "03", desc: "Deployment pipelines with environment promotion gates — dev, staging, production — and parity between environments via IaC.",                    from: "CI Pipeline",      fromSub: "Dev → Staging → Prod · IaC parity", to: "CD Pipeline",       checks: ["Env parity", "Promotion gates", "Rollback tested"] },
      { title: "Kubernetes & IaC",     tag: "04", desc: "Container and Kubernetes infrastructure defined in Terraform/Helm — reproducible, version-controlled, and reviewed before deploy.",            from: "CD Pipeline",      fromSub: "Terraform · Helm · Kubernetes",   to: "K8s Cluster",       checks: ["Cluster health", "Resource limits", "RBAC policies"] },
      { title: "Security & Compliance",tag: "05", desc: "Secret management, network policy, SAST/DAST scanning, dependency vulnerability checks, and client-defined security control baselines.",               from: "K8s Cluster",      fromSub: "Vault · SAST · DAST · Deps",     to: "Secure Baseline",   checks: ["Secrets in Vault", "SAST passing", "Dep vulns addressed"] },
      { title: "Monitoring & On-Call", tag: "06", desc: "Metrics, logs, and traces surfaced in a coherent operational view. Runbooks linked to alerts. On-call rotation documented before go-live.",    from: "Secure Baseline",  fromSub: "Prometheus · Grafana · Runbooks", to: "Production Ready",  checks: ["Alert accuracy", "Runbooks complete", "On-call documented"] },
    ],
    services: [
      { title: "CI/CD Pipeline Design",      desc: "Build, test, and deployment pipelines that run fast, fail clearly, and deploy safely — with rollback capability and clear ownership.", points: ["Fast build cycles", "Clear failure messages", "Rollback in pipeline"] },
      { title: "Kubernetes & Containers",    desc: "Docker image optimisation, Kubernetes manifest design, Helm chart development, and operational runbooks for container-based deployments.", points: ["Helm charts", "Resource & limit design", "RBAC policies"] },
      { title: "Infrastructure Automation",  desc: "Terraform and Ansible configurations that reduce manual infrastructure changes and make configuration drift easier to detect.", points: ["Terraform IaC", "Drift detection", "Module reuse"] },
      { title: "Incident Response Tooling",  desc: "Runbooks, alerting policies, and on-call rotation infrastructure that reduce mean time to resolution.", points: ["Alert accuracy tuning", "Runbooks per alert", "On-call rotation setup"] },
      { title: "Security & Compliance",      desc: "Secret management, network policy, SAST/DAST scanning, and security controls mapped to client-defined requirements for regulated environments.", points: ["HashiCorp Vault", "SAST / DAST", "Compliance baseline"] },
    ],
    techStack: [
      { category: "CI/CD",       items: ["GitHub Actions", "GitLab CI", "ArgoCD", "Tekton"] },
      { category: "Containers",  items: ["Docker", "Kubernetes", "Helm", "Kustomize"] },
      { category: "IaC",         items: ["Terraform", "Ansible", "Pulumi", "AWS CDK"] },
      { category: "Monitoring",  items: ["Prometheus", "Grafana", "PagerDuty", "Sentry", "OpenTelemetry"] },
    ],
    industries: [
      { name: "Technology",     detail: "Multi-service CI/CD, developer platform engineering, internal developer portal tooling." },
      { name: "Finance",        detail: "Deployment pipelines designed to support controlled change management, traceability, and audit logging." },
      { name: "Healthcare",     detail: "Healthcare deployments designed around protected-data handling, privacy-conscious logging, and documented security baselines." },
      { name: "Retail",         detail: "Controlled deployment pipelines, peak-traffic scaling automation, and storefront delivery workflows." },
      { name: "Manufacturing",  detail: "OT/IT DevOps, firmware deployment pipelines, edge device update infrastructure." },
    ],
    faqs: [
      { q: "How long to set up a proper CI/CD pipeline?",    a: "The effort depends on repository structure, environments, testing maturity, security controls, deployment targets, and existing tooling. We scope the pipeline after reviewing the current delivery process." },
      { q: "Do you use GitOps or push-based deployments?",  a: "We prefer GitOps (ArgoCD) for Kubernetes — it gives full auditability and drift detection. For simpler deployments, push-based pipelines with proper rollback are perfectly adequate. We recommend based on your needs." },
      { q: "How do you handle secrets in CI/CD pipelines?", a: "Never in environment variables or code. We use HashiCorp Vault, AWS Secrets Manager, or GCP Secret Manager depending on your stack — with least-privilege access policies and rotation where applicable." },
      { q: "What is handed over at the end?",               a: "All IaC code, CI/CD pipeline configuration, Helm charts, runbooks, and on-call documentation. Your team can operate, extend, and onboard new services without us." },
    ],
    ctaH2:       "Need better DevOps?",
    ctaDesc:     "Tell us your current deployment process and what is causing pain. We will come back with an honest improvement plan.",
    relatedSlugs: ["cloud", "backend-apis", "data-infrastructure"],
  },


  ...P2_SERVICES,
];

/* ── Helpers ───────────────────────────────────────────── */
export function getService(slug: string): ServicePageData | undefined {
  return ALL_SERVICES.find(s => s.slug === slug);
}

export const ALL_SLUGS = ALL_SERVICES.map(s => s.slug);