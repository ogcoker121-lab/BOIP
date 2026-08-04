import { InterviewAnswers } from "@/types/interview";
import { evaluateRules } from "./rule-engine";
import { OpportunityContext } from "./context";
import { OpportunitySnapshot } from "./snapshot-model";
import { businessStageNextSteps } from "./rules/business-stage";
import { revenueModelNextSteps } from "./rules/revenue-model";
import { alwaysWatchItems, customerValidationStrengths, customerValidationWatchItems } from "./rules/customer-validation";
import { pricingWatchItems } from "./rules/pricing";

// Interview -> Interview Service -> Opportunity Mapper -> Rule Engine ->
// Snapshot Model -> UI. This file is the mapper: it turns raw interview
// answers into an OpportunityContext, hands that to the rule engine against
// each topic's rules, and assembles the result into an OpportunitySnapshot.
// Pure, no UI or network dependency - callable from a page (as it is today)
// or a server route later without changing anything here.

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

function buildContext(answers: InterviewAnswers): OpportunityContext {
  return {
    businessStage: clean(answers["business-stage"]),
    industry: clean(answers["industry"]),
    revenueModel: clean(answers["revenue-model"]),
    marketType: clean(answers["market-type"]),
    hasCustomer: Boolean(answers["who-affected"]?.trim()),
    hasProblem: Boolean(answers["problem-solved"]?.trim()),
    hasMarketSignal: Boolean(answers["market-signal"]?.trim()),
  };
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
  const context = buildContext(answers);

  const strengths = evaluateRules(customerValidationStrengths, context);

  const watchList = [
    ...evaluateRules(customerValidationWatchItems, context),
    ...evaluateRules(pricingWatchItems, context),
    ...alwaysWatchItems,
  ];

  const nextSteps = [...evaluateRules(businessStageNextSteps, context), ...evaluateRules(revenueModelNextSteps, context)];

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
    nextSteps: dedupe(nextSteps),
  };
}
