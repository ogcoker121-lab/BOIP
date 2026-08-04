"use client";

import { useContext } from "react";
import { InterviewContext, InterviewContextValue } from "../context/InterviewContext";

export function useInterview(): InterviewContextValue {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  return context;
}
