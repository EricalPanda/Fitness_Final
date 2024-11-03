const Subscription = require("../../models/subscription");
const Workout = require("../../models/workout");
const Course = require("../../models/course");
const Exercise = require('../../models/exercise');

// Get subscriptions by coachId
const getSubscriptionsByCoachId = async (req, res) => {
    try {
        const coachId = req.account.id;

        // Find courses by coachId
        const courses = await Course.find({ coachId });

        // Extract courseIds to filter subscriptions
        const courseIds = courses.map(course => course._id);

        // Find subscriptions for those courses
        const subscriptions = await Subscription.find({ courseId: { $in: courseIds } })
            .populate("userId", "name email")
            .populate("courseId", "name description")
            .exec();

        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get workouts within a specific subscription
const getWorkoutsBySubscriptionId = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        // Find the subscription and populate the workout details
        const subscription = await Subscription.findById(subscriptionId).populate({
            path: "workoutId",
            model: "Workout",
            populate: {
                path: "workout.exerciseId",
                model: "Exercise",
                select: "name description"
            }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        res.status(200).json({ success: true, data: subscription.workoutId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller to get exercises by coachId
const getExercisesByCoach = async (req, res) => {
    try {
        const coachId = req.account.id;

        // Find all exercises associated with the provided coachId
        const exercises = await Exercise.find({ coachId });

        if (!exercises.length) {
            return res.status(404).json({ message: "No exercises found for this coach." });
        }

        res.status(200).json(exercises);
    } catch (error) {
        console.error("Error fetching exercises by coach:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Controller to update workout details
const updateWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        const { name, date, status, workout } = req.body;

        // Kiểm tra xem có workout nào khác cùng ngày không
        const existingWorkout = await Workout.findOne({ date, _id: { $ne: workoutId } });
        if (existingWorkout) {
            return res.status(400).json({ message: "A workout already exists for this date." });
        }

        // Kiểm tra các exerciseId trùng lặp trong workout
        const exerciseIds = workout.map((ex) => ex.exerciseId.toString());
        const hasDuplicates = exerciseIds.length !== new Set(exerciseIds).size;
        if (hasDuplicates) {
            return res.status(400).json({ message: "Duplicate exercise IDs are not allowed." });
        }

        // Cập nhật workout
        const updatedWorkout = await Workout.findByIdAndUpdate(
            workoutId,
            {
                name,
                date,
                status,
                workout,
            },
            { new: true }
        );

        if (!updatedWorkout) {
            return res.status(404).json({ message: "Workout not found" });
        }

        res.status(200).json(updatedWorkout);
    } catch (error) {
        console.error("Error updating workout:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    getSubscriptionsByCoachId,
    getWorkoutsBySubscriptionId,
    getExercisesByCoach,
    updateWorkout
};
