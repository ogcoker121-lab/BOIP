import { OpportunityContext, OpportunityMatch } from "@/src/domain/opportunity";
import { Recommendation } from "@/src/domain/recommendation";
import { renderRevenueModel } from "../templates/revenue-model-template";
import { BusinessPlanSection } from "../models/business-plan";
import { resolveFrameworkReferences } from "./shared";

export function buildRevenueModelSection(
  opportunityContext: OpportunityContext,
  bestMatch: OpportunityMatch | undefined,
  recommendations: Recommendation[],
): BusinessPlanSection {
  const content = renderRevenueModel({
    revenueModel: bestMatch?.opportunity.revenueModel ?? opportunityContext.revenueModel,
    budgetFit: bestMatch?.budgetFit,
  });

  // Frameworks referenced by whichever Business Model / Pricing
  // recommendations actually fired - derived, not hardcoded ids.
  const frameworkIds = recommendations
    .filter((recommendation) => recommendation.category === "Business Model" || recommendation.category === "Pricing")
    .flatMap((recommendation) => recommendation.frameworkReferences);

  return {
    id: "revenue-model",
    title: "Revenue Model",
    content,
    recommendedFrameworks: resolveFrameworkReferences(frameworkIds),
  };
}
