const Quiz = require("../models/quizModel");
const User = require("../models/usersModel");

newQuiz = async (req, res) => {
  try {
    const { title, description, questions, timeLimit } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and questions are required" });
    }

    const newQuiz = new Quiz({
      title,
      description,
      questions,
      timeLimit,
    });

    const savedQuiz = await newQuiz.save();

    res
      .status(201)
      .json({ message: "Quiz created successfully", quiz: savedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// delete quiz

deleteQuizById = async (req, res) => {
  try {
    let { id } = req.params;
    deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!deleteQuiz)
      return res.status(404).json({ message: "Quiz not found" });
    res.status(200).json({ message: "Quiz deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete quiz by id
deleteQuiz = async (req, res) => {
  try {
    deletedQuizs = await Quiz.deleteMany({});
    if (!deletedQuizs)
      return res.status(404).json({ message: "No quizzes found to delete" });
    res.status(200).json({ message: "Quizzes deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//update quiz

updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description, questions, timeLimit } = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, questions, timeLimit },
      { new: true }
    );
    if (!updatedQuiz)
      return res.status(404).json({ message: "Quiz not found" });

    res
      .status(200)
      .json({ message: "Quiz updated successfully", data: updatedQuiz });
  } catch (error) {
    res.status(500).json({ message: "Sever Error", error: error.message });
  }
};

// retrive quiz

retriveQuizs = async (req, res) => {
  try {
    const retrivedQuizes = await Quiz.find();
    if (!retrivedQuizes)
      return res.status(404).json({ message: "Quizes not found" });
    res
      .status(200)
      .json({ message: "Quizes retrive successfully", data: retrivedQuizes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//retrive quiz by id

retriveQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const retrivedQuizById = await Quiz.findById(id);
    if (!retrivedQuizById)
      return res.status(404).json({ message: "Quiz not found" });
    res
      .status(200)
      .json({ message: "Quiz retrives successfully", data: retrivedQuizById });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const submitQuiz = async (req, res) => {
  const { studentId, quizId } = req.params;
  const { answers } = req.body;

  try {
      const quiz = await Quiz.findById(quizId);
      const student = await User.findById(studentId);

      if (!student) {
          return res.status(404).json({ message: "Student not found" });
      }

      if (student.role.toLowerCase() === "admin" || student.role.toLowerCase() === "professor") {
          return res.status(403).json({ message: "Admins and instructors can't answer quizzes" });
      }

      if (!quiz) {
          return res.status(404).json({ message: "Quiz not found" });
      }

      const hasAlreadySubmitted = student.quizzes.some(q => q.quizId === quizId);
      if (hasAlreadySubmitted) {
          return res.status(412).json({ message: "Student has already submitted this quiz" });
      }

      let totalScore = 0, correctCount = 0;

      quiz.questions.forEach((question, index) => {
          const correctAnswer = question.correctAnswer;
          const studentAnswer = answers[index];

          if (correctAnswer === studentAnswer) {
              totalScore += question.score;
              correctCount++;
          }
      });

      student.quizzes.push({ quizId, totalScore, correctCount });
      await student.save();

      res.status(200).json({
          message: "Quiz submitted successfully",
          totalScore,
          correctCount,
      });
  } catch (error) {
      console.error("Error in submitQuiz:", error); // Log the error
      res.status(500).json({ message: error.message });
  }
};


module.exports = {
  newQuiz,
  deleteQuiz,
  deleteQuizById,
  updateQuiz,
  retriveQuizs,
  retriveQuizById,
  submitQuiz,
};
