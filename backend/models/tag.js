import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema({
  tagName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  courseId: [ // multiple courses can have same tag
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const tagsModel = mongoose.models.Tag || mongoose.model("Tag", tagsSchema);

export default tagsModel;
