const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "meal",
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "item",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("menu", menuSchema);
