import { InterviewAnswers } from "@/types/interview";
import { InterviewStatus } from "./interview-repository";

// Browser-side wrapper around app/api/interview/*. The interview UI only
// ever talks to this - it never imports the repository or Supabase directly.
export interface InterviewDTO {
  id: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  answers: InterviewAnswers;
}

export async function createInterview(): Promise<InterviewDTO> {
  const response = await fetch("/api/interview", { method: "POST" });
  if (!response.ok) {
    throw new Error(`Failed to create interview (${response.status})`);
  }
  return response.json();
}

export async function fetchInterview(id: string): Promise<InterviewDTO | null> {
  const response = await fetch(`/api/interview/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to load interview (${response.status})`);
  }
  return response.json();
}

export async function saveInterviewAnswer(id: string, questionId: string, answer: string): Promise<InterviewDTO> {
  const response = await fetch(`/api/interview/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionId, answer }),
  });
  if (!response.ok) {
    throw new Error(`Failed to save answer (${response.status})`);
  }
  return response.json();
}

export async function submitInterview(id: string): Promise<InterviewDTO> {
  const response = await fetch(`/api/interview/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "submit" }),
  });
  if (!response.ok) {
    throw new Error(`Failed to submit interview (${response.status})`);
  }
  return response.json();
}
