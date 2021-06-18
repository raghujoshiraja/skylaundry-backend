const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userCtrl = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid Password" });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });

      res.json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  signup: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });
      if (user) return res.status(400).json({ message: "Email already exits" });

      if (password.length < 7)
        return res
          .status(400)
          .json({ message: "Password must be atleast 7 chars long" });

      const passwordHash = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );

      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });
      await newUser.save();

      const accessToken = createAccessToken({ id: newUser._id });
      const refreshToken = createRefreshToken({ id: newUser._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/users/refresh_token",
      });

      res.status(201).json({ accessToken });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/users/refresh_token" });
      res.json({ message: "Logged Out.." });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ message: "Please Authorize" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) res.status(400).json({ message: "Invalid Token" });

        const accessToken = createAccessToken({ id: user.id });

        res.json({ user, accessToken });
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  getUserDetails: async (req, res) => {
    try {
      const { id } = req.params;
      if (id.length !== 24)
        return res.status(400).json({ message: "Please provide correct id" });

      const user = await Users.findById(req.params.id).select(
        "_id name createdAt"
      );

      if (!user)
        return res
          .status(404)
          .json({ message: "Requested user does not exist" });

      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await Users.find({
        $or: [{ role: 0 }, { role: 1 }],
      }).select("_id name role");

      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
