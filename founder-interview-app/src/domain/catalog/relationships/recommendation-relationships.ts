import { Recommendation } from "@/src/domain/recommendation";
import { Relationship } from "../models/relationship";

// A Recommendation already declares which frameworks it draws on
// (frameworkReferences) - this doesn't infer anything new, it just gives
// that existing, explicit fact a Relationship shape instead of a bare
// string list. Sourced from the object itself so it can never drift out
// of sync with what the recommendation domain actually references.
export function deriveRecommendationRelationships(recommendation: Recommendation): Relationship[] {
  return recommendation.frameworkReferences.map((frameworkId) => ({
    sourceId: recommendation.id,
    targetId: frameworkId,
    type: "USES" as const,
  }));
}
