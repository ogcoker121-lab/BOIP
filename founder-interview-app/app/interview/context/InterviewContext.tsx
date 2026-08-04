"use client";

import { ReactNode, createContext, useEffect, useRef, useState } from "react";
import { questions } from "@/data/questions";
import { InterviewAnswers, InterviewQuestion } from "@/types/interview";
import {
  createInterview,
  fetchInterview,
  saveInterviewAnswer,
  submitInterview as submitInterviewRequest,
} from "@/lib/interview-client";

const STORAGE_KEY = "boip-interview-id";
const SAVE_DEBOUNCE_MS = 500;

// Feature-local state for the /interview wizard only - not a general
// application store. It should be impossible to use this outside
// app/interview/*, and it must not grow beyond what the wizard needs.
//
// Persistence (v0.2): on mount, restores an unfinished interview from
// localStorage + the API if one exists, otherwise starts a new one.
// Answers auto-save (debounced, flushed on navigation) via
// lib/interview-client.ts. None of this changes the shape below, so no
// page or component needs to change.
export interface InterviewContextValue {
  questions: InterviewQuestion[];
  answers: InterviewAnswers;
  currentIndex: number;
  currentQuestion: InterviewQuestion;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  error?: string;
  status: "in_progress" | "submitted";
  updateAnswer: (value: string) => void;
  next: () => boolean;
  previous: () => void;
  goToQuestion: (index: number) => void;
  submit: () => void;
  reset: () => void;
}

export const InterviewContext = createContext<InterviewContextValue | null>(null);

function firstUnansweredIndex(answers: InterviewAnswers): number {
  const index = questions.findIndex((question) => !answers[question.id]?.trim());
  return index === -1 ? questions.length - 1 : index;
}

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"in_progress" | "submitted">("in_progress");

  const interviewIdRef = useRef<string | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<{ questionId: string; value: string } | null>(null);

  // Restore an unfinished interview, or start a new one.
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const storedId = window.localStorage.getItem(STORAGE_KEY);

      try {
        if (storedId) {
          const existing = await fetchInterview(storedId);
          if (existing && existing.status === "in_progress") {
            if (cancelled) return;
            interviewIdRef.current = existing.id;
            setAnswers(existing.answers);
            setCurrentIndex(firstUnansweredIndex(existing.answers));
            return;
          }
          window.localStorage.removeItem(STORAGE_KEY);
        }

        const created = await createInterview();
        if (cancelled) return;
        interviewIdRef.current = created.id;
        window.localStorage.setItem(STORAGE_KEY, created.id);
      } catch (err) {
        // Persistence unavailable this session (offline, API error, etc.) -
        // the interview still works locally, it just won't save.
        console.error("Failed to initialize interview persistence", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const flushPendingSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const pending = pendingSaveRef.current;
    const interviewId = interviewIdRef.current;
    if (pending && interviewId) {
      pendingSaveRef.current = null;
      saveInterviewAnswer(interviewId, pending.questionId, pending.value).catch((err) => {
        console.error("Failed to save answer", err);
      });
    }
  };

  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    if (error) setError(undefined);

    pendingSaveRef.current = { questionId: currentQuestion.id, value };
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(flushPendingSave, SAVE_DEBOUNCE_MS);
  };

  const next = (): boolean => {
    const value = answers[currentQuestion.id]?.trim();
    if (currentQuestion.required && !value) {
      setError("This question is required.");
      return false;
    }
    setError(undefined);
    flushPendingSave();
    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
    }
    return true;
  };

  const previous = () => {
    setError(undefined);
    flushPendingSave();
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToQuestion = (index: number) => {
    setError(undefined);
    flushPendingSave();
    setCurrentIndex(index);
  };

  const submit = () => {
    flushPendingSave();
    setStatus("submitted");

    const interviewId = interviewIdRef.current;
    if (interviewId) {
      submitInterviewRequest(interviewId).catch((err) => {
        console.error("Failed to submit interview", err);
      });
    }
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const reset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setError(undefined);
    setStatus("in_progress");
    interviewIdRef.current = null;
    window.localStorage.removeItem(STORAGE_KEY);
  };

  if (!ready) {
    return <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading your interview…</p>;
  }

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
