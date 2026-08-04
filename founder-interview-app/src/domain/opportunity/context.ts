// The shape every Opportunity rule file evaluates against. Built once by
// the mapper from an interview's answers; rule files never see raw answers.
export interface OpportunityContext {
  businessStage: string;
  industry: string;
  revenueModel: string;
  marketType: string;
  hasCustomer: boolean;
  hasProblem: boolean;
  hasMarketSignal: boolean;
}
