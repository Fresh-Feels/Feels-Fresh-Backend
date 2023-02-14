const router = require("express").Router();

//paths
const user = require("./user");
const meal = require("./meal");
const menu = require("./menu");
const item = require("./item");
const order = require("./order");
const admin = require("./admin");
const upload = require("./upload");

//routes
router.use("/user", user);
router.use("/meal", meal);
router.use("/menu", menu);
router.use("/item", item);
router.use("/order", order);
router.use("/admin", admin);
router.use("/upload", upload);

module.exports = router;
