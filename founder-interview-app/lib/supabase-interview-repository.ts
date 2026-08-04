import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { InterviewAnswers } from "@/types/interview";
import { InterviewProgressUpdate, InterviewRecord, InterviewRepository, InterviewStatus } from "./interview-repository";

interface InterviewRow {
  id: string;
  status: InterviewStatus;
  current_question_index: number;
  created_at: string;
  updated_at: string;
}

interface InterviewAnswerRow {
  interview_id: string;
  question_id: string;
  answer: string;
}

// Server-only: constructed with the service role key, so it bypasses RLS.
// Never import this from client code - it's only reached via the API
// routes in app/api/interview/*.
export class SupabaseInterviewRepository implements InterviewRepository {
  private client: SupabaseClient;

  constructor(url: string, serviceRoleKey: string) {
    this.client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false },
    });
  }

  async createInterview(): Promise<InterviewRecord> {
    const { data, error } = await this.client
      .from("interviews")
      .insert({})
      .select()
      .single<InterviewRow>();

    if (error || !data) {
      throw new Error(`Failed to create interview: ${error?.message}`);
    }

    return toInterviewRecord(data, {});
  }

  async getInterview(id: string): Promise<InterviewRecord | null> {
    const { data: interview, error } = await this.client
      .from("interviews")
      .select()
      .eq("id", id)
      .maybeSingle<InterviewRow>();

    if (error) {
      throw new Error(`Failed to load interview: ${error.message}`);
    }
    if (!interview) return null;

    const { data: answerRows, error: answersError } = await this.client
      .from("interview_answers")
      .select("interview_id, question_id, answer")
      .eq("interview_id", id);

    if (answersError) {
      throw new Error(`Failed to load interview answers: ${answersError.message}`);
    }

    const answers = toAnswers(answerRows ?? []);
    return toInterviewRecord(interview, answers);
  }

  async saveProgress(id: string, update: InterviewProgressUpdate): Promise<InterviewRecord | null> {
    if (update.questionId !== undefined && update.answer !== undefined) {
      const { error: upsertError } = await this.client
        .from("interview_answers")
        .upsert(
          { interview_id: id, question_id: update.questionId, answer: update.answer, updated_at: new Date().toISOString() },
          { onConflict: "interview_id,question_id" },
        );

      if (upsertError) {
        throw new Error(`Failed to save answer: ${upsertError.message}`);
      }
    }

    const interviewUpdate: { updated_at: string; current_question_index?: number } = {
      updated_at: new Date().toISOString(),
    };
    if (update.currentQuestionIndex !== undefined) {
      interviewUpdate.current_question_index = update.currentQuestionIndex;
    }

    const { error } = await this.client.from("interviews").update(interviewUpdate).eq("id", id);
    if (error) {
      throw new Error(`Failed to update interview: ${error.message}`);
    }

    return this.getInterview(id);
  }

  async submitInterview(id: string): Promise<InterviewRecord | null> {
    const { error } = await this.client
      .from("interviews")
      .update({ status: "submitted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to submit interview: ${error.message}`);
    }

    return this.getInterview(id);
  }
}

function toAnswers(rows: InterviewAnswerRow[]): InterviewAnswers {
  return rows.reduce<InterviewAnswers>((acc, row) => {
    acc[row.question_id] = row.answer;
    return acc;
  }, {});
}

function toInterviewRecord(row: InterviewRow, answers: InterviewAnswers): InterviewRecord {
  return {
    id: row.id,
    status: row.status,
    currentQuestionIndex: row.current_question_index,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    answers,
  };
}
