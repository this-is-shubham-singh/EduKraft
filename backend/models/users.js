import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  accountType: {
    type: String,
    enum: ["Learner", "Instructor", "Admin"],
    required: true,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  courses: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courseProgress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CourseProgress",
  },
});

const userModel = mongoose.models.User || mongoose.model("User", usersSchema);

export default userModel;
