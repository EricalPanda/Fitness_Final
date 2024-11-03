const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    message: {
        type: String,
        required: true
    },
    feedbackTime: {
        type: Date,
        default: Date.now
    }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
