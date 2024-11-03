// Layout.js
import React, { useState } from "react";
import Sidebar from "./SideBar";
import "./SideBarLayout.css";

const SideBarLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="dashboard">
      {/* Sidebar và nút toggle */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Nội dung chính */}
      <div className={`content ${isSidebarOpen ? "" : "closed"}`}>
        {children} {/* Nội dung của từng trang */}
      </div>
    </div>
  );
};

export default SideBarLayout;
