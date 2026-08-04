"use client";

import { ReactNode, createContext, useState } from "react";
import { questions } from "@/data/questions";
import { InterviewAnswers, InterviewQuestion } from "@/types/interview";

// Feature-local state for the /interview wizard only - not a general
// application store. It should be impossible to use this outside
// app/interview/*, and it must not grow beyond what the wizard needs.
export interface InterviewContextValue {
  questions: InterviewQuestion[];
  answers: InterviewAnswers;
  currentIndex: number;
  currentQuestion: InterviewQuestion;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error?: string;
  status: "in-progress" | "submitted";
  updateAnswer: (value: string) => void;
  next: () => boolean;
  previous: () => void;
  goToQuestion: (index: number) => void;
  submit: () => void;
  reset: () => void;
}

export const InterviewContext = createContext<InterviewContextValue | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"in-progress" | "submitted">("in-progress");

  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    if (error) setError(undefined);
  };

  const next = (): boolean => {
    const value = answers[currentQuestion.id]?.trim();
    if (currentQuestion.required && !value) {
      setError("This question is required.");
      return false;
    }
    setError(undefined);
    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
    }
    return true;
  };

  const previous = () => {
    setError(undefined);
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToQuestion = (index: number) => {
    setError(undefined);
    setCurrentIndex(index);
  };

  const submit = () => {
    setStatus("submitted");
  };

  const reset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setError(undefined);
    setStatus("in-progress");
  };

  const value: InterviewContextValue = {
    questions,
    answers,
    currentIndex,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    error,
    status,
    updateAnswer,
    next,
    previous,
    goToQuestion,
    submit,
    reset,
  };

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}
