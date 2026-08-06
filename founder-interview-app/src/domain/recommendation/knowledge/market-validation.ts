import { Rule } from "@/src/domain/shared";
import { OpportunityContext } from "@/src/domain/opportunity";
import { Recommendation } from "../models/recommendation";

export const marketValidationRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  {
    id: "RULE-019",
    when: { hasMarketSignal: false },
    then: [
      {
        id: "REC-004",
        title: "Validate Market Demand",
        description: "Gather concrete evidence that demand exists before investing further.",
        reason: "No market signal has been captured yet - without it, every other decision is a guess.",
        priority: "High",
        estimatedEffort: "Medium",
        estimatedImpact: "High",
        category: "Market Validation",
        actions: [
          "Run a smoke-test landing page",
          "Post in three relevant communities and gauge response",
          "Track signups or expressions of interest",
        ],
        frameworkReferences: ["FW-004"],
      },
    ],
  },
];
