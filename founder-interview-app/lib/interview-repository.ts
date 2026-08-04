import { InterviewAnswers } from "@/types/interview";

export type InterviewStatus = "in_progress" | "submitted";

export interface InterviewRecord {
  id: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  answers: InterviewAnswers;
}

// Server-side data access for the interview feature. The UI never talks to
// this directly - it goes through the API routes in app/api/interview/*,
// which is what keeps the interview flow agnostic to where the data lives.
export interface InterviewRepository {
  createInterview(): Promise<InterviewRecord>;
  getInterview(id: string): Promise<InterviewRecord | null>;
  saveAnswer(id: string, questionId: string, answer: string): Promise<InterviewRecord | null>;
  submitInterview(id: string): Promise<InterviewRecord | null>;
}

function randomId(): string {
  return typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `interview_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Default implementation: process-memory only, resets on server restart.
// Used automatically whenever Supabase env vars aren't configured, so the
// app stays buildable and testable without live credentials.
export class InMemoryInterviewRepository implements InterviewRepository {
  private interviews = new Map<string, InterviewRecord>();

  async createInterview(): Promise<InterviewRecord> {
    const now = new Date().toISOString();
    const record: InterviewRecord = {
      id: randomId(),
      status: "in_progress",
      createdAt: now,
      updatedAt: now,
      answers: {},
    };
    this.interviews.set(record.id, record);
    return record;
  }

  async getInterview(id: string): Promise<InterviewRecord | null> {
    return this.interviews.get(id) ?? null;
  }

  async saveAnswer(id: string, questionId: string, answer: string): Promise<InterviewRecord | null> {
    const record = this.interviews.get(id);
    if (!record) return null;
    record.answers = { ...record.answers, [questionId]: answer };
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async submitInterview(id: string): Promise<InterviewRecord | null> {
    const record = this.interviews.get(id);
    if (!record) return null;
    record.status = "submitted";
    record.updatedAt = new Date().toISOString();
    return record;
  }
}

let inMemorySingleton: InMemoryInterviewRepository | null = null;

// Picks the Supabase-backed repository when SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are set, otherwise falls back to the in-memory
// one. The Supabase implementation is imported dynamically so this module
// has no hard dependency on real credentials existing.
export async function getInterviewRepository(): Promise<InterviewRepository> {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceRoleKey) {
    return getSupabaseInterviewRepository(url, serviceRoleKey);
  }

  if (!inMemorySingleton) {
    inMemorySingleton = new InMemoryInterviewRepository();
  }
  return inMemorySingleton;
}

let supabaseSingleton: InterviewRepository | null = null;
async function getSupabaseInterviewRepository(url: string, serviceRoleKey: string): Promise<InterviewRepository> {
  if (!supabaseSingleton) {
    const { SupabaseInterviewRepository } = await import("./supabase-interview-repository");
    supabaseSingleton = new SupabaseInterviewRepository(url, serviceRoleKey);
  }
  return supabaseSingleton;
}
