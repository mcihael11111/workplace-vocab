// ─── CATEGORIES ─────────────────────────────────────────────────────────────
// 30 categories across 7 domains.
// Shape: { id, name, domain, count, color, accent, icon, description }
// icon — a Lucide React component, rendered as <cat.icon size={N} color={cat.accent} />

import {
  Microscope, Workflow, Puzzle, Palette, Type,
  Component, Lightbulb, Compass, AlignCenter, PenLine,
  Accessibility, Layers, Code2, Repeat2,
  TrendingUp, FlaskConical, Users,
  Fingerprint, Target, Smartphone, Megaphone,
  Wallet, Rocket, Building2,
  Copyright, FileText, ShieldCheck,
  BrainCircuit, Sparkles, Wand2, Cpu, ShieldAlert,
} from "lucide-react";

const CATEGORIES = [
  // ── Product Design ────────────────────────────────────────────────────────
  { id: "research",             name: "Research",             domain: "Product Design", count: 46, color: "#E8F4F8", accent: "#0EA5E9", icon: Microscope,   description: "User interviews, affinity maps, personas, journey maps" },
  { id: "design-methodologies", name: "Design Methodologies", domain: "Product Design", count: 20, color: "#F0FDF4", accent: "#22C55E", icon: Workflow,      description: "Cognitive load, Fitts' Law, mental models, affordance" },
  { id: "element",              name: "UI Elements",          domain: "Product Design", count: 42, color: "#FFF7ED", accent: "#F97316", icon: Puzzle,        description: "Buttons, menus, modals, tooltips, navigation patterns" },
  { id: "colours",              name: "Colours",              domain: "Product Design", count: 28, color: "#FDF4FF", accent: "#A855F7", icon: Palette,       description: "Colour theory, palettes, contrast, CMYK, RGB" },
  { id: "typography",           name: "Typography",           domain: "Product Design", count: 21, color: "#FFF1F2", accent: "#F43F5E", icon: Type,          description: "Serifs, x-height, baseline, line height, typefaces" },
  { id: "design-system",        name: "Design System",        domain: "Product Design", count: 9,  color: "#F8FAFC", accent: "#64748B", icon: Component,     description: "Tokens, components, style guides, pattern libraries" },
  { id: "ideation",             name: "Ideation",             domain: "Product Design", count: 13, color: "#ECFDF5", accent: "#10B981", icon: Lightbulb,     description: "Wireframes, low-fi, high-fi, information architecture" },
  { id: "discovery",            name: "Discovery",            domain: "Product Design", count: 6,  color: "#EFF6FF", accent: "#3B82F6", icon: Compass,       description: "Design briefs, requirements, assumptions, hypotheses" },
  { id: "alignment",            name: "Alignment",            domain: "Product Design", count: 12, color: "#FEF9C3", accent: "#CA8A04", icon: AlignCenter,   description: "Grids, golden ratio, gutters, 8-point grid, breakpoints" },
  { id: "copy",                 name: "Copy",                 domain: "Product Design", count: 5,  color: "#F0FDF4", accent: "#16A34A", icon: PenLine,       description: "Microcopy, CTAs, body copy, hierarchy" },
  { id: "accessibility",        name: "Accessibility",        domain: "Product Design", count: 5,  color: "#EEF2FF", accent: "#6366F1", icon: Accessibility, description: "WCAG, usability, thumb reachability, scalability" },
  { id: "prototyping",          name: "Prototyping",          domain: "Product Design", count: 3,  color: "#F0F9FF", accent: "#0284C7", icon: Layers,        description: "Interactions, micro-interactions, design specs" },
  // ── Engineering ───────────────────────────────────────────────────────────
  { id: "development",          name: "Development",          domain: "Engineering",    count: 20, color: "#F0F9FF", accent: "#06B6D4", icon: Code2,         description: "MVP, APIs, QA, deployment, version control, CI/CD" },
  { id: "methodologies",        name: "Methodologies",        domain: "Engineering",    count: 20, color: "#FFF7ED", accent: "#EA580C", icon: Repeat2,       description: "Agile, Scrum, Kanban, sprints, user stories, epics" },
  // ── Business ──────────────────────────────────────────────────────────────
  { id: "business",             name: "Business",             domain: "Business",       count: 20, color: "#FFF5F5", accent: "#EF4444", icon: TrendingUp,    description: "KPIs, OKRs, roadmaps, stakeholders, ROI, churn" },
  { id: "testing",              name: "Testing",              domain: "Business",       count: 20, color: "#FFFBEB", accent: "#EAB308", icon: FlaskConical,  description: "A/B testing, heatmaps, conversion rate, cohort analysis" },
  { id: "positions",            name: "Positions",            domain: "Business",       count: 20, color: "#FDF2F8", accent: "#EC4899", icon: Users,         description: "PM, UX designer, design lead, CPO, Scrum Master" },
  // ── Marketing ─────────────────────────────────────────────────────────────
  { id: "brand",                name: "Brand",                domain: "Marketing",      count: 19, color: "#F5F3FF", accent: "#8B5CF6", icon: Fingerprint,   description: "Brand values, visual identity, equity, authenticity" },
  { id: "marketing-strategy",   name: "Marketing Strategy",   domain: "Marketing",      count: 9,  color: "#FFFBEB", accent: "#F59E0B", icon: Target,        description: "GTM strategy, positioning, segmentation, value proposition" },
  { id: "content-social",       name: "Content & Social",     domain: "Marketing",      count: 10, color: "#FFF7ED", accent: "#F97316", icon: Smartphone,    description: "SEO, content marketing, email, social media, organic reach" },
  { id: "paid-growth",          name: "Paid & Growth",        domain: "Marketing",      count: 9,  color: "#FEF2F2", accent: "#EF4444", icon: Megaphone,     description: "Paid media, CRO, performance marketing, retargeting" },
  // ── Finance ───────────────────────────────────────────────────────────────
  { id: "financial-fundamentals", name: "Financial Fundamentals", domain: "Finance",    count: 11, color: "#F0FDF4", accent: "#16A34A", icon: Wallet,        description: "Revenue, profit margin, P&L, gross margin, break-even, ROI" },
  { id: "startup-finance",      name: "Startup Finance",      domain: "Finance",        count: 11, color: "#ECFDF5", accent: "#059669", icon: Rocket,        description: "Burn rate, runway, ARR, unit economics, EBITDA, valuation" },
  { id: "business-operations",  name: "Business Operations",  domain: "Finance",        count: 7,  color: "#F7FEE7", accent: "#65A30D", icon: Building2,     description: "Cash flow, procurement, invoicing, accounts, fiscal planning" },
  // ── Legal ─────────────────────────────────────────────────────────────────
  { id: "intellectual-property", name: "Intellectual Property", domain: "Legal",        count: 8,  color: "#FFF7ED", accent: "#C2410C", icon: Copyright,     description: "Copyright, trademark, patent, licensing, IP ownership" },
  { id: "contracts-agreements", name: "Contracts & Agreements", domain: "Legal",        count: 10, color: "#FEF3C7", accent: "#D97706", icon: FileText,      description: "NDA, contracts, SLA, indemnity, equity, shareholder agreements" },
  { id: "compliance-data",      name: "Compliance & Data",    domain: "Legal",          count: 10, color: "#FFF1F2", accent: "#E11D48", icon: ShieldCheck,   description: "GDPR, privacy policy, compliance, data retention, acceptable use" },
  // ── AI & Machine Learning ──────────────────────────────────────────────────
  { id: "ai-foundations",        name: "AI Foundations",        domain: "AI & Machine Learning", count: 18, color: "#EFF6FF", accent: "#3B82F6", icon: BrainCircuit,  description: "Machine learning, neural networks, training, supervised & unsupervised learning" },
  { id: "generative-ai",        name: "Generative AI",         domain: "AI & Machine Learning", count: 20, color: "#FDF4FF", accent: "#A855F7", icon: Sparkles,      description: "LLMs, prompts, tokens, hallucination, fine-tuning, diffusion models" },
  { id: "ai-product-design",    name: "AI Product & Design",   domain: "AI & Machine Learning", count: 15, color: "#F0FDF4", accent: "#10B981", icon: Wand2,         description: "Human-in-the-loop, explainability, AI UX patterns, trust calibration" },
  { id: "ai-engineering",       name: "AI Engineering",        domain: "AI & Machine Learning", count: 12, color: "#FFF7ED", accent: "#F97316", icon: Cpu,           description: "Inference, embeddings, RAG, vector databases, model deployment" },
  { id: "ai-ethics-safety",     name: "AI Ethics & Safety",    domain: "AI & Machine Learning", count: 10, color: "#FEF2F2", accent: "#EF4444", icon: ShieldAlert,   description: "Bias, fairness, alignment, responsible AI, regulation" },
];

export { CATEGORIES };
