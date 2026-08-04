import { Rule } from "../rule-engine";
import { OpportunityContext } from "../context";

export const customerValidationStrengths: Rule<OpportunityContext, string>[] = [
  { when: { hasCustomer: true }, then: ["Customer clearly identified"] },
  { when: { hasProblem: true }, then: ["Problem clearly defined"] },
  { when: { hasMarketSignal: true }, then: ["Early market signal identified"] },
];

export const customerValidationWatchItems: Rule<OpportunityContext, string>[] = [
  { when: { hasMarketSignal: false }, then: ["Market signal not yet validated"] },
];

// Not driven by any interview answer today - the interview never asks
// about competitors or market sizing, so these are always relevant until
// it does.
export const alwaysWatchItems: string[] = ["Market size not yet estimated", "Competitive differentiation not yet defined"];
