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
 enum: [...Array(7 + 1).keys()], // Generates array from 0 to 7
 // Order Status Number Meaning (initial 0)
 // 0 = Ordered, waiting for alloting driver
 // 1 = Driver allotted, ready for pick up
 // 2 = Picked Up, ready to wash
 // 3 = Washing (Processing wash cycle)
 // 4 = Washed, Ready to be deliverd
 // 5 = Delivery Driver Allotted
 // 6 = Delivered by delivery Driver, payment pending by default
 // 7 = Payment pending
 // 8 = Payment Done
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
