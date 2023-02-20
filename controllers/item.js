//Models
const itemModel = require("../models/Item");

//Helpers
const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * @description Add Item
 * @route POST /api/item/add-item
 * @access Private
 */
module.exports.addItem = async (req, res) => {
  const { ...payload } = req.body;
  let protein = 0;
  let carb = 0;
  let fat = 0;
  let fiber = 0;

  // Add Item Logic
  try {
    const item = await itemModel.create({ ...payload });
    if (!item) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Something went wrong", status: false }] });
    }

    //Calculating Nutients
    item.ingredients.forEach((e) => {
      protein += Number(e.nutrients[0].protein);
      carb += Number(e.nutrients[0].carb);
      fat += Number(e.nutrients[0].fat);
      fiber += Number(e.nutrients[0].fiber);
    });

    //pushing them into nurtients
    item.nutrients.push({ protein, carb, fat, fiber });

    await item.save();

    //Response
    return res.status(200).json({
      msg: "Item Added",
      item,
      status: true,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Item
 * @route GET /api/item/get-item
 * @access Public
 */
module.exports.getItem = async (req, res) => {
  const { id } = req.params;

  //logic
  try {
    const item = await itemModel.findOne({ _id: { $eq: ObjectId(id) } });

    //Edge Cases
    if (!item) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Item not found", status: false }] });
    }

    //Response
    return res.status(200).json({
      item,
      status: true,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Item nutrients
 * @route GET /api/item/get-item-nutrients
 * @access Public
 */
module.exports.getItemNutrients = async (req, res) => {
  const { id } = req.params;
  //logic
  try {
    const { calories, nutrients } = await itemModel.findOne({
      _id: { $eq: ObjectId(id) },
    });

    //Edge Cases
    if (nutrients.length === 0 || calories <= 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Nutrients not found", status: false }] });
    }

    //Response
    return res.status(200).json({
      calories,
      nutrients,
      status: true,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get All Items
 * @route GET /api/item/get-items
 * @access Private
 */
module.exports.getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find({});
    if (items.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Items not found", status: false }] });
    }
    //Response
    return res.status(200).json({
      items,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Items Filter
 * @route GET /api/item/get-items-filter
 * @access Public
 */
module.exports.getFilterItems = async (req, res) => {
  const { type, category } = req.query;

  try {
    const items = await itemModel.find({ type, category });
    if (items.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Items not found", status: false }] });
    }
    //Response
    return res.status(200).json({
      items,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
