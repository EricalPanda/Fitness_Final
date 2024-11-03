import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetail.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill CSS

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) return <div className="loading">Loading course details...</div>;
    if (error) return <div className="error">Error: {error}</div>;
    if (!course) return <div className="not-found">Course not found</div>;

    const { name, description, duration, price, difficulty, workoutId, coachId } = course;

    const handleBack = () => {
        navigate('/course-details');
    };

    const handlePayment = () => {
        navigate('/subscriptionCheckout', { state: { course: course } });
    };

    return (
        <div className="course-details">
            <button className="back-btn" onClick={handleBack}>&larr; Back to Courses</button>
            <div className="course-header">
                <h1 className="course-title">{name}</h1>
            </div>

            <div className="course-content">
                <div className="course-main-info">
                    <div className="highlight description-highlight">
                        <span className="highlight-label">Course Description</span>
                        {/* Use React Quill to display description */}
                        <div className="quill-container">
                            <ReactQuill value={description} readOnly={true} theme="bubble" />
                        </div>
                    </div>
                    <div className="course-highlights">
                        <div className="highlight">
                            <span className="highlight-label">Duration</span>
                            <span className="highlight-value">{duration}</span>
                        </div>
                        <div className="highlight">
                            <span className="highlight-label">Price</span>
                            <span className="highlight-value">{price} đ</span>
                        </div>
                        <div className="highlight">
                            <span className="highlight-label">Difficulty</span>
                            <span className="highlight-value">{difficulty}</span>
                        </div>
                    </div>
                    <button className="enroll-btn" onClick={handlePayment}>Subscribe</button>
                </div>
                <div className="course-sidebar">
                    <div className="sidebar-section">
                        <h3>Course Workouts</h3>
                        <ul className="workout-list">
                            {Array.isArray(workoutId) && workoutId.length > 0
                                ? workoutId.map((workout, index) => (
                                    <li key={index}>{workout.name || workout._id}</li>
                                ))
                                : <li>No workouts available</li>
                            }
                        </ul>
                    </div>
                    <div className="sidebar-section">
                        <h3>Coach</h3>
                        <p className="coach-name">{coachId ? (coachId.accountId.name || coachId._id) : 'No coach assigned'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
