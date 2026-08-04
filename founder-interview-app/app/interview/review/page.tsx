"use client";

import { useRouter } from "next/navigation";
import ReviewAnswers from "@/components/interview/ReviewAnswers";
import { useInterview } from "../hooks/useInterview";

export default function InterviewReviewPage() {
  const router = useRouter();
  const { questions, answers, goToQuestion, submit } = useInterview();

  const handleEdit = (index: number) => {
    goToQuestion(index);
    router.push("/interview");
  };

  const handleSubmit = () => {
    submit();
    router.push("/interview/complete");
  };

  return (
    <ReviewAnswers
      questions={questions}
      answers={answers}
      onEdit={handleEdit}
      onBack={() => router.push("/interview")}
      onSubmit={handleSubmit}
    />
  );
}
