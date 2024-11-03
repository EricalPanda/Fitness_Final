import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import './BlogDetail.css';

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);

      const fetchProfile = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/users/getUserProfile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUserId(response.data._id);
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };

      fetchProfile();
    }

    const fetchData = async () => {
      try {
        const blogResponse = await axios.get(`http://localhost:5000/api/admins/blogs/${blogId}`);
        setBlog(blogResponse.data);

        const commentsResponse = await axios.get(`http://localhost:5000/api/admins/blogs/${blogId}/comments`);
        setComments(commentsResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [blogId]);

  const fetchComments = async () => {
    try {
      const commentsResponse = await axios.get(`http://localhost:5000/api/admins/blogs/${blogId}/comments`);
      setComments(commentsResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info('You need to be logged in to comment.');
      return;
    }
    try {
      await axios.post(`http://localhost:5000/api/admins/blogs/${blogId}/comments`, {
        content: newComment,
        userId: userId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setNewComment('');
      fetchComments(); // Refresh comments after adding
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditClick = (comment) => {
    setEditingCommentId(comment._id);
    setEditedComment(comment.content);
  };

  const handleEditChange = (e) => {
    setEditedComment(e.target.value);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/admins/comments/${editingCommentId}`, {
        content: editedComment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEditingCommentId(null);
      setEditedComment('');
      fetchComments(); // Refresh comments after editing
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteClick = async (commentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admins/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchComments(); // Refresh comments after deleting
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="blog-detail">
      {blog ? (
        <>
          <div
            className="feature-image"
            style={{
              backgroundImage: `url(${blog.image})`,
              backgroundSize: 'cover', // Đảm bảo hình ảnh bao phủ toàn bộ vùng
              backgroundPosition: 'center', // Căn giữa hình ảnh
              backgroundRepeat: 'no-repeat', // Ngăn hình ảnh lặp lại
              width: '100vw', // Chiều rộng là 100% chiều rộng của viewport
              maxHeight: '400px', // Tùy chọn chiều cao tối đa nếu cần
              borderLeft: '5px solid #000', // Độ dày và màu sắc của viền trái
              borderRight: '5px solid #000', // Độ dày và màu sắc của viền phải
            }}
          ></div>


          <div className="container-fluid article-content">
            <div className="article-header site-main">
              <h1 className="entry-title">{blog.title}</h1>
              <div className="author">
                <a className="avatar" href="#">
                  <img
                    height="80"
                    width="80"
                    src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"
                    alt="Author"
                  />
                </a>
                <div className="inner-meta">
                  <span>By <a className="created-by" >Admin</a></span>
                  <p className="created-at">{new Date(blog.date).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="site-main article-text-wrap">

              <p className="article-source">

              </p>


              <div className="entry-summary">
                {blog.content}
              </div>
            </div>
          </div>

          <div className="comments-section">
            <h2>Comments</h2>
            <div className="comments" style={{ maxWidth: '600px', margin: '0 auto' }}>
              {comments.map(comment => (
                <div key={comment._id} className="comment" style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '10px', marginBottom: '10px' }}>
                  <p className="comment-meta" style={{ fontSize: '12px', marginBottom: '5px' }}>
                    {/* Kiểm tra xem userId có tồn tại trước khi hiển thị name */}
                    <strong>{comment.userId ? comment.userId.name : 'Unknown User'}</strong> - {new Date(comment.date).toLocaleString()}
                  </p>
                  <p className="comment-content" style={{ fontSize: '14px', marginBottom: '10px' }}>
                    {comment.content}
                  </p>
                  {isLoggedIn && userId === comment.userId?._id && (
                    <div className="comment-actions" style={{ fontSize: '16px' }}>
                      <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => handleEditClick(comment)}
                        className="icon"
                        style={{ marginRight: '10px', cursor: 'pointer' }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteClick(comment._id)}
                        className="icon"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}
                  {editingCommentId === comment._id && (
                    <form onSubmit={handleEditSubmit} style={{ marginTop: '10px' }}>
                      <textarea
                        value={editedComment}
                        onChange={handleEditChange}
                        required
                        style={{
                          width: '100%',
                          height: '60px',
                          padding: '8px',
                          fontSize: '14px',
                          boxSizing: 'border-box',
                        }}
                      />
                      <button type="submit" style={{
                        padding: '6px 12px',
                        fontSize: '14px',
                        marginTop: '5px',
                      }}>Save</button>
                    </form>
                  )}
                </div>
              ))}
            </div>

            {isLoggedIn ? (
              <form className="comment-form" onSubmit={handleCommentSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
                <textarea
                  value={newComment}
                  onChange={handleCommentChange}
                  placeholder="Add a comment..."
                  required
                  style={{
                    width: '100%',
                    height: '80px',
                    padding: '10px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    marginTop: '10px',
                  }}
                >
                  Submit
                </button>
              </form>
            ) : (
              <p className="login-message">Please log in to add a comment.</p>
            )}
          </div>
        </>
      ) : (
        <p>Blog not found</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default BlogDetail;
