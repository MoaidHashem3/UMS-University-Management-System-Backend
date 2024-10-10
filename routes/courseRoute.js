const upload = require("../Middlewares/uploadConfig");
const express = module.require("express");
const router = express.Router();
const { getStudentsInCourse } = require("../controllers/handelCourse");
const auth = require("../middleware/authMiddleware");
const app = express();
const {
  getAllCourse,
  getCourseById,
  createCourse,
  updateCourse,
  uploadImage,
  uploadContent,
  deleteCourseById,
  deleteAllCourse,
  enrollInCourse,
} = require("../controllers/handelCourse");

app.use(express.json());
router.get("/", getAllCourse);
router.get("/:id", getCourseById);
router.post("/", upload.single("image"), createCourse);
router.put("/:id", updateCourse);
router.post("/enroll/:courseId/:studentId", enrollInCourse);
router.post("/uploadCourseImage/:id", upload.single("image"), uploadImage);
router.post(
  "/uploadCourseContent/:id",
  upload.single("pdfFile"),
  uploadContent
);
router.delete("/:id", deleteCourseById);
router.delete("/", deleteAllCourse);

router.get("/:courseId/students", getStudentsInCourse);

module.exports = router;
