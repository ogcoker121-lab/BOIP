import { sentence } from "./text-helpers";

export interface GoToMarketInput {
  marketType: string;
  firstAction?: string;
}

export function renderGoToMarket(input: GoToMarketInput): string[] {
  const lines: string[] = [];
  if (input.marketType) lines.push(sentence(`You're targeting ${input.marketType.toLowerCase()}`));
  if (input.firstAction) lines.push(sentence(`Your first action: ${input.firstAction}`));
  return lines;
}
