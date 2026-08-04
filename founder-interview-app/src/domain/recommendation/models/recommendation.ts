// Pure domain model: no React, no API routes, no persistence knowledge.

export type RecommendationCategory =
  | "Customer Discovery"
  | "Business Model"
  | "Market Validation"
  | "Pricing"
  | "Competition"
  | "MVP";

export type RecommendationPriority = "Critical" | "High" | "Medium" | "Low";
export type RecommendationEffort = "Small" | "Medium" | "Large";
export type RecommendationImpact = "High" | "Medium" | "Low";

export interface Recommendation {
  // Permanent, hand-assigned in knowledge/ - never renumbered or reused,
  // even if the rule that produces it changes. The start of BOIP's
  // internal ontology: these become stable references for the Knowledge
  // Graph, Founder Report, AI prompts, and recommendation history.
  id: string;
  title: string;
  description: string;
  reason: string;
  priority: RecommendationPriority;
  estimatedEffort: RecommendationEffort;
  estimatedImpact: RecommendationImpact;
  category: RecommendationCategory;
  actions: string[];
  // Stable framework IDs (e.g. "FW-011"), not free-text names, so they
  // can resolve against BOIP's Framework Library later without the
  // application depending on how a framework happens to be named today.
  frameworkReferences: string[];
}
