const router = require("express").Router();

//Controller functions
const {
  addPackage,
  getAllPackages,
  deletePackage,
} = require("../controllers/package");

//Middlewares
const verifyAdmin = require("../middlewares/verifyAdmin");

//routes
router.route("/add-package").post(verifyAdmin, addPackage);
router.route("/get-packages").get(getAllPackages);
router.route("/delete-package/:id").delete(verifyAdmin, deletePackage);

module.exports = router;
