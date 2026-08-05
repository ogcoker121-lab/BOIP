import { InterviewAnswers } from "@/types/interview";
import { buildOpportunityContext, matchOpportunities, OpportunityMatch } from "@/src/domain/opportunity";
import { NextMoveType } from "@/src/domain/shared";
import { buildRouteContext, RouteContext } from "../models/route-context";
import { decideRoute } from "../engine/route-decision-engine";

export interface NextMove {
  nextMoveType: NextMoveType;
  title: string;
  description: string;
  primaryActionLabel: string;
  primaryActionRoute: string;
  secondaryActionLabel?: string;
  secondaryActionRoute?: string;
}

export interface OpportunityDiscoveryResult {
  nextMove: NextMove;
  matches: OpportunityMatch[];
  routeContext: RouteContext;
}

function buildNextMove(nextMoveType: NextMoveType, bestMatch: OpportunityMatch | undefined): NextMove {
  switch (nextMoveType) {
    case "business_plan": {
      const opportunity = bestMatch?.opportunity;
      return {
        nextMoveType,
        title: opportunity ? `Build your ${opportunity.title} Plan` : "Build your business plan",
        description: opportunity
          ? `${bestMatch?.whyItFits ?? ""}`
          : "Your profile supports starting a business - the next step is turning that into a concrete plan.",
        primaryActionLabel: "Create My Business Plan",
        primaryActionRoute: opportunity ? `/business-plan/${opportunity.id}` : "/business-plan",
      };
    }
    case "side_hustle": {
      const opportunity = bestMatch?.opportunity;
      return {
        nextMoveType,
        title: opportunity ? `Start a ${opportunity.title}` : "Start a side hustle",
        description: opportunity
          ? `${bestMatch?.whyItFits ?? ""}`
          : "Your profile supports testing an idea alongside your current work.",
        primaryActionLabel: "View My Side-Hustle Launch Plan",
        primaryActionRoute: opportunity ? `/side-hustle/${opportunity.id}` : "/side-hustle",
      };
    }
    case "hybrid_path": {
      const opportunity = bestMatch?.opportunity;
      return {
        nextMoveType,
        title: opportunity ? `Secure income and test a ${opportunity.title} part-time` : "Secure income while you test an idea part-time",
        description:
          "Keeping stable income while testing a business idea part-time is the lower-risk way to find out if it's worth pursuing further.",
        primaryActionLabel: "Build My Side-Hustle Plan",
        primaryActionRoute: opportunity ? `/side-hustle/${opportunity.id}` : "/side-hustle",
        secondaryActionLabel: "View Matching Jobs",
        secondaryActionRoute: "/jobs",
      };
    }
    case "skill_path":
      return {
        nextMoveType,
        title: "Build the skill that unlocks your best options",
        description:
          "Your profile doesn't yet show experience matching your strongest opportunities. Building one focused skill would open up significantly better options than starting from here.",
        primaryActionLabel: "See Skill-Building Options",
        primaryActionRoute: "/skills",
      };
    case "job_search":
    default:
      return {
        nextMoveType: "job_search",
        title: "Explore job and career options",
        description: "Right now, dependable income is the priority - the next step is finding roles that fit your profile.",
        primaryActionLabel: "View Matching Jobs",
        primaryActionRoute: "/jobs",
      };
  }
}

// Interview -> Opportunity -> Route Decision -> Opportunity Matching ->
// Next Move -> UI. Pure, UI-independent. Reuses buildOpportunityContext()
// so this reads the interview identically to every other domain.
export function buildOpportunityDiscovery(answers: InterviewAnswers): OpportunityDiscoveryResult {
  const opportunityContext = buildOpportunityContext(answers);
  const routeContext = buildRouteContext(answers, opportunityContext);
  const decidedRoute = decideRoute(routeContext);

  const matchResult = matchOpportunities(routeContext, decidedRoute, opportunityContext.industry);

  // Applied after matching, not during route decision, because it depends
  // on match quality: a clear skills gap against the opportunities that
  // fit the decided route. Never overrides an explicit "find a job"
  // preference - that's still the founder's stated choice.
  const shouldRedirectToSkillPath =
    matchResult.hasSkillGap && decidedRoute !== "job_search" && routeContext.preferredPath !== "job";

  const nextMoveType: NextMoveType = shouldRedirectToSkillPath ? "skill_path" : decidedRoute;
  const matches = shouldRedirectToSkillPath ? [] : matchResult.matches;
  const bestMatch = matches.find((match) => match.matchLabel === "Best Match");

  return {
    nextMove: buildNextMove(nextMoveType, bestMatch),
    matches,
    routeContext,
  };
}
