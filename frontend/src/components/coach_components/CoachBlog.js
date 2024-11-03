import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, InputGroup, Pagination } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import './CoachBlog.css';

function CoachBlog() {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
        publicationDate: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        axios.get('http://localhost:5000/api/coaches/blogs')
            .then(response => {
                setBlogs(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the blogs!", error);
            });
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRowClick = (blog) => {
        setSelectedBlog(blog);
        setShowModal(true);
        setIsAdding(false);
        setFormData({
            title: blog.title || '',
            content: blog.content || '',
            image: blog.image || '',
            publicationDate: blog.publicationDate || ''
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedBlog(null);
        setIsAdding(false);
        setFormData({
            title: '',
            content: '',
            image: '',
            publicationDate: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddBlog = () => {
        setIsAdding(true);
        setShowModal(true);
        setFormData({
            title: '',
            content: '',
            image: '',
            publicationDate: ''
        });
    };

    const handleSave = () => {
        if (isAdding) {
            axios.post('http://localhost:5000/api/coaches/blogs', formData)
                .then(response => {
                    setBlogs([...blogs, response.data]);
                    handleCloseModal();
                })
                .catch(error => {
                    console.error("There was an error adding the blog!", error);
                });
        } else {
            axios.put(`http://localhost:5000/api/coaches/blogs/${selectedBlog._id}`, formData)
                .then(response => {
                    setBlogs(prevBlogs => prevBlogs.map(blog => blog._id === response.data._id ? response.data : blog));
                    handleCloseModal();
                })
                .catch(error => {
                    console.error("There was an error updating the blog!", error);
                });
        }
    };

    const handleDelete = (blogId) => {
        axios.delete(`http://localhost:5000/api/coaches/blogs/${blogId}`)
            .then(() => {
                setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
            })
            .catch(error => {
                console.error("There was an error deleting the blog!", error);
            });
    };

    const handleChangePage = (newPage) => {
        setPage(newPage - 1);
    };

    return (
        <div className="coach-blog-container">
            {/* Search Bar */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <InputGroup>
                    <Form.Control
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <InputGroup.Text><FaSearch /></InputGroup.Text>
                </InputGroup>
                <Button variant="primary" onClick={handleAddBlog}>
                    <FaPlus /> Add Blog
                </Button>
            </div>

            {/* Blog Table */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Publication Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((blog, index) => (
                        <tr key={blog._id}>
                            <td>{index + 1}</td>
                            <td>{blog.title}</td>
                            <td>{blog.content}</td>
                            <td>{new Date(blog.publicationDate).toLocaleDateString()}</td>
                            <td>
                                <Button variant="warning" onClick={() => handleRowClick(blog)}>
                                    <FaEdit />
                                </Button>{' '}
                                <Button variant="danger" onClick={() => handleDelete(blog._id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Pagination */}
            <Pagination>
                <Pagination.Prev disabled={page === 0} onClick={() => handleChangePage(page)} />
                <Pagination.Item>{page + 1}</Pagination.Item>
                <Pagination.Next
                    disabled={page >= Math.ceil(filteredBlogs.length / rowsPerPage) - 1}
                    onClick={() => handleChangePage(page + 2)}
                />
            </Pagination>

            {/* Blog Form Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{isAdding ? 'Add Blog' : 'Edit Blog'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="content"
                                rows={3}
                                value={formData.content}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPublicationDate">
                            <Form.Label>Publication Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="publicationDate"
                                value={formData.publicationDate}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {isAdding ? 'Add' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CoachBlog;
