import { Recommendation } from "@/src/domain/recommendation";
import { Relationship } from "../models/relationship";

// Every recommendation-knowledge rule's `then` is exactly one
// Recommendation today - the rule generates it. That structural fact
// (one rule, one recommendation, read straight from the knowledge file)
// is what this declares; nothing is guessed from names or categories.
//
// Route-weight rules produce a weighted nudge toward a route (not a
// permanent id) and opportunity-signal rules produce a bare string, so
// neither has a GENERATES target today - see rule-builder.ts, which
// only calls this for the recommendation-sourced rules.
export function deriveRuleGeneratesRelationship(ruleId: string, recommendation: Recommendation): Relationship {
  return { sourceId: ruleId, targetId: recommendation.id, type: "GENERATES" };
}
