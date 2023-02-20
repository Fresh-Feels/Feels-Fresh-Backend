const router = require("express").Router();

//Controller Functions
const { addSubscription } = require("../controllers/subscription");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-subscription").post(verifyUser, addSubscription);

module.exports = router;
