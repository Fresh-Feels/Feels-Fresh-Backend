const router = require("express").Router();

//Controller functions
const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../controllers/favorite");

//Middlewares
const verifyUser = require("../middlewares/verifyUser");

//routes
router.route("/add-favorite").post(verifyUser, addFavorite);
router.route("/get-favorites").get(verifyUser, getFavorites);
router.route("/remove-favorite/:id").delete(verifyUser, removeFavorite);

module.exports = router;
