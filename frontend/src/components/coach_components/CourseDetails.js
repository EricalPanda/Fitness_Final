import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Card, ListGroup, Button, Spinner, Form } from "react-bootstrap";
import "./CourseDetails.css";

const CourseDetails = ({ show, handleClose }) => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    slotNumber: "",
    category: "",
  });

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/coaches/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setCourse(response.data);
          setFormData({
            name: response.data.name,
            description: response.data.description,
            price: response.data.price,
            slotNumber: response.data.slotNumber,
            category: response.data.category,
          });
          console.log(response.data.description);

          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching course data");
          setLoading(false);
        });
    }
  }, [courseId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = () => {
    axios
      .put(`http://localhost:5000/api/coaches/course/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setCourse(response.data); // Update with the saved data
        setIsEditing(false); // Exit edit mode
      })
      .catch((error) => {
        setError("Error updating course data");
      });
  };

  const handleDelete = () => {
    axios
      .delete(`http://localhost:5000/api/coaches/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        setError("Error deleting course");
      });
  };

  if (loading) {
    console.log("Course ID:", courseId);
    return <div>Loading ...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="background-body">
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit Course" : course.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isEditing ? (
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formSlotNumber">
                <Form.Label>Slot Number</Form.Label>
                <Form.Control
                  type="number"
                  name="slotNumber"
                  value={formData.slotNumber}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formCategory">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          ) : (
            <>
              <Card.Img
                variant="top"
                src={course.image[0] || "default-image-url"}
                alt={course.name}
              />
              <Card.Body>
                <Card.Text>{course.description}</Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Price:</strong> ${course.price}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Slot Number:</strong> {course.slotNumber}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Category:</strong> {course.category}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <h5 className="mt-4">Exercises</h5>
              {course.exercises && course.exercises.length > 0 ? (
                <ListGroup variant="flush">
                  {course.exercises.map((exercise) => (
                    <ListGroup.Item key={exercise._id}>
                      {exercise.name} - {exercise.exerciseDuration} mins
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No exercises available.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={handleEditToggle}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="warning" onClick={handleEditToggle}>
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseDetails;
