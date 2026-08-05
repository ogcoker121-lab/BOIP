import { Rule } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "../context";

export const pricingWatchItems: Rule<OpportunityContext, string>[] = [
  { id: "RULE-028", when: { revenueModel: "Not sure yet" }, then: ["Pricing not yet validated with customers"] },
];
