import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarCoach.css';

const NavbarCoach = () => {
    return (
        <div className="navbar-container">
            {/* Top Bar */}
            {/* <div className="top-bar">
                <h1>Admin Dashboard</h1>
            </div> */}

            {/* Sidebar */}
            <div className="sidebar">
                <ul>
                    <li>
                        <Link to="/coach/profile">Dashboard</Link>
                    </li>
                    <li></li>
                    <li></li>
                    <li>
                        <Link to="/coach/course">Manage Course</Link>
                    </li>
                    <li>
                        <Link to="/coach/create-course"> Create Course</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/coach/exercise-bank">Manage Exercise</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/coach/subscription">Manage Subscription</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavbarCoach;