const router = require("express").Router();

//Controller Functions
const { addMenu, getMenu } = require("../controllers/menu");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");
//routes
router.route("/add-menu").post(verifyAdmin, addMenu);
router.route("/get-menu/:id").get(getMenu);

module.exports = router;
