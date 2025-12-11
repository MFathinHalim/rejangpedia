// @ts-nocheck
import { NextResponse } from "next/server";
import QuizController from "@/controllers/quiz";

export async function POST(req: Request) {
  let body = {};

  try {
    body = await req.json();
  } catch {
    body = {};
  }
  //@ts-ignore
  const { id } = body;

  const quizController = QuizController.getInstance();

  // Kalau id tidak ada -> random quiz
  if (!id) {
    const randomQuiz = await quizController.getRandomQuiz();
    if (!randomQuiz) {
      return NextResponse.json(
        { error: "Tidak ada quiz tersedia" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: randomQuiz.id,
      soal: randomQuiz.soal,
      image: randomQuiz.image,
      multipleQuestion: randomQuiz.multipleQuestion,
    });
  }

  // Kalau id ada -> ambil by ID
  const quiz = await quizController.getQuiz(id);

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: quiz.id,
    soal: quiz.soal,
    multipleQuestion: quiz.multipleQuestion,
  });
}
