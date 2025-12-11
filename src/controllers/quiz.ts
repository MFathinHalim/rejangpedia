// @ts-nocheck
import { quizModel } from "@/models/quiz";
import { userModel } from "@/models/user";
import dbConnect from "@/utils/mongoose";

class QuizController {
  static instance: QuizController;

  constructor() {}

  static getInstance() {
    if (!QuizController.instance) {
      QuizController.instance = new QuizController();
    }
    return QuizController.instance;
  }

  // memastikan DB connect sebelum tiap aksi
  async ensureDB() {
    await dbConnect();
  }

  // ===============================
  // CREATE QUIZ
  // ===============================
  async createQuiz(soal: string, image: string, multipleQuestion: any[]) {
    await this.ensureDB();

    const newQuiz = await quizModel.create({
      soal,
      image,
      multipleQuestion,
    });

    return newQuiz;
  }

  // ===============================
  // GET QUIZ BY ID
  // ===============================
  async getRandomQuiz() {
    const count = await quizModel.countDocuments();

    if (count === 0) return null;

    const randomIndex = Math.floor(Math.random() * count);

    const randomQuiz = await quizModel.findOne().skip(randomIndex);

    return randomQuiz;
  }

  async getQuiz(id: string) {
    await this.ensureDB();

    const quiz = await quizModel.findOne({ id });

    if (!quiz) return null;
    return quiz;
  }
  async getAllQuiz() {
    return await quizModel.find({});
  }

  // ===============================
  // DELETE QUIZ
  // ===============================
  async deleteQuiz(_id: string) {
    await this.ensureDB();

    const deleted = await quizModel.deleteOne({ _id });
    return deleted.deletedCount > 0;
  }

  // ===============================
  // ANSWER QUIZ
  // ===============================
  async answerQuiz(quizId: string, answer: string, username: string) {
    await this.ensureDB();

    const quiz = await quizModel.findOne({ _id: quizId });
    if (!quiz) return { success: false, message: "Quiz not found" };

    // cari jawaban
    const findAnswer = quiz.multipleQuestion.find(
      (q: any) => q.jawaban.toLowerCase() === answer.toLowerCase(),
    );

    if (!findAnswer) {
      return {
        success: false,
        correct: false,
        message: "Jawaban tidak valid",
      };
    }

    // cari user
    const user = await userModel.findOne({ username });
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // jika benar -> tambah score
    if (findAnswer.benar) {
      const scoreToAdd = findAnswer.score || 0;
      user.quizScore = (user.quizScore || 0) + scoreToAdd;
      await user.save();

      return {
        success: true,
        correct: true,
        addedScore: scoreToAdd,
        totalScore: user.quizScore,
      };
    }

    // salah tapi gak ngurangin score
    return {
      success: true,
      correct: false,
      message: "Jawaban salah",
    };
  }
}

export default QuizController;
