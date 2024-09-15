const Course = require("../models/courseModel");

const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    if (courses.length == 0) {
      return res.status(404).json({ message: "No Users Found!" });
    }
    res.status(200).json(courses);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const createCourse = async (req, res) => {
  const course = req.body;
  try {

    const newCourse = new Course(course)
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
    if (!course) return res.status(404).send('course not found');

    course.image = req.file.path; 
    await course.save();

    res.send('Image uploaded and updated for course');
  } catch (err) {
      console.log(err)
    res.status(500).send(err.message);
  }
};
const uploadContent = async (req, res) => {
    
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).send('course not found');

    course.content = [...course.content, req.file.path];
    await course.save();

    res.send('Content uploaded and updated for course');
  } catch (err) {
      console.log(err)
    res.status(500).send(err.message);
  }
};
module.exports = { getAllCourse, createCourse, updateCourse,uploadImage,uploadContent };
