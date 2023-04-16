//Models
const menuModel = require("../models/Menu");
const mealModel = require("../models/Meal");
const orderModel = require("../models/Order");

//Helpers
const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * @description Add menu
 * @route POST /api/menu/add-menu
 * @access Public
 */
module.exports.addMenu = async (req, res) => {
  const { menu, meal } = req.body;
  let totalCalories = 0;

  //Add menu logic
  try {
    //Adding Items
    const createdMenu = await menuModel.create({ meal: ObjectId(meal), menu });
    if (!createdMenu) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Something went wrong", status: false }] });
    }

    const menuItems = await menuModel
      .find({ meal: { $eq: ObjectId(meal) } })
      .populate("menu");

    //Add total calories to meal
    menuItems[0].menu.forEach((e) => {
      totalCalories += Number(e.calories);
    });

    await mealModel.updateOne(
      { _id: { $eq: ObjectId(meal) } },
      { calories: totalCalories }
    );

    //Response
    return res.status(200).json({
      msg: "Menu Added",
      menuItems,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get menu
 * @route GET /api/menu/get-menu
 * @access Public
 */
module.exports.getMenu = async (req, res) => {
  const { id } = req.params;
  const { _id } = req.user;
  let protein = 0;
  let fat = 0;
  let carb = 0;
  let totalCalories = 0;
  let isOrdered = false;

  try {
    //Check if the meal is ordered
    const orders = await orderModel.find({
      $and: [{ meal: ObjectId(id) }, { user: _id }],
    });
    if (orders.length > 0) isOrdered = true;

    //Get Menu
    const menu = await menuModel
      .find({ meal: { $eq: ObjectId(id) } })
      .populate("meal menu");

    if (menu.length === 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No menu found", status: false }] });
    }

    //Add total calories to meal
    menu[0].menu.forEach((e) => {
      protein += e.nutrients[0].protein;
      carb += e.nutrients[0].carb;
      fat += e.nutrients[0].fat;
    });

    totalCalories = protein + fat + carb;

    //Response
    return res.status(200).json({
      menu,
      totalCalories,
      nutrients: [{ protein, fat, carb }],
      isOrdered,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get menu for admin
 * @route GET /api/menu/get-menu-admin
 * @access Public
 */
module.exports.getMenuAdmin = async (req, res) => {
  const { id } = req.params;
  let protein = 0;
  let fat = 0;
  let carb = 0;
  let totalCalories = 0;
  
  try {
    //Get Menu
    const menu = await menuModel
      .find({ meal: { $eq: ObjectId(id) } })
      .populate("meal menu");

    if (menu.length === 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "No menu found", status: false }] });
    }

    //Add total calories to meal
    menu[0].menu.forEach((e) => {
      protein += e.nutrients[0].protein;
      carb += e.nutrients[0].carb;
      fat += e.nutrients[0].fat;
    });

    totalCalories = protein + fat + carb;

    //Response
    return res.status(200).json({
      menu,
      totalCalories,
      nutrients: [{ protein, fat, carb }],
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};
