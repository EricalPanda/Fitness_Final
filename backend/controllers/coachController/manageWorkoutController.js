const Workout = require('../../models/workout');

// Lấy danh sách tất cả các workouts
const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find().populate('exerciseId');
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bài tập', error });
  }
};

// Lấy thông tin một workout cụ thể theo ID
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate('exerciseId');
    if (!workout) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập' });
    }
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bài tập', error });
  }
};

// Tạo mới một workout
const createWorkout = async (req, res) => {
  const { name, dateNumber, status, exerciseId, completed } = req.body;

  try {
    const newWorkout = new Workout({
      name,
      dateNumber,
      status,
      exerciseId,
      completed,
    });

    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tạo bài tập', error });
  }
};

// Cập nhật một workout theo ID
const updateWorkout = async (req, res) => {
  const { name, dateNumber, status, exerciseId, completed } = req.body;

  try {
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      {
        name,
        dateNumber,
        status,
        exerciseId,
        completed,
      },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập để cập nhật' });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi cập nhật bài tập', error });
  }
};

// Xóa một workout theo ID
const deleteWorkout = async (req, res) => {
  try {
    const deletedWorkout = await Workout.findByIdAndDelete(req.params.id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Không tìm thấy bài tập để xóa' });
    }
    res.status(200).json({ message: 'Xóa bài tập thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bài tập', error });
  }
};

// Export tất cả các hàm
module.exports = {
  getAllWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
