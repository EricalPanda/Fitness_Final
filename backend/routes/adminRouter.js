const express = require("express");
const router = express.Router();

const userAdminController = require("../controllers/adminController/userAdmin");
const coachAdminController = require("../controllers/adminController/coachAdmin");

const adminHiringApplyController = require('../controllers/adminController/hiringManagement');

const {
  getAllBlogs,
  getBlogById,
  getAllCommentsByBlog,
  createComment,
  updateComment,
  deleteComment,
  updateBlog,
  createBlog,
  deleteBlog
} = require("../controllers/adminController/blogManagement");
const authMiddleware = require("../middleware/authMiddleware");


/*
* --------------------------------------------------------------------------
*  ACCOUNT
*
*/

// Get all accounts
router.get("/accounts", authMiddleware(['admin']), userAdminController.getAllAccounts);

// Create a new account
router.post("/accounts", authMiddleware(['admin']), userAdminController.createAccount);

// Update an account's 
router.put("/accounts/:accountId", authMiddleware(['admin']), userAdminController.updateAccount);

// Update user role to coach
router.put("/accounts/role/:id", authMiddleware(['admin']), userAdminController.UpdateRole);

// Block/unblock an account
router.patch("/accounts/:accountId/status", authMiddleware(['admin']), userAdminController.blockUnblockAccount);


/*
* --------------------------------------------------------------------------
*  COACH
*
*/

// Create a new coach
router.post("/createCoach", authMiddleware(['admin']), coachAdminController.createCoach);
router.get('/coaches', authMiddleware(['admin']), coachAdminController.getAllCoaches);
router.get('/coaches/:id', authMiddleware(['admin']), coachAdminController.getCoachById);
router.put('/coaches/edit', authMiddleware(['admin']), coachAdminController.editCoach);
router.patch('/coaches/block/:id', authMiddleware(['admin']), coachAdminController.blockUnblockCoach);

/*
* --------------------------------------------------------------------------
*  BLOG
*
*/

// CRUD Blog
router.get("/blogs", getAllBlogs);
router.post("/blogs", authMiddleware(['admin']), createBlog);
router.put("/blogs/:blogId", authMiddleware(['admin']), updateBlog);

router.get("/blogs/:blogId", getBlogById);

router.delete("/blogs/:blogId", authMiddleware(['admin']), deleteBlog);

// CRUD Comment
router.get("/blogs/:blogId/comments", getAllCommentsByBlog);
router.post("/blogs/:blogId/comments", authMiddleware(), createComment);
router.put("/comments/:commentId", authMiddleware(), updateComment);
router.delete("/comments/:commentId", authMiddleware(), deleteComment);


/*
* --------------------------------------------------------------------------
*  HIRING
*
*/

// Lấy tất cả các hồ sơ ứng tuyển
router.get('/hiring-applications', adminHiringApplyController.getAllHiringApplications);

// Lấy chi tiết một hồ sơ ứng tuyển theo ID
router.get('/hiring-applications/:id', adminHiringApplyController.getHiringApplicationById);

// Cập nhật trạng thái của một hồ sơ ứng tuyển
router.put('/hiring-applications/:id/status', adminHiringApplyController.updateHiringApplicationStatus);


module.exports = router;
