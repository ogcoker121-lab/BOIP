"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Interview, { InterviewView } from "@/components/interview/Interview";
import { questions } from "@/data/questions";
import { InterviewAnswers } from "@/types/interview";

// Holds the interview session state (plain React state, no context/global
// store). This layout persists across /interview, /interview/review and
// /interview/complete, so state survives client-side navigation between
// them but resets on a full page refresh - acceptable for this MVP.
export default function InterviewLayout() {
  const pathname = usePathname();
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const view: InterviewView = pathname.endsWith("/complete")
    ? "complete"
    : pathname.endsWith("/review")
      ? "review"
      : "questions";

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <Interview
        view={view}
        questions={questions}
        answers={answers}
        setAnswers={setAnswers}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </main>
  );
}
