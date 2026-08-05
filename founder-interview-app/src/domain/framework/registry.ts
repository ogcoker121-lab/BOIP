// A founder should never see a raw "FW-011" - they should see "Business
// Model Canvas". This registry is the resolution point: every domain that
// references a framework by id (recommendation/, opportunity/library/)
// resolves it here rather than embedding names, which can change, in
// application code. IDs are mapped to BOIP's existing numbered knowledge
// documents (01_Founder_Interview and the repo root's 01-13 docs).
export interface Framework {
  id: string;
  name: string;
  summary: string;
  whyItMatters: string;
}

export const frameworkRegistry: Record<string, Framework> = {
  "FW-001": {
    id: "FW-001",
    name: "Lean Startup",
    summary: "Build a minimum viable version of your idea, test it with real users, and learn before investing further.",
    whyItMatters: "Reduces the risk of building something nobody wants by validating early and cheaply.",
  },
  "FW-002": {
    id: "FW-002",
    name: "Business Idea Generator Framework",
    summary: "A structured way to generate and filter business ideas against your skills, interests, and constraints.",
    whyItMatters: "Helps you move from a vague direction to a shortlist of concrete, testable ideas.",
  },
  "FW-003": {
    id: "FW-003",
    name: "Design Thinking",
    summary: "A human-centred process for understanding a problem deeply before designing a solution.",
    whyItMatters: "Keeps the solution grounded in what customers actually need, not just what's easy to build.",
  },
  "FW-004": {
    id: "FW-004",
    name: "Market Opportunity Analysis",
    summary: "Assesses the size, growth, and accessibility of a market before committing resources to it.",
    whyItMatters: "Confirms there's a real, reachable market before you invest time or money.",
  },
  "FW-005": {
    id: "FW-005",
    name: "Customer Discovery",
    summary: "Structured conversations with potential customers to validate a problem before building a solution.",
    whyItMatters: "The fastest, cheapest way to find out if you're solving a real problem for real people.",
  },
  "FW-007": {
    id: "FW-007",
    name: "Competitive Intelligence",
    summary: "Systematically studying competitors to understand their strengths, weaknesses, and gaps.",
    whyItMatters: "Helps you position clearly instead of entering a market blind to who you're up against.",
  },
  "FW-011": {
    id: "FW-011",
    name: "Business Model Canvas",
    summary: "A one-page framework covering how a business creates, delivers, and captures value.",
    whyItMatters: "Forces clarity on how the business actually makes money before you write a full plan.",
  },
  "FW-013": {
    id: "FW-013",
    name: "Pricing Strategies",
    summary: "A set of proven approaches to setting and testing prices, from cost-based to value-based models.",
    whyItMatters: "Getting pricing wrong early is one of the most common - and most fixable - founder mistakes.",
  },
  "FW-021": {
    id: "FW-021",
    name: "Product Development & Product-Market Fit",
    summary: "A framework for iterating a product toward strong, measurable demand from a defined customer segment.",
    whyItMatters: "Tells you when you've found real traction versus when you're still guessing.",
  },
};

export function resolveFramework(id: string): Framework | null {
  return frameworkRegistry[id] ?? null;
}

export function resolveFrameworks(ids: string[]): Framework[] {
  return ids.map(resolveFramework).filter((framework): framework is Framework => framework !== null);
}
