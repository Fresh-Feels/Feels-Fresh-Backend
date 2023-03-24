const router = require("express").Router();

//Controller Functions
const { addMeal, getMeals } = require("../controllers/meal");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyUser = require("../middlewares/verifyUser");
const verifyIsPaid = require("../middlewares/verifyIsPaid");

//routes
router.route("/add-meal").post(verifyAdmin, addMeal);
router.route("/get-meals").get(verifyUser, verifyIsPaid, getMeals);
// router.route("/paid").get(verifyUser, verifyIsPaid);

module.exports = router;
