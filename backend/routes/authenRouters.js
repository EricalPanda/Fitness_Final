const express = require("express");
const router = express.Router();
const { login, googleLogin, register, forgotPassword, resetPassword } = require("../controllers/authController/authUserController");


router.post("/login", login);
router.post("/googleLogin", googleLogin);
router.post("/register", register);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:id/:token', resetPassword);

module.exports = router;
