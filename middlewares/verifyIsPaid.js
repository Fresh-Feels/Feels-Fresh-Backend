const subscriptionModel = require("../models/Subscription");

module.exports = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const isPaid = await subscriptionModel.findOne({ user: _id });
    let subscriptionDate = isPaid.updatedAt.getDate();
    let currentDate = new Date().getDate();

    if (currentDate + 2 - subscriptionDate === isPaid.days) {
      return res.status(401).send("Your Subscription is Expired");
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};
