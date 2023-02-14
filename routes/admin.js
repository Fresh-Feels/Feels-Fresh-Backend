const router = require("express").Router();

//controller functions
const { adminSignup, adminLogin } = require("../controllers/admin");

//routes
router.route("/signup").post(adminSignup);
router.route("/login").post(adminLogin);

module.exports = router;
