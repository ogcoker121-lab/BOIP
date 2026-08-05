import { OpportunitySnapshot } from "@/src/domain/opportunity/snapshot-model";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { renderRisks } from "../templates/risks-template";
import { BusinessPlanSection } from "../models/business-plan";

export function buildRisksSection(snapshot: OpportunitySnapshot, bestMatch: OpportunityMatch | undefined): BusinessPlanSection {
  const content = renderRisks(snapshot.watchList, bestMatch?.mainLimitation);

  return {
    id: "risks",
    title: "Risks",
    content,
    recommendedFrameworks: [],
  };
}
