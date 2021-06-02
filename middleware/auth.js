const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token)
      return res
        .status(400)
        .json({
          message: "Please provide access token as an Authorization header",
        });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (!user)
        return res.status(400).json({ message: "Invalid Authorization" });

      req.user = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = auth;
