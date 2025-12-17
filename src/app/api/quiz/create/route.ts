import { NextResponse } from "next/server";
import QuizController from "@/controllers/quiz";

export async function POST(req: Request) {
  try {
    const { soal, image, multipleQuestion } = await req.json();

    if (!soal || !multipleQuestion) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const quizCtrl = QuizController.getInstance();
    const newQuiz = await quizCtrl.createQuiz(soal, image, multipleQuestion);

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    );
  }
}
