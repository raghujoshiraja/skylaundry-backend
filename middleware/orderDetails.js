const Orders = require("../models/orderModel");

const checkOrderExists = async (req, res, next) => {
  // check if a single order in params as id exist.
  // If "Not" => return status(404)
  // Else add order details to req.
  try {
    const { id } = req.params;

    if (id.length !== 24 || !(await Orders.exists({ _id: id })))
      return res.status(400).json({ message: "Please provide correct ID" });

    const order = await Orders.findById(id);
    // Check last time just to be safe
    if (!order) return res.status(400).json({ message: "ID does not exist" });

    req.order = order;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkOrderExists;
