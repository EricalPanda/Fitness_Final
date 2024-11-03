const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getUserProfile, editUserProfile, changePassword, createSurvey } = require("../controllers/userController/userProfileController");
const { userHiringApply } = require("../controllers/userController/userHiringApplyController")
const upload = require('../middleware/multer')
const {
    // createSurvey,
    // getSurveysByUser,
    getSurveyByUserId,
    // updateSurvey
} = require("../controllers/userController/surveyUserController");

const courseController = require("../controllers/userController/courseController");
const workoutController = require("../controllers/userController/workoutController");

/*
* --------------------------------------------------------------------------
*  PROFILE
*
*/
router.put('/editUserProfile', authMiddleware(['user']), editUserProfile);
router.put('/changePassword', authMiddleware(['coach']), changePassword);
router.get('/getUserProfile', authMiddleware(['user']), getUserProfile);


/*
* --------------------------------------------------------------------------
*  COURSE
*
*/
// Route lấy toàn bộ khóa học
router.get("/courses", courseController.getAllCourses);

// Route lấy chi tiết khóa học
router.get("/courses/:id", courseController.getCourseDetail);

router.post("/payment", authMiddleware(['user']), courseController.subscriptionPayment);
// router.get("/payment-success", courseController.subscriptionPaymentSuccess);



/*
* --------------------------------------------------------------------------
*  WORKOUT
*
*/

router.get('/subscriptions', authMiddleware(['user']), workoutController.getUserSubscriptions);
router.get('/subscriptions/:subscriptionId/workouts', workoutController.getSubscriptionWorkouts);


router.post(
    '/hiringApply',
    authMiddleware(['user']),
    upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'frontId', maxCount: 1 },
        { name: 'backId', maxCount: 1 },
    ]),
    userHiringApply
);

//  survey của người dùng
router.post('/survey', createSurvey);
// router.get('/survey/:userId', getSurveysByUser);
router.get('/survey/:id', getSurveyByUserId);
// router.put('/survey/:id', updateSurvey);


module.exports = router;