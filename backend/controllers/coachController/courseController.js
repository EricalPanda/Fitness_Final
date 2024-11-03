const Course = require("../../models/course");
const Exercise = require("../../models/exercise");
const Coach = require("../../models/account");
const mongoose = require("mongoose");

// exerciseController.js
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find();

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({ message: "No exercises found." });
    }

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res
      .status(500)
      .json({ msg: "Error fetching exercises", error: error.message });
  }
};

// Tạo một khóa học mới
exports.createCourse = async (req, res) => {
  try {
    const { name, description, slotNumber, price, image, exercises, category } = req.body;

    const coachId = req.account.id;

    const exerciseIds = exercises.map((exerciseId) => {
      if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
        throw new Error(`Invalid exercise ID: ${exerciseId}`);
      }
      return new mongoose.Types.ObjectId(exerciseId);
    });

    // Kiểm tra xem các bài tập có tồn tại không
    const exerciseList = await Exercise.find({ _id: { $in: exerciseIds } });
    if (exerciseList.length !== exerciseIds.length) {
      const missingIds = exerciseIds.filter(id => !exerciseList.some(ex => ex._id.equals(id)));
      return res.status(404).json({ message: `Exercises not found for IDs: ${missingIds.join(', ')}` });
    }

    // Tạo khóa học mới
    const newCourse = new Course({
      name,
      description,
      slotNumber,
      price,
      image,
      coachId: new mongoose.Types.ObjectId(coachId),
      exercises: exerciseIds,
      category,
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: "Error creating course", error: error.message });
  }
};

// Lấy danh sách các khóa học theo coachId
exports.getCoursesByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCourses = await Course.countDocuments({ coachId: coachId });

    const courses = await Course.find({ coachId: coachId })
      .skip(skip)
      .limit(limit)
      .populate("coachId")
      .populate("exercises");

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: "No courses found for this coach" });
    }

    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

// Lấy khóa học theo id
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId)
      .populate("coachId")
      .populate("exercises");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res
      .status(500)
      .json({ message: "Error fetching course", error: error.message });
  }
};

// Cập nhật một khóa học
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      slotNumber,
      price,
      image,
      exercises,
      category,
    } = req.body;

    const exerciseList = await Exercise.find({ _id: { $in: exercises } });
    if (exerciseList.length !== exercises.length) {
      return res.status(404).json({ message: "Some exercises not found" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
        name,
        description,
        slotNumber,
        price,
        image,
        exercises,
        category,
      },
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res
      .status(500)
      .json({ message: "Error updating course", error: error.message });
  }
};

// Xóa khóa học
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.deleteOne({ _id: req.params.id });
    console.log("Course deleted successfully");
    res
      .status(200)
      .json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log("Error deleting course:", error);
    res
      .status(500)
      .json({ message: "Error deleting course", error: error.message });
  }
};
