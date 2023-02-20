const mongoose = require("mongoose");

const assistanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("assistance", assistanceSchema);
