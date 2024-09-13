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

module.exports = {newQuiz};
