import { CatalogStatus } from "../models/catalog-entry";

export type RuleKnowledgeSource = "route" | "recommendation" | "opportunitySignal";

export interface RuleCatalogMetadata {
  capability: string;
  owner: string;
  version: string;
  status: CatalogStatus;
}

// A rule's capability/owner comes from which knowledge file it lives in,
// not the individual rule - rule-builder.ts already knows that (it reads
// route-weights.ts, the recommendation knowledge files, and the
// opportunity-signal knowledge files separately), so this is one row per
// source, not one row per RULE-xxx. "Route Decision" and "Opportunity
// Matching" reuse the exact QuestionCapability labels those knowledge
// sets already serve (types/interview.ts) - the same underlying concept,
// same name.
export const ruleCatalogMetadataBySource: Record<RuleKnowledgeSource, RuleCatalogMetadata> = {
  route: { capability: "Route Decision", owner: "Route Decision Domain", version: "1.0", status: "Active" },
  recommendation: { capability: "Recommendation", owner: "Recommendation Domain", version: "1.0", status: "Active" },
  opportunitySignal: {
    capability: "Opportunity Matching",
    owner: "Opportunity Domain",
    version: "1.0",
    status: "Active",
  },
};
