import { Opportunity } from "../models/opportunity";
import { businessOpportunities } from "./businesses";
import { sideHustleOpportunities } from "./side-hustles";

// The Starter Opportunity Library: curated BOIP knowledge, not live market
// listings - labelled as such wherever it's shown to a founder. Extend by
// adding entries here (or a new catalog file), never by hard-coding an
// opportunity name into the matching engine or UI.
export const opportunityLibrary: Opportunity[] = [...businessOpportunities, ...sideHustleOpportunities];

export function getOpportunityById(id: string): Opportunity | null {
  return opportunityLibrary.find((opportunity) => opportunity.id === id) ?? null;
}
