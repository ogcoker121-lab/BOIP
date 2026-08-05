// Every sentence here already existed elsewhere - founderSummary from
// the Opportunity Snapshot (v0.3), the explanation from the Decision
// Engine (v0.6). This template only assembles them into one section; it
// never writes new prose.
export interface ExecutiveSummaryInput {
  founderSummary: string[];
  explanationHeadline: string;
  explanationBullets: string[];
}

export function renderExecutiveSummary(input: ExecutiveSummaryInput): string[] {
  const paragraphs = [...input.founderSummary];
  if (input.explanationHeadline && input.explanationBullets.length > 0) {
    paragraphs.push(`${input.explanationHeadline} ${input.explanationBullets.join(" ")}`);
  }
  return paragraphs.filter(Boolean);
}
