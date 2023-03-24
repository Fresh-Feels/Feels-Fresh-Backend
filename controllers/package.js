//Models
const packageModel = require("../models/Package");

//Helpers
const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * @description Add Package
 * @route POST /api/package/add-package
 * @access Private
 */
module.exports.addPackage = async (req, res) => {
  const { mealCount, days, price, subscription } = req.body;
  let packageDays = 0;

  if (subscription === "Monthly") {
    packageDays = 30;
  } else {
    packageDays = days;
  }

  //Edge Cases
  if (mealCount <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Meal Count is Required", status: false }],
    });
  }
  if (days <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Subscription days are Required", status: false }],
    });
  }
  if (price <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Subscription Price is Required", status: false }],
    });
  }

  try {
    const package = await packageModel.create({
      mealCount,
      days: packageDays,
      price,
      subscription,
    });

    if (!package) {
      return res
        .status(404)
        .json({ status: false, msg: "Something went wrong" });
    }

    //Response
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get All Package
 * @route POST /api/package/get-packages
 * @access Private
 */
module.exports.getAllPackages = async (req, res) => {
  try {
    const packages = await packageModel.find({});

    if (packages.length === 0) {
      return res.status(404).json({ status: false, msg: "No Packages Found" });
    }

    //Response
    return res.status(200).json({ status: true, packages });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Delete Package
 * @route POST /api/package/delete-packages
 * @access Private
 */
module.exports.deletePackage = async (req, res) => {
  const { id } = req.params;

  try {
    await packageModel.deleteOne({ _id: ObjectId(id) });

    //Response
    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
