/* ══════════════════════════════════════════════════════════
   _data.ts  —  Single source of truth for all page content
   No fake stats, no fake client logos, no fabricated numbers
══════════════════════════════════════════════════════════ */

export const FONT =
  "var(--font-geist-sans),'Geist',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

export const C = {
  BLK:   "#0A0A0A",
  BLU:   "#2563EB",
  BLU_D: "#1D4ED8",
  WHT:   "#FFFFFF",
  PANEL: "#F7F9FC",
  BORD:  "#E2E8F0",
  GRAY:  "#64748B",
  GRAY_L:"#94A3B8",
} as const;

/* ── Services ── */
export interface Service {
  title:          string;
  desc:           string;
  points:         [string, string, string];
  learnMoreHref?: string;
  learnMoreLabel?:string;
}

export const SERVICES: Service[] = [
  {
    title: "Custom Model Training",
    desc:  "We design and train deep learning models from scratch or fine-tune pre-trained architectures on your proprietary data — structured tables, images, audio, or text. Every model is purpose-built for your domain.",
    points: ["From-scratch architecture design", "Transfer learning & fine-tuning", "Experiment tracking & versioning"],
    learnMoreHref:  "https://www.tensorflow.org/guide/keras/training_with_built_in_methods",
    learnMoreLabel: "TensorFlow Docs",
  },
  {
    title: "Natural Language Processing",
    desc:  "Text classification, sentiment analysis, named entity recognition, document summarization, and conversational AI built on transformer architectures like BERT, GPT, and LLaMA — tailored to your industry vocabulary and data.",
    points: ["Custom NER & intent detection", "Document intelligence pipelines", "Multilingual model support"],
    learnMoreHref:  "https://huggingface.co/docs/transformers/index",
    learnMoreLabel: "Hugging Face Docs",
  },
  {
    title: "Computer Vision",
    desc:  "Object detection, segmentation, face recognition, OCR, and visual quality inspection for real-time production environments across web, mobile, and edge devices.",
    points: ["Real-time inference pipelines", "Custom annotation & labeling", "Edge-optimised vision models"],
    learnMoreHref:  "https://docs.ultralytics.com/",
    learnMoreLabel: "YOLO Docs",
  },
  {
    title: "Predictive Modeling",
    desc:  "Regression, classification, and time-series forecasting models that detect anomalies early and make data-informed decisions — integrated into your existing dashboards.",
    points: ["Demand & revenue forecasting", "Anomaly & fraud detection", "Explainability reports included"],
    learnMoreHref:  "https://scikit-learn.org/stable/supervised_learning.html",
    learnMoreLabel: "Scikit-learn Docs",
  },
  {
    title: "Reinforcement Learning",
    desc:  "Agent-based machine learning systems that learn optimal strategies through environment interaction — applied in recommendation engines, robotics control, dynamic pricing, and supply chain optimization.",
    points: ["Simulation environment setup", "Policy optimisation & evaluation", "Safe deployment & rollback"],
    learnMoreHref:  "https://pytorch.org/tutorials/intermediate/reinforcement_q_learning.html",
    learnMoreLabel: "PyTorch RL Docs",
  },
  {
    title: "Edge AI & Optimization",
    desc:  "Model quantization, pruning, and distillation for lightweight on-device inference — enabling offline-capable, low-latency AI without cloud dependency or data egress.",
    points: ["ONNX · TFLite · CoreML · TensorRT", "Model compression and optimization", "On-device data processing options"],
    learnMoreHref:  "https://onnx.ai/",
    learnMoreLabel: "ONNX Docs",
  },
];

/* ── Tech Stack ── */
export const TECH_STACK = [
  { category: "Frameworks",      items: ["TensorFlow", "PyTorch", "Keras", "JAX", "Scikit-learn"] },
  { category: "NLP & LLMs",      items: ["Hugging Face", "LangChain", "OpenAI API", "LlamaIndex", "spaCy"] },
  { category: "Computer Vision", items: ["OpenCV", "YOLO", "Detectron2", "Roboflow", "MediaPipe"] },
  { category: "MLOps & Infra",   items: ["MLflow", "Weights & Biases", "Docker", "Kubernetes", "Ray"] },
  { category: "Cloud Platforms", items: ["AWS SageMaker", "Google Vertex AI", "Azure ML", "GCP BigQuery ML"] },
  { category: "Edge Deployment", items: ["ONNX", "TensorFlow Lite", "CoreML", "TensorRT", "OpenVINO"] },
] as const;

/* ── Industries ── */
export const INDUSTRIES = [
  { name: "Healthcare",         detail: "Medical imaging analysis, clinical NLP, patient risk stratification, drug discovery pipelines" },
  { name: "Finance",            detail: "Fraud detection, credit scoring, algorithmic trading signals, document processing automation" },
  { name: "Manufacturing",      detail: "Visual defect inspection, predictive maintenance, yield optimisation, demand forecasting" },
  { name: "Retail",             detail: "Product recommendation engines, demand forecasting, visual search, returns prediction" },
  { name: "Logistics",          detail: "Route optimisation, delivery time prediction, warehouse automation, demand sensing" },
  { name: "Telecommunications", detail: "Network anomaly detection, churn prediction, call centre NLP, usage forecasting" },
] as const;

