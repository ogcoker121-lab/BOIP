import { Rule } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import { Recommendation } from "../models/recommendation";

export const competitionRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  // An empty `when` always matches (the engine's matches() is vacuously
  // true over zero keys) - correct here, since the interview never asks
  // about competitors at all, so this is always relevant today.
  {
    when: {},
    then: [
      {
        id: "REC-006",
        title: "Map the Competitive Landscape",
        description: "Identify who else is solving this problem and how you're different.",
        reason:
          "Competitive differentiation hasn't been defined - founders who skip this often struggle to explain why customers should choose them.",
        priority: "Medium",
        estimatedEffort: "Small",
        estimatedImpact: "Medium",
        category: "Competition",
        actions: [
          "List three to five direct or indirect competitors",
          "Identify what they do well and poorly",
          "Write one sentence on why you're different",
        ],
        frameworkReferences: ["FW-007"],
      },
    ],
  },
];
