const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      length: 24,
    },
    status: {
      type: Number,
      enum: [...Array(7 + 1).keys()], // Generates array from 0 to 7
      // Order Status Number Meaning (initial 0)
      // 0 = Ordered, waiting for alloting driver
      // 1 = Driver allotted, ready for pick up
      // 2 = Reached washing facility, ready to wash
      // 3 = Washing (Processing wash cycle)
      // 4 = Washed, Ready to be deliverd
      // 5 = Delivery Driver Allotted
      // 6 = Delivered by delivery Driver, order Complete
      default: 0,
    },
    order: {
      // Array containing all orders in format
      // [{categoryId: 'kahjsdfj', quantity: 10, price: ''}]
      type: Array,
      required: true,
    },
    dropOffDriverId: {
      type: String,
      length: 24,
    },
    total: {
      type: Number,
    },
    paymentDone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", orderSchema);
