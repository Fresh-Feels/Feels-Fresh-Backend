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
        "Lose Weight",
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
      enum: ["Male", "Female", "Other"],
    },
    bodyFat: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },
    active: {
      type: String,
      required: true,
      enum: [
        "Sedentary (little or no exercise)",
        "Lightly Active (1-3 days workout)",
        "Moderately Active (3-5 days workout)",
        "Active (6-7 days workout)",
        "Very Active (6-7 days hard workout)",
      ],
    },
    dietType: {
      type: String,
      required: true,
    },
    targetCalories: {
      type: Number,
    },
    goal: [
      {
        goalType: {
          type: String,
          required: true,
          enum: ["General Goal", "Exact Goal"],
        },
        generalGoal: {
          type: String,
          enum: ["Lose fat", "Maintain weight", "Build muscle"],
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
