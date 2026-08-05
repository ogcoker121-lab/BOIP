import { InterviewAnswers } from "@/types/interview";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import { OpportunitySnapshot } from "@/src/domain/opportunity/snapshot-model";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { Decision } from "@/src/domain/decision/models/decision";
import { BusinessPlanSection } from "../models/business-plan";
import { buildExecutiveSummarySection } from "../sections/executive-summary-section";
import { buildBusinessOpportunitySection } from "../sections/business-opportunity-section";
import { buildCustomerSection } from "../sections/customer-section";
import { buildRevenueModelSection } from "../sections/revenue-model-section";
import { buildGoToMarketSection } from "../sections/go-to-market-section";
import { buildFirst90DayPlanSection } from "../sections/first-90-day-plan-section";
import { buildRisksSection } from "../sections/risks-section";
import { buildRecommendedFrameworksSection } from "../sections/recommended-frameworks-section";

export interface BusinessPlanBuilderInput {
  answers: InterviewAnswers;
  opportunityContext: OpportunityContext;
  snapshot: OpportunitySnapshot;
  decision: Decision;
  bestMatch: OpportunityMatch | undefined;
}

// Version 1's eight sections, in a fixed order - not derived, so a plan
// reads the same way every time. Assembly only: every section builder
// already did its own work, this just orders the results.
export function buildBusinessPlanSections(input: BusinessPlanBuilderInput): BusinessPlanSection[] {
  const { answers, opportunityContext, snapshot, decision, bestMatch } = input;

  return [
    buildExecutiveSummarySection(snapshot, decision),
    buildBusinessOpportunitySection(snapshot),
    buildCustomerSection(answers),
    buildRevenueModelSection(opportunityContext, bestMatch, decision.recommendations),
    buildGoToMarketSection(opportunityContext, bestMatch, decision.recommendations),
    buildFirst90DayPlanSection(decision.recommendations),
    buildRisksSection(snapshot, bestMatch),
    buildRecommendedFrameworksSection(decision.recommendations, bestMatch),
  ];
}
