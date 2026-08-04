import { NextRequest, NextResponse } from "next/server";
import { InterviewProgressUpdate, getInterviewRepository } from "@/lib/interview-repository";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const repository = await getInterviewRepository();
  const interview = await repository.getInterview(id);

  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }
  return NextResponse.json(interview);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const repository = await getInterviewRepository();

  let interview;
  if (body?.action === "submit") {
    interview = await repository.submitInterview(id);
  } else {
    const update: InterviewProgressUpdate = {};
    if (typeof body?.questionId === "string" && typeof body?.answer === "string") {
      update.questionId = body.questionId;
      update.answer = body.answer;
    }
    if (typeof body?.currentQuestionIndex === "number") {
      update.currentQuestionIndex = body.currentQuestionIndex;
    }
    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    interview = await repository.saveProgress(id, update);
  }

  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }
  return NextResponse.json(interview);
}
