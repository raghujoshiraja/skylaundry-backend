const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
  },
  driverId: {
    type: String,
  },
  status: {
    type: Number,
    enum: [0, 1, 2], // 0 -> Pending, 1 -> Approved, 2 -> Rejected
    default: 0
  },
  order: {
    // Array containing all orders in format
    // [{categoryId: 'kahjsdfj', quantity: 10, price: ''}]
    type: Array,
    required: true,
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Orders', orderSchema)