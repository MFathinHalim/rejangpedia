import QuizController from "@/controllers/quiz";

export async function DELETE(req) {
  const { id } = await req.json();
  const controller = QuizController.getInstance();

  const ok = await controller.deleteQuiz(id);
  return Response.json({ success: ok });
}
