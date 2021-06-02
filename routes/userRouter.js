const userCtrl = require("../controllers/userCtrl");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.route("/login").post(userCtrl.login);
router.route("/signup").post(userCtrl.signup);
router.route("/logout").get(userCtrl.logout);
router.route('/refresh_token').get(userCtrl.refreshToken)
router.route("/infor").get(auth, userCtrl.getUser);

module.exports = router;
