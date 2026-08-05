import { describe, it, expect } from "vitest";
import type { Recommendation } from "@/src/domain/recommendation";
import { deriveRuleGeneratesRelationship } from "./rule-relationships";

describe("deriveRuleGeneratesRelationship", () => {
  it("declares a GENERATES edge from the rule to the recommendation it produces", () => {
    const recommendation = { id: "REC-999" } as Recommendation;
    expect(deriveRuleGeneratesRelationship("RULE-CD-001", recommendation)).toEqual({
      sourceId: "RULE-CD-001",
      targetId: "REC-999",
      type: "GENERATES",
    });
  });
});
