import { Rule } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import { Recommendation } from "../models/recommendation";

export const businessModelRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  {
    when: { revenueModel: "Not sure yet" },
    then: [
      {
        id: "REC-003",
        title: "Define Your Business Model",
        description: "Work through a structured business model exercise before finalising your offer.",
        reason:
          "Your revenue model isn't decided yet - it's foundational to almost every other decision, including pricing, marketing, and MVP scope.",
        priority: "Critical",
        estimatedEffort: "Small",
        estimatedImpact: "High",
        category: "Business Model",
        actions: [
          "Complete a Business Model Canvas",
          "List three comparable businesses and how they charge",
          "Choose one revenue model to test first",
        ],
        frameworkReferences: ["FW-011"],
      },
    ],
  },
];
