import React from 'react';
import { Link } from 'react-router-dom';
import './NavbarAdmin.css';

const NavbarAdmin = () => {
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
                        <Link to="/admin/user">Dashboard</Link>
                    </li>
                    <li></li>
                    <li></li>
                    <li>
                        <Link to="/admin/user">Manage Users</Link>
                    </li>
                    <li>
                        <Link to="/admin/user/createUser"> * Create Users</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/admin/coach">Manage Coach</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/admin/couse">Manage Course</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/admin/couse">Manage Blog</Link>
                    </li>
                    <li></li>

                    <li>
                        <Link to="/admin/hiring">Manage Hiring Apply</Link>
                    </li>

                    <li></li>
                    <li>
                        <Link to="/admin/settings">Settings</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default NavbarAdmin;