const router = require("express").Router();

//Controller Functions
const {
  createPromocode,
  getAllPromocodes,
  verifyPromocode,
} = require("../controllers/promocode");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/create-promocode").post(verifyAdmin, createPromocode);
router.route("/get-all-promocodes").get(getAllPromocodes);
router.route("/verify-promocode/:code").get(verifyPromocode);

module.exports = router;
