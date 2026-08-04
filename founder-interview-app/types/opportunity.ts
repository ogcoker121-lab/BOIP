export interface OpportunityOverview {
  stage: string;
  industry: string;
  customer: string;
  revenueModel: string;
}

export interface OpportunitySnapshot {
  founderSummary: string[];
  overview: OpportunityOverview;
  strengths: string[];
  watchList: string[];
  nextSteps: string[];
}
