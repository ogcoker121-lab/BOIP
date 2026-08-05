import { NextMoveType } from "@/src/domain/shared/next-move-type";
import { RouteContext } from "@/src/domain/route-decision/models/route-context";
import { Opportunity, OpportunityCapitalBand } from "../models/opportunity";
import { opportunityLibrary } from "../catalog";
import { OpportunityMatch, OpportunityMatchResult } from "./opportunity-match";

// Deterministic profile-fit scoring, 0-100. Not a prediction of success -
// just how well the founder's stated profile lines up with what the
// opportunity requires. Weights: skills 40, capital 20, time 20, risk 10,
// stated industry 10.

const CAPITAL_ORDINAL: Record<OpportunityCapitalBand, number> = { "Very low": 0, Low: 1, Medium: 2, High: 3 };
const FOUNDER_CAPITAL_ORDINAL: Record<RouteContext["capitalBand"], number> = { very_low: 0, low: 1, medium: 2, high: 3 };
const RISK_ORDINAL: Record<Opportunity["risk"], number> = { Low: 0, Medium: 1, High: 2 };
const FOUNDER_RISK_ORDINAL: Record<RouteContext["riskBand"], number> = { low: 0, moderate: 1, high: 2 };
// Representative weekly-hours midpoint for each founder time band.
const FOUNDER_HOURS_ESTIMATE: Record<RouteContext["timeBand"], number> = { low: 4, medium: 15, high: 30 };

function scoreSkills(founderSkills: string[], opportunitySkills: string[]): { points: number; overlap: string[] } {
  const overlap = founderSkills.filter((skill) => opportunitySkills.includes(skill));
  return { points: Math.min(40, overlap.length * 20), overlap };
}

function scoreCapital(founderBand: RouteContext["capitalBand"], required: OpportunityCapitalBand): number {
  const deficit = CAPITAL_ORDINAL[required] - FOUNDER_CAPITAL_ORDINAL[founderBand];
  return Math.max(0, 20 - Math.max(0, deficit) * 10);
}

function scoreTime(founderBand: RouteContext["timeBand"], minWeeklyHours: number): number {
  const estimate = FOUNDER_HOURS_ESTIMATE[founderBand];
  if (estimate >= minWeeklyHours) return 20;
  return Math.max(0, Math.round((estimate / minWeeklyHours) * 20));
}

function scoreRisk(founderBand: RouteContext["riskBand"], opportunityRisk: Opportunity["risk"]): number {
  const diff = Math.abs(FOUNDER_RISK_ORDINAL[founderBand] - RISK_ORDINAL[opportunityRisk]);
  return Math.max(0, 10 - diff * 5);
}

function budgetFitLabel(founderBand: RouteContext["capitalBand"], required: OpportunityCapitalBand): string {
  const deficit = CAPITAL_ORDINAL[required] - FOUNDER_CAPITAL_ORDINAL[founderBand];
  if (deficit <= 0) return "Comfortably within your stated budget.";
  if (deficit === 1) return "Close to your stated budget - may require careful planning.";
  return "Requires more capital than you currently indicated.";
}

function buildWhyItFits(overlap: string[], budgetFit: string, timeScore: number): string {
  const parts: string[] = [];
  if (overlap.length > 0) {
    parts.push(`Your ${overlap.join(" and ")} skills line up directly with this route.`);
  } else {
    parts.push("This route doesn't draw on your strongest listed skills, but the rest of your profile still supports it.");
  }
  parts.push(budgetFit);
  parts.push(timeScore >= 20 ? "Your available time comfortably covers what this typically needs." : "You'll need to protect more time than you currently have available.");
  return parts.join(" ");
}

function scoreOpportunity(opportunity: Opportunity, context: RouteContext, industry: string): OpportunityMatch {
  const { points: skillPoints, overlap } = scoreSkills(context.skills, opportunity.skills);
  const capitalPoints = scoreCapital(context.capitalBand, opportunity.capitalRequired);
  const timePoints = scoreTime(context.timeBand, opportunity.minWeeklyHours);
  const riskPoints = scoreRisk(context.riskBand, opportunity.risk);
  const industryBonus = industry && industry === opportunity.industry ? 10 : 0;

  const budgetFit = budgetFitLabel(context.capitalBand, opportunity.capitalRequired);

  return {
    opportunity,
    matchScore: skillPoints + capitalPoints + timePoints + riskPoints + industryBonus,
    matchLabel: "Best Match", // reassigned by selectTopThree
    whyItFits: buildWhyItFits(overlap, budgetFit, timePoints),
    relevantSkills: overlap,
    budgetFit,
    timeToRevenueFit: opportunity.timeToRevenue,
    mainLimitation: opportunity.mainLimitation,
    firstAction: opportunity.firstAction,
  };
}

// Best Match: highest score. Strong Alternative: highest remaining score
// from a different industry when one exists, otherwise just the next
// highest. Different Direction: highest remaining score not sharing an
// industry with either pick already made, otherwise the next highest
// remaining - credible variety where the library supports it, a graceful
// fallback when it doesn't.
function selectTopThree(scored: OpportunityMatch[]): OpportunityMatch[] {
  const sorted = [...scored].sort((a, b) => b.matchScore - a.matchScore);
  if (sorted.length === 0) return [];

  const picks: OpportunityMatch[] = [{ ...sorted[0], matchLabel: "Best Match" }];
  const usedIndustries = new Set([sorted[0].opportunity.industry]);

  const remainingAfterFirst = sorted.slice(1);
  const altIndex = remainingAfterFirst.findIndex((match) => !usedIndustries.has(match.opportunity.industry));
  const alt = remainingAfterFirst[altIndex !== -1 ? altIndex : 0];
  if (alt) {
    picks.push({ ...alt, matchLabel: "Strong Alternative" });
    usedIndustries.add(alt.opportunity.industry);
  }

  const remainingAfterSecond = remainingAfterFirst.filter((match) => match.opportunity.id !== alt?.opportunity.id);
  const diffIndex = remainingAfterSecond.findIndex((match) => !usedIndustries.has(match.opportunity.industry));
  const diff = remainingAfterSecond[diffIndex !== -1 ? diffIndex : 0];
  if (diff) {
    picks.push({ ...diff, matchLabel: "Different Direction" });
  }

  return picks;
}

export function matchOpportunities(context: RouteContext, nextMoveType: NextMoveType, industry: string): OpportunityMatchResult {
  if (nextMoveType !== "business_plan" && nextMoveType !== "side_hustle" && nextMoveType !== "hybrid_path") {
    return { matches: [], hasSkillGap: false };
  }

  const eligible = opportunityLibrary.filter((opportunity) => opportunity.suitableFor.includes(nextMoveType));
  const scored = eligible.map((opportunity) => scoreOpportunity(opportunity, context, industry));
  const matches = selectTopThree(scored);
  const hasSkillGap = matches.length > 0 && matches[0].relevantSkills.length === 0;

  return { matches, hasSkillGap };
}
