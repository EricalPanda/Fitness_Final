import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import CSS của React Quill
import "./ExerciseList.css";

const ExerciseList = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]); // Dữ liệu bài tập từ API
  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [show, setShow] = useState(false); // Trạng thái hiển thị modal chi tiết
  const [showCreateModal, setShowCreateModal] = useState(false); // Trạng thái hiển thị modal tạo bài tập
  const [selectedExercise, setSelectedExercise] = useState(null); // Bài tập được chọn để hiển thị trong modal
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [newExercise, setNewExercise] = useState({
    name: "",
    description: "",
    exerciseType: "",
    exerciseDuration: "",
    video: "",
    difficulty: "",
  }); // Lưu trữ thông tin bài tập mới

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/coaches/exercises", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setExercises(response.data);
      })
      .catch((error) => {
        console.error("Error fetching exercises:", error);
      });
  }, []); // Chỉ chạy một lần khi component mount

  // Lọc các bài tập theo từ khóa tìm kiếm
  const filteredExercises = exercises.filter(
    (exercise) =>
      !searchTerm ||
      (exercise.name &&
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Hàm để hiển thị modal chi tiết
  const handleShow = (exercise) => {
    setSelectedExercise(exercise); // Lưu bài tập được chọn
    setIsEditing(false); // Khi mở modal, tắt chế độ chỉnh sửa
    setShow(true); // Hiển thị modal
  };

  const handleClose = () => setShow(false);

  const handleEditToggle = () => setIsEditing(true);

  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to update an exercise.");
      return;
    }

    const exerciseId = selectedExercise._id;
    console.log("exerciseId: ", exerciseId);


    console.log("Data being sent to the server:", {
      name: selectedExercise.name,
      description: selectedExercise.description,
      exerciseType: selectedExercise.exerciseType,
      exerciseDuration: selectedExercise.exerciseDuration,
      video: selectedExercise.video,
      difficulty: selectedExercise.difficulty,
    });

    axios
      .put(
        `http://localhost:5000/api/coaches/exercises/${exerciseId}`,
        {
          name: selectedExercise.name,
          description: selectedExercise.description,
          exerciseType: selectedExercise.exerciseType,
          exerciseDuration: selectedExercise.exerciseDuration,
          video: selectedExercise.video,
          difficulty: selectedExercise.difficulty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setExercises(
          exercises.map((exercise) =>
            exercise._id === selectedExercise._id ? response.data : exercise
          )
        );
        alert("Exercise updated successfully!");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(
          "Error updating exercise:",
          error.response ? error.response.data : error.message
        );
        alert("Failed to update exercise.");
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exercise?"
    );
    if (confirmDelete) {
      const token = localStorage.getItem("token");

      axios
        .delete(`http://localhost:5000/api/coaches/exercises/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong request để xác thực
          },
        })
        .then(() => {
          setExercises(exercises.filter((exercise) => exercise._id !== id));
          alert("Exercise deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting exercise:", error);
          alert("Failed to delete exercise.");
        });
    }
  };

  // Hàm để cập nhật giá trị của các trường khi chỉnh sửa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedExercise({ ...selectedExercise, [name]: value });
  };

  // Hàm để cập nhật phần mô tả khi dùng React Quill
  const handleDescriptionChange = (value) => {
    setSelectedExercise({ ...selectedExercise, description: value });
  };


  // Hàm để mở modal tạo bài tập mới
  const handleShowCreateModal = () => setShowCreateModal(true);

  // Hàm để đóng modal tạo bài tập mới
  const handleCloseCreateModal = () => setShowCreateModal(false);

  // Hàm xử lý khi người dùng nhập thông tin bài tập mới
  const handleNewExerciseChange = (e) => {
    const { name, value } = e.target;
    setNewExercise({ ...newExercise, [name]: value });
  };

  // Hàm để lưu bài tập mới
  const handleCreateExercise = () => {
    const token = localStorage.getItem("token");

    axios
      .post(
        "http://localhost:5000/api/coaches/exercises",
        { ...newExercise },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong request để xác thực
          },
        }
      )
      .then((response) => {
        setExercises([...exercises, response.data]); // Cập nhật danh sách bài tập
        alert("Exercise created successfully!");
        handleCloseCreateModal(); // Đóng modal sau khi tạo thành công
      })
      .catch((error) => {
        console.error("Error creating exercise:", error);
        alert("Failed to create exercise.");
      });
  };

  return (
    <div className="exercise-list-container">
      <h2 className="page-title">Exercise Bank</h2>

      {/* Thanh tìm kiếm */}
      <input
        type="text"
        placeholder="Search exercises..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếm
      />

      {/* Nút tạo bài tập mới */}
      <Button variant="primary mb-3" onClick={handleShowCreateModal}>
        Create New Exercise
      </Button>

      <div className="exercise-list">
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div
              key={exercise._id.$oid}
              className="exercise-card"
              onClick={() => handleShow(exercise)}
            >
              <h3 onClick={() => handleShow(exercise)}>{exercise.name}</h3>
              <br />
              <p>
                <span>Type: </span>
                {exercise.exerciseType}
              </p>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(exercise._id?.$oid || exercise._id);
                }}
              >
                ✖
              </button>
            </div>
          ))
        ) : (
          <p>No exercises found</p>
        )}
      </div>

      {/* Modal tạo bài tập mới */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#333" }}>
            Create New Exercise
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ color: "black" }}>
            <Form.Group controlId="formNewName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newExercise.name}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewDescription">
              <Form.Label>Description</Form.Label>
              <ReactQuill
                value={newExercise.description}
                onChange={(value) =>
                  setNewExercise({ ...newExercise, description: value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formNewType">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="exerciseType"
                value={newExercise.exerciseType}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="number"
                name="exerciseDuration"
                value={newExercise.exerciseDuration}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewDifficulty">
              <Form.Label>Difficulty</Form.Label>
              <Form.Control
                type="text"
                name="difficulty"
                value={newExercise.difficulty}
                onChange={handleNewExerciseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNewVideo">
              <Form.Label>Link video</Form.Label>
              <Form.Control
                type="text"
                name="video"
                value={newExercise.video}
                onChange={handleNewExerciseChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCreateExercise}>
            Tạo bài tập
          </Button>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal để hiển thị thông tin chi tiết hoặc chỉnh sửa */}
      {selectedExercise && (
        <Modal show={show} onHide={handleClose} >
          <Modal.Header closeButton>
            <Modal.Title style={{ color: "black" }}>
              {isEditing ? "Edit Exercise" : selectedExercise.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isEditing ? (
              <Form style={{ color: "#333", marginBottom: "10px" }}>
                <Form.Group controlId="formName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={selectedExercise.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDescription">
                  <Form.Label>Description</Form.Label>
                  <ReactQuill
                    value={selectedExercise.description}
                    onChange={handleDescriptionChange}
                    style={{ color: "#000" }}
                  />
                </Form.Group>
                <Form.Group controlId="formType">
                  <Form.Label>Exercise Type</Form.Label>
                  <Form.Control
                    type="text"
                    name="exerciseType"
                    value={selectedExercise.exerciseType}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDuration">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    name="exerciseDuration"
                    value={selectedExercise.exerciseDuration}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formDifficulty">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    type="text"
                    name="difficulty"
                    value={selectedExercise.difficulty}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVideo">
                  <Form.Label>Video Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="video"
                    value={selectedExercise.video}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            ) : (
              <>
                <p>
                  <strong>Description:</strong> {selectedExercise.description}
                </p>
                <p>
                  <strong>Exercise Type:</strong>{" "}
                  {selectedExercise.exerciseType}
                </p>
                <p>
                  <strong>Duration:</strong> {selectedExercise.exerciseDuration}{" "}
                  minutes
                </p>
                <p>
                  <strong>Difficulty:</strong> {selectedExercise.difficulty}
                </p>
                <p>
                  <strong>Video:</strong>{" "}
                  <a
                    href={selectedExercise.video}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Watch Video
                  </a>
                </p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            {isEditing ? (
              <>
                <Button variant="primary" onClick={handleSaveChanges}>
                  Save Changes
                </Button>
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="warning" onClick={handleEditToggle}>
                Edit
              </Button>
            )}
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ExerciseList;
