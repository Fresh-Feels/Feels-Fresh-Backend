const router = require("express").Router();

//controller functions
const {
  addItem,
  getItem,
  getItemNutrients,
  getAllItems,
} = require("../controllers/item");

//middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/add-item").post(verifyAdmin, addItem);
router.route("/get-item/:id").get(getItem);
router.route("/get-items").get(verifyAdmin, getAllItems);
router.route("/get-item-nutrients/:id").get(getItemNutrients);

module.exports = router;
