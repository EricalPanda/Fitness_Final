import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Sử dụng useNavigate để điều hướng
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return regex.test(email);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password regex
    return regex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 special character."
      );
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the email and password formats are valid before submitting
    if (emailError || passwordError) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/authenticate/register",
        { email, password, name }
      );
      toast.success(response.data.msg);

      // Điều hướng tới trang đăng nhập sau khi đăng ký thành công
      navigate("/signin"); // Điều hướng người dùng đến trang đăng nhập
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return (
    <section className="" style={{ margin: "50px" }}>
      <div className="container-fluid">
        <div className="row">
          <div className="text-black">
            <div className="d-flex justify-content-center align-items-center">
              <form style={{ width: "23rem" }} onSubmit={handleSubmit}>
                <h3
                  className="fw-normal mb-3 pb-3"
                  style={{ letterSpacing: "1px" }}
                >
                  Sign Up
                </h3>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  {emailError && (
                    <div className="text-danger">{emailError}</div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Name"
                    onChange={handleNameChange}
                    value={name}
                    required
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  {passwordError && (
                    <div className="text-danger">{passwordError}</div>
                  )}
                </div>
                <div className="pt-1 mb-4">
                  <button
                    className="btn btn-info btn-lg btn-block"
                    type="submit"
                    disabled={emailError || passwordError}
                  >
                    Sign Up
                  </button>
                </div>
                <p className="small mb-5 pb-lg-2">
                  <Link className="text-muted" to="/forgotpassword">
                    Forgot password?
                  </Link>
                </p>
                <p>
                  Already have an account?{" "}
                  <Link to="/signin" className="link-info">
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
