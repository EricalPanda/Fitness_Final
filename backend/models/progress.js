const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressSchema = new Schema({
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
    },
    completionRate: {
        type: String
    }
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
