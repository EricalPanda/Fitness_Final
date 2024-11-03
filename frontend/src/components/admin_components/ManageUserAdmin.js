import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faEye, faEdit, faBan, faCheck } from "@fortawesome/free-solid-svg-icons";
import 'bootstrap/dist/css/bootstrap.min.css';

const ManagerUser = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: "",
        name: "",
        role: "user",
        status: "activate",
        avatar: "",
        gender: "",
        dob: "",
        phone: "",
        address: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showConfirmBlockModal, setShowConfirmBlockModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/admins/accounts", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (showEditModal) {
            setSelectedUser({ ...selectedUser, [name]: value });
        } else {
            setNewUser({ ...newUser, [name]: value });
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        const filtered = users.filter(
            (user) =>
                (user.email && user.email.toLowerCase().includes(e.target.value.toLowerCase())) ||
                (user.name && user.name.toLowerCase().includes(e.target.value.toLowerCase()))
        );
        setFilteredUsers(filtered);
    };

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(
                `http://localhost:5000/api/admins/accounts/${selectedUser._id}`,
                selectedUser,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(res.data.msg);
            fetchUsers();
            setShowEditModal(false);
        } catch (err) {
            toast.error("Failed to update user");
        }
    };

    const handleBlockUnblockUser = async () => {
        try {
            const res = await axios.patch(
                `http://localhost:5000/api/admins/accounts/${selectedUser._id}/status`,
                { status: selectedUser.status === "activate" ? "blocked" : "activate" },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            toast.success(res.data.msg);
            fetchUsers();
            setShowConfirmBlockModal(false);
        } catch (err) {
            toast.error("Failed to change user status");
        }
    };

    const handleShowViewModal = (user) => {
        setSelectedUser(user);
        setShowViewModal(true);
    };
    const handleCloseViewModal = () => setShowViewModal(false);

    const handleShowEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };
    const handleCloseEditModal = () => setShowEditModal(false);

    const handleShowConfirmBlockModal = (user) => {
        setSelectedUser(user);
        setShowConfirmBlockModal(true);
    };
    const handleCloseConfirmBlockModal = () => setShowConfirmBlockModal(false);

    const handleUpgradeToCoach = async (userId) => { // Nhận userId
        setLoading(true); // Đặt trạng thái loading
        try {
            console.log("Selected User ID for Upgrade:", userId);

            if (!userId) {
                toast.error("No user selected for upgrade");
                return;
            }

            // Gọi API để cập nhật vai trò
            const res = await axios.put(
                `http://localhost:5000/api/admins/accounts/role/${userId}`,
                { role: 'coach' },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(res.data);

            // Tạo một mục coach tương ứng
            await axios.post(
                `http://localhost:5000/api/admins/createCoach`,
                {
                    accountId: userId, // Sử dụng userId từ tham số
                    introduce: "",
                    selfImage: [],
                    contract: "",
                    certificate: [],
                    experience: []
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(res.data.msg);
            fetchUsers();
        } catch (err) {
            console.error(err.response ? err.response.data : err.message);
            toast.error("Failed to upgrade user to coach");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2>User Management</h2>
            <ToastContainer />

            <div className="d-flex justify-content-between mb-4">
                <Link to="/admin/user/createUser" className="btn btn-primary">
                    Create User
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

            {/* Users List */}
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
                    {currentUsers.map((user) => (
                        <tr key={user._id}>
                            <td>
                                <img
                                    src={user.avatar || "https://via.placeholder.com/50"}
                                    alt="avatar"
                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                            </td>
                            <td>{user.email}</td>
                            <td>{user.name}</td>
                            <td>{user.role}</td>
                            <td>{user.status}</td>
                            <td>
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="mx-2"
                                    onClick={() => handleShowViewModal(user)}
                                    style={{ cursor: "pointer" }}
                                />
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    className="mx-2"
                                    onClick={() => handleShowEditModal(user)}
                                    style={{ cursor: "pointer" }}
                                />
                                <FontAwesomeIcon
                                    icon={user.status === "activate" ? faBan : faCheck}
                                    className="mx-2"
                                    onClick={() => handleShowConfirmBlockModal(user)}
                                    style={{ cursor: "pointer" }}
                                />
                                <Button
                                    variant="success"
                                    onClick={() => handleUpgradeToCoach(user._id)}
                                    className="mx-2"
                                >
                                    Upgrade to Coach
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Pagination */}
            <nav>
                <ul className="pagination justify-content-center">
                    {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }).map((_, index) => (
                        <li key={index} className="page-item">
                            <button onClick={() => paginate(index + 1)} className="page-link">
                                {index + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* View User Modal */}
            <Modal show={showViewModal} onHide={handleCloseViewModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <>
                            <p><strong>ID:</strong> {selectedUser._id}</p>
                            <p><strong>Email:</strong> {selectedUser.email}</p>
                            <p><strong>Name:</strong> {selectedUser.name}</p>
                            <p><strong>Gender:</strong> {selectedUser.gender}</p>
                            <p><strong>Date of Birth:</strong> {selectedUser.dob}</p>
                            <p><strong>Phone:</strong> {selectedUser.phone}</p>
                            <p><strong>Address:</strong> {selectedUser.address}</p>
                            <p><strong>Role:</strong> {selectedUser.role}</p>
                            <p><strong>Status:</strong> {selectedUser.status}</p>
                            {/* Additional fields can be displayed here */}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseViewModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <Form onSubmit={handleUpdateUser}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={selectedUser.email} readOnly />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" value={selectedUser.name} onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })} required />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Gender</Form.Label>
                                <Form.Control as="select" name="gender" value={selectedUser.gender} onChange={(e) => setSelectedUser({ ...selectedUser, gender: e.target.value })}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date of Birth</Form.Label>
                                <Form.Control type="date" name="dob" value={selectedUser.dob} onChange={(e) => setSelectedUser({ ...selectedUser, dob: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="text" name="phone" value={selectedUser.phone} onChange={(e) => setSelectedUser({ ...selectedUser, phone: e.target.value })} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" value={selectedUser.address} onChange={(e) => setSelectedUser({ ...selectedUser, address: e.target.value })} />
                            </Form.Group>
                            {/* Additional fields can be edited here */}
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseEditModal}>
                                    Close
                                </Button>
                                <Button type="submit" variant="primary">
                                    Update User
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Modal.Body>
            </Modal>

            {/* Confirm Block/Unblock User Modal */}
            <Modal show={showConfirmBlockModal} onHide={handleCloseConfirmBlockModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser?.status === "activate" ? "Block User" : "Unblock User"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {selectedUser?.status === "activate" ? "block" : "unblock"} this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirmBlockModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleBlockUnblockUser}>
                        {selectedUser?.status === "activate" ? "Block" : "Unblock"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagerUser;
