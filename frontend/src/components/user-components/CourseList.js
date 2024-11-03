import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CourseList.css';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the Quill styles

const CoursesList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const coursesPerPage = 3;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/users/courses');
                setCourses(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="loading">Loading courses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(courses.length / coursesPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    return (
        <div className="courses-list-container">
            <h1 className="courses-title">Available Courses</h1>
            <div className="courses-grid">
                {currentCourses.map(course => (
                    <div key={course._id} className="course-card">
                        <div className="course-header">
                            <h2 className="course-name">{course.name}</h2>
                            <span className="course-coach">
                                Coach: {course.coachId ? course.coachId.name : 'Unknown'}
                            </span>
                        </div>
                        {/* Use dangerouslySetInnerHTML to render the description as HTML */}
                        <p className="course-description" dangerouslySetInnerHTML={{ __html: course.description }} />
                        <div className="course-workouts">
                            <h3>Workouts</h3>
                            <ul>
                                {course.workoutId && course.workoutId.slice(0, 3).map(workout => (
                                    <li key={workout._id}>{workout.name}</li>
                                ))}
                            </ul>
                        </div>
                        <Link to={`/course/${course._id}`} className="details-btn">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>

            <div className="pagination">
                <button
                    className="pagination-btn"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span className="page-info">Page {currentPage} of {totalPages}</span>
                <button
                    className="pagination-btn"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CoursesList;
