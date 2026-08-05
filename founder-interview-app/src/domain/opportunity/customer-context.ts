import { InterviewAnswers } from "@/types/interview";

function clean(value: string | undefined): string {
  return (value ?? "").trim().replace(/\.$/, "");
}

// A human-readable view of the founder's customer/problem/market-signal
// answers - the same three interview answers OpportunityContext already
// reduces to booleans (hasCustomer/hasProblem/hasMarketSignal, for rule
// matching) but here as text, for anything that needs to say what they
// are, not just whether they exist. Keeps Interview -> Opportunity ->
// [consumer] the shape every consumer follows; nothing downstream of
// the Opportunity domain reads raw interview answers directly.
export interface CustomerContext {
  customer: string;
  problem: string;
  marketSignal: string;
}

export function buildCustomerContext(answers: InterviewAnswers): CustomerContext {
  return {
    customer: clean(answers["who-affected"]),
    problem: clean(answers["problem-solved"]),
    marketSignal: clean(answers["market-signal"]),
  };
}
