import { NextRequest, NextResponse } from "next/server";
import { getInterviewRepository } from "@/lib/interview-repository";

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
  } else if (typeof body?.questionId === "string" && typeof body?.answer === "string") {
    interview = await repository.saveAnswer(id, body.questionId, body.answer);
  } else {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!interview) {
    return NextResponse.json({ error: "Interview not found" }, { status: 404 });
  }
  return NextResponse.json(interview);
}
