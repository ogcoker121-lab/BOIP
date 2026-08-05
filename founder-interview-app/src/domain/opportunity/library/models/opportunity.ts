import { NextMoveType } from "@/src/domain/shared";

export type OpportunityKind = "business" | "side_hustle";
export type OpportunityRisk = "Low" | "Medium" | "High";
export type OpportunityCapitalBand = "Very low" | "Low" | "Medium" | "High";
export type OpportunityTimeToRevenue = "Fast (under 1 month)" | "Moderate (1-3 months)" | "Slow (3+ months)";

// A curated opportunity as a first-class object, not a static page.
// OPP-xxx ids are permanent (same convention as REC-xxx and FW-xxx) so
// future capabilities - scoring, reports, the knowledge graph, search
// results - can reference the same object rather than each holding their
// own copy of "what this opportunity is".
//
// The attribute fields below (suitableFor, risk, capitalRequired, skills,
// minWeeklyHours) ARE the recommendation rules - matching/scoring reads
// these directly rather than a separate parallel rules list, so there is
// exactly one place an opportunity's eligibility criteria can drift.
export interface Opportunity {
  id: string;
  title: string;
  description: string;
  kind: OpportunityKind;
  industry: string;
  suitableFor: NextMoveType[];
  risk: OpportunityRisk;
  capitalRequired: OpportunityCapitalBand;
  minCapitalGBP: number;
  minWeeklyHours: number;
  skills: string[];
  revenueModel: string;
  timeToRevenue: OpportunityTimeToRevenue;
  mainLimitation: string;
  firstAction: string;
  frameworkReferences: string[];
  // Which plan template v0.6 should render for this opportunity.
  planTemplate: "business" | "side_hustle";
}
