import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Import Authen
import SignIn from "./pages/authenticate_pages/SignInPage";
import SignUp from "./pages/authenticate_pages/SignUpPage";
import ForgotPassword from "./pages/authenticate_pages/ForgotPasswordPage";
import ResetPassword from "./pages/authenticate_pages/ResetPasswordPage";

// Import Home Page
import HomePage from './pages/user-pages/HomePage';
import AboutPage from './pages/user-pages/AboutPage';
import BmiCalculatorPage from './pages/user-pages/BmiCalculatorPage';
import BlogPage from './pages/user-pages/BlogPage';
import BlogDetailPage from './pages/user-pages/BlogDetailPage';
import ContactPage from './pages/user-pages/ContactPage';
import HiringPage from './pages/user-pages/HiringPage';
import CourseOverview from "./pages/user-pages/CourseOverview";

// Import User Page
import UserProfilePage from './pages/user-pages/UserProfilePage';
import ViewSchedulePage from './pages/user-pages/ViewSchedulePage';
import CoachListPage from './pages/user-pages/CoachListPage';
import CoachDetailPage from './pages/user-pages/CoachDetailPage';
import CaloriesCalculatorPage from './pages/user-pages/CaloriesCalculatorPage';
import CourseDetailPage from './pages/user-pages/CourseDetailPage';
import CourseListPage from './pages/user-pages/CourseListPage';
import SubscriptionCheckoutPage from './pages/user-pages/SubscriptionCheckoutPage';
import SubscriptionListPage from './pages/user-pages/SubscriptionListPage';

// Import coach page
// import CoachDashboard from './pages/coach-pages/CoachDashboard';
import CoachBlog from './components/coach_components/CoachBlog';
import CoachProfilePage from './pages/coach-pages/CoachProfilePage'
import CoachDashboard from "./pages/coach-pages/CoachDashboard";
import CreateCourseForm from "./pages/coach-pages/CreateCourseForm";
import CourseDetailCoach from "./pages/coach-pages/CourseDetails";
import ExerciseList from "./pages/coach-pages/ExerciseCoachPage";

import SubscriptionListPageCoach from "./pages/coach-pages/SubscriptionListPage";
import SubscriptionDetailPageCoach from "./pages/coach-pages/SubscriptionDetailPage";


// Import admin page
import ManageUserPage from './pages/admin-pages/ManageUserPage';
import CreateUserAdminPage from './pages/admin-pages/CreateUserAdminPage';


import ManageQuestionPage from './pages/admin-pages/ManageQuestionPage';
import SurveyUserPage from './pages/user-pages/SurveyUserPage';
import ManageCoachAdminPage from './pages/admin-pages/ManageCoachPage';


// import AdminDashboard from './pages/admin-pages/AdminDashboard';
import HiringAdmin from './pages/admin-pages/HiringAdmin';



function App() {
  return (
    <div className="app">
      <div className="content">
        <Routes>
          {/* Authen Router */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />

          {/* Home Page Router */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/bmi" element={<BmiCalculatorPage />} />
          <Route path="/calo" element={<CaloriesCalculatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:blogId" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/hiring" element={<HiringPage />} />

          {/* User Router */}
          <Route path="/userProfile" element={<UserProfilePage />} />
          <Route path="/userSchedule" element={<SubscriptionListPage />} />
          <Route path="/userSchedule/:subscriptionId" element={<ViewSchedulePage />} />

          <Route path="/coach-details" element={<CoachListPage />} />
          <Route path="/coach/:id" element={<CoachDetailPage />} />

          <Route path="/course-details" element={<CourseListPage />} />
          <Route path="/course/:id" element={<CourseDetailPage />} />
          <Route path="/subscriptionCheckout" element={<SubscriptionCheckoutPage />} />

          <Route path="/survey" element={<SurveyUserPage />} />
          <Route path="/course-overview" element={<CourseOverview />} />


          {/* Coach Router */}
          <Route path="/coach/profile" element={<CoachProfilePage />} />
          <Route path="/coach/blog" element={<CoachBlog />} />

          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/coach/course" element={<CoachDashboard />} />
          <Route path="/coach/create-course" element={<CreateCourseForm />} />
          <Route path="/coach/detail-course/:courseId" element={<CourseDetailCoach />} />
          <Route path="/coach/exercise-bank/" element={<ExerciseList />} />

          <Route path="/coach/subscription" element={<SubscriptionListPageCoach />} />
          <Route path="/coach/subscription/:subscriptionId" element={<SubscriptionDetailPageCoach />} />


          {/* Admin Router */}
          <Route path="/admin/user" element={< ManageUserPage />} />
          <Route path="/admin/user/createUser" element={< CreateUserAdminPage />} />

          <Route path="/admin/coach" element={< ManageCoachAdminPage />} />

          <Route path="/admin/hiring" element={<HiringAdmin />} />
          <Route path="/question" element={<ManageQuestionPage />} />

          {/* Coach Router */}

        </Routes >
      </div >
    </div >
  );
}

export default App;
