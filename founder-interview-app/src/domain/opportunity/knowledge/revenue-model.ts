import { Rule } from "../rule-engine";
import { OpportunityContext } from "../context";

export const revenueModelNextSteps: Rule<OpportunityContext, string>[] = [
  {
    when: { revenueModel: "Not sure yet" },
    then: ["Work through the Business Model Canvas", "Research how comparable businesses charge"],
  },
];
