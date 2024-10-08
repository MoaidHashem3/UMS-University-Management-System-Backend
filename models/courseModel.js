const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },
  professor: {
    type: String,
    required: true,
    trim: true,
  },
  major: {
    type: String,
    required: true,
    trim: true,
  },

  duration: {
    type: Number,
    required: true,
  },

  quizzes: [ 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  
  image: {
    type: String,
  },

 content: [
    {
      title: { type: String, required: true }, 
      filePath: { type: String, required: true }, 
    },
  ],

  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
