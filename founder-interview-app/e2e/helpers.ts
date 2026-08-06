import { Page, expect } from "@playwright/test";
import { questions } from "@/data/questions";
import { InterviewAnswers } from "@/types/interview";

// A profile likely to land on side_hustle with a Best Match opportunity
// and at least one fired recommendation - the same shape of fixture used
// throughout the domain test suites (src/domain/decision/mapper/*.test.ts),
// but expressed as answers to the *real* questions the UI actually asks
// (see data/questions.ts), including the ones domain fixtures skip
// (full-name, occupation, business-idea, biggest-obstacle).
export const SIDE_HUSTLE_ANSWERS: InterviewAnswers = {
  "full-name": "Jane Founder",
  occupation: "Marketing manager",
  "professional-skills": "Marketing & Content",
  "business-idea": "A platform that helps freelancers build professional portfolios quickly.",
  "problem-solved": "They struggle to showcase their work professionally.",
  "who-affected": "Freelancers who need better portfolios.",
  industry: "SaaS / Software",
  "business-stage": "Just an idea",
  "revenue-model": "Subscription",
  "market-type": "Consumers (B2C)",
  "market-signal": "A few people have already asked me to help.",
  "preferred-path": "Build a side hustle",
  "employment-status": "Employed full-time",
  "risk-tolerance": "Moderate",
  "income-urgency": "📅 Within 3 months",
  "time-available": "20 to 35 hours",
  "capital-available": "£1,000 to £5,000",
  "biggest-obstacle": "Not sure where to start.",
};

// Answers every question the UI presents, in the fixed linear order
// data/questions.ts defines, then submits - the same path a founder
// actually walks (Landing -> Interview -> Review -> Submit), not a
// shortcut around it. Questions with no entry in `answers` (the two
// optional ones this fixture omits, three-year-success) are left blank.
export async function completeInterview(page: Page, answers: InterviewAnswers = SIDE_HUSTLE_ANSWERS) {
  await page.goto("/");
  await page.getByRole("link", { name: "Start Interview" }).click();
  await expect(page).toHaveURL("/interview");

  for (const question of questions) {
    const value = answers[question.id];

    if (value !== undefined) {
      if (question.type === "select") {
        await page.locator(`#${question.id}`).selectOption({ label: value });
      } else if (question.type === "multi-select") {
        await page.getByRole("button", { name: value, exact: true }).click();
      } else {
        await page.locator(`#${question.id}`).fill(value);
      }
    }

    const isLastQuestion = question.id === questions[questions.length - 1].id;
    await page.getByRole("button", { name: isLastQuestion ? "Review Answers" : "Next" }).click();
  }

  await expect(page).toHaveURL("/interview/review");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page).toHaveURL("/interview/complete");
}
