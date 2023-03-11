const router = require("express").Router();

//controller functions
const {
  adminSignup,
  adminLogin,
  getMeals,
  deleteMeal,
  deleteItem,
  getFeedbacks,
  deleteFeedback,
  deletePromocode,
} = require("../controllers/admin");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/signup").post(adminSignup);
router.route("/login").post(adminLogin);

router.route("/get-meals").get(verifyAdmin, getMeals);
router.route("/delete-meal/:id").delete(verifyAdmin, deleteMeal);
router.route("/delete-item/:id").delete(verifyAdmin, deleteItem);

router.route("/get-feedbacks").get(verifyAdmin, getFeedbacks);
router.route("/delete-feedback/:id").delete(verifyAdmin, deleteFeedback);

router.route("/delete-promocode/:id").delete(verifyAdmin, deletePromocode);

module.exports = router;
