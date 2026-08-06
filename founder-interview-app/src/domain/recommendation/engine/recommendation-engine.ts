import { evaluateRules } from "@/src/domain/shared";
import { OpportunityContext } from "@/src/domain/opportunity";
import { Recommendation, RecommendationEffort, RecommendationImpact, RecommendationPriority } from "../models/recommendation";
import { customerDiscoveryRecommendations } from "../knowledge/customer-discovery";
import { businessModelRecommendations } from "../knowledge/business-model";
import { marketValidationRecommendations } from "../knowledge/market-validation";
import { pricingRecommendations } from "../knowledge/pricing";
import { competitionRecommendations } from "../knowledge/competition";
import { mvpRecommendations } from "../knowledge/mvp";

// Integration only - this is not a second engine. Every knowledge set
// below is evaluated by the one generic evaluateRules() from
// src/domain/shared/rule-engine.ts. Future scoring knowledge reuses the
// same engine the same way.
const ALL_KNOWLEDGE = [
  customerDiscoveryRecommendations,
  businessModelRecommendations,
  marketValidationRecommendations,
  pricingRecommendations,
  competitionRecommendations,
  mvpRecommendations,
];

const PRIORITY_ORDER: Record<RecommendationPriority, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
const IMPACT_ORDER: Record<RecommendationImpact, number> = { High: 0, Medium: 1, Low: 2 };
const EFFORT_ORDER: Record<RecommendationEffort, number> = { Small: 0, Medium: 1, Large: 2 };

// Deterministic ordering: priority, then impact, then effort (favoring the
// smaller/quicker win when priority and impact tie).
function compareRecommendations(a: Recommendation, b: Recommendation): number {
  if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  }
  if (IMPACT_ORDER[a.estimatedImpact] !== IMPACT_ORDER[b.estimatedImpact]) {
    return IMPACT_ORDER[a.estimatedImpact] - IMPACT_ORDER[b.estimatedImpact];
  }
  return EFFORT_ORDER[a.estimatedEffort] - EFFORT_ORDER[b.estimatedEffort];
}

export function evaluateRecommendations(context: OpportunityContext): Recommendation[] {
  const recommendations = ALL_KNOWLEDGE.flatMap((knowledge) => evaluateRules(knowledge, context));
  return [...recommendations].sort(compareRecommendations);
}
