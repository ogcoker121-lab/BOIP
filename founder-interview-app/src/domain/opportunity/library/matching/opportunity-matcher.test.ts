import { describe, it, expect } from "vitest";
import type { RouteContext } from "@/src/domain/route-decision";
import { matchOpportunities } from "./opportunity-matcher";

function baseContext(overrides: Partial<RouteContext> = {}): RouteContext {
  return {
    preferredPath: "side_hustle",
    riskBand: "moderate",
    urgencyBand: "soon",
    employmentStatus: "employed_full_time",
    isCurrentlyEmployed: true,
    capitalBand: "low",
    timeBand: "medium",
    businessReadiness: "moderate",
    skills: [],
    ...overrides,
  };
}

describe("matchOpportunities", () => {
  it("returns no matches for job_search or skill_path - the library only covers business/side-hustle/hybrid routes", () => {
    expect(matchOpportunities(baseContext(), "job_search", "").matches).toEqual([]);
    expect(matchOpportunities(baseContext(), "skill_path", "").matches).toEqual([]);
  });

  it("only scores opportunities whose suitableFor includes the requested route", () => {
    const result = matchOpportunities(baseContext(), "side_hustle", "");
    expect(result.matches.length).toBeGreaterThan(0);
    for (const match of result.matches) {
      expect(match.opportunity.suitableFor).toContain("side_hustle");
    }
  });

  it("labels the top three diversely: Best Match, Strong Alternative, Different Direction", () => {
    const result = matchOpportunities(baseContext(), "side_hustle", "");
    expect(result.matches.map((match) => match.matchLabel)).toEqual(
      ["Best Match", "Strong Alternative", "Different Direction"].slice(0, result.matches.length),
    );
  });

  it("sorts the Best Match as the highest-scoring eligible opportunity", () => {
    const result = matchOpportunities(baseContext(), "side_hustle", "");
    const scores = result.matches.map((match) => match.matchScore);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });

  it("flags hasSkillGap when the Best Match has zero skill overlap", () => {
    const noSkills = matchOpportunities(baseContext({ skills: [] }), "side_hustle", "");
    expect(noSkills.hasSkillGap).toBe(true);
    expect(noSkills.matches[0].relevantSkills).toEqual([]);
  });

  it("does not flag hasSkillGap when the Best Match's skills overlap the founder's", () => {
    // Marketing & Content overlaps several curated side-hustle entries (v0.5 library).
    const withSkills = matchOpportunities(baseContext({ skills: ["Marketing & Content"] }), "side_hustle", "");
    expect(withSkills.hasSkillGap).toBe(false);
    expect(withSkills.matches[0].relevantSkills.length).toBeGreaterThan(0);
  });

  it("is deterministic - the same context always produces the same result", () => {
    const context = baseContext({ skills: ["Marketing & Content"] });
    const first = matchOpportunities(context, "side_hustle", "Creative");
    const second = matchOpportunities(context, "side_hustle", "Creative");
    expect(first).toEqual(second);
  });
});