/* ── FAQs ──
   4 questions only — no fixed numbers, no timelines, no
   specific commitments that could bind the organisation later.
   Answers are honest, helpful, and scope-neutral.
── */
export interface FAQ { q: string; a: string; }
export const FAQS: FAQ[] = [
  {
    q: "Do we own the model and all code after the project?",
    a: "Deliverables, source access, model artifacts, third-party licensing, and handover terms are defined in the engagement agreement. Where model weights or other artifacts can be transferred under their applicable licenses, the delivery scope states that explicitly.",
  },
  {
    q: "Can you integrate AI into our existing software stack?",
    a: "Absolutely. We design models to fit into your infrastructure rather than asking you to change it. Whether your backend runs on cloud, on-premise, or a mix, we expose the model through a standard interface that connects cleanly with your existing systems.",
  },
  {
    q: "How do you handle sensitive and confidential data?",
    a: "Data privacy is a core part of every engagement. We agree on data handling terms before any files are shared, and training can be run entirely within your own environment so your data never needs to leave your control.",
  },
  {
    q: "What does the process look like from start to finish?",
    a: "Every project starts with a discovery session where we understand your data, goals, and constraints. From there we align on a scope and work in defined phases — each one delivering something tangible you can evaluate before we move forward.",
  },
];

/* ── Lifecycle Steps ── */
export interface Step {
  title:   string;
  tag:     string;
  desc:    string;
  from:    string;
  fromSub: string;
  to:      string;
  checks:  [string, string, string];
}
export const STEPS: Step[] = [
  { title:"Data Input",         tag:"01", desc:"Ingest raw data from any source — databases, images, PDFs, audio, or live API streams. Quality assessment and schema validation included.",            from:"Data Sources", fromSub:"CSV · JSON · Images · Audio",   to:"Validated Dataset", checks:["Schema validation","Format normalisation","Ingestion log"] },
  { title:"Preprocessing",      tag:"02", desc:"Clean, deduplicate, normalise, and label. Annotation pipelines for images; tokenisation and embedding preparation for text.",                           from:"Raw Dataset",  fromSub:"Deduplicate · Normalise · Label",  to:"Feature Store",     checks:["Missing value fill","Feature scaling","Label encoding"] },
  { title:"Model Training",     tag:"03", desc:"Select and configure architectures, run tracked experiments, iterate on hyperparameters until performance criteria are met.",                           from:"Feature Store",fromSub:"Architecture · Experiments",      to:"Best Checkpoint",   checks:["Loss curve tracking","Learning rate tuning","Gradient monitoring"] },
  { title:"Evaluation",         tag:"04", desc:"Test against held-out data with domain-specific metrics. Bias audits and explainability reports for regulated industries.",                             from:"Held-out Set", fromSub:"Precision · Recall · F1 · AUC",   to:"Approved Model",    checks:["Confusion matrix","ROC-AUC score","Bias audit"] },
  { title:"Deployment",         tag:"05", desc:"Package as REST API, gRPC service, or embedded SDK and deliver to cloud, on-premise, or edge device.",                                                 from:"Model Bundle", fromSub:"Docker · REST API · gRPC · SDK",  to:"Live Endpoint",     checks:["Latency test","Load test","Health check"] },
  { title:"Monitor & Retrain",  tag:"06", desc:"Live dashboards track accuracy and data drift. Automated retraining pipelines keep performance high as the world changes.",                            from:"Prod Traffic", fromSub:"Drift · Alerts · Metrics",        to:"Stable Model",      checks:["Drift score","Alert rules","Retrain trigger"] },
];

/* ── Workflow Nodes ── */
export const WF_NODES = [
  { id:"collect",  label:"Data Collection", sub:"Any source",        x:90,  y:220, dark:false },
  { id:"annotate", label:"Annotation",       sub:"Label & tag",       x:260, y:130, dark:false },
  { id:"preproc",  label:"Preprocessing",    sub:"Clean & normalise", x:260, y:310, dark:false },
  { id:"train",    label:"Model Training",   sub:"Your data",         x:430, y:220, dark:false },
  { id:"evaluate", label:"Evaluation",       sub:"Metrics & audit",   x:600, y:130, dark:false },
  { id:"deploy",   label:"Deployment",       sub:"API / SDK / Edge",  x:600, y:310, dark:false },
  { id:"optimise", label:"Optimise",         sub:"Fine-tune & A/B",   x:770, y:130, dark:false },
  { id:"monitor",  label:"Monitor",          sub:"Drift & retrain",   x:770, y:310, dark:true  },
] as const;

export const WF_EDGES = [
  { from:0, to:1 },{ from:0, to:2 },
  { from:1, to:3 },{ from:2, to:3 },
  { from:3, to:4 },{ from:3, to:5 },
  { from:4, to:6 },{ from:5, to:7 },
  { from:6, to:7 },
] as const;