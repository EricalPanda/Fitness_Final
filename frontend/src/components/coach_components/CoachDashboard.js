import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Container,
  Dropdown,
  DropdownButton,
  Pagination,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CourseTable.css";

const CourseTable = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseDescription, setCourseDescription] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/coaches/course?page=${currentPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCourses(response.data.courses || []);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, [currentPage]);

  const handleCreateCourse = () => {
    navigate("/coach/create-course");
  };

  const handleEditCourse = (courseId) => {
    navigate(`coach/edit-course/${courseId}`);
  };

  const handleViewCourse = (courseId) => {
    navigate(`/coach/detail-course/${courseId}`);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCourseId(null);
    setCourseDescription("");
  };

  // Xóa khóa học
  const handleDeleteCourse = (courseId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/api/coaches/courses/delete/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setCourses(courses.filter((course) => course._id !== courseId));
          alert("Course deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting course:", error);
        });
    }
  };

  // Xử lý khi thay đổi trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="background-body">
      <Container className="container-table">
        <h2 className="custom-header">Courses</h2>
        <Button variant="primary" onClick={handleCreateCourse} className="mb-3">
          Create Course
        </Button>
        <br />

        <Table striped bordered hover className="course-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Course Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Exercises</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course._id}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{course.name}</td>
                <td>
                  <ReactQuill
                    value={course.description}
                    readOnly={true}
                    theme="snow"
                    modules={{ toolbar: false }}
                  />
                </td>
                <td>{course.price}</td>
                <td>
                  {course.exercises && course.exercises.length > 0 ? (
                    <ul>
                      {course.exercises.map((exercise) => (
                        <li key={exercise._id}>{exercise.name}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No exercises</p>
                  )}
                </td>
                <td>
                  <DropdownButton
                    id={`dropdown-${course._id}`}
                    title="⋮"
                    variant="secondary"
                    size="sm"
                  >
                    <Dropdown.Item key={course._id} onClick={() => handleViewCourse(course._id)}>
                      View Course
                    </Dropdown.Item>
                    <Dropdown.Item key={course._id} onClick={() => handleEditCourse(course._id)}>
                      Edit
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-danger"
                    >
                      Delete
                    </Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Thêm phân trang */}
        <Pagination className="mt-3">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Container>
    </div>
  );
};

export default CourseTable;
