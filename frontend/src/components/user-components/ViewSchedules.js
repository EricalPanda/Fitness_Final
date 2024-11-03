import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
} from "date-fns";
import axios from "axios";
import moment from "moment";
import './ViewSchedules.css';
import "../css/bootstrap.min.css";
import "../css/font-awesome.min.css";
import "../css/style.css";

const ViewSchedules = () => {
  const { subscriptionId } = useParams();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workouts, setWorkouts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchMonthlyWorkouts();
  }, [currentMonth]);

  const fetchMonthlyWorkouts = async () => {
    const token = localStorage.getItem("token");
    try {
      const startDate = startOfMonth(currentMonth);
      const endDate = endOfMonth(currentMonth);
      const response = await axios.get(
        `http://localhost:5000/api/users/subscriptions/${subscriptionId}/workouts`,
        {
          params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const handleDateClick = (date) => {
    const isWorkoutDay = workouts.some(workout =>
      isSameDay(new Date(workout.date), date)
    );

    if (isWorkoutDay) {
      setSelectedDate(date);
      fetchWorkouts(date);
      setShowPopup(true);
    }
  };

  const fetchWorkouts = async (date) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/subscriptions/${subscriptionId}/workouts?date=${date.toISOString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error("Error fetching workouts:", error);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="prev-btn">Previous</button>
        <span className="current-month">{format(currentMonth, dateFormat)}</span>
        <button onClick={nextMonth} className="next-btn">Next</button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const dateFormat = "eeee";
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <th key={i} className="day-header">
          {format(addDays(startDate, i), dateFormat)}
        </th>
      );
    }
    return <tr>{days}</tr>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isWorkoutDay = workouts.some(workout =>
          isSameDay(new Date(workout.date), cloneDay)
        );

        days.push(
          <td
            key={day}
            className={`hover-bg ts-meta ${!isSameMonth(day, monthStart) ? "disabled" : isWorkoutDay ? "workout-day" : ""
              } ${isSameDay(day, new Date()) ? "selected" : ""}`}
            onClick={() => handleDateClick(cloneDay)}
            style={{ backgroundColor: isWorkoutDay ? "#d3d3d3" : "" }}
          >
            <span className="date-number">{formattedDate}</span>
          </td>
        );
        day = addDays(day, 1);
      }
      rows.push(<tr key={day}>{days}</tr>);
      days = [];
    }
    return <tbody>{rows}</tbody>;
  };

  const closeModal = () => {
    setShowPopup(false);
    window.location.reload();
  };

  const renderPopup = () => {
    return (
      <div className={`popup ${showPopup ? "show" : ""}`}>
        <div className="popup-content">
          <h3>Workout Details for {format(selectedDate, "MMMM d, yyyy")}</h3>
          {workouts.length > 0 ? (
            <ul>
              {workouts.map((workout) => (
                <li key={workout._id}>
                  <strong>{workout.name}</strong> - {workout.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No workout scheduled for this day.</p>
          )}
          <button onClick={closeModal} className="close-btn">Close</button>
        </div>
      </div>
    );
  };

  return (
    <section className="class-timetable-section spad">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="section-title">
              <span>Find Your Time</span>
              <h2>Find Your Time</h2>
            </div>
          </div>
        </div>

        {renderHeader()}

        <div className="row">
          <div className="col-lg-12">
            <div className="class-timetable">
              <table>
                <thead>{renderDays()}</thead>
                {renderCells()}
              </table>
            </div>
          </div>
        </div>

        {showPopup && renderPopup()}
      </div>
    </section>
  );
};

export default ViewSchedules;
