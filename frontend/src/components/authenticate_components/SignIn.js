import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Role-based navigation function
  const handleNavigation = (role, name) => {
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    if (role === "admin") {
      navigate("/admin/user");
    } else if (role === "coach") {
      navigate("/coach");
    } else {
      navigate("/");
    }
  };

  // Handle successful Google login
  const onSuccess = async (response) => {
    const credential = response.credential;
    const decoded = jwtDecode(credential);

    const { email, name, sub: googleId } = decoded;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/authenticate/googleLogin",
        { email, name, googleId }
      );
      toast.success(res.data.msg);
      localStorage.setItem("token", res.data.token);

      // Call the role-based navigation function
      handleNavigation(res.data.role);
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error logging in with Google";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    }
  };

  // Handle failed Google login
  const onFailure = (error) => {
    console.log("[Login Failed]", error);
    toast.error("Google login failed.");
  };

  // Handle normal email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/authenticate/login",
        { email, password }
      );
      toast.success(response.data.msg);
      localStorage.setItem("token", response.data.token);

      // Call the role-based navigation function
      handleNavigation(response.data.role);
    } catch (error) {
      const errorMsg =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Error logging in";
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
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
                  Sign in
                </h3>

                {/* Google Login Button */}
                <div className="mb-4">
                  <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onFailure}
                    useOneTap
                  />
                </div>

                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                <div className="form-outline mb-4">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="pt-1 mb-4">
                  <button
                    type="submit"
                    className="btn btn-info btn-lg btn-block"
                  >
                    Log In
                  </button>
                </div>

                <p className="small mb-5 pb-lg-2">
                  <Link to="/forgotpassword" className="text-muted">
                    Forgot password?
                  </Link>
                </p>
                <p>
                  Don't have an account?{" "}
                  <Link to="/signup" className="link-info">
                    Sign up here
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
