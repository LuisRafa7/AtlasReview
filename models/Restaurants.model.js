const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      unique: true,
    },
    location: { type: Schema.Types.ObjectId, ref: "City" },
    image: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      required: true,
      trim: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
