import { Opportunity } from "@/src/domain/opportunity/library/models/opportunity";
import { Relationship } from "../models/relationship";

// Same pattern as recommendation-relationships.ts: Opportunity already
// declares its own frameworkReferences - this surfaces that existing
// fact, it doesn't invent one.
export function deriveOpportunityRelationships(opportunity: Opportunity): Relationship[] {
  return opportunity.frameworkReferences.map((frameworkId) => ({
    sourceId: opportunity.id,
    targetId: frameworkId,
    type: "USES" as const,
  }));
}
