import { CustomerContext } from "@/src/domain/opportunity/customer-context";
import { renderCustomer } from "../templates/customer-template";
import { BusinessPlanSection } from "../models/business-plan";

// Consumes CustomerContext (opportunity domain) rather than reading
// interview answers directly - Interview -> Opportunity -> Business
// Plan, the same shape every other section already follows.
export function buildTargetCustomerSection(customerContext: CustomerContext): BusinessPlanSection {
  const content = renderCustomer(customerContext);

  return {
    id: "target-customer",
    title: "Target Customer",
    content,
    recommendedFrameworks: [],
  };
}
