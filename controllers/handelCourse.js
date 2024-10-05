const Course = require("../models/courseModel");
const User = require("../models/usersModel");

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find().populate("quiz").populate("students");
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
    const course = await Course.findById(req.params.id).populate("quizzes").populate("students");
    if (!course) {
      return res.status(404).json({ message: "No Course Found!" });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCourse = async (req, res) => {
  const course = req.body;
  try {
    const newCourse = new Course(course);
    const savedCourse = await newCourse.save();

    res.status(201).json({ message: "Course created successfully", data: savedCourse });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("course not found");

    course.image = req.file.path;
    await course.save();

    res.send("Image uploaded and updated for course");
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};

const uploadContent = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send("course not found");

    course.content = [...course.content, req.file.path];
    await course.save();

    res.send("Content uploaded and updated for course");
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
};
