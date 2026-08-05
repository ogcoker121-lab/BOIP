import { InterviewAnswers } from "@/types/interview";
import { clean } from "../templates/text-helpers";
import { renderCustomer } from "../templates/customer-template";
import { BusinessPlanSection } from "../models/business-plan";

export function buildCustomerSection(answers: InterviewAnswers): BusinessPlanSection {
  const content = renderCustomer({
    customer: clean(answers["who-affected"]),
    problem: clean(answers["problem-solved"]),
    marketSignal: clean(answers["market-signal"]),
  });

  return {
    id: "customer",
    title: "Customer",
    content,
    recommendedFrameworks: [],
  };
}
