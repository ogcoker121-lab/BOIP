export interface OpportunityOverview {
  stage: string;
  industry: string;
  customer: string;
  revenueModel: string;
  marketType: string;
}

// "What should I do next" now lives entirely in the recommendation domain
// (src/domain/recommendation/) - see buildRecommendations(). The snapshot
// describes the opportunity; it doesn't prescribe actions.
export interface OpportunitySnapshot {
  founderSummary: string[];
  overview: OpportunityOverview;
  strengths: string[];
  watchList: string[];
}
