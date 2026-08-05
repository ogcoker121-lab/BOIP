import { evaluateRulesWithTrace } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import {
  customerValidationStrengths,
  customerValidationWatchItems,
} from "@/src/domain/opportunity/knowledge/customer-validation";
import { pricingWatchItems as opportunityPricingWatchItems } from "@/src/domain/opportunity/knowledge/pricing";
import { RouteContext } from "@/src/domain/route-decision/models/route-context";
import { routeWeightRules } from "@/src/domain/route-decision/knowledge/route-weights";
import { customerDiscoveryRecommendations } from "@/src/domain/recommendation/knowledge/customer-discovery";
import { businessModelRecommendations } from "@/src/domain/recommendation/knowledge/business-model";
import { marketValidationRecommendations } from "@/src/domain/recommendation/knowledge/market-validation";
import { pricingRecommendations } from "@/src/domain/recommendation/knowledge/pricing";
import { competitionRecommendations } from "@/src/domain/recommendation/knowledge/competition";
import { mvpRecommendations } from "@/src/domain/recommendation/knowledge/mvp";
import { Evaluation } from "../models/decision";

// Re-evaluates the same knowledge the route-decision, opportunity, and
// recommendation domains already evaluated, purely to trace which rules
// matched and why - never to recompute or override their output. Every
// weight and reason here is read straight from the existing knowledge
// rows, not invented.
//
// evaluateRulesWithTrace() only reports matched/unmatched; the weight and
// reason for each row still come from the rule's own `then` (available
// here regardless of match, since we hold the knowledge array directly) -
// unmatched rules are kept as Evaluations too, for genuine auditability.

const RECOMMENDATION_KNOWLEDGE = [
  customerDiscoveryRecommendations,
  businessModelRecommendations,
  marketValidationRecommendations,
  pricingRecommendations,
  competitionRecommendations,
  mvpRecommendations,
];

function buildRouteEvaluations(context: RouteContext): Evaluation[] {
  const trace = evaluateRulesWithTrace(routeWeightRules, context);
  return routeWeightRules.map((rule, index) => ({
    ruleId: rule.id,
    category: "route",
    matched: trace[index].matched,
    // A single rule can nudge more than one route (see RULE-007); those
    // entries always share one reason in today's knowledge, so summing
    // the weights and taking that shared reason is lossless.
    weight: rule.then.reduce((sum, contribution) => sum + contribution.weight, 0),
    reason: rule.then[0]?.reason ?? "",
  }));
}

function buildOpportunitySignalEvaluations(context: OpportunityContext): Evaluation[] {
  const rules = [...customerValidationStrengths, ...customerValidationWatchItems, ...opportunityPricingWatchItems];
  const trace = evaluateRulesWithTrace(rules, context);
  return rules.map((rule, index) => ({
    ruleId: rule.id,
    category: "opportunity-signal",
    matched: trace[index].matched,
    // This knowledge's `then` values are bare strings (e.g. "Customer
    // clearly identified") - no separate reason field exists, so the
    // string itself doubles as the reason, same as it doubles as the
    // strength/watch-list label on the Opportunity Snapshot.
    reason: rule.then[0] ?? "",
  }));
}

function buildRecommendationEvaluations(context: OpportunityContext): Evaluation[] {
  return RECOMMENDATION_KNOWLEDGE.flatMap((rules) => {
    const trace = evaluateRulesWithTrace(rules, context);
    return rules.map((rule, index) => ({
      ruleId: rule.id,
      category: "recommendation" as const,
      matched: trace[index].matched,
      reason: rule.then[0]?.reason ?? "",
    }));
  });
}

export function buildEvaluations(routeContext: RouteContext, opportunityContext: OpportunityContext): Evaluation[] {
  return [
    ...buildRouteEvaluations(routeContext),
    ...buildOpportunitySignalEvaluations(opportunityContext),
    ...buildRecommendationEvaluations(opportunityContext),
  ];
}
