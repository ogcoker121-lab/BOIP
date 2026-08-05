import { test, expect } from "@playwright/test";
import { completeInterview } from "./helpers";

// Opportunity Snapshot -> Framework Explorer: a "Learn More" link on a
// Recommendation Card (components/interview/RecommendationCard.tsx)
// resolves entirely through the Knowledge Catalog (v0.7/v0.8), not a
// direct lookup into the recommendation/framework domains.
test("Learn More on a recommendation opens the Framework Explorer for that framework", async ({ page }) => {
  await completeInterview(page);

  const learnMore = page.getByRole("link", { name: "Learn More" }).first();
  await expect(learnMore).toBeVisible();
  await learnMore.click();

  await expect(page).toHaveURL(/\/frameworks\/FW-\d+/);
  await expect(page.getByText(/^Framework - FW-\d+$/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "What it is" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "When to use it" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Expected outcome" })).toBeVisible();
});

test("an unknown framework id degrades to a not-found state instead of erroring", async ({ page }) => {
  await page.goto("/frameworks/NOPE-999");
  await expect(page.getByRole("heading", { name: "Framework not found" })).toBeVisible();
  await page.getByRole("link", { name: "Back to home" }).click();
  await expect(page).toHaveURL("/");
});
