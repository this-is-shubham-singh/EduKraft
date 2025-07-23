import mongoose from "mongoose";

const tempVerifyEmailSchema = new mongoose.Schema({
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
  otp: { type: Number, required: true },
  otpExpiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // use this to automatically delete data after expiry time, becuase what if user never verifies, this crutial data stays on your db and also keep bundling up
  },
});

const tempVerifyEmailModel =
  mongoose.models.TempVerifyEmail ||
  mongoose.model("TempVerifyEmail", tempVerifyEmailSchema);

export default tempVerifyEmailModel;
