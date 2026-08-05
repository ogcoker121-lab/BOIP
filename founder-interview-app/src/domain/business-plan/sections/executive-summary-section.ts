import { OpportunitySnapshot } from "@/src/domain/opportunity/snapshot-model";
import { Decision } from "@/src/domain/decision/models/decision";
import { renderExecutiveSummary } from "../templates/executive-summary-template";
import { BusinessPlanSection } from "../models/business-plan";

export function buildExecutiveSummarySection(snapshot: OpportunitySnapshot, decision: Decision): BusinessPlanSection {
  const content = renderExecutiveSummary({
    founderSummary: snapshot.founderSummary,
    explanationHeadline: decision.explanation.headline,
    explanationBullets: decision.explanation.bullets,
  });

  return {
    id: "executive-summary",
    title: "Executive Summary",
    content,
    recommendedFrameworks: [],
  };
}
