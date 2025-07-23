import mongoose from "mongoose";

const ratingAndReviewsSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
  },
});

const ratingAndReviewsModel =
  mongoose.models.RatingAndReviews ||
  mongoose.model("RatingAndReviews", ratingAndReviewsSchema);

export default ratingAndReviewsModel;
