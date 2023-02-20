//Models
const subscriptionModel = require("../models/Subscription");

/**
 * @description Add Subscription
 * @route POST /api/admin/add-subscription
 * @access Private
 */
module.exports.addSubscription = async (req, res) => {
  const { _id } = req.user;
  const { mealCount, days, price } = req.body;

  //Edge Cases
  if (mealCount <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Number of Meals are required", status: false }],
    });
  }
  if (days <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Number of Days per Week are required", status: false }],
    });
  }
  if (price <= 0) {
    return res.status(400).json({
      errors: [{ msg: "Price is required", status: false }],
    });
  }

  //Logic
  try {
    //Logic
    const subscription = await subscriptionModel.create({
      user: _id,
      mealCount,
      days,
      price,
    });

    //Response
    return res.status(200).json({
      msg: "Thank you",
      subscription,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
