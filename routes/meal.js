const router = require("express").Router();

//Controller Functions
const { addMeal, getMeals } = require("../controllers/meal");

//Middlewares
const verifyAdmin = require('../middlewares/verifyAdmin')

//routes
router.route("/add-meal").post(verifyAdmin, addMeal);
router.route("/get-meals").get(getMeals);

module.exports = router;
