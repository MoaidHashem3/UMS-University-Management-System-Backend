const express = module.require("express");
const router = express.Router();
const app = express();
const {
  getAllCourse,
  createCourse,
  updateCourse,
} = require("../controllers/handelCourse");

app.use(express.json());
router.get("/", getAllCourse);
router.post("/", createCourse);
router.put("/:id", updateCourse);

module.exports = router;
