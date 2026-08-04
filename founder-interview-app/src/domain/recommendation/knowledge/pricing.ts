import { Rule } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import { Recommendation } from "../models/recommendation";

export const pricingRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  {
    when: { revenueModel: "Not sure yet" },
    then: [
      {
        id: "REC-005",
        title: "Research Pricing",
        description: "Investigate what comparable businesses charge and test willingness to pay.",
        reason: "Pricing hasn't been validated with anyone yet, and it directly affects viability.",
        priority: "Medium",
        estimatedEffort: "Small",
        estimatedImpact: "Medium",
        category: "Pricing",
        actions: [
          "Research pricing of three to five comparable products",
          "Ask prospective customers what they'd expect to pay",
          "Set an initial price to test, not a final one",
        ],
        frameworkReferences: ["FW-013"],
      },
    ],
  },
];
