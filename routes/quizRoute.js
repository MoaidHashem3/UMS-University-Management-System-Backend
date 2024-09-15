const { newQuiz, deleteQuizById,deleteQuiz, updateQuiz, retriveQuizs, retriveQuizById } = module.require('../controllers/handelQuiz.js')
const express = module.require('express')
const router = express.Router();
const app = express();
app.use(express.json())

router.post('/', newQuiz);
router.patch('/:id', updateQuiz);
router.delete('/',deleteQuiz);
router.delete('/:id', deleteQuizById);
router.get('/', retriveQuizs);
router.get('/:id', retriveQuizById);

module.exports = router;
