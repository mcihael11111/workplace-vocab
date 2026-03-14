// ─── CATEGORIES ─────────────────────────────────────────────────────────────
// 19 categories across 4 domains.
// Shape: { id, name, domain, count, color, accent, icon, description }

const CATEGORIES = [
  // ── Product Design ────────────────────────────────────────────────────────
  { id: "research",             name: "Research",             domain: "Product Design", count: 46, color: "#E8F4F8", accent: "#0EA5E9", icon: "🔍", description: "User interviews, affinity maps, personas, journey maps" },
  { id: "design-methodologies", name: "Design Methodologies", domain: "Product Design", count: 20, color: "#F0FDF4", accent: "#22C55E", icon: "⚙️", description: "Cognitive load, Fitts' Law, mental models, affordance" },
  { id: "element",              name: "UI Elements",          domain: "Product Design", count: 42, color: "#FFF7ED", accent: "#F97316", icon: "🧩", description: "Buttons, menus, modals, tooltips, navigation patterns" },
  { id: "colours",              name: "Colours",              domain: "Product Design", count: 28, color: "#FDF4FF", accent: "#A855F7", icon: "🎨", description: "Colour theory, palettes, contrast, CMYK, RGB" },
  { id: "typography",           name: "Typography",           domain: "Product Design", count: 21, color: "#FFF1F2", accent: "#F43F5E", icon: "Aa", description: "Serifs, x-height, baseline, line height, typefaces" },
  { id: "design-system",        name: "Design System",        domain: "Product Design", count: 9,  color: "#F8FAFC", accent: "#64748B", icon: "📐", description: "Tokens, components, style guides, pattern libraries" },
  { id: "ideation",             name: "Ideation",             domain: "Product Design", count: 13, color: "#ECFDF5", accent: "#10B981", icon: "💡", description: "Wireframes, low-fi, high-fi, information architecture" },
  { id: "discovery",            name: "Discovery",            domain: "Product Design", count: 6,  color: "#EFF6FF", accent: "#3B82F6", icon: "🧭", description: "Design briefs, requirements, assumptions, hypotheses" },
  { id: "alignment",            name: "Alignment",            domain: "Product Design", count: 12, color: "#FEF9C3", accent: "#CA8A04", icon: "⊞",  description: "Grids, golden ratio, gutters, 8-point grid, breakpoints" },
  { id: "copy",                 name: "Copy",                 domain: "Product Design", count: 5,  color: "#F0FDF4", accent: "#16A34A", icon: "✍️", description: "Microcopy, CTAs, body copy, hierarchy" },
  { id: "accessibility",        name: "Accessibility",        domain: "Product Design", count: 5,  color: "#EEF2FF", accent: "#6366F1", icon: "♿", description: "WCAG, usability, thumb reachability, scalability" },
  { id: "prototyping",          name: "Prototyping",          domain: "Product Design", count: 3,  color: "#F0F9FF", accent: "#0284C7", icon: "🖱️", description: "Interactions, micro-interactions, design specs" },
  // ── Engineering ───────────────────────────────────────────────────────────
  { id: "development",          name: "Development",          domain: "Engineering",    count: 26, color: "#F0F9FF", accent: "#06B6D4", icon: "💻", description: "MVP, APIs, QA, deployment, responsive design" },
  { id: "methodologies",        name: "Methodologies",        domain: "Engineering",    count: 7,  color: "#FFF7ED", accent: "#EA580C", icon: "🔄", description: "Design thinking, Agile, Lean, Waterfall, Double Diamond" },
  // ── Business ──────────────────────────────────────────────────────────────
  { id: "business",             name: "Business",             domain: "Business",       count: 18, color: "#FFF5F5", accent: "#EF4444", icon: "📈", description: "Stakeholders, KPIs, NPS, B2B, voice of customer" },
  { id: "testing",              name: "Testing",              domain: "Business",       count: 15, color: "#FFFBEB", accent: "#EAB308", icon: "📊", description: "A/B testing, heatmaps, conversion rate, analytics" },
  { id: "positions",            name: "Positions",            domain: "Business",       count: 9,  color: "#FDF2F8", accent: "#EC4899", icon: "👤", description: "PM, UX designer, UI designer, researcher, dev roles" },
  // ── Marketing ─────────────────────────────────────────────────────────────
  { id: "brand",                name: "Brand",                domain: "Marketing",      count: 14, color: "#F5F3FF", accent: "#8B5CF6", icon: "✦",  description: "Tone of voice, brand identity, design debt, social proof" },
  { id: "marketing",            name: "Marketing",            domain: "Marketing",      count: 10, color: "#FFFBEB", accent: "#F59E0B", icon: "📣", description: "Funnels, CAC, LTV, SEO, content strategy, segmentation" },
];

export { CATEGORIES };
