const router = require("express").Router();

//Controller Functions
const { submitAssistance } = require("../controllers/assistance");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/submit-assistance").post(verifyUser, submitAssistance);

module.exports = router;
