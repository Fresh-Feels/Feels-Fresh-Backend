const router = require("express").Router();

//Controller Functions
const { addMeal, getMeals } = require("../controllers/meal");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-meal").post(verifyAdmin, addMeal);
router.route("/get-meals").get(verifyUser, getMeals);

module.exports = router;
