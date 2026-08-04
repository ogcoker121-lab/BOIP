"use client";

import { useRouter } from "next/navigation";
import Interview from "@/components/interview/Interview";
import { useInterview } from "./hooks/useInterview";

export default function InterviewPage() {
  const router = useRouter();
  const { questions, answers, currentIndex, currentQuestion, isLastQuestion, error, updateAnswer, next, previous } =
    useInterview();

  const handleNext = () => {
    if (next() && isLastQuestion) {
      router.push("/interview/review");
    }
  };

  return (
    <Interview
      question={currentQuestion}
      value={answers[currentQuestion.id] ?? ""}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      canGoPrevious={currentIndex > 0}
      isLastQuestion={isLastQuestion}
      error={error}
      onAnswerChange={updateAnswer}
      onNext={handleNext}
      onPrevious={previous}
    />
  );
}
