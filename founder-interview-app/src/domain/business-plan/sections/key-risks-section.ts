import { OpportunitySnapshot } from "@/src/domain/opportunity/snapshot-model";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { renderRisks } from "../templates/risks-template";
import { BusinessPlanSection } from "../models/business-plan";

export function buildKeyRisksSection(snapshot: OpportunitySnapshot, bestMatch: OpportunityMatch | undefined): BusinessPlanSection {
  const content = renderRisks(snapshot.watchList, bestMatch?.mainLimitation);

  return {
    id: "key-risks",
    title: "Key Risks",
    content,
    recommendedFrameworks: [],
  };
}
