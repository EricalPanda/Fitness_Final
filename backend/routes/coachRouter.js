const express = require("express");
const router = express.Router();
const Coach = require('../models/coach');
const authMiddleware = require("../middleware/authMiddleware");

const { getCoachProfile, editCoachProfile } = require("../controllers/coachController/coachProfileController");

const { submitBlogByCoach, updateCoachBlog, deleteCoachBlog, getCoachBlogs, getCoachBlogsById } = require('../controllers/coachController/coachBlogManagement');

// const { getAllWorkouts, getWorkoutById, createWorkout, updateWorkout, deleteWorkout } = require('../controllers/coachController/manageWorkoutController');

// const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/coachController/manageCourseController');

const courseController = require('../controllers/coachController/courseController')

const exerciseController = require('../controllers/coachController/exerciseController')

const multer = require("../middleware/multer");

// COACH INFORMATION

router.get('/getCoachProfile', authMiddleware(['coach']), getCoachProfile);
router.put('/editCoachProfile', authMiddleware(['coach']), editCoachProfile);


// BLOG

router.post('/blogs', authMiddleware(['coach']), submitBlogByCoach);

// Get all blogs submitted by the logged-in coach
router.get('/blogs', authMiddleware(['coach']), getCoachBlogs);
router.get('/blogs/:blogId', authMiddleware(['coach']), getCoachBlogsById);

router.put('/blogs/:blogId', authMiddleware(['coach']), updateCoachBlog);

router.delete('/blogs/:blogId', authMiddleware(['coach']), deleteCoachBlog);




//CRUD Course
// router.get('/courses', getAllCourses);
// router.get('/courses/:id', getCourseById);
// router.post('/courses', createCourse);
// router.put('/courses/:id', updateCourse);
// router.delete('/courses/:id', deleteCourse);


/*
* --------------------------------------------------------------------------
*  COURSE
*
*/

// Tạo khóa học 
router.post("/createCourse", authMiddleware(["coach"]), courseController.createCourse);

// router.get("/exercises", authMiddleware(["coach"]), courseController.getAllExercises);

// Lấy danh sách các khóa học 
router.get("/course", authMiddleware(["coach"]), courseController.getCoursesByCoachId);
router.get("/course/:courseId", authMiddleware(["coach"]), courseController.getCourseById);

// Cập nhật khóa học 
router.put("/course/update/:courseId", authMiddleware(["coach"]), courseController.updateCourse);

// Xóa khóa học 
router.delete("/course/delete/:courseId", authMiddleware(["coach"]), courseController.deleteCourse);


/*
* --------------------------------------------------------------------------
*  EXERCISE
*
*/

router.get("/exercises", authMiddleware(["coach"]), exerciseController.getExercisesByCoachId);

// Route để tạo bài tập mới
router.post("/exercises", authMiddleware(["coach"]),
    multer.single("video"),
    exerciseController.createExercise
);
router.get("/exercises/:id", authMiddleware(["coach"]), exerciseController.getExerciseById);

// Route để cập nhật bài tập
router.put("exercises/:id", authMiddleware(["coach"]), exerciseController.updateExercise);

// Route để xóa bài tập
router.delete("exercises/:id", authMiddleware(["coach"]), exerciseController.deleteExercise);

// CRUD Workout
// router.get('/workout/', getAllWorkouts);
// router.get('/workout/:id', getWorkoutById);
// router.post('/workout/', createWorkout);
// router.put('/workout/:id', updateWorkout);
// router.delete('/workout/:id', deleteWorkout);

/*
* --------------------------------------------------------------------------
*  SUBSCRIPTION MANAGEMENT
*
*/
const { getSubscriptionsByCoachId, getWorkoutsBySubscriptionId, getExercisesByCoach, updateWorkout } = require("../controllers/coachController/subscriptionManagement");

router.get("/subscriptions", authMiddleware(["coach"]), getSubscriptionsByCoachId);

router.get("/subscriptions/:subscriptionId/workouts", authMiddleware(["coach"]), getWorkoutsBySubscriptionId);

router.get('/exercises', authMiddleware(["coach"]), getExercisesByCoach);

router.put('/workouts/:workoutId', authMiddleware(["coach"]), updateWorkout);


router.get('/', async (req, res) => {
    try {
        const coaches = await Coach.find().populate('accountId');
        res.status(200).json(coaches);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const coach = await Coach.findById(req.params.id).populate("accountId");
        if (!coach) {
            return res.status(404).json({ message: "Coach not found" });
        }
        res.status(200).json(coach);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


module.exports = router;