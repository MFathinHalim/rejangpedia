import { Model, Schema, model, models } from "mongoose";

// Main post schema
const quizSchema = new Schema({
  id: String,
  soal: String,
  image: String,
  multipleQuestion: [
    {
      jawaban: String,
      benar: Boolean,
      score: Number,
    },
  ],
});

const quizModel: Model<Data> = models.quizs || model<Data>("quizs", quizSchema);

export { quizModel };
