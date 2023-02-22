//Models
const promoModel = require("../models/Promocode");

/**
 * @description Create Promocode
 * @route POST /api/promocode/create-promocode
 * @access Private
 */
module.exports.createPromocode = async (req, res) => {
  const { name, code, discount } = req.body;

  //Edge Cases
  if (name === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Name is required", status: false }] });
  }
  if (code === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Promocode is required", status: false }] });
  }
  if (discount <= 0) {
    return res
      .status(400)
      .json({ errors: [{ msg: "Discount is required", status: false }] });
  }

  //Logic
  try {
    const promocode = await promoModel.create({
      name,
      code,
      discount,
    });

    //Response
    return res.status(200).json({
      msg: "Promocode Applied",
      promocode,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get all Promocodes
 * @route GET /api/promocode/get-all-promocodes
 * @access Public
 */
module.exports.getAllPromocodes = async (req, res) => {
  try {
    const promocodes = await promoModel.find({ code: { $ne: "REFER" } });
    if (promocodes.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Promocodes not found", status: false }] });
    }

    //Response
    return res.status(200).json({
      promocodes,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Verify Promocodes
 * @route GET /api/promocode/verify-promocode
 * @access Public
 */
module.exports.verifyPromocode = async (req, res) => {
  const { code } = req.params;

  //Edge Cases
  if (code === "") {
    return res
      .status(400)
      .json({ errors: [{ msg: "Promocode is required", status: false }] });
  }

  //Logic
  try {
    const promocode = await promoModel.findOne({ code });
    if (!promocode) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Invalid Promocode", status: false }] });
    }

    //Response
    return res.status(200).json({
      discount: promocode.discount,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
