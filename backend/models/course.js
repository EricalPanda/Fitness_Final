const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    slotNumber: {
      type: Number,
    },
    price: {
      type: Number,
    },
    image: {
      type: [String],
    },
    coachId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    exercises: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise",
      },
    ],
    status: {
      type: String,
      default: "submit",
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
