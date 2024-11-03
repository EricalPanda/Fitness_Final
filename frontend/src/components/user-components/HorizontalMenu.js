// Menu nằm ngang ở trong View Schedules
import React from "react";
import "./HorizontalMenu.css";

const HorizontalMenu = () => {
  return (
    <div className="horizontal-menu">
      <ul>
        <li>
          <a href="#">Course Detail</a>
        </li>
        <li>
          <a href="#">Course Management</a>
        </li>
        <li>
          <a href="#">Course Schedule</a>
        </li>
        <li>
          <a href="#">View Coach's Advices</a>
        </li>
        <li>
          <a href="#">Chat With Coach</a>
        </li>
      </ul>
    </div>
  );
};

export default HorizontalMenu;
