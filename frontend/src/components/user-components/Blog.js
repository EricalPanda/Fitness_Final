// src/pages/Blog.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Blog.css';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 4;

    useEffect(() => {
        axios.get('http://localhost:5000/api/admins/blogs')
            .then(response => {
                setBlogs(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    const currentBlogs = filteredBlogs.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) return <div id="preloder"><div class="loader"></div></div>;
    if (error) return <p className="error">Error: {error}</p>;

    return (
        <div className="blog-container">
            <div className="search-box">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="blog-list">
                {currentBlogs.map(blog => (
                    <div key={blog._id} className="blog-item">
                        <img src={blog.image} alt={blog.title} className="blog-image" />
                        <h2 className="blog-item-title">{blog.title}</h2>
                        <p className="blog-item-content">{blog.content.substring(0, 150)}...</p>
                        <Link to={`/blog/${blog._id}`} className="read-more-link">Read More</Link>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? 'disabled' : ''}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? 'disabled' : ''}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Blog;
