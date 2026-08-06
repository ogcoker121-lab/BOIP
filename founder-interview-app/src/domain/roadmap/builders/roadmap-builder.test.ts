import { describe, it, expect } from "vitest";
import type { Recommendation } from "@/src/domain/recommendation";
import { buildRoadmap } from "./roadmap-builder";

function rec(priority: Recommendation["priority"], title: string): Recommendation {
  return { priority, title } as Recommendation;
}

describe("buildRoadmap", () => {
  it("buckets Critical and High priority recommendations into Days 1-30", () => {
    const roadmap = buildRoadmap([rec("Critical", "Do this first"), rec("High", "Do this too")]);
    expect(roadmap.buckets[0]).toEqual({ label: "Days 1-30", items: ["Do this first", "Do this too"] });
  });

  it("buckets Medium priority into Days 31-60 and Low priority into Days 61-90", () => {
    const roadmap = buildRoadmap([rec("Medium", "Mid term"), rec("Low", "Later")]);
    expect(roadmap.buckets[1]).toEqual({ label: "Days 31-60", items: ["Mid term"] });
    expect(roadmap.buckets[2]).toEqual({ label: "Days 61-90", items: ["Later"] });
  });

  it("preserves the recommendation engine's own ordering within a bucket - never re-sorts", () => {
    const roadmap = buildRoadmap([rec("High", "Second-scored"), rec("Critical", "First-scored")]);
    expect(roadmap.buckets[0].items).toEqual(["Second-scored", "First-scored"]);
  });

  it("produces all three buckets, empty, for an empty recommendation list", () => {
    const roadmap = buildRoadmap([]);
    expect(roadmap.buckets.map((bucket) => bucket.items)).toEqual([[], [], []]);
  });
});
