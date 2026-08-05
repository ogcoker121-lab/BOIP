import { InterviewAnswers } from "@/types/interview";
import { evaluateRules } from "@/src/domain/shared";
import { OpportunityContext, buildOpportunityContext } from "./context";
import { OpportunitySnapshot } from "./snapshot-model";
import { alwaysWatchItems, customerValidationStrengths, customerValidationWatchItems } from "./knowledge/customer-validation";
import { pricingWatchItems } from "./knowledge/pricing";

// Interview -> Interview Service -> Opportunity Mapper -> Rule Engine ->
// Snapshot Model -> UI. This file is the mapper: it turns raw interview
// answers into an OpportunityContext, hands that to the rule engine against
// each topic's knowledge, and assembles the result into an
// OpportunitySnapshot. Pure, no UI or network dependency - callable from a
// page (as it is today) or a server route later without changing anything
// here. Doesn't cover "what to do next" - see the recommendation domain.

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

function buildFounderSummary(answers: InterviewAnswers, context: OpportunityContext): string[] {
  const customer = clean(answers["who-affected"]);
  const problemSolved = clean(answers["problem-solved"]);
  const sentences: string[] = [];

  if (context.industry && customer) {
    const customerClause = `${customer.charAt(0).toLowerCase()}${customer.slice(1)}`;
    sentences.push(`You're building in the ${context.industry} space, focused on ${customerClause}.`);
  }

  const stagePhrase = STAGE_PHRASES[context.businessStage];
  if (stagePhrase) {
    sentences.push(`You are currently ${stagePhrase}.`);
  }

  if (context.revenueModel) {
    sentences.push(
      context.revenueModel === "Not sure yet"
        ? "Your revenue model isn't decided yet."
        : `Your primary revenue model is ${context.revenueModel.toLowerCase()}.`,
    );
  }

  if (problemSolved) {
    sentences.push(`The problem you're solving: ${problemSolved}.`);
  }

  return sentences;
}

export function buildOpportunitySnapshot(answers: InterviewAnswers): OpportunitySnapshot {
  const context = buildOpportunityContext(answers);

  const strengths = evaluateRules(customerValidationStrengths, context);

  const watchList = [
    ...evaluateRules(customerValidationWatchItems, context),
    ...evaluateRules(pricingWatchItems, context),
    ...alwaysWatchItems,
  ];

  return {
    founderSummary: buildFounderSummary(answers, context),
    overview: {
      stage: context.businessStage || "Not specified",
      industry: context.industry || "Not specified",
      customer: clean(answers["who-affected"]) || "Not specified",
      revenueModel: context.revenueModel || "Not specified",
      marketType: context.marketType || "Not specified",
    },
    strengths: dedupe(strengths),
    watchList: dedupe(watchList),
  };
}
