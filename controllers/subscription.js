//Models
const subscriptionModel = require("../models/Subscription");

//Utils Functions
const { generatePaymentToken } = require("../utils/Methods");

/**
 * @description Add Subscription
 * @route POST /api/subscription/add-subscription
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
    //Find if subscription exists
    const isExists = await subscriptionModel.findOne({ user: _id });
    if (isExists) {
      return res.status(400).json({
        errors: [{ msg: "User Subscription Exists", status: false }],
      });
    }
    
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

/**
 * @description Payment using credit card
 * @route POST /api/payment/credit-card
 * @access Private
 */
module.exports.payment = async (req, res) => {
  const {
    company_code,
    customer_id,
    cc_number,
    expiry_month,
    expiry_year,
    cvv,
  } = req.body;

  try {
    const token = generatePaymentToken(
      company_code,
      customer_id,
      cc_number,
      expiry_month,
      expiry_year,
      cvv
    );
    console.log(token);
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
