const router = require("express").Router();

//controller functions
const { addOrder, getAllOrders, getOrder } = require("../controllers/order");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/add-order/:meal").post(verifyUser, addOrder);
router.route("/get-orders").get(verifyAdmin, getAllOrders);
router.route("/get-order/:id").get(verifyAdmin, getOrder);

module.exports = router;
