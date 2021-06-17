const router = require("express").Router();
const categoryController = require("../controllers/categoryCtrl");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth")

router.route("/").get(categoryController.getAll);
router.route("/single/:id").get(categoryController.getSingle);
router.route("/").post(auth, adminAuth, categoryController.create);
router.route("/:id").delete(auth, adminAuth, categoryController.delete);

module.exports = router;
