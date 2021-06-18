const userCtrl = require("../controllers/userCtrl");
const router = require("express").Router();
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.route("/login").post(userCtrl.login);
router.route("/signup").post(userCtrl.signup);
router.route("/logout").get(userCtrl.logout);
router.route("/refresh_token").get(userCtrl.refreshToken);
router.route("/user_details/:id").get(userCtrl.getUserDetails);
router.route("/infor").get(auth, userCtrl.getUser);
router.route("/users").get(auth, userCtrl.getUsers);

module.exports = router;
