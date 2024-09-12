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
  const Course = req.body;
  try {
    const newCourse = await Course.create(Course);
    res.status(201).json({ message: "Course created successfully" });
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

module.exports = { getAllCourse, createCourse, updateCourse };
