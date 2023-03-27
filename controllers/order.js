//Models
const orderModel = require("../models/Order");
const userModel = require("../models/User");
const menuModel = require("../models/Menu");
const subscriptionModel = require("../models/Subscription");

//Helpers
const {
  Types: { ObjectId },
} = require("mongoose");

/**
 * @description Add Order
 * @route POST /api/order/add-order
 * @access Private
 */
module.exports.addOrder = async (req, res) => {
  const { _id } = req.user;
  const { meal } = req.params;

  try {
    //Shipping Address and menu
    const { address, cutlery, deliveryTime } = await userModel.findOne({ _id });
    const { menu } = await menuModel.findOne({ meal: { $eq: ObjectId(meal) } });
    const { mealCount } = await subscriptionModel.findOne({
      user: { $eq: _id },
    });

    //Edge Cases
    if (address === "") {
      return res.status(404).json({
        errors: [
          {
            msg: "Provide your shipping address in profile section",
            status: false,
          },
        ],
      });
    }
    if (menu.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "No menu to order", status: false }] });
    }

    const userOrders = await orderModel.find({ user: _id });
    if (userOrders.length >= mealCount) {
      return res
        .status(401)
        .json({ status: false, msg: "Upgrade Your Package" });
    }

    //Logic
    const order = await orderModel.create({
      user: _id,
      meal,
      orderItems: menu,
      cutlery,
      deliveryTime,
      shippingAddress: address,
    });

    //Response
    return res.status(200).json({
      msg: "Order added Successfully",
      order,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Orders
 * @route GET /api/order/get-order
 * @access Private
 */
module.exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("user orderItems");
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Orders not found", status: false }] });
    }
    //Response
    return res.status(200).json({
      orders,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get Order
 * @route GET /api/order/get-order
 * @access Private
 */
module.exports.getOrder = async (req, res) => {
  const { id } = req.params;

  //logic
  try {
    const order = await orderModel
      .findOne({ _id: { $eq: ObjectId(id) } })
      .populate("user orderItems");

    //Edge Cases
    if (!order) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Item not found", status: false }] });
    }

    //Response
    return res.status(200).json({
      order,
      status: true,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Get User Orders
 * @route GET /api/order/get-user-orders
 * @access Private
 */
module.exports.getUserOrders = async (req, res) => {
  const { _id } = req.user;

  try {
    const orders = await orderModel.find({ user: _id });
    if (orders.length === 0) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Orders not found", status: false }] });
    }
    //Response
    return res.status(200).json({
      orders,
      status: true,
    });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Remove User Order
 * @route DELTE /api/order/remove-user-order
 * @access Private
 */
module.exports.removeUserOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const isExist = await orderModel.findOne({ _id: ObjectId(id) });
    if (!isExist) {
      return res
        .status(401)
        .json({ status: false, msg: "Order doesnot exist" });
    }
    await orderModel.deleteOne({ _id: ObjectId(id) });

    return res.status(200).json({ status: true, msg: "Order Removed" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: error });
  }
};

/**
 * @description Complete Order
 * @route DELTE /api/order/complete-order
 * @access Private
 */
module.exports.completeOrder = async (req, res) => {
  const { id } = req.params;

  try {
    await orderModel.deleteOne({ _id: ObjectId(id) });

    return res.status(200).json({ status: true });
  } catch (error) {
    return res.status(500).json({ errors: error });
  }
};
