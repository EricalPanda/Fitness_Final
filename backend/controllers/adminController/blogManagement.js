
const express = require("express");
const bodyParser = require("body-parser");
const Account = require('../../models/account');

const Comment = require('../../models/comment');
const Blog = require("../../models/blog");
const adminRouter = express.Router();
adminRouter.use(bodyParser.json());

// CRUD operations for Blog

// Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, description, content, image } = req.body;
        const userId = req.account.id;  // Lấy userId từ req.account.id
        const newBlog = await Blog.create({
            title,
            description,
            content,
            image,
            status: "approved",
            author: userId,
        });

        res.status(201).json({
            _id: newBlog._id,
            title: newBlog.title,
            description: newBlog.description,
            content: newBlog.content,
            image: newBlog.image,
            status: newBlog.status,
            author: newBlog.author,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tạo bài blog",
            error: error.message,
        });
    }
};


// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({});
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a blog by ID
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: `Blog ${req.params.blogId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update a blog by ID
const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, description, content, image } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Không tìm thấy bài blog" });
        }

        blog.title = title || blog.title;
        blog.description = description || blog.description;
        blog.content = content || blog.content;
        blog.image = image || blog.image;

        const updatedBlog = await blog.save();

        res.status(200).json({
            _id: updatedBlog._id,
            title: updatedBlog.title,
            description: updatedBlog.description,
            content: updatedBlog.content,
            image: updatedBlog.image,
        });
        console.log("update success");
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi cập nhật bài blog", error: error.message });
    }
};

// Delete a blog by ID

const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;

        //Tìm người dùng và xóa theo id
        const blog = await Blog.findByIdAndDelete(blogId);

        //Nếu không tìm thấy
        if (!blog) {
            return res.status(404).json({ message: "Không tìm thấy bài blog" });
        }
        res.status(200).json({ message: "Bài blog đã được xóa" });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Lỗi khi xóa bài blog", error: error.message });
    }
};

// Create a new comment for a blog
const createComment = async (req, res) => {
    const { blogId } = req.params;
    const userId = req.account.id;  // Lấy userId từ req.account.id
    const { content } = req.body;

    try {
        // Tạo bình luận mới
        const comment = await Comment.create({ userId, blogId, content });

        // Thêm bình luận vào blog
        const blog = await Blog.findByIdAndUpdate(blogId, { $push: { comments: comment._id } }, { new: true });

        if (blog) {
            res.status(201).json(comment);
        } else {
            res.status(404).json({ message: `Blog ${blogId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get all comments for a blog
const getAllCommentsByBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const comments = await Comment.find({ blogId }).populate('userId', 'name');
        res.status(200).json(comments);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Update a comment by ID

const updateComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndUpdate(commentId, { $set: req.body }, { new: true });
        if (comment) {
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: `Comment ${commentId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a comment by ID
const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findByIdAndDelete(commentId);
        if (comment) {
            await Blog.findByIdAndUpdate(comment.blogId, { $pull: { comments: commentId } }, { new: true });
            res.status(200).json(comment);
        } else {
            res.status(404).json({ message: `Comment ${commentId} not found` });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Approve blog
const approveBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.blogId, { status: 'approved' }, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Reject blog
const rejectBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findByIdAndUpdate(blogId, { status: 'rejected'}, { new: true });
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = {
    createBlog,
    deleteBlog,
    updateBlog,
    getAllBlogs,
    getBlogById,
    getAllCommentsByBlog,
    createComment,
    updateComment,
    deleteComment,
    rejectBlog,
    approveBlog,
};