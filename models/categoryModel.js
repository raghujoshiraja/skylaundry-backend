const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {},
  price: {},
  
}, {
  timestamps: true
})

module.exports = mongoose.model("Categories", categorySchema)