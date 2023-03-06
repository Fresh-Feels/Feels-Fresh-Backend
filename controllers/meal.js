//Models
const mealModel = require("../models/Meal");
const userGoalsModel = require("../models/UserGoals");
const subscriptionModel = require("../models/Subscription");
/**
 * @description Add Meal
 * @route POST /api/meal/add-meal
 * @access Public
 */
module.exports.addMeal = async (req, res) => {
  const { image, name, price } = req.body;

  //Edge cases and errors
  if (image === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Image is required", status: false }] });
  }
  if (name === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Name is required", status: false }] });
  }
  if (price <= 0) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Price is required", status: false }] });
  }

  //Logic
  try {
    const meal = await mealModel.create({
      image,
      name,
      price,
    });

    return res.status(200).json({
      msg: "Meal Added",
      meal,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Meal
 * @route GET /api/menu/get-meals
 * @access Public
 */
module.exports.getMeals = async (req, res) => {
  const { _id } = req.user;
  try {
    const { targetCalories } = await userGoalsModel.findOne({
      user: { $eq: _id },
    });
    const { mealCount } = await subscriptionModel.findOne({
      user: { $eq: _id },
    });
    const meals = await mealModel
      .find({
        calories: { $lte: Number(targetCalories) },
      })
      .limit(mealCount);

    if (meals.length === 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No meals found", status: false }] });
    }
    //Response
    return res.status(200).json({
      meals,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};
