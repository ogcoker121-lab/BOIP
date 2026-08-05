import { Opportunity } from "../models/opportunity";

export type MatchLabel = "Best Match" | "Strong Alternative" | "Different Direction";

// The match score is a profile-fit score, not a prediction of success.
export interface OpportunityMatch {
  opportunity: Opportunity;
  matchScore: number;
  matchLabel: MatchLabel;
  whyItFits: string;
  relevantSkills: string[];
  budgetFit: string;
  timeToRevenueFit: string;
  mainLimitation: string;
  firstAction: string;
}

export interface OpportunityMatchResult {
  matches: OpportunityMatch[];
  // True when even the best-scoring eligible opportunity had no founder
  // skill overlap at all - the signal route-decision uses to reclassify
  // as skill_path after matching (see route-decision-mapper usage in
  // next-move-mapper.ts).
  hasSkillGap: boolean;
}
