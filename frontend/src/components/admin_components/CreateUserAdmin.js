// CreateUser.js
import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button, Form } from 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';

const CreateUser = ({ onUserCreated }) => {
    const [newUser, setNewUser] = useState({
        email: '',
        name: '',
        role: 'user',
        status: 'activate',
        avatar: '',
        gender: 'male',
        dob: '',
        phone: '',
        address: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();

        // Simple validation example
        if (!newUser.email || !newUser.name) {
            toast.error('Email and Name are required.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/admins/accounts', newUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.success(res.data.msg);
            onUserCreated();
            setNewUser({
                email: '',
                name: '',
                role: 'user',
                status: 'activate',
                avatar: '',
                gender: 'male',
                dob: '',
                phone: '',
                address: '',
            });
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to create user'); // More specific error message
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create New User</h2>
            <ToastContainer />
            <Form onSubmit={handleCreateUser}>
                {/* Form Fields for New User */}
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" name="email" value={newUser.email} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={newUser.name} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Control as="select" name="gender" value={newUser.gender} onChange={handleInputChange}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control type="date" name="dob" value={newUser.dob} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control type="text" name="phone" value={newUser.phone} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" name="address" value={newUser.address} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="status" value={newUser.status} onChange={handleInputChange}>
                        <option value="activate">Activate</option>
                        <option value="blocked">Blocked</option>
                    </Form.Control>
                </Form.Group>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary">
                        Create User
                    </Button>
                </Modal.Footer>
            </Form>
        </div>
    );
};

export default CreateUser;
