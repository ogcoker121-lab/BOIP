import { Rule } from "../rule-engine";
import { OpportunityContext } from "../context";

export const pricingWatchItems: Rule<OpportunityContext, string>[] = [
  { when: { revenueModel: "Not sure yet" }, then: ["Pricing not yet validated with customers"] },
];
