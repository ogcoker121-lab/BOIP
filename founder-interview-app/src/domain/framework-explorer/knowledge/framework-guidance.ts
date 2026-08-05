// Structured knowledge, not AI - the same kind of hand-authored data as
// frameworkRegistry itself (src/domain/framework/registry.ts) or any
// RULE-xxx knowledge row. Adds what the catalog genuinely doesn't carry
// (when to use it, expected outcome, common mistakes) without touching
// or duplicating what it already does (title, description) - the
// resolver combines both, never one instead of the other.
//
// Keyed by the same FW-xxx ids the catalog already assigns - this file
// doesn't mint new identity, it only attaches guidance to identity that
// exists.
export interface FrameworkGuidance {
  whenToUse: string;
  expectedOutcome: string;
  commonMistakes: string[];
}

export const frameworkGuidance: Record<string, FrameworkGuidance> = {
  "FW-001": {
    whenToUse: "Once you have a hypothesis worth testing, not just an idea - before you invest in building anything beyond the minimum needed to learn.",
    expectedOutcome: "A validated (or invalidated) assumption, backed by real user behaviour rather than opinion, at the lowest possible cost.",
    commonMistakes: [
      "Building a polished product before anyone has confirmed the problem is real",
      "Treating the MVP as a smaller final product instead of a learning tool",
      "Ignoring negative signals because of sunk cost in what's already been built",
    ],
  },
  "FW-002": {
    whenToUse: "When you know you want to build something but don't yet have a specific, testable idea.",
    expectedOutcome: "A shortlist of concrete ideas filtered against your actual skills, interests, and constraints - not just a brainstorm.",
    commonMistakes: [
      "Chasing an idea because it's trendy rather than because it fits your strengths",
      "Generating ideas without ever filtering them against real constraints",
      "Stopping at the first idea instead of comparing a shortlist",
    ],
  },
  "FW-003": {
    whenToUse: "Before you've settled on a solution - when the problem itself still needs sharpening.",
    expectedOutcome: "A problem statement grounded in what customers actually experience, not what you assume they experience.",
    commonMistakes: [
      "Jumping to solutions before the problem is fully understood",
      "Designing for an imagined user instead of talking to real ones",
      "Treating empathy work as a one-time step instead of revisiting it as you learn more",
    ],
  },
  "FW-004": {
    whenToUse: "Before committing meaningful time or money to an idea, to confirm the market is large and reachable enough to matter.",
    expectedOutcome: "A realistic view of market size, growth, and how reachable that market actually is for you specifically.",
    commonMistakes: [
      "Using total market size instead of the realistically reachable segment",
      "Assuming growth trends will continue without checking why they're happening",
      "Skipping this and discovering too late that the addressable market is too small",
    ],
  },
  "FW-005": {
    whenToUse: "As early as possible - ideally before writing a single line of code or spending on production.",
    expectedOutcome: "Direct evidence, from real conversations, of whether the problem you're solving is one people actually have and would pay to fix.",
    commonMistakes: [
      "Pitching your solution instead of listening for the problem",
      "Only talking to friends and family, who tend to be too polite to disagree",
      "Treating polite interest as validated demand",
    ],
  },
  "FW-007": {
    whenToUse: "Once you have a defined offer, to understand who else is solving this problem and how you're different.",
    expectedOutcome: "A clear, honest picture of competitors' strengths and gaps, and a specific answer to \"why you, not them\".",
    commonMistakes: [
      "Only looking at direct competitors and missing indirect alternatives (including \"doing nothing\")",
      "Underestimating competitors instead of studying what they do well",
      "Positioning on features instead of on a customer's actual reason to switch",
    ],
  },
  "FW-011": {
    whenToUse: "Once the problem and customer are validated, to pull every part of the business model onto one page before writing a full plan.",
    expectedOutcome: "A single-page view of how the business creates, delivers, and captures value - clear enough to spot gaps before you build around them.",
    commonMistakes: [
      "Filling it in once and never revisiting it as assumptions get tested",
      "Treating it as a pitch document instead of a working, editable model",
      "Leaving the revenue streams or cost structure vague because they feel unresolved",
    ],
  },
  "FW-013": {
    whenToUse: "Once you have an offer worth pricing, before you commit to a number publicly.",
    expectedOutcome: "An initial price to test - grounded in comparable offers and real willingness to pay - rather than a guess.",
    commonMistakes: [
      "Pricing purely on cost instead of on the value delivered",
      "Treating the first price as final instead of as something to test and adjust",
      "Never asking a prospective customer what they'd actually expect to pay",
    ],
  },
  "FW-021": {
    whenToUse: "Once you have real users on the product, to know whether you're iterating toward genuine demand or still guessing.",
    expectedOutcome: "A measurable read on product-market fit - specific usage or retention signals, not a feeling that things are \"going well\".",
    commonMistakes: [
      "Adding features instead of addressing why existing users aren't retaining",
      "Confusing vanity metrics (signups, downloads) with real product-market fit",
      "Declaring fit too early, based on a handful of enthusiastic early adopters",
    ],
  },
};
