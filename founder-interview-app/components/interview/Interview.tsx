"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { InterviewAnswers, InterviewQuestion } from "@/types/interview";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import NavigationButtons from "./NavigationButtons";
import ReviewAnswers from "./ReviewAnswers";
import CompletionCard from "./CompletionCard";

export type InterviewView = "questions" | "review" | "complete";

interface InterviewProps {
  view: InterviewView;
  questions: InterviewQuestion[];
  answers: InterviewAnswers;
  setAnswers: Dispatch<SetStateAction<InterviewAnswers>>;
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
}

export default function Interview({
  view,
  questions,
  answers,
  setAnswers,
  currentIndex,
  setCurrentIndex,
}: InterviewProps) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const handleAnswerChange = (value: string) => {
    const question = questions[currentIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    if (error) setError(undefined);
  };

  const handleNext = () => {
    const question = questions[currentIndex];
    const value = answers[question.id]?.trim();
    if (question.required && !value) {
      setError("This question is required.");
      return;
    }
    setError(undefined);
    if (currentIndex === questions.length - 1) {
      router.push("/interview/review");
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    setError(undefined);
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentIndex(index);
    setError(undefined);
    router.push("/interview");
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
  };

  if (view === "review") {
    return (
      <ReviewAnswers
        questions={questions}
        answers={answers}
        onEdit={handleEdit}
        onBack={() => router.push("/interview")}
        onSubmit={() => router.push("/interview/complete")}
      />
    );
  }

  if (view === "complete") {
    return <CompletionCard onRestart={handleRestart} />;
  }

  const question = questions[currentIndex];

  return (
    <div>
      <ProgressBar current={currentIndex + 1} total={questions.length} />
      <div className="mt-8">
        <QuestionCard
          question={question}
          value={answers[question.id] ?? ""}
          onChange={handleAnswerChange}
          error={error}
        />
      </div>
      <NavigationButtons
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={currentIndex > 0}
        nextLabel={currentIndex === questions.length - 1 ? "Review Answers" : "Next"}
      />
    </div>
  );
}
