//Models
const subscriptionModel = require("../models/Subscription");
const https = require("https");

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
      const subscription = await subscriptionModel.findOneAndUpdate(
        { user: _id },
        { mealCount, days, price },
        { new: true }
      );

      //Response
      return res.status(200).json({
        msg: "Thank you",
        subscription,
        status: true,
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
 * @route POST /api/subscription/credit-card
 * @access Private
 */
module.exports.payment = async (req, res) => {
  const { name, cc_number, expiry_month, expiry_year, cvv, grand_total } =
    req.body;
  const { _id } = req.user;
  const { id } = req.params;

  const data = {
    customer_id: String(_id),
    order_id: id,
    name,
    cc_number,
    expiry_month,
    expiry_year,
    cvv,
    grand_total,
    currency_code: "BHD",
    payment_type: 1,
    used_token: 0,
    save_token: 0,
    success_url: process.env.BASE_URL + "/subscription/success",
    failed_url: process.env.BASE_URL + "/subscription/failed",
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "company-code": process.env.COMPANY_CODE,
    },
  };

  const jsonData = JSON.stringify(data);

  const reqAPI = https.request(
    "https://payments.paygcc.com/api/v9/checkout",
    options,
    (resAPI) => {
      let response = "";
      resAPI.on("data", (chunk) => {
        response += chunk;
      });
      resAPI.on("end", async () => {
        const result = JSON.parse(response);
        console.log(result);
        if (result.gateway_response) {
          //Update user payment system
          await subscriptionModel.updateOne({ user: _id }, { isPaid: true });
          
          // Redirect to gateway_response URL
          res
            .status(200)
            .json({ status: true, gateway_response: result.gateway_response });
        } else {
          res.send("Gateway response error");
        }
      });
    }
  );

  reqAPI.on("error", (error) => {
    console.error(error);
    res.send("An error occurred while processing the payment");
  });

  reqAPI.write(jsonData);
  reqAPI.end();
};

/**
 * @description Payment Success
 * @route GET /api/subscription/success
 * @access Private
 */
module.exports.paymentSuccess = async (req, res) => {
  res.send("Payment was successful");
};

/**
 * @description Payment Success
 * @route GET /api/subscription/failed
 * @access Private
 */
module.exports.paymentFailed = async (req, res) => {
  res.send("Payment failed");
};

/**
 * @description Get User Subscription
 * @route GET /api/subscription/get-user-subscription
 * @access Private
 */
module.exports.getUserSubscription = async (req, res) => {
  const { _id } = req.user;

  try {
    const subscription = await subscriptionModel.findOne({ user: _id });
    if (!subscription) {
      return res.status(400).json({ status: true, msg: "No Subscription" });
    }

    //Response
    return res.status(200).json({
      status: true,
      subscription,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
