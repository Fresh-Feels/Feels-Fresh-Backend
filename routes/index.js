const router = require("express").Router();

//paths
const user = require("./user");
const meal = require("./meal");
const menu = require("./menu");
const item = require("./item");
const order = require("./order");
const admin = require("./admin");
const upload = require("./upload");
const favorite = require("./favorite");
const subscription = require("./subscription");
const assistance = require("./assistance");
const promocode = require("./promocode");

//routes
router.use("/user", user);
router.use("/meal", meal);
router.use("/menu", menu);
router.use("/item", item);
router.use("/order", order);
router.use("/admin", admin);
router.use("/upload", upload);
router.use("/favorite", favorite);
router.use("/subscription", subscription);
router.use("/assistance", assistance);
router.use("/promocode", promocode);

module.exports = router;
