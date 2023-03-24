const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    mealCount: {
      type: Number,
      required: true,
      default: 0,
    },
    days: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    subscription: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("package", packageSchema);
