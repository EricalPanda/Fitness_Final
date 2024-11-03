import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

// Gộp cả CourseList và CourseForm vào cùng một file ManageCourse.js
const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState({
        name: '',
        description: '',
        duration: '',
        price: 0,
        status: '',
        difficulty: '',
        coachId: ''
    });
    const [coaches, setCoaches] = useState([]);
    const history = useHistory();
    const { id } = useParams();

    // Fetch all courses
    useEffect(() => {
        axios.get('/api/courses')
            .then(response => setCourses(response.data))
            .catch(error => console.log('Error fetching courses:', error));
    }, []);

    // Fetch all coaches
    useEffect(() => {
        axios.get('/api/coaches')
            .then(response => setCoaches(response.data))
            .catch(error => console.log('Error fetching coaches:', error));
    }, []);

    // Fetch course by ID if editing
    useEffect(() => {
        if (id) {
            axios.get(`/api/courses/${id}`)
                .then(response => setCourse(response.data))
                .catch(error => console.log('Error fetching course:', error));
        }
    }, [id]);

    // Handle delete course
    const handleDelete = (id) => {
        axios.delete(`/api/courses/${id}`)
            .then(() => {
                setCourses(courses.filter(course => course._id !== id));
            })
            .catch(error => console.log('Error deleting course:', error));
    };

    // Handle form changes
    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    // Handle form submit (create or edit course)
    const handleSubmit = (e) => {
        e.preventDefault();
        if (id) {
            axios.put(`/api/courses/${id}`, course)
                .then(() => history.push('/courses'))
                .catch(error => console.log('Error updating course:', error));
        } else {
            axios.post('/api/courses', course)
                .then(() => history.push('/courses'))
                .catch(error => console.log('Error creating course:', error));
        }
    };

    return (
        <div>
            <h2>Manage Courses</h2>
            
            {/* Course List */}
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course) => (
                        <tr key={course._id}>
                            <td>{course.name}</td>
                            <td>{course.description}</td>
                            <td>{course.price}</td>
                            <td>{course.status}</td>
                            <td>
                                <button onClick={() => history.push(`/courses/${course._id}/edit`)}>Edit</button>
                                <button onClick={() => handleDelete(course._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Course Form (Create/Edit) */}
            <h3>{id ? 'Edit Course' : 'Create New Course'}</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={course.name}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Description:
                    <textarea
                        name="description"
                        value={course.description}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Duration:
                    <input
                        type="text"
                        name="duration"
                        value={course.duration}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Price:
                    <input
                        type="number"
                        name="price"
                        value={course.price}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Status:
                    <input
                        type="text"
                        name="status"
                        value={course.status}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Difficulty:
                    <input
                        type="text"
                        name="difficulty"
                        value={course.difficulty}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Coach:
                    <select
                        name="coachId"
                        value={course.coachId}
                        onChange={handleChange}
                    >
                        {coaches.map(coach => (
                            <option key={coach._id} value={coach._id}>
                                {coach.introduce}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="submit">
                    {id ? 'Update Course' : 'Create Course'}
                </button>
            </form>
        </div>
    );
};

export default ManageCourse;
