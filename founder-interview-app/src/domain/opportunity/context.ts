import { InterviewAnswers } from "@/types/interview";

// The shape every Opportunity (and Recommendation) rule file evaluates
// against. Built once here from an interview's raw answers; rule files
// never see raw answers, only this.
export interface OpportunityContext {
  businessStage: string;
  industry: string;
  revenueModel: string;
  marketType: string;
  hasCustomer: boolean;
  hasProblem: boolean;
  hasMarketSignal: boolean;
}

function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\.$/, "");
}

export function buildOpportunityContext(answers: InterviewAnswers): OpportunityContext {
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
