const router = require("express").Router();

//Controller Functions
const {
  addSubscription,
  payment,
  paymentSuccess,
  paymentFailed,
} = require("../controllers/subscription");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-subscription").post(verifyUser, addSubscription);

router.route("/credit-card/:id").post(verifyUser, payment);
router.route("/success").get(paymentSuccess);
router.route("/failed").get(paymentFailed);

module.exports = router;
