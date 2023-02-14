const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["breakfast", "lunch", "dinner", "snack"],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    nutrients: [
      {
        protein: {
          type: Number,
        },
        carb: {
          type: Number,
        },
        fat: {
          type: Number,
        },
        fiber: {
          type: Number,
        },
      },
    ],
    directions: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        ingredientName: {
          type: String,
          required: true,
        },
        ingredientDescription: {
          type: String,
          required: true,
        },
        ingredientImage: {
          type: String,
          required: true,
        },
        nutrients: [
          {
            protein: {
              type: Number,
            },
            carb: {
              type: Number,
            },
            fat: {
              type: Number,
            },
            fiber: {
              type: Number,
            },
          },
        ],
      },
    ],
    category: {
      type: String,
      required: true,
      enum: ["Low Carb", "Fan Favorite", "Vegetable", "Balanced", "Recent"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("item", itemSchema);
