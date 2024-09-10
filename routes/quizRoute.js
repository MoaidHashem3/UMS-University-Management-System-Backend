const {newQuiz} =module.require('../controllers/handelQuiz.js')
const express = module.require('express')
const router = express.Router();
const app = express();
app.use(express.json())
router.post('/quiz', newQuiz)

module.exports = router;
