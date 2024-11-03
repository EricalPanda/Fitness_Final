import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye, faEdit, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManagerCoach = () => {
    const [coaches, setCoaches] = useState([]);
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [coachesPerPage] = useState(10);

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admins/coaches", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data && res.data.coaches) {
                console.log(res.data.coaches);

                setCoaches(res.data.coaches);
                setFilteredCoaches(res.data.coaches);
            } else {
                throw new Error("Dữ liệu không phải là mảng");
            }
        } catch (err) {
            toast.error("Failed to fetch coaches");
            console.error("Error fetching coaches:", err);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = coaches.filter(
            (coach) =>
                (coach.email && coach.email.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (coach.name && coach.name.toLowerCase().includes(e.target.value.toLowerCase()))
        );
        setFilteredCoaches(Array.isArray(filtered) ? filtered : []);
    };


    const indexOfLastCoach = currentPage * coachesPerPage;
    const indexOfFirstCoach = indexOfLastCoach - coachesPerPage;
    const currentCoaches = filteredCoaches.slice(indexOfFirstCoach, indexOfLastCoach);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleShowViewModal = (coach) => {
        setSelectedCoach(coach);
        setShowViewModal(true);
    };
    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowEditModal = (coach) => {
        setSelectedCoach(coach);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleShowConfirmBlockModal = (coach) => {
        setSelectedCoach(coach);
        setShowConfirmBlockModal(true);
    };
    const handleCloseConfirmBlockModal = () => setShowConfirmBlockModal(false);

    const handleUpdateCoach = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:5000/api/admins/coaches/${selectedCoach._id}`,
                selectedCoach,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(res.data.msg);
            fetchCoaches();
            handleCloseEditModal();
        } catch (err) {
            toast.error("Failed to update coach");
        }
    };

    const handleBlockUnblockCoach = async () => {
        try {
            const newStatus = selectedCoach.status === "activate" ? "blocked" : "activate";
            const res = await axios.patch(
                `http://localhost:5000/api/admins/coaches/${selectedCoach._id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(res.data.msg);
            fetchCoaches();
            handleCloseConfirmBlockModal();
        } catch (err) {
            toast.error("Failed to change coach status");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Coach Management</h2>
            <ToastContainer />

            <div className="d-flex justify-content-between mb-4">
                <Link to="/admin/coach" className="btn btn-primary">
                    Create Coach
                </Link>
                <div>
                    <FontAwesomeIcon icon={faSearch} style={{ marginRight: "10px" }} />
                    <input
                        type="text"
                        placeholder="Search by email or name"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control"
                        style={{ display: "inline-block", width: "250px", backgroundColor: "#333", color: "#fff" }}
                    />
                </div>
            </div>

            {/* Coaches List */}
            <table className="table table-bordered" style={{ backgroundColor: "#333", color: "#fff" }}>
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCoaches.map((coach) => (
                        <tr key={coach._id}>
                            <td>
                                <img
                                    src={coach.avatar || "https://via.placeholder.com/50"}
                                    alt="avatar"
                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                            </td>
                            <td>{coach.email}</td>
                            <td>{coach.name}</td>
                            <td>{coach.role}</td>
                            <td>{coach.status}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="mx-2"
                                    onClick={() => handleShowViewModal(coach)}
                                    style={{ cursor: "pointer" }}
                                />
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="mx-2"
                                    onClick={() => handleShowEditModal(coach)}
                                    style={{ cursor: "pointer" }}
                                />
                                <FontAwesomeIcon
                                    icon={coach.status === "activate" ? faBan : faCheck}
                                    className="mx-2"
                                    onClick={() => handleShowConfirmBlockModal(coach)}
                                    style={{ cursor: "pointer" }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(filteredCoaches.length / coachesPerPage) }).map((_, index) => (
                        <li key={index} className="page-item">
                            <button onClick={() => paginate(index + 1)} className="page-link">
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* View Coach Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Coach Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCoach && (
                        <>
                            <p><strong>ID:</strong> {selectedCoach._id}</p>
                            <p><strong>Email:</strong> {selectedCoach.email}</p>
                            <p><strong>Name:</strong> {selectedCoach.name}</p>
                            <p><strong>Gender:</strong> {selectedCoach.gender}</p>
                            <p><strong>Date of Birth:</strong> {selectedCoach.dob}</p>
                            <p><strong>Phone:</strong> {selectedCoach.phone}</p>
                            <p><strong>Address:</strong> {selectedCoach.address}</p>
                            <p><strong>Status:</strong> {selectedCoach.status}</p>
                            <p><strong>Introduce:</strong> {selectedCoach.introduce}</p>

                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit Coach Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Coach</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCoach && (
                        <Form onSubmit={handleUpdateCoach}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={selectedCoach.email} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={selectedCoach.name} onChange={(e) => setSelectedCoach({ ...selectedCoach, name: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" value={selectedCoach.gender} onChange={(e) => setSelectedCoach({ ...selectedCoach, gender: e.target.value })}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="dob" value={selectedCoach.dob} onChange={(e) => setSelectedCoach({ ...selectedCoach, dob: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="tel" name="phone" value={selectedCoach.phone} onChange={(e) => setSelectedCoach({ ...selectedCoach, phone: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={selectedCoach.address} onChange={(e) => setSelectedCoach({ ...selectedCoach, address: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Introduce</Form.Label>
                                <Form.Control as="textarea" rows={3} name="introduce" value={selectedCoach.introduce} onChange={(e) => setSelectedCoach({ ...selectedCoach, introduce: e.target.value })} />
                            </Form.Group>
                            <Button type="submit" variant="primary">Save changes</Button>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Confirm Block/Unblock Modal */}
            <Modal show={showConfirmBlockModal} onHide={handleCloseConfirmBlockModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedCoach?.status === "activate" ? "Block Coach" : "Unblock Coach"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {selectedCoach?.status === "activate" ? "block" : "unblock"} this coach?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmBlockModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleBlockUnblockCoach}>
                        {selectedCoach?.status === "activate" ? "Block" : "Unblock"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagerCoach;
