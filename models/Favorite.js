const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "item",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("favorite", favoriteSchema);
