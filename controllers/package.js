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
  const { name, days, price } = req.body;

  try {
    const package = await packageModel.create({
      name,
      days,
      price,
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
