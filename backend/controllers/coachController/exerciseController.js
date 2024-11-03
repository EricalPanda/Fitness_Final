const Exercise = require("../../models/exercise");
const Coach = require("../../models/account");
const mongoose = require("mongoose");

// Lấy danh sách bài tập theo coachId
exports.getExercisesByCoachId = async (req, res) => {
  try {
    const coachId = req.account.id;

    console.log(req.account.id, "000");

    // Tìm các bài tập với coachId được cung cấp
    const exercises = await Exercise.find({ coachId: coachId });

    if (!exercises || exercises.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài tập nào cho huấn luyện viên này.",
      });
    }
    // console.log("exercises", exercises);

    res.status(200).json(exercises);
  } catch (error) {
    console.error("Lỗi khi lấy bài tập theo coachId:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy bài tập", error: error.message });
  }
};

// Tạo một bài tập mới
exports.createExercise = async (req, res) => {
  try {
    const { name, description, exerciseType, exerciseDuration, difficulty } = req.body;
    const coachId = req.account.id;

    let videoUrl = null;
    if (req.file) {
      videoUrl = await uploadToCloudinary(req.file.buffer, "exercises");
    }

    const newExercise = new Exercise({
      name,
      description,
      exerciseType,
      exerciseDuration,
      video: videoUrl,
      difficulty,
      coachId,
    });

    await newExercise.save();

    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Lỗi khi tạo bài tập:", error);
    res.status(500).json({ message: "Lỗi khi tạo bài tập", error: error.message });
  }
};

// // Lấy danh sách tất cả bài tập
// exports.getAllExercises = async (req, res) => {
//   try {
//     const exercises = await Exercise.find(); // Tìm tất cả các bài tập
//     res.status(200).json(exercises); // Trả về danh sách bài tập
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách bài tập:", error);
//     res
//       .status(500)
//       .json({ message: "Lỗi khi lấy danh sách bài tập", error: error.message });
//   }
// };

// Lấy bài tập theo ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id); // Tìm bài tập theo ID
    if (!exercise) {
      return res.status(404).json({ message: "Bài tập không tồn tại" });
    }
    res.status(200).json(exercise); // Trả về thông tin bài tập
  } catch (error) {
    console.error("Lỗi khi lấy bài tập:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy bài tập", error: error.message });
  }
};

exports.updateExercise = async (req, res) => {
  try {
    const { name, description, exerciseType, exerciseDuration, video, difficulty } = req.body;

    // Tìm bài tập theo ID
    const exercise = await Exercise.findById(req.params.id);
    console.log("req.params.id ", req.params.id);

    console.log("123 exercise", exercise);


    // Kiểm tra nếu bài tập không tồn tại
    if (!exercise) {
      return res.status(404).json({ message: "Bài tập không tồn tại" });
    }

    // Cập nhật bài tập với dữ liệu mới
    const updatedExercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        exerciseType,
        exerciseDuration,
        video,
        difficulty,
      },
      { new: true } // Trả về bài tập đã cập nhật
    );

    res.status(200).json(updatedExercise); // Trả về bài tập sau khi cập nhật
  } catch (error) {
    console.error("Lỗi khi cập nhật bài tập:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật bài tập", error: error.message });
  }
};


// Xóa một bài tập
exports.deleteExercise = async (req, res) => {
  try {
    console.log("Request params ID:", req.params.id); // Kiểm tra ID của bài tập nhận được từ request

    // Tìm bài tập theo ID
    const exercise = await Exercise.findById(req.params.id);

    // Kiểm tra nếu bài tập không tồn tại
    if (!exercise) {
      console.log("Exercise not found"); // Log nếu bài tập không tồn tại
      return res.status(404).json({ message: "Bài tập không tồn tại" });
    }

    // Xóa bài tập
    await Exercise.deleteOne({ _id: req.params.id });
    console.log("Exercise deleted successfully"); // Log khi bài tập đã được xóa
    res.status(200).json({ message: "Bài tập đã được xóa thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bài tập:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi xóa bài tập", error: error.message });
  }
};
