const Quiz = require('../models/quizModel');

newQuiz = async (req, res) => {
  try {
    const { title, description, questions, timeLimit } = req.body;

    if (!title || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    const newQuiz = new Quiz({
      title,
      description,
      questions,
      timeLimit
    });

    const savedQuiz = await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quiz: savedQuiz });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// delete quiz

deleteQuiz = async (req, res) => {
  try {
    let { id } = req.params
    deletedQuiz = await Quiz.findByIdAndDelete(id);
    if (!this.deleteQuiz)
      return res.status(404).json({ message: "not found" })
    res.status(200).json({ message: 'Quiz deleted Successfully' })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

//delete quiz by id
deleteQuizById = async (res) => {
  try {
    deletedQuizs = await Quiz.deleteMany({});
    if (!deletedQuizs)
      return res.status(404).json({ message: "not found" })
    res.status(200).json({ message: 'Quiz deleted Successfully' })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

//update quiz

updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description, questions, timeLimit } = req.body;

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, description, questions, timeLimit }, { new: true }
    );
    if (!updatedQuiz)
      return res.status(404).json({ message: "Quiz not found" })

    res.status(200).json({ message: "Quiz updated successfully", data: updatedQuiz })
  } catch (error) {
    res.status(500).json({ message: 'Sever Error', error: error.message })
  }

}

// retrive quiz

retriveQuizs = async (res) => {
  try {
    const retrivedQuizes = await Quiz.find()
    if (!retrivedQuizes)
      return res.status(404).json({ message: "Quizes not found" })
    res.status(200).json({ message: "Quizes retrive successfully", data: retrivedQuizes })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })

  }
}

//retrive quiz by id

retriveQuizById = async (req, res) => {
  const { id } = req.params;
  try {
    const retrivedQuizById = await Quiz.findById(id);
    if (!retrivedQuizById)
      return res.status(404).json({ message: "Quize not found" })
    res.status(200).json({ message: "Quize retrives successfully", data: retrivedQuizes })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }

}



module.exports = { newQuiz, deleteQuiz,deleteQuizById, updateQuiz, retriveQuizs, retriveQuizById };
