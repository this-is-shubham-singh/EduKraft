import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  dob: {
    type: Date,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

const profileModel =
  mongoose.models.Profile || mongoose.model("Profile", profileSchema);

export default profileModel;
