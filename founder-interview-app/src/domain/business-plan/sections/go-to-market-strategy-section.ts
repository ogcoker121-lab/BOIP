import { OpportunityContext } from "@/src/domain/opportunity/context";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import { renderGoToMarket } from "../templates/go-to-market-template";
import { BusinessPlanSection } from "../models/business-plan";
import { resolveFrameworkReferences } from "./shared";

export function buildGoToMarketStrategySection(
  opportunityContext: OpportunityContext,
  bestMatch: OpportunityMatch | undefined,
  recommendations: Recommendation[],
): BusinessPlanSection {
  const content = renderGoToMarket({
    marketType: opportunityContext.marketType,
    firstAction: bestMatch?.firstAction,
  });

  const frameworkIds = recommendations
    .filter((recommendation) => recommendation.category === "Customer Discovery" || recommendation.category === "Market Validation")
    .flatMap((recommendation) => recommendation.frameworkReferences);

  return {
    id: "go-to-market-strategy",
    title: "Go-to-Market Strategy",
    content,
    recommendedFrameworks: resolveFrameworkReferences(frameworkIds),
  };
}
