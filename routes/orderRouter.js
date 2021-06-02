const orderCtrl = require("../controllers/orderCtrl");
const router = require("express").Router();
const auth = require("../middleware/auth");
const userDetails = require("../middleware/userDetails");

router.route("/")
  .get(auth, userDetails, orderCtrl.get)
  .post(auth, userDetails, orderCtrl.create)

module.exports = router;
