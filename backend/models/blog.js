// models/Blog.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
    content: {
        type: String
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Blog', blogSchema);
