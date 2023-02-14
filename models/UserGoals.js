const mongoose = require("mongoose");

const userGoalsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "user",
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "Lose weight",
        "Gaining Muscles and losing fat",
        "Gaining Muscles and losing fat is secondary",
        "Eating healthier without losing weight",
      ],
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"],
    },
    bodyFat: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
    },
    active: {
      type: String,
      required: true,
      enum: [
        "Lightly active",
        "Moderately active",
        "very active",
        "extremely active",
      ],
    },
    dietType: {
      type: String,
      required: true,
      enum: [
        "anything",
        "keto",
        "vegan",
        "mediterranean",
        "vegetarian",
        "paleo",
      ],
    },
    goal: [
      {
        goalType: {
          type: String,
          required: true,
          enum: ["general goal", "exact goal"],
        },
        generalGoal: {
          type: String,
          enum: ["lose fat", "maintain weight", "build muscle"],
        },
        exactGoal: [
          {
            goalWeight: {
              type: Number,
              required: true,
            },
            weightChangeRate: {
              type: Number,
              required: true,
            },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("userGoal", userGoalsSchema);
