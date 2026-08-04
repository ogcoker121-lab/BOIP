// Deterministic BOIP rules - data, not code. No AI, no prompts: every
// founder with the same relevant answers gets the same snapshot. Extend
// this file (add rows) rather than adding branching logic to the mapper.

// Shared condition shape: matches when every key present equals the given
// value. Absent keys are ignored, so a rule can key off just one field.
export interface RuleCondition {
  businessStage?: string;
  revenueModel?: string;
}

export interface NextStepRule {
  when: RuleCondition;
  recommend: string[];
}

export const nextStepRules: NextStepRule[] = [
  {
    when: { businessStage: "Just an idea" },
    recommend: [
      "Conduct customer discovery interviews",
      "Validate the problem with target users",
      "Create a low-fidelity MVP",
    ],
  },
  {
    when: { businessStage: "Validating the problem" },
    recommend: [
      "Interview at least 20 target customers",
      "Test willingness to pay before building",
      "Define the smallest viable version of your product",
    ],
  },
  {
    when: { businessStage: "Building an MVP or early product" },
    recommend: [
      "Get the MVP in front of real users",
      "Track early usage and feedback",
      "Validate pricing with your first customers",
    ],
  },
  {
    when: { businessStage: "Pre-revenue but ready to launch" },
    recommend: [
      "Run a soft launch with a small customer group",
      "Finalise your pricing",
      "Set up a simple way to track revenue",
    ],
  },
  {
    when: { businessStage: "Early revenue" },
    recommend: [
      "Double down on what's already converting",
      "Ask paying customers why they bought",
      "Look for a repeatable acquisition channel",
    ],
  },
  {
    when: { businessStage: "Established and growing" },
    recommend: [
      "Identify your highest-leverage growth channel",
      "Build out your team's capacity",
      "Revisit your business model for scale",
    ],
  },
  {
    when: { revenueModel: "Not sure yet" },
    recommend: ["Work through the Business Model Canvas", "Research how comparable businesses charge"],
  },
];

export interface ValueWatchRule {
  when: RuleCondition;
  label: string;
}

export const watchListValueRules: ValueWatchRule[] = [
  { when: { revenueModel: "Not sure yet" }, label: "Pricing not yet validated with customers" },
];

// Presence-based signals: does answering (or not answering) a given
// question say something about the opportunity? True/false rather than
// text classification, so it's reliable and testable.
export interface PresenceRule {
  questionId: string;
  whenAnswered: boolean;
  label: string;
}

export const strengthRules: PresenceRule[] = [
  { questionId: "who-affected", whenAnswered: true, label: "Customer clearly identified" },
  { questionId: "problem-solved", whenAnswered: true, label: "Problem clearly defined" },
  { questionId: "market-signal", whenAnswered: true, label: "Early market signal identified" },
];

export const watchListPresenceRules: PresenceRule[] = [
  { questionId: "market-signal", whenAnswered: false, label: "Market signal not yet validated" },
];

// Watch list items the interview never asks about at all - always worth
// flagging regardless of what was answered.
export const alwaysWatchItems: string[] = [
  "Market size not yet estimated",
  "Competitive differentiation not yet defined",
];

export function matchesCondition(condition: RuleCondition, values: RuleCondition): boolean {
  return (Object.keys(condition) as (keyof RuleCondition)[]).every((key) => condition[key] === values[key]);
}
