import { InterviewAnswers } from "@/types/interview";
import { OpportunitySnapshot } from "@/types/opportunity";
import {
  alwaysWatchItems,
  matchesCondition,
  nextStepRules,
  strengthRules,
  watchListPresenceRules,
  watchListValueRules,
} from "./rules";

// Pure and UI-independent: same answers always produce the same snapshot.
// No AI, no network calls - just this interview's answers plus the rules
// in ./rules.ts. Callable from a page (as today) or, later, a server route
// without any change here.

const STAGE_PHRASES: Record<string, string> = {
  "Just an idea": "at the idea stage",
  "Validating the problem": "validating the problem",
  "Building an MVP or early product": "building an MVP or early product",
  "Pre-revenue but ready to launch": "pre-revenue but ready to launch",
  "Early revenue": "generating early revenue",
  "Established and growing": "established and growing",
};

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items));
}

function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\.$/, "");
}

function buildFounderSummary(answers: InterviewAnswers): string[] {
  const industry = clean(answers["industry"]);
  const customer = clean(answers["who-affected"]);
  const businessStage = clean(answers["business-stage"]);
  const revenueModel = clean(answers["revenue-model"]);
  const problemSolved = clean(answers["problem-solved"]);

  const sentences: string[] = [];

  if (industry && customer) {
    const customerClause = `${customer.charAt(0).toLowerCase()}${customer.slice(1)}`;
    sentences.push(`You're building in the ${industry} space, focused on ${customerClause}.`);
  }

  const stagePhrase = STAGE_PHRASES[businessStage];
  if (stagePhrase) {
    sentences.push(`You are currently ${stagePhrase}.`);
  }

  if (revenueModel) {
    sentences.push(
      revenueModel === "Not sure yet"
        ? "Your revenue model isn't decided yet."
        : `Your primary revenue model is ${revenueModel.toLowerCase()}.`,
    );
  }

  if (problemSolved) {
    sentences.push(`The problem you're solving: ${problemSolved}.`);
  }

  return sentences;
}

export function buildOpportunitySnapshot(answers: InterviewAnswers): OpportunitySnapshot {
  const businessStage = clean(answers["business-stage"]);
  const revenueModel = clean(answers["revenue-model"]);
  const conditionValues = { businessStage, revenueModel };

  const strengths = strengthRules
    .filter((rule) => Boolean(answers[rule.questionId]?.trim()) === rule.whenAnswered)
    .map((rule) => rule.label);

  const presenceWatchItems = watchListPresenceRules
    .filter((rule) => Boolean(answers[rule.questionId]?.trim()) === rule.whenAnswered)
    .map((rule) => rule.label);

  const valueWatchItems = watchListValueRules
    .filter((rule) => matchesCondition(rule.when, conditionValues))
    .map((rule) => rule.label);

  const nextSteps = nextStepRules
    .filter((rule) => matchesCondition(rule.when, conditionValues))
    .flatMap((rule) => rule.recommend);

  return {
    founderSummary: buildFounderSummary(answers),
    overview: {
      stage: businessStage || "Not specified",
      industry: clean(answers["industry"]) || "Not specified",
      customer: clean(answers["who-affected"]) || "Not specified",
      revenueModel: revenueModel || "Not specified",
    },
    strengths: dedupe(strengths),
    watchList: dedupe([...presenceWatchItems, ...valueWatchItems, ...alwaysWatchItems]),
    nextSteps: dedupe(nextSteps),
  };
}
