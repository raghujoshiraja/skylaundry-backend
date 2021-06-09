const orderCtrl = require("../controllers/orderCtrl");
const router = require("express").Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const userDetails = require("../middleware/userDetails");
const orderDetails = require("../middleware/orderDetails");

router.route("/")
  .get(auth, userDetails, orderCtrl.get)
  .post(auth, userDetails, orderCtrl.create)

router.route("/:id")
  .get(auth, userDetails, orderDetails, orderCtrl.getSingle)
  .put(auth, orderDetails, orderDetails, orderCtrl.update)
  .delete(auth, userDetails, orderDetails, orderCtrl.delete)

router.route('/add_driver/:id')
  .put(auth, adminAuth, orderDetails, orderCtrl.addDriver)

module.exports = router;
