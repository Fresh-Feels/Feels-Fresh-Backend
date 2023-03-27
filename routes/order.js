const router = require("express").Router();

//controller functions
const {
  addOrder,
  getAllOrders,
  getOrder,
  completeOrder,
  getUserOrders,
  removeUserOrder,
} = require("../controllers/order");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/add-order/:meal").post(verifyUser, addOrder);
router.route("/get-orders").get(verifyAdmin, getAllOrders);
router.route("/get-order/:id").get(verifyAdmin, getOrder);
router.route("/get-user-orders").get(verifyUser, getUserOrders);
router.route("/remove-user-order/:id").delete(verifyUser, removeUserOrder);

router.route("/complete-order/:id").delete(verifyAdmin, completeOrder);

module.exports = router;
