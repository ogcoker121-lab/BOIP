import { OpportunityContext } from "@/src/domain/opportunity/context";
import { OpportunitySnapshot } from "@/src/domain/opportunity/snapshot-model";
import { CustomerContext } from "@/src/domain/opportunity/customer-context";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";
import { Decision } from "@/src/domain/decision/models/decision";
import { BusinessPlanSection } from "../models/business-plan";
import { buildExecutiveSummarySection } from "../sections/executive-summary-section";
import { buildBusinessOpportunitySection } from "../sections/business-opportunity-section";
import { buildTargetCustomerSection } from "../sections/target-customer-section";
import { buildRevenueModelSection } from "../sections/revenue-model-section";
import { buildGoToMarketStrategySection } from "../sections/go-to-market-strategy-section";
import { buildFirst90DayActionPlanSection } from "../sections/first-90-day-action-plan-section";
import { buildKeyRisksSection } from "../sections/key-risks-section";
import { buildRecommendedFrameworksSection } from "../sections/recommended-frameworks-section";

export interface BusinessPlanBuilderInput {
  opportunityContext: OpportunityContext;
  snapshot: OpportunitySnapshot;
  customerContext: CustomerContext;
  decision: Decision;
  bestMatch: OpportunityMatch | undefined;
}

// Version 1's eight sections, in a fixed, canonical order - not derived,
// so a plan reads the same way every time. Assembly only: every section
// builder already did its own work, this just orders the results. No
// section here reads raw interview answers - every input is an existing
// domain's own context/output (Opportunity, Decision) or a value derived
// from it (bestMatch).
export function buildBusinessPlanSections(input: BusinessPlanBuilderInput): BusinessPlanSection[] {
  const { opportunityContext, snapshot, customerContext, decision, bestMatch } = input;

  return [
    buildExecutiveSummarySection(snapshot, decision),
    buildBusinessOpportunitySection(snapshot),
    buildTargetCustomerSection(customerContext),
    buildRevenueModelSection(opportunityContext, bestMatch, decision.recommendations),
    buildGoToMarketStrategySection(opportunityContext, bestMatch, decision.recommendations),
    buildFirst90DayActionPlanSection(decision.recommendations),
    buildKeyRisksSection(snapshot, bestMatch),
    buildRecommendedFrameworksSection(decision.recommendations, bestMatch),
  ];
}
