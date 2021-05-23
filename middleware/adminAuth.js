const Users = require('../models/userModel')

const adminAuth = (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id)

    if (user.role !== 2)
      return res.status(400).json({ message: "Admin access denied" })
    
      next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = adminAuth