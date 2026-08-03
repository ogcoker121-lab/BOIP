import { InterviewQuestion } from "@/types/interview";

// Sourced and simplified from /01_Founder_Interview/BOIP Question Bank.md.
// This MVP uses one fixed, linear question set (no path branching, no scoring).
export const questions: InterviewQuestion[] = [
  {
    id: "full-name",
    question: "What is your full name?",
    type: "text",
    required: true,
    placeholder: "Jane Founder",
  },
  {
    id: "occupation",
    question: "What is your current occupation or main area of work?",
    description: "Optional, but it helps us understand your background.",
    type: "text",
    required: false,
    placeholder: "e.g. Marketing manager, teacher, freelance designer",
  },
  {
    id: "business-idea",
    question: "Describe your business idea, or the problem space you want to explore, in one or two sentences.",
    type: "textarea",
    required: true,
    placeholder: "I want to build...",
  },
  {
    id: "problem-solved",
    question: "What problem does it solve?",
    type: "textarea",
    required: true,
    placeholder: "The problem is...",
  },
  {
    id: "who-affected",
    question: "Who experiences this problem most strongly?",
    type: "textarea",
    required: true,
    placeholder: "e.g. Small business owners, new parents, remote teams",
  },
  {
    id: "market-signal",
    question: "What evidence have you seen that demand for this exists?",
    description: "Optional. Conversations, existing competitors, personal experience, anything.",
    type: "textarea",
    required: false,
    placeholder: "e.g. People keep asking me about this, I've seen similar products sell well",
  },
  {
    id: "time-available",
    question: "How many hours per week can you consistently dedicate to this business?",
    type: "select",
    required: true,
    options: [
      "Less than 5 hours",
      "5 to 10 hours",
      "10 to 20 hours",
      "20 to 35 hours",
      "Full-time",
    ],
  },
  {
    id: "capital-available",
    question: "How much money could you realistically invest without putting essential living costs at risk?",
    type: "select",
    required: true,
    options: [
      "Under £1,000",
      "£1,000 to £5,000",
      "£5,000 to £15,000",
      "£15,000 to £50,000",
      "More than £50,000",
      "Prefer not to say",
    ],
  },
  {
    id: "biggest-obstacle",
    question: "What is the biggest obstacle stopping you from moving forward today?",
    type: "textarea",
    required: true,
    placeholder: "e.g. Not sure where to start, limited time, lack of funding",
  },
  {
    id: "three-year-success",
    question: "What would success look like for you three years from now?",
    description: "Optional.",
    type: "textarea",
    required: false,
    placeholder: "In three years, success looks like...",
  },
];
