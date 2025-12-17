import { Model, Schema, model, models } from "mongoose";

const userSchema: Schema<userType> = new Schema<userType>({
  id: String,
  username: String,
  password: String,
  desc: String,
  atmin: Boolean,
  quizScore: {
    type: Number,
    default: 0,
  },
});

const userModel: Model<userType> = models.user || model("user", userSchema);
export { userModel, userSchema };
