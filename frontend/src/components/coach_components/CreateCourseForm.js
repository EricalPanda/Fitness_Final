import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Form, Button, ProgressBar, Container, Card } from "react-bootstrap";
import "./CreateCourseForm.css"; // Thêm file CSS để tùy chỉnh

const CreateCourseForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // Đặt trạng thái để điều hướng giữa các bước
  const [progress, setProgress] = useState(50); // Thanh tiến trình
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    slotNumber: "",
    price: "",
    image: "",
    exercises: [], // Chỉnh sửa để sử dụng exercises thay vì exerciseId
    category: "",
  });
  const [exerciseSearch, setExerciseSearch] = useState([]); // Lưu giá trị tìm kiếm bài tập
  const [exercisesList, setExercisesList] = useState([]); // Danh sách bài tập lấy từ API
  const [selectedExercises, setSelectedExercises] = useState([]); // Các bài tập được chọn
  const [errors, setErrors] = useState({}); // Thêm trạng thái lỗi

  // Lấy danh sách bài tập từ API
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coaches/exercises", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setExercisesList(response.data || []); // Gán danh sách bài tập từ API
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }, []);

  // Xử lý thay đổi giá trị trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({
      ...courseData,
      [name]: value,
    });
  };

  // Xử lý thay đổi giá trị mô tả (description) với ReactQuill
  const handleDescriptionChange = (value) => {
    setCourseData({
      ...courseData,
      description: value,
    });
  };

  // Validate form trước khi submit
  const validateForm = () => {
    const newErrors = {};
    if (!courseData.name.trim()) {
      newErrors.name = "Course name is required";
    }
    if (!courseData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!courseData.slotNumber.trim()) {
      newErrors.slotNumber = "Slot number is required";
    }
    if (!courseData.price || isNaN(courseData.price) || courseData.price <= 0) {
      newErrors.price = "Please enter a valid price";
    }
    if (!courseData.category.trim()) {
      newErrors.category = "Category is required";
    }
    return newErrors;
  };

  // Xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Gọi validate
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Dừng submit nếu có lỗi
    }

    const course = {
      ...courseData,
      exercises: selectedExercises
        .filter((exercise) => exercise !== null)
        .map((exercise) => exercise._id),
    };

    console.log("Data being sent to backend:", course); // Thêm log

    axios
      .post("http://localhost:5000/api/coaches/createCourse", course, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Course created successfully:", response.data);
        alert("Course created successfully!");
        navigate("/coach/course"); // Chuyển hướng sau khi tạo thành công
      })
      .catch((error) => {
        console.error("Error creating course:", error);
        alert("Error creating course.");
      });
  };

  // Xử lý điều hướng giữa các bước
  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    setProgress(progress + 50);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    setProgress(progress - 50);
  };

  const renderStep1 = () => (
    <div className="form-background">
      <Card className="shadow-sm p-4 mb-4 bg-white rounded">
        <Card.Body>
          <Form>
            <Form.Group controlId="formCourseName">
              <Form.Label className="custom-label">Course Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={courseData.name}
                onChange={handleInputChange}
                required
                className="custom-input"
              />
              {errors.name && <p className="text-danger">{errors.name}</p>}
            </Form.Group>

            <Form.Group controlId="formDescription" className="mt-3">
              <Form.Label className="custom-label">Description</Form.Label>
              <ReactQuill
                style={{ color: "#333" }}
                value={courseData.description}
                onChange={handleDescriptionChange}
                className="custom-input"
              />
              {errors.description && (
                <p className="text-danger">{errors.description}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formSlotnumber" className="mt-3">
              <Form.Label className="custom-label">Slot Number</Form.Label>
              <Form.Control
                type="text"
                name="slotNumber"
                value={courseData.slotNumber}
                onChange={handleInputChange}
                required
                className="custom-input"
              />
              {errors.slotNumber && (
                <p className="text-danger">{errors.slotNumber}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formPrice" className="mt-3">
              <Form.Label className="custom-label">Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                required
                className="custom-input"
              />
              {errors.price && <p className="text-danger">{errors.price}</p>}
            </Form.Group>

            <Form.Group controlId="formCategory" className="mt-3">
              <Form.Label className="custom-label">Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                required
                className="custom-input"
              />
              {errors.category && (
                <p className="text-danger">{errors.category}</p>
              )}
            </Form.Group>

            <Form.Group controlId="formImages" className="mt-3">
              <Form.Label className="custom-label">Images</Form.Label>
              <Form.Control
                as="textarea"
                name="image"
                rows={2}
                placeholder="Enter image URLs separated by commas"
                value={courseData.image}
                onChange={(e) =>
                  setCourseData({ ...courseData, image: e.target.value })
                }
                className="custom-input"
              />
            </Form.Group>

            <Button variant="primary" className="mt-4" onClick={handleNext}>
              Next
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="form-background">
      <Card className="shadow-sm p-4 mb-4 bg-white rounded">
        <Card.Body>
          <h4 className="custom-label" style={{ color: "orange", fontSize: '40px', marginBottom: '40px' }}>
            Select Exercises
          </h4>

          <Form.Group className="mb-3">
            <Form.Label
              className="custom-label">

            </Form.Label>
            {exercisesList.length > 0 ? (
              exercisesList.map((exercise) => (
                <Form.Check

                  key={exercise._id}
                  type="checkbox"
                  id={`exercise-${exercise._id}`}
                  label={exercise.name}
                  checked={selectedExercises.includes(exercise)}
                  onChange={() => {
                    const newSelectedExercises = selectedExercises.includes(
                      exercise
                    )
                      ? selectedExercises.filter((ex) => ex !== exercise)
                      : [...selectedExercises, exercise];
                    setSelectedExercises(newSelectedExercises);

                    setCourseData({
                      ...courseData,
                      exercises: newSelectedExercises.map((ex) => ex._id),
                    });
                  }}
                />
              ))
            ) : (
              <p>No exercises available</p>
            )}
          </Form.Group>

          <Button
            variant="secondary"
            onClick={handlePrevious}
            className="mt-3 me-2"
          >
            Previous
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="mt-3">
            Submit
          </Button>
        </Card.Body>
      </Card>
    </div>
  );

  return (
    <Container className="mt-5">
      <div className="form-background">
        <h2 className="custom-header" style={{ color: 'orange' }}>Create Course</h2>
        <ProgressBar animated now={progress} className="mb-4" />
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>
    </Container>
  );
};

export default CreateCourseForm;
