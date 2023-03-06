const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    orderItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "item",
      },
    ],
    cutlery: {
      type: Boolean,
      default: false,
    },
    deliveryTime: {
      type: String,
      default: "Morning",
      enum: ["Morning", "Night Before"],
    },
    shippingAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("order", orderSchema);
