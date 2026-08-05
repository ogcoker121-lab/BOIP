// The public surface of src/domain/opportunity/.
export type { OpportunityContext } from "./context";
export { buildOpportunityContext } from "./context";
export type { CustomerContext } from "./customer-context";
export { buildCustomerContext } from "./customer-context";
export type { OpportunitySnapshot, OpportunityOverview } from "./snapshot-model";
export { buildOpportunitySnapshot } from "./opportunity-mapper";
export type {
  Opportunity,
  OpportunityKind,
  OpportunityRisk,
  OpportunityCapitalBand,
  OpportunityTimeToRevenue,
} from "./library/models/opportunity";
export { opportunityLibrary, getOpportunityById } from "./library/catalog";
export type { OpportunityMatch, OpportunityMatchResult, MatchLabel } from "./library/matching/opportunity-match";
export { matchOpportunities } from "./library/matching/opportunity-matcher";

// Raw knowledge - intentionally exposed here for domains that trace or
// catalog evaluation itself (decision/, catalog/), not for recomputing a
// snapshot. Everyone else should use buildOpportunitySnapshot().
export { customerValidationStrengths, customerValidationWatchItems, alwaysWatchItems } from "./knowledge/customer-validation";
export { pricingWatchItems } from "./knowledge/pricing";
