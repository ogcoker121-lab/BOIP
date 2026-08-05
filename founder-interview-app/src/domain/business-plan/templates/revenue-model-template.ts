import { sentence } from "./text-helpers";

export interface RevenueModelInput {
  revenueModel: string;
  budgetFit?: string;
}

export function renderRevenueModel(input: RevenueModelInput): string[] {
  const lines: string[] = [];
  lines.push(
    input.revenueModel && input.revenueModel !== "Not sure yet"
      ? sentence(`Your primary revenue model is ${input.revenueModel.toLowerCase()}`)
      : "Your revenue model isn't decided yet.",
  );
  if (input.budgetFit) lines.push(sentence(input.budgetFit));
  return lines;
}
