import { describe, it, expect } from "vitest";
import type { Recommendation } from "@/src/domain/recommendation";
import { deriveRecommendationRelationships } from "./recommendation-relationships";

describe("deriveRecommendationRelationships", () => {
  it("turns each of the recommendation's own frameworkReferences into a USES edge from it", () => {
    const recommendation = {
      id: "REC-999",
      frameworkReferences: ["FW-001", "FW-011"],
    } as Recommendation;

    expect(deriveRecommendationRelationships(recommendation)).toEqual([
      { sourceId: "REC-999", targetId: "FW-001", type: "USES" },
      { sourceId: "REC-999", targetId: "FW-011", type: "USES" },
    ]);
  });

  it("produces no relationships when the recommendation references no frameworks", () => {
    const recommendation = { id: "REC-999", frameworkReferences: [] } as unknown as Recommendation;
    expect(deriveRecommendationRelationships(recommendation)).toEqual([]);
  });
});
