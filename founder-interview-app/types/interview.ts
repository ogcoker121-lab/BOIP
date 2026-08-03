export type QuestionType = "text" | "textarea" | "select";

export interface InterviewQuestion {
  id: string;
  question: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export type InterviewAnswers = Record<string, string>;
