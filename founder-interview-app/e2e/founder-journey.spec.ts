import { test, expect } from "@playwright/test";
import { completeInterview } from "./helpers";

// Landing -> Interview -> Opportunity Snapshot -> Recommendations ->
// Business Plan: the core founder workflow verified manually every
// release so far (see playwright.config.ts), now automated.
test("a founder completes the interview and reaches a Business Plan built from their answers", async ({ page }) => {
  await completeInterview(page);

  await expect(page.getByRole("heading", { name: "Your Opportunity Snapshot" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Your Next Move" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Recommended Actions" })).toBeVisible();

  // At least one recommendation card rendered with its priority badge -
  // proof the Decision/Recommendation engines actually ran on this
  // founder's real answers, not an empty state.
  await expect(page.getByText(/^(Critical|High|Medium|Low)$/).first()).toBeVisible();

  await page.getByRole("link", { name: "View Full Business Plan" }).click();
  await expect(page).toHaveURL("/interview/business-plan");

  await expect(page.getByText("Business Plan", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Executive Summary" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "First 90-Day Action Plan" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Key Risks" })).toBeVisible();
});
