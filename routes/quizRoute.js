const { newQuiz, deleteQuizById,deleteQuiz, updateQuiz, retriveQuizs, retriveQuizById } = module.require('../controllers/handelQuiz.js')
const express = module.require('express')
const router = express.Router();
const app = express();
app.use(express.json())

router.post('/quiz', newQuiz);
router.patch('/quiz', updateQuiz);
router.delete('/quiz',deleteQuiz);
router.delete('/quiz/:id', deleteQuizById);
router.get('/quiz', retriveQuizs);
router.get('/quiz/:id', retriveQuizById);

module.exports = router;
