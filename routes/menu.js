const router = require("express").Router();

//Controller Functions
const { addMenu, getMenu } = require("../controllers/menu");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-menu").post(verifyAdmin, addMenu);
router.route("/get-menu/:id").get(verifyUser, getMenu);

module.exports = router;
