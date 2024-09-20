const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  score: { type: Number, default: 1, required: true },
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [questionSchema],
  timeLimit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

quizSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
