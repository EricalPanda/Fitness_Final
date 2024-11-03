const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    message: {
        type: String
    },
    createAt: {
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
