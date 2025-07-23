import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const tagsModel = mongoose.models.Tag || mongoose.model("Tag", tagsSchema);

export default tagsModel;
