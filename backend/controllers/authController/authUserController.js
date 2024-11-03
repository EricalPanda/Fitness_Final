const Account = require("../../models/account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../utils/sendEmail");
const { validationResult } = require("express-validator");

// Đăng ký người dùng
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let account = await Account.findOne({ email });

    if (account) {
      return res.status(400).json({ msg: "Account already exists" });
    }

    account = new Account({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(password, salt);

    await account.save();

    res.json({
      msg: "Account registered successfully, please log in.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
  // Kiểm tra lỗi validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Tìm account bằng email
    const account = await Account.findOne({ email });

    if (!account) {
      return res.status(400).json({ msg: "Email không đúng" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Mật khẩu không đúng" });
    }

    // Tạo payload cho JWT, bao gồm cả role
    const payload = {
      id: account._id,
      email: account.email,
      name: account.name,
      role: account.role,
    };

    // Ký JWT và trả về token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          role: account.role,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Google login
exports.googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;
  const password = ""; // No password for Google login
  console.log(">>> ", email, name, googleId);

  if (!email) {
    return res.status(400).json({ msg: "Email không hợp lệ" });
  }

  try {
    let account = await Account.findOne({ email });

    if (account) {
      const payload = {
        id: account._id,
        email: account.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      return res.status(200).json({ msg: "Login successful", token, role: account.role });
    } else {
      // Create a new account if it doesn't exist
      account = new Account({
        email,
        name: name,
        password: password,
        status: "activate",
      });

      await account.save();

      const payload = {
        id: account._id,
        email: account.email,
        name: account.name,
        role: account.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET);
      console.log("token >>> ", token);

      return res
        .status(201)
        .json({ msg: "Account created and logged in", token, role: account.role });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(">>> email: ", email);

  const user = await Account.findOne({ email: email });
  if (!user) {
    return res.send({ Status: "Not Existed" });
  }

  const token = jwt.sign({ id: user._id }, "jwt_secret_key", {
    expiresIn: "5m",
  });

  const to = email;
  const subject = "Reset Password Link";
  const text = `http://localhost:3000/resetpassword/${user._id}/${token}`;

  if (!to || !subject || !text) {
    console.log("Please provide email, subject, and content");
    return res
      .status(400)
      .json({ error: "Please provide email, subject, and content" });
  }

  try {
    await sendEmail(to, subject, text);
    return res.status(200).json({ Status: "Success" });
  } catch (error) {
    return res.status(500).json({ Status: "Error sending email" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  console.log(">>> id, token, password >>> ", id, token, password);

  try {
    // Verify the token
    jwt.verify(token, "jwt_secret_key", async (err, decoded) => {
      if (err) {
        return res.status(400).json({ Status: "Error with token" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update the password in the database
      await Account.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword }
      );

      res.json({ Status: "Success", msg: "Password updated successfully" });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ Status: "Server Error", error: err.message });
  }
};
