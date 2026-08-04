import { NextResponse } from "next/server";
import { getInterviewRepository } from "@/lib/interview-repository";

export async function POST() {
  const repository = await getInterviewRepository();
  const interview = await repository.createInterview();
  return NextResponse.json(interview, { status: 201 });
}
