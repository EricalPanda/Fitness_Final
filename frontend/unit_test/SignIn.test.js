import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SignIn from "../src/pages/authenticate/SignIn";

jest.mock("axios");
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: jest.fn(() => null),
}));
jest.mock("@react-oauth/google", () => ({
  GoogleLogin: jest.fn(({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ credential: "mock-credential" })}>
      Mock Google Login
    </button>
  )),
  googleLogout: jest.fn(),
}));
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({
    email: "test@example.com",
    name: "Test User",
    sub: "mock-google-id",
  })),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  test("renders sign in form", () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email address")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log In" })).toBeInTheDocument();
  });

  test("handles successful form submission", async () => {
    axios.post.mockResolvedValueOnce({
      data: { msg: "Login successful", token: "mock-token" },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/authenticate/login",
        { email: "test@example.com", password: "password123" }
      );
      expect(toast.success).toHaveBeenCalledWith("Login successful");
      expect(localStorage.setItem).toHaveBeenCalledWith("token", "mock-token");
    });
  });

  test("handles Google login success", async () => {
    axios.post.mockResolvedValueOnce({
      data: { msg: "Google login successful", token: "mock-google-token" },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.click(screen.getByText("Mock Google Login"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/authenticate/googleLogin",
        {
          email: "test@example.com",
          name: "Test User",
          googleId: "mock-google-id",
        }
      );
      expect(toast.success).toHaveBeenCalledWith("Google login successful");
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "token",
        "mock-google-token"
      );
    });
  });

  test("handles login with invalid credentials", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: "Invalid credentials" } },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("handles login with non-existent email", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: "User not found" } },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "nonexistent@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("User not found");
      expect(screen.getByText("User not found")).toBeInTheDocument();
    });
  });

  test("handles login with empty email", async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByPlaceholderText("Email address")).toBeInvalid();
  });

  test("handles login with empty password", async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByPlaceholderText("Password")).toBeInvalid();
  });

  test("handles login with invalid email format", async () => {
    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "invalidemail" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    expect(screen.getByPlaceholderText("Email address")).toBeInvalid();
  });

  test("handles server error during login", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { msg: "Server error" } },
    });

    render(
      <Router>
        <SignIn />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Log In" }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Server error");
      expect(screen.getByText("Server error")).toBeInTheDocument();
    });
  });
});
