import { Rule } from "@/src/domain/shared";
import { OpportunityContext } from "../context";

export const customerValidationStrengths: Rule<OpportunityContext, string>[] = [
  { id: "RULE-024", when: { hasCustomer: true }, then: ["Customer clearly identified"] },
  { id: "RULE-025", when: { hasProblem: true }, then: ["Problem clearly defined"] },
  { id: "RULE-026", when: { hasMarketSignal: true }, then: ["Early market signal identified"] },
];

export const customerValidationWatchItems: Rule<OpportunityContext, string>[] = [
  { id: "RULE-027", when: { hasMarketSignal: false }, then: ["Market signal not yet validated"] },
];

// Not driven by any interview answer today - the interview never asks
// about competitors or market sizing, so these are always relevant until
// it does.
export const alwaysWatchItems: string[] = ["Market size not yet estimated", "Competitive differentiation not yet defined"];
