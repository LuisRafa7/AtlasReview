const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const countrySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      trim: true,
    },
    population: {
      type: Number,
    },
    flag: {
      type: String,
    },
    cities: [{ type: Schema.Types.ObjectId, ref: "City" }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Country = model("Country", countrySchema);

module.exports = Country;
