import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema({
  subSectionName: {
    type: String,
    required: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  timeDuration: {
    type: String,
  },
});

const subSectionModel =
  mongoose.models.Section || mongoose.model("SubSection", subSectionSchema);

export default subSectionModel;
