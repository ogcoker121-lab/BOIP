import { describe, it, expect } from "vitest";
import { buildRecommendations } from "./recommendation-mapper";

describe("buildRecommendations", () => {
  it("builds recommendations from raw interview answers via OpportunityContext", () => {
    const recommendations = buildRecommendations({
      "business-stage": "Just an idea",
      "revenue-model": "Not sure yet",
    });
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations.every((r) => typeof r.id === "string" && r.id.startsWith("REC-"))).toBe(true);
  });

  it("never crashes on an empty answer set", () => {
    expect(() => buildRecommendations({})).not.toThrow();
  });
});
