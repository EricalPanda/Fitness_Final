const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    name: {
        type: String
    },
    date: {
        type: Date
    },
    status: {
        type: String
    },
    workout: [{
        exerciseId: {
            type: Schema.Types.ObjectId,
            ref: 'Exercise'
        },
        quantity: {
            type: Number
        }
    }],
    progressId: {
        type: Schema.Types.ObjectId,
        ref: 'Progress'
    },
    workoutVideo: {
        type: [String]
    }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
