const Categories = require("../models/categoryModel");
const Orders = require("../models/orderModel");

const orderCtrl = {
  get: async (req, res) => {
    try {
      const { role, id } = req.userDetails;

      if (role === 2) {
        // Admin Response
        res.json(await Orders.find({})); // Fetch all orders
      } else if (role === 1) {
        // Driver Response
        res.json(await Orders.find({ driverId: id })); // Fetch driver-specific orders
      } else {
        // User Reponse
        const orders = await Orders.find({ clientId: id });

        res.json(orders);
      }
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  getSingle: async (req, res) => {
    try {
      const { role, id:_id } = req.userDetails;

      const { order } = req;
      // order structure: [{categoryId: '', weight: 1}, {...}, ...]
      // Add some sort of array avlidator in the future here

      // Check if user is admin or driver. Else disallow
      if (role !== 2 && order.clientId !== _id && order.driverId !== _id)
        return res
          .status(403)
          .json({ message: "Not authorized to access this entry" });

      // Fetch Prices for categories and add them to order

      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  create: async (req, res) => {
    try {
      const { role } = req.userDetails;
      // Check if user is admin or driver. Else disallow
      if (role !== 0)
        return res.status(400).json({ message: "Only a user can order" });

      const { order } = req.body;
      // order structure: [{categoryId: '', weight: 1}, {...}, ...]
      // Add some sort of array avlidator in the future here

      // Fetch Prices for categories and add them to order
      try {
        const rawOrder = await Promise.all(
          order.map(async (item) => {
            const { categoryId, weight } = item;

            const categoryPrice = (await Categories.findById(categoryId)).price;

            return { categoryId, weight, price: categoryPrice };
          })
        );

        console.log(rawOrder);

        const newOrder = new Orders({
          clientId: req.user.id,
          order: rawOrder,
        });
        await newOrder.save();

        res.json({ message: "Added order successfully" });
      } catch (err) {
        res.status(400).json({
          message: `Order validation failed: ${err.message}`,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  update: async (req, res) => {
    try {
      const { role, _id } = req.userDetails;

      const { order } = req;
      // order structure: [{categoryId: '', weight: 1}, {...}, ...]
      // Add some sort of array avlidator in the future here

      // Check if user is admin or driver. Else disallow
      if (role !== 2 && (order.clientId !== _id || order.driverId !== _id))
        return res
          .status(400)
          .json({ message: "Not authorized to change the entry" });

      // Fetch Prices for categories and add them to order
      try {
        const rawOrder = await Promise.all(
          order.map(async (item) => {
            const { categoryId, weight } = item;

            const categoryPrice = (await Categories.findById(categoryId)).price;

            return { categoryId, weight, price: categoryPrice };
          })
        );

        console.log(rawOrder);

        const newOrder = new Orders({
          clientId: req.user.id,
          order: rawOrder,
        });
        await newOrder.save();

        res.json({ message: "Added order successfully" });
      } catch (err) {
        res.status(400).json({
          message: `Order validation failed: ${err.message}`,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  delete: async (req, res) => {
    try {
      const { role, id } = req.userDetails;

      const { order } = req;
      // order structure: [{categoryId: '', weight: 1}, {...}, ...]
      // Add some sort of array avlidator in the future here

      // Check if user is admin or driver. Else disallow
      if (role !== 2 && order.clientId !== id)
        return res
          .status(400)
          .json({ message: "Not authorized to change the entry" });

      await Orders.findByIdAndDelete(order.id);

      res.json({ message: "Deleted Successfully" });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  addDriver: async (req, res) => {
    try {
      const { order } = req;
      const { driverId } = req.body;

      await Orders.findByIdAndUpdate(order.id, { driverId });

      res.json({ message: "Driver added successfully" });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
};

module.exports = orderCtrl;
