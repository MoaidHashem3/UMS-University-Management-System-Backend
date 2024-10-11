const Course = require("../models/courseModel");
const User = require("../models/usersModel");
const Quiz = require("../models/quizModel")

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate("quizzes").populate("students").populate("professor", "name");
    if (courses.length == 0) {
      return res.status(404).json({ message: "No Courses Found!" });
    }
    res.status(200).json(courses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("quizzes")
      .populate("students");

    if (!course) {
      return res.status(404).json({ message: "No Course Found!" });
    }
    const imageUrl = `${req.protocol}://${req.get('host')}/${course.image}`;
    const contentWithFullPaths = course.content.map(item => ({
      title: item.title, 
      filePath: `${req.protocol}://${req.get('host')}/${item.filePath.replace(/\\/g, "/")}`,
    }));

    res.status(200).json({
      ...course.toObject(),
      imageUrl,
      content: contentWithFullPaths, 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const createCourse = async (req, res) => {
  const course = req.body;
  try {
    if (req.file) {
      course.image = req.file.path;
    }

    const newCourse = new Course(course);
    const savedCourse = await newCourse.save();

    await User.findByIdAndUpdate(
      course.professor, 
      { $push: { createdCourses: savedCourse._id} }, 
      { new: true } 
    );

    res.status(201).json({ message: "Course created successfully", data: savedCourse });
  } catch (err) {
    console.error("Error creating course:", err); 
    res.status(400).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { quizId } = req.body; 
  console.log(id, quizId)
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $push: { quizzes: quizId } }, // Adds the quizId to the quizzes array
      { new: true } // Return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ message: "Course updated successfully", updatedCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    const imagePath = req.file.path.replace(/\\/g, "/"); 

    course.image = imagePath;
    await course.save();

    const imageUrl = `${req.protocol}://${req.get('host')}/${imagePath}`;

    res.status(200).json({ message: "Image uploaded successfully", imageUrl });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const uploadContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("Course not found");

    const { title } = req.body;

    if (!title) {
      return res.status(400).send("Title is required");
    }

    const contentItem = {
      title,
      filePath: req.file.path.replace(/\\/g, "/"),
    };

    course.content.push(contentItem);
    await course.save();

    res.status(200).send("Content uploaded and updated for course");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};


const deleteCourseById = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteAllCourse = async (req, res) => {
  try {
    const deletedCourses = await Course.deleteMany();
    if (deletedCourses.deletedCount === 0) {
      return res.status(404).json({ message: "No courses found to delete" });
    }
    res.status(200).json({ message: `${deletedCourses.deletedCount} courses deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const enrollInCourse = async (req, res)=>{
  const { courseId, studentId } = req.params;
  try{
    const course = await Course.findById(courseId);
    const student = await User.findById(studentId);

    if(!course || !student){
      return res.status(404).json({ message: "Course or student not found" });
    }

    if(course.students.includes(studentId)){
      return res.status(400).json({ message: "Student is already enrolled in this course" });
    }

    // Enroll the student in the course
    course.students.push(studentId);
    await course.save();
    
    // Add the course to the student's enrolled courses
    student.enrolledCourses.push(courseId);
    await student.save();
    
    res.status(200).json({ message: "Student enrolled successfully in the course" });

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
}
const getStudentsInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Fetch the course to get the enrolled students
    const course = await Course.findById(courseId).populate('students');
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find all students enrolled in the course
    const enrolledStudents = await User.find(
      { _id: { $in: course.students } },
      "name email quizzes"
    );

    // Find all quizzes in the course
    const quizzes = await Quiz.find({ course: courseId });
    
    // Fetch quiz scores for each student
    const studentsData = await Promise.all(
      enrolledStudents.map(async (student) => {
        let totalScore = 0;

        // Iterate through the student's quizzes and sum the total score
        student.quizzes.forEach(quiz => {
          totalScore += quiz.totalScore;
        });

        return {
          name: student.name,
          email: student.email,
          totalScore: totalScore, // Combined total score of all quizzes
        };
      })
    );

    res.status(200).json({
      message: "Students data retrieved successfully",
      data: studentsData,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  getAllCourse,
  getCourseById,
  createCourse,
  updateCourse,
  uploadImage,
  uploadContent,
  deleteCourseById,
  deleteAllCourse,
  enrollInCourse,
  getStudentsInCourse
};
