import { Rule } from "@/src/domain/shared";
import { OpportunityContext } from "@/src/domain/opportunity";
import { Recommendation } from "../models/recommendation";

export const mvpRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  {
    id: "RULE-022",
    when: { businessStage: "Just an idea" },
    then: [
      {
        id: "REC-007",
        title: "Build a Low-Fidelity MVP",
        description: "Create the simplest possible version to start testing your idea in the real world.",
        reason: "You're still at the idea stage - a lightweight MVP will teach you more than further planning will.",
        priority: "Medium",
        estimatedEffort: "Medium",
        estimatedImpact: "Medium",
        category: "MVP",
        actions: [
          "Define the single core feature to test",
          "Build the simplest version possible - no-code is fine",
          "Get it in front of five people this week",
        ],
        frameworkReferences: ["FW-001"],
      },
    ],
  },
  {
    id: "RULE-023",
    when: { businessStage: "Building an MVP or early product" },
    then: [
      {
        id: "REC-008",
        title: "Get Your MVP in Front of Real Users",
        description: "Ship the smallest usable version and start collecting real feedback.",
        reason: "You're already building - the priority now is real-world usage data, not more features.",
        priority: "Critical",
        estimatedEffort: "Medium",
        estimatedImpact: "High",
        category: "MVP",
        actions: [
          "Ship the MVP to at least ten real users",
          "Set up a simple way to collect feedback",
          "Track one core usage metric",
        ],
        frameworkReferences: ["FW-021"],
      },
    ],
  },
];
