import { OpportunitySnapshot } from "@/src/domain/opportunity";
import { renderBusinessOpportunity } from "../templates/business-opportunity-template";
import { BusinessPlanSection } from "../models/business-plan";

export function buildBusinessOpportunitySection(snapshot: OpportunitySnapshot): BusinessPlanSection {
  const content = renderBusinessOpportunity({
    stage: snapshot.overview.stage,
    industry: snapshot.overview.industry,
    customer: snapshot.overview.customer,
    revenueModel: snapshot.overview.revenueModel,
    marketType: snapshot.overview.marketType,
    strengths: snapshot.strengths,
  });

  return {
    id: "business-opportunity",
    title: "Business Opportunity",
    content,
    recommendedFrameworks: [],
  };
}
