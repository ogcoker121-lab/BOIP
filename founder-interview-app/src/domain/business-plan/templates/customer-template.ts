import { sentence } from "./text-helpers";

export interface CustomerInput {
  customer: string;
  problem: string;
  marketSignal: string;
}

export function renderCustomer(input: CustomerInput): string[] {
  const lines: string[] = [];
  if (input.customer) lines.push(sentence(`Your customer: ${input.customer}`));
  if (input.problem) lines.push(sentence(`The problem they experience: ${input.problem}`));
  lines.push(input.marketSignal ? sentence(`Market signal: ${input.marketSignal}`) : "Market signal: not yet validated.");
  return lines;
}
