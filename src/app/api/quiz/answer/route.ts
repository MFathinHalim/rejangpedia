import { NextResponse } from "next/server";
import QuizController from "@/controllers/quiz";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { quizId, answer, username } = body;

    if (!quizId || !answer || !username) {
      return NextResponse.json(
        { error: "quizId, answer, username is required" },
        { status: 400 },
      );
    }

    const controller = QuizController.getInstance();
    const result = await controller.answerQuiz(quizId, answer, username);

    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Server error" },
      { status: 500 },
    );
  }
}
