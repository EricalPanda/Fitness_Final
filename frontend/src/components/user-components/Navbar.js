import React, { useState, useEffect } from "react";
import { fetchUserProfile } from "../../services/userService";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [activeMenu, setActiveMenu] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Kiểm tra token trong localStorage khi component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserProfile()
        .then((data) => {
          setUserName(data.name);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      {/* Offcanvas Menu Section Begin */}
      <div className="offcanvas-menu-overlay" />
      {/* Offcanvas Menu Section End */}
      {/* Header Section Begin */}
      <header className="header-section">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3">
              <div className="logo">
                <a href="./">
                  <img src={require('../img/logo.png')} alt="" />
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <nav className="nav-menu">
                <ul>
                  <li className={activeMenu === 'home' ? 'active' : ''}>
                    <a href="./" onClick={() => handleMenuClick('home')}>Home</a>
                  </li>
                  <li className={activeMenu === 'about' ? 'active' : ''}>
                    <a href="./about" onClick={() => handleMenuClick('about')}>About Us</a>
                  </li>
                  <li className={activeMenu === 'classes' ? 'active' : ''}>
                    <a href="./coach-details" onClick={() => handleMenuClick('classes')}>Coach</a>
                  </li>
                  <li className={activeMenu === 'classes' ? 'active' : ''}>
                    <a href="./course-details" onClick={() => handleMenuClick('classes')}>Course</a>
                  </li>
                  <li className={activeMenu === 'services' ? 'active' : ''}>
                    <a href="./blog" onClick={() => handleMenuClick('services')}>Blog</a>
                  </li >
                  <li className={activeMenu === 'contact' ? 'active' : ''}>
                    <a href="./contact" onClick={() => handleMenuClick('./contact')}>Contact</a>
                  </li>
                  <li className={activeMenu === 'pages' ? 'active' : ''}>
                    <a href="#">More</a>
                    <ul className="dropdown">
                      <li>
                        <a href="./bmi" onClick={() => handleMenuClick('bmi')}>Bmi calculate</a>
                      </li>
                      <li>
                        <a href="./calo" onClick={() => handleMenuClick('calo')}>Calories calculate</a>
                      </li>
                      <li>
                        <a href="./hiring" onClick={() => handleMenuClick('hiring')}>Hiring</a>
                      </li>
                    </ul>
                  </li>
                </ul >
              </nav >
            </div >
            <div className="col-lg-3">
              <div className="nav-right">
                {!isLoggedIn ? (
                  <div className="">
                    <a href="/signin" className="primary-btn btn-normal appoinment-btn">Login</a>
                  </div>
                ) : (
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton">
                      {userName || 'User'}
                    </button>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                      <Link className="dropdown-item" to="/userProfile">User Profile</Link>
                      <Link className="dropdown-item" to="/userSchedule">User Schedule</Link>
                      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div >
        </div >
      </header >
      {/* Header End */}
    </div >
  );
}

export default Navbar;
