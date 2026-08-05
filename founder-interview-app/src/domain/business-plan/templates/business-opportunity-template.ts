// Every field here comes straight from the Opportunity Snapshot's own
// overview/strengths (v0.3) - this template only labels and lists them.
export interface BusinessOpportunityInput {
  stage: string;
  industry: string;
  customer: string;
  revenueModel: string;
  marketType: string;
  strengths: string[];
}

export function renderBusinessOpportunity(input: BusinessOpportunityInput): string[] {
  const facts = [
    `Stage: ${input.stage}`,
    `Industry: ${input.industry}`,
    `Customer: ${input.customer}`,
    `Revenue model: ${input.revenueModel}`,
    `Market type: ${input.marketType}`,
  ];
  const strengthLines = input.strengths.map((strength) => `Strength: ${strength}`);
  return [...facts, ...strengthLines];
}
