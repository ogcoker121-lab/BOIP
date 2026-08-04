"use client";

import { ReactNode, createContext, useRef, useState, useEffect } from "react";
import { questions } from "@/data/questions";
import { InterviewAnswers, InterviewQuestion } from "@/types/interview";
import {
  createInterview,
  fetchInterview,
  saveInterviewProgress,
  submitInterview as submitInterviewRequest,
} from "@/lib/interview-client";

const STORAGE_KEY = "boip-interview-id";
const SAVE_DEBOUNCE_MS = 500;

// Feature-local state for the /interview wizard only - not a general
// application store. It should be impossible to use this outside
// app/interview/*, and it must not grow beyond what the wizard needs.
//
// Persistence (v0.2): on mount, restores an unfinished interview from
// localStorage + the API if one exists, at the exact question it left off
// on (server-stored current_question_index, not inferred). An interview
// isn't created until the founder enters their first answer - visiting
// /interview and leaving creates nothing. None of this changes the shape
// below, so no page or component needs to change.
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

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [answers, setAnswers] = useState<InterviewAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"in_progress" | "submitted">("in_progress");

  const interviewIdRef = useRef<string | null>(null);
  const creatingRef = useRef<Promise<string | null> | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAnswerRef = useRef<{ questionId: string; value: string } | null>(null);

  // Restore an unfinished interview if one exists. Does NOT create one -
  // creation is lazy, triggered by the first answer (see ensureInterview).
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const storedId = window.localStorage.getItem(STORAGE_KEY);
      if (!storedId) {
        setReady(true);
        return;
      }

      try {
        const existing = await fetchInterview(storedId);
        if (cancelled) return;

        if (existing && existing.status === "in_progress") {
          interviewIdRef.current = existing.id;
          setAnswers(existing.answers);
          setCurrentIndex(Math.min(existing.currentQuestionIndex, questions.length - 1));
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch (err) {
        console.error("Failed to restore interview", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Lazily creates the interview on first use, deduping concurrent callers.
  const ensureInterview = async (): Promise<string | null> => {
    if (interviewIdRef.current) return interviewIdRef.current;
    if (creatingRef.current) return creatingRef.current;

    const promise = createInterview()
      .then((created) => {
        interviewIdRef.current = created.id;
        window.localStorage.setItem(STORAGE_KEY, created.id);
        return created.id;
      })
      .catch((err) => {
        console.error("Failed to create interview", err);
        return null;
      })
      .finally(() => {
        creatingRef.current = null;
      });

    creatingRef.current = promise;
    return promise;
  };

  // Persists whatever changed. Won't create an interview just to record a
  // navigation event with no answer - only an actual answer justifies that.
  const persistProgress = async (update: { questionId?: string; answer?: string; currentQuestionIndex?: number }) => {
    const hasAnswer = update.questionId !== undefined && update.answer !== undefined;
    let interviewId = interviewIdRef.current;

    if (!interviewId) {
      if (!hasAnswer) return;
      interviewId = await ensureInterview();
      if (!interviewId) return;
    }

    saveInterviewProgress(interviewId, update).catch((err) => {
      console.error("Failed to save interview progress", err);
    });
  };

  const flushPendingSave = (nextIndex?: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    const pending = pendingAnswerRef.current;
    pendingAnswerRef.current = null;

    const update: { questionId?: string; answer?: string; currentQuestionIndex?: number } = {};
    if (pending) {
      update.questionId = pending.questionId;
      update.answer = pending.value;
    }
    if (nextIndex !== undefined) {
      update.currentQuestionIndex = nextIndex;
    }
    if (Object.keys(update).length === 0) return;

    void persistProgress(update);
  };

  const currentQuestion = questions[currentIndex];
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questions.length - 1;

  const updateAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    if (error) setError(undefined);

    pendingAnswerRef.current = { questionId: currentQuestion.id, value };
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => flushPendingSave(), SAVE_DEBOUNCE_MS);
  };

  const next = (): boolean => {
    const value = answers[currentQuestion.id]?.trim();
    if (currentQuestion.required && !value) {
      setError("This question is required.");
      return false;
    }
    setError(undefined);

    if (isLastQuestion) {
      flushPendingSave();
    } else {
      const nextIndex = currentIndex + 1;
      flushPendingSave(nextIndex);
      setCurrentIndex(nextIndex);
    }
    return true;
  };

  const previous = () => {
    setError(undefined);
    const prevIndex = Math.max(0, currentIndex - 1);
    flushPendingSave(prevIndex);
    setCurrentIndex(prevIndex);
  };

  const goToQuestion = (index: number) => {
    setError(undefined);
    flushPendingSave(index);
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
