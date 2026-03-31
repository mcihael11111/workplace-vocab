// Curated learning paths — ordered sequences of terms for structured learning.
// Each path targets a specific role or learning goal.

export const LEARNING_PATHS = [
  {
    id: "design-foundations",
    name: "Design Foundations",
    description: "The essential vocabulary every designer needs. Covers core concepts from research to visual design.",
    target: "New designers, career switchers",
    difficulty: "Beginner",
    estimatedMinutes: 40,
    terms: [
      "Cognitive Load", "Affordance", "Mental Model", "User Persona", "User Flow",
      "Wireframe", "Prototype", "Design System", "White Space", "Visual Hierarchy",
      "Colour Theory", "Typography", "Responsive Design", "Accessibility", "Heuristic Evaluation",
      "A/B Testing", "Usability Testing", "Information Architecture", "Interaction Design", "Microcopy",
    ],
  },
  {
    id: "ux-research-essentials",
    name: "UX Research Essentials",
    description: "How to understand users, run studies, and turn findings into actionable insights.",
    target: "Designers, product managers",
    difficulty: "Beginner",
    estimatedMinutes: 30,
    terms: [
      "User Research", "Qualitative Research", "Quantitative Research", "User Persona", "Empathy Map",
      "Journey Map", "Affinity Map", "Card Sorting", "Usability Testing", "Think-Aloud Protocol",
      "Heuristic Evaluation", "Survey Design", "Contextual Inquiry", "Moderated Testing", "Unmoderated Testing",
    ],
  },
  {
    id: "product-management-101",
    name: "Product Management 101",
    description: "The language of product teams. From discovery to delivery, learn how PMs think and communicate.",
    target: "New PMs, founders",
    difficulty: "Beginner",
    estimatedMinutes: 40,
    terms: [
      "MVP", "Product-Market Fit", "OKR", "KPI", "User Story",
      "Sprint", "Backlog", "Roadmap", "Stakeholder", "Value Proposition",
      "Feature Flag", "A/B Testing", "Churn Rate", "Retention", "North Star Metric",
      "Discovery", "Prioritisation", "Scope Creep", "Technical Debt", "Go-to-Market",
    ],
  },
  {
    id: "developer-business-vocab",
    name: "Developer's Business Vocab",
    description: "The business and product terms developers hear in meetings but rarely get explained.",
    target: "Engineers crossing into product",
    difficulty: "Intermediate",
    terms: [
      "OKR", "KPI", "Stakeholder", "Value Proposition", "ROI",
      "Burn Rate", "Runway", "Product-Market Fit", "Go-to-Market", "Churn Rate",
      "ARR", "MRR", "CAC", "LTV", "NDA",
    ],
    estimatedMinutes: 30,
  },
  {
    id: "startup-essentials",
    name: "Startup Essentials",
    description: "From pitch decks to burn rates. The vocabulary you need to build and fund a company.",
    target: "Founders, early employees",
    difficulty: "Intermediate",
    estimatedMinutes: 40,
    terms: [
      "MVP", "Product-Market Fit", "Burn Rate", "Runway", "ARR",
      "MRR", "CAC", "LTV", "Churn Rate", "Seed Round",
      "Series A", "Valuation", "Cap Table", "Term Sheet", "Pitch Deck",
      "Go-to-Market", "Value Proposition", "NDA", "IP", "Equity",
    ],
  },
  {
    id: "marketing-for-builders",
    name: "Marketing for Builders",
    description: "Marketing concepts that product people and developers need to understand growth.",
    target: "Product people learning growth",
    difficulty: "Beginner",
    estimatedMinutes: 30,
    terms: [
      "Brand Identity", "Brand Positioning", "Target Audience", "Value Proposition", "Content Strategy",
      "SEO", "Conversion Rate", "Funnel", "A/B Testing", "Retention",
      "Churn Rate", "CAC", "LTV", "Go-to-Market", "Organic Growth",
    ],
  },
  {
    id: "ai-literacy",
    name: "AI Literacy",
    description: "Understand artificial intelligence and machine learning without the jargon wall.",
    target: "Anyone new to AI/ML",
    difficulty: "Beginner",
    estimatedMinutes: 30,
    terms: [
      "Machine Learning", "Neural Network", "Deep Learning", "Natural Language Processing", "Large Language Model",
      "Training Data", "Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Hallucination",
      "Prompt Engineering", "Fine-Tuning", "Transfer Learning", "Bias", "Overfitting",
    ],
  },
  {
    id: "full-toolkit",
    name: "The Full Toolkit",
    description: "A cross-domain tour of the most important terms. One from every corner of the workplace.",
    target: "Ambitious learners, career switchers",
    difficulty: "Intermediate",
    estimatedMinutes: 60,
    terms: [
      "Cognitive Load", "Affordance", "Design System", "CI/CD", "MVP",
      "OKR", "Value Proposition", "Burn Rate", "NDA", "Hallucination",
      "Brand Identity", "SEO", "A/B Testing", "Accessibility", "User Persona",
      "Sprint", "Technical Debt", "Churn Rate", "ROI", "Stakeholder",
      "Mental Model", "Wireframe", "Typography", "Responsive Design", "Information Architecture",
      "KPI", "Roadmap", "Go-to-Market", "IP", "Machine Learning",
    ],
  },
];

// Role → recommended path mapping (used by onboarding)
export const ROLE_PATH_MAP = {
  "Designer":          "design-foundations",
  "Product Manager":   "product-management-101",
  "Developer":         "developer-business-vocab",
  "Marketer":          "marketing-for-builders",
  "Founder / Business":"startup-essentials",
  "Career Switcher":   "full-toolkit",
  "Student":           "design-foundations",
  "Just Curious":      "full-toolkit",
};
