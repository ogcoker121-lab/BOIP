import { InterviewAnswers } from "@/types/interview";
import { OpportunityContext } from "@/src/domain/opportunity/context";

export type PreferredPath = "business" | "side_hustle" | "job" | "explore";
export type RiskBand = "low" | "moderate" | "high";
export type UrgencyBand = "immediate" | "soon" | "flexible";
export type CapitalBand = "very_low" | "low" | "medium" | "high";
export type TimeBand = "low" | "medium" | "high";
export type ReadinessBand = "weak" | "moderate" | "strong";
export type EmploymentStatus =
  | "employed_full_time"
  | "employed_part_time"
  | "self_employed"
  | "unemployed"
  | "student"
  | "retired";

// The shape the route-decision knowledge evaluates against - derived,
// normalized bands rather than raw answer strings, so knowledge rows stay
// simple equality checks instead of re-parsing free-form option text.
export interface RouteContext {
  preferredPath: PreferredPath;
  riskBand: RiskBand;
  urgencyBand: UrgencyBand;
  employmentStatus: EmploymentStatus;
  isCurrentlyEmployed: boolean;
  capitalBand: CapitalBand;
  timeBand: TimeBand;
  businessReadiness: ReadinessBand;
  skills: string[];
}

function mapPreferredPath(value: string | undefined): PreferredPath {
  switch (value) {
    case "Start a business":
      return "business";
    case "Build a side hustle":
      return "side_hustle";
    case "Find a better job":
      return "job";
    default:
      return "explore";
  }
}

function mapRiskBand(value: string | undefined): RiskBand {
  if (value === "High" || value === "Very high - I'm comfortable with uncertainty") return "high";
  if (value === "Moderate") return "moderate";
  return "low";
}

function mapUrgencyBand(value: string | undefined): UrgencyBand {
  if (value === "🚨 Immediately") return "immediate";
  if (value === "📅 Within 3 months") return "soon";
  return "flexible";
}

function mapEmploymentStatus(value: string | undefined): EmploymentStatus {
  switch (value) {
    case "Employed full-time":
      return "employed_full_time";
    case "Employed part-time":
      return "employed_part_time";
    case "Self-employed":
      return "self_employed";
    case "Student":
      return "student";
    case "Retired":
      return "retired";
    default:
      return "unemployed";
  }
}

function mapCapitalBand(value: string | undefined): CapitalBand {
  switch (value) {
    case "£1,000 to £5,000":
      return "low";
    case "£5,000 to £15,000":
      return "medium";
    case "£15,000 to £50,000":
    case "More than £50,000":
      return "high";
    default:
      // "Under £1,000" and "Prefer not to say" both default to the most
      // conservative assumption.
      return "very_low";
  }
}

function mapTimeBand(value: string | undefined): TimeBand {
  switch (value) {
    case "10 to 20 hours":
      return "medium";
    case "20 to 35 hours":
    case "Full-time":
      return "high";
    default:
      return "low";
  }
}

const BUSINESS_STAGE_POINTS: Record<string, number> = {
  "Just an idea": 0,
  "Validating the problem": 1,
  "Building an MVP or early product": 2,
  "Pre-revenue but ready to launch": 2,
  "Early revenue": 3,
  "Established and growing": 3,
};

function computeBusinessReadiness(
  capitalBand: CapitalBand,
  timeBand: TimeBand,
  riskBand: RiskBand,
  opportunityContext: OpportunityContext,
): ReadinessBand {
  const capitalPoints = { very_low: 0, low: 1, medium: 2, high: 3 }[capitalBand];
  const timePoints = { low: 0, medium: 1, high: 2 }[timeBand];
  const riskPoints = { low: 0, moderate: 1, high: 2 }[riskBand];
  const stagePoints = BUSINESS_STAGE_POINTS[opportunityContext.businessStage] ?? 0;

  const score = capitalPoints + timePoints + riskPoints + stagePoints;
  if (score >= 6) return "strong";
  if (score >= 3) return "moderate";
  return "weak";
}

export function parseSkills(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export function buildRouteContext(answers: InterviewAnswers, opportunityContext: OpportunityContext): RouteContext {
  const riskBand = mapRiskBand(answers["risk-tolerance"]);
  const capitalBand = mapCapitalBand(answers["capital-available"]);
  const timeBand = mapTimeBand(answers["time-available"]);
  const employmentStatus = mapEmploymentStatus(answers["employment-status"]);

  return {
    preferredPath: mapPreferredPath(answers["preferred-path"]),
    riskBand,
    urgencyBand: mapUrgencyBand(answers["income-urgency"]),
    employmentStatus,
    isCurrentlyEmployed: ["employed_full_time", "employed_part_time", "self_employed"].includes(employmentStatus),
    capitalBand,
    timeBand,
    businessReadiness: computeBusinessReadiness(capitalBand, timeBand, riskBand, opportunityContext),
    skills: parseSkills(answers["professional-skills"]),
  };
}
