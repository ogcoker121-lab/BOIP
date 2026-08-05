import { Rule } from "@/src/domain/shared/rule-engine";
import { OpportunityContext } from "@/src/domain/opportunity/context";
import { Recommendation } from "../models/recommendation";

// Deterministic BOIP knowledge - data, not code. IDs are permanent once
// assigned: never renumbered, never reused. Add a new row with the next
// available REC-xxx id to change behavior.
export const customerDiscoveryRecommendations: Rule<OpportunityContext, Recommendation>[] = [
  {
    id: "RULE-016",
    when: { businessStage: "Just an idea" },
    then: [
      {
        id: "REC-001",
        title: "Conduct Customer Discovery",
        description: "Talk directly to the people who experience this problem before building anything.",
        reason:
          "You're at the idea stage - the fastest way to reduce risk is validating the problem with real people before investing time or money.",
        priority: "Critical",
        estimatedEffort: "Medium",
        estimatedImpact: "High",
        category: "Customer Discovery",
        actions: [
          "Interview 20 potential customers",
          "Document recurring pain points",
          "Validate willingness to pay",
        ],
        frameworkReferences: ["FW-005"],
      },
    ],
  },
  {
    id: "RULE-017",
    when: { businessStage: "Validating the problem" },
    then: [
      {
        id: "REC-002",
        title: "Expand Customer Discovery",
        description: "Deepen validation with a larger, more structured sample of target customers.",
        reason: "You've started validating - now's the time to get a statistically meaningful signal before committing to a build.",
        priority: "High",
        estimatedEffort: "Medium",
        estimatedImpact: "High",
        category: "Customer Discovery",
        actions: [
          "Interview at least 20 target customers",
          "Segment findings by customer type",
          "Identify your strongest early-adopter segment",
        ],
        frameworkReferences: ["FW-005"],
      },
    ],
  },
];
