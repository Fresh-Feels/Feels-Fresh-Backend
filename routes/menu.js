const router = require("express").Router();

//Controller Functions
const { addMenu, getMenu, getMenuAdmin } = require("../controllers/menu");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-menu").post(verifyAdmin, addMenu);
router.route("/get-menu/:id").get(verifyUser, getMenu);
router.route("/get-menu-admin/:id").get(verifyUser, getMenuAdmin);

module.exports = router;
