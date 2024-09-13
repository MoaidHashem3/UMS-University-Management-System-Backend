const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },

  description: { type: String, required: true, trim: true },

  image: { type: String, required: false },

  professor: { type: String, required: true, trim: true },

  major: { type: String, required: true, trim: true },

  duration: { type: Number, required: true },

  quiz: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
