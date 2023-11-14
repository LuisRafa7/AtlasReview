const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const reviewSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: false,
      unique: true,
    },
    evaluation: {
      type: Number,
      required: true,
      trim: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    activity: { type: Schema.Types.ObjectId, ref: "Museum" } || {
        type: Schema.Types.ObjectId,
        ref: "Restaurant",
      } || { type: Schema.Types.ObjectId, ref: "Hotel" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
