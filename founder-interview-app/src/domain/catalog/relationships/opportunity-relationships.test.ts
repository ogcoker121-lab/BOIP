import { describe, it, expect } from "vitest";
import type { Opportunity } from "@/src/domain/opportunity";
import { deriveOpportunityRelationships } from "./opportunity-relationships";

describe("deriveOpportunityRelationships", () => {
  it("turns each of the opportunity's own frameworkReferences into a USES edge from it", () => {
    const opportunity = {
      id: "OPP-999",
      frameworkReferences: ["FW-004"],
    } as Opportunity;

    expect(deriveOpportunityRelationships(opportunity)).toEqual([
      { sourceId: "OPP-999", targetId: "FW-004", type: "USES" },
    ]);
  });

  it("produces no relationships when the opportunity references no frameworks", () => {
    const opportunity = { id: "OPP-999", frameworkReferences: [] } as unknown as Opportunity;
    expect(deriveOpportunityRelationships(opportunity)).toEqual([]);
  });
});
