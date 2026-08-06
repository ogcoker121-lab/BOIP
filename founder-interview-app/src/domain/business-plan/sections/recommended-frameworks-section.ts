import { Recommendation } from "@/src/domain/recommendation";
import { OpportunityMatch } from "@/src/domain/opportunity";
import { renderRecommendedFrameworksIntro } from "../templates/recommended-frameworks-template";
import { BusinessPlanSection } from "../models/business-plan";
import { resolveFrameworkReferences } from "./shared";

export function buildRecommendedFrameworksSection(
  recommendations: Recommendation[],
  bestMatch: OpportunityMatch | undefined,
): BusinessPlanSection {
  const frameworkIds = [
    ...recommendations.flatMap((recommendation) => recommendation.frameworkReferences),
    ...(bestMatch?.opportunity.frameworkReferences ?? []),
  ];
  const recommendedFrameworks = resolveFrameworkReferences(frameworkIds);

  return {
    id: "recommended-frameworks",
    title: "Recommended Frameworks",
    content: renderRecommendedFrameworksIntro(recommendedFrameworks.length),
    recommendedFrameworks,
  };
}
