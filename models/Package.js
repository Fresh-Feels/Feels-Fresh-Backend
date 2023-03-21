const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
    },
    days: {
      type: String,
      required: true,
      default: "",
    },
    price: {
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
