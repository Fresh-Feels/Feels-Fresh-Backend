const router = require("express").Router();

//controller functions
const {
  userSignup,
  userLogin,
  forgotPassword,
  verifyUserToResetPassword,
  resendVerificationEmail,
  resetPassword,
  addAddress,
  userInfo,
  cutlery,
  deliveryTime,
  editProfile,
} = require("../controllers/user");

const { addUserGoals } = require("../controllers/userGoals");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//Routes
router.route("/signup").post(userSignup);
router.route("/login").post(userLogin);

router.route("/forgot-password/:email").get(forgotPassword);
router.route("/verify-user-to-resetPassword").post(verifyUserToResetPassword);
router.route("/resend-otp").get(resendVerificationEmail);
router.route("/reset-password").put(verifyUser, resetPassword);
router.route("/edit-profile").put(verifyUser, editProfile);

router.route("/address").put(verifyUser, addAddress);
router.route("/user-info").get(verifyUser, userInfo);

router.route("/add-user-goals").post(verifyUser, addUserGoals);

router.route("/cutlery").put(verifyUser, cutlery);
router.route("/delivery-time").put(verifyUser, deliveryTime);

module.exports = router;
