import QuizController from "@/controllers/quiz";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const controller = QuizController.getInstance();

  const ok = await controller.deleteQuiz(id);
  return Response.json({ success: ok });
}
