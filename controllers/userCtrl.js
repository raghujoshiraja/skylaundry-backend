const Users = require('../models/userModel')

const userCtrl = {
  login: async (req, res) => {
    try {
      res.json("Hello World")
    } catch (err) {
      res.status(500).json({ message: err.mesage })
    }
  },
  signup: async (req, res) => {
    try {
      res.json("Hello World")
    } catch (err) {
      res.status(500).json({ message: err.mesage })
    }
  },
  infor: async (req, res) => {
    try {
      res.json("Hello World")
    } catch (err) {
      res.status(500).json({ message: err.mesage })
    }
  },
  // login: async (req, res) => {
  //   try {
  //     res.json("Hello World")
  //   } catch (err) {
  //     res.status(500).json({ message: err.mesage })
  //   }
  // },
}

module.exports = userCtrl