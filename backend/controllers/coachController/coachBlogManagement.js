const express = require("express");
const bodyParser = require("body-parser");
const Blog = require("../../models/blog");
const adminRouter = express.Router();
adminRouter.use(bodyParser.json());
// Submit blog by coach for admin approval
const submitBlogByCoach = async (req, res) => {
    try {
        const coachId = req.account.id;
        const { title, image, content } = req.body;
        console.log("coachId: ", coachId);


        // Create a new blog with status 'pending'
        const newBlog = await Blog.create({
            title,
            image,
            content,
            author: coachId,
            status: 'pending'
        });

        res.status(201).json({
            message: 'Blog submitted successfully. Pending admin approval.',
            blog: newBlog
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all blogs submitted by the logged-in coach
const getCoachBlogs = async (req, res) => {
    const coachId = req.account.id;
    console.log("coachId: ", coachId);
    try {
        const blogs = await Blog.find({ author: coachId });
        if (blogs.length === 0) {
            return res.status(200).json({ message: 'No blogs submitted by this coach' });
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

const getCoachBlogsById = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;

    // Validate if blogId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return res.status(400).json({ message: 'Invalid blog ID' });
    }


    try {
        const blog = await Blog.findOne({ _id: blogId, author: coachId });
        if (!blog) {
            return res.status(200).json({ message: 'No blogs submitted by this coach' });
        }
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update blog by coach
const updateCoachBlog = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;
    const { title, image, content } = req.body;

    try {
        // Find the blog by ID and author
        const blog = await Blog.findOne({ _id: blogId, author: coachId });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found or you do not have permission to update this blog' });
        }

        if (blog.status !== 'pending') {
            return res.status(403).json({ message: 'You can only update blogs that are still pending approval' });
        }

        // Update blog fields
        blog.title = title || blog.title;
        blog.image = image || blog.image;
        blog.content = content || blog.content;

        const updatedBlog = await blog.save();

        res.status(200).json({
            message: 'Blog updated successfully',
            blog: updatedBlog
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Delete blog by coach
const deleteCoachBlog = async (req, res) => {
    const coachId = req.account.id;
    const { blogId } = req.params;

    try {
        // Find the blog by ID and author
        const blog = await Blog.findOne({ _id: blogId, author: coachId });

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found or you do not have permission to delete this blog' });
        }

        await Blog.findByIdAndDelete(blogId);

        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


module.exports = {
    submitBlogByCoach,
    updateCoachBlog,
    deleteCoachBlog,
    getCoachBlogs,
    getCoachBlogsById,
};
