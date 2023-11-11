const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const citySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: false,
      unique: true,
    },
    location: {
      type: String,
      trim: true,
    },
    country: { type: Schema.Types.ObjectId, ref: "Country" },
    image: {
      type: String,
      trim: true,
    },
    museum: [{ type: Schema.Types.ObjectId, ref: "Museum" }],
    restaurants: [{ type: Schema.Types.ObjectId, ref: "Restaurant" }],
    hotels: [{ type: Schema.Types.ObjectId, ref: "Hotel" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const City = model("City", citySchema);

module.exports = City;
