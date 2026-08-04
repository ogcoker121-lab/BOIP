import { Rule } from "../rule-engine";
import { OpportunityContext } from "../context";

// Deterministic BOIP rules - data, not code. Add a row to change behavior;
// the mapper and rule engine never need to change.
export const businessStageNextSteps: Rule<OpportunityContext, string>[] = [
  {
    when: { businessStage: "Just an idea" },
    then: [
      "Conduct customer discovery interviews",
      "Validate the problem with target users",
      "Create a low-fidelity MVP",
    ],
  },
  {
    when: { businessStage: "Validating the problem" },
    then: [
      "Interview at least 20 target customers",
      "Test willingness to pay before building",
      "Define the smallest viable version of your product",
    ],
  },
  {
    when: { businessStage: "Building an MVP or early product" },
    then: [
      "Get the MVP in front of real users",
      "Track early usage and feedback",
      "Validate pricing with your first customers",
    ],
  },
  {
    when: { businessStage: "Pre-revenue but ready to launch" },
    then: ["Run a soft launch with a small customer group", "Finalise your pricing", "Set up a simple way to track revenue"],
  },
  {
    when: { businessStage: "Early revenue" },
    then: [
      "Double down on what's already converting",
      "Ask paying customers why they bought",
      "Look for a repeatable acquisition channel",
    ],
  },
  {
    when: { businessStage: "Established and growing" },
    then: ["Identify your highest-leverage growth channel", "Build out your team's capacity", "Revisit your business model for scale"],
  },
];
