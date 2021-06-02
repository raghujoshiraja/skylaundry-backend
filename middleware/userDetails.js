const Users = require("../models/userModel");

const userDetails = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id).select("-password"); // Select user, except password

    if (!user) return res.status(400).json({ message: "User was deleted" });

    req.userDetails = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = userDetails;
