import QuizController from "@/controllers/quiz";

export async function GET() {
  const controller = QuizController.getInstance();
  const quizzes = await controller.getAllQuiz();
  return Response.json(quizzes);
}
