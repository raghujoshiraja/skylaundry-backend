const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 100
  },
  price: {
    type: Number,
    required: true // per kg in US$
  },
}, {
  timestamps: true
})

module.exports = mongoose.model("Categories", categorySchema)