const Categories = require("../models/categoryModel");
const Orders = require("../models/orderModel");
const Users = require("../models/userModel");


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
      const { role, id: _id } = req.userDetails;

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
  changeStatus: async (req, res) => {
    try {
      const { status, id: orderId } = req.params;
      const { role, _id } = req.userDetails;
      const isAuthorizedDriver = req.order.driverId !== _id;
      const isAuthorizedClient = req.order.clientId !== _id;

      // Validate Order Id
      if (
        !orderId ||
        orderId.length !== 24 ||
        !(await Orders.exists({ _id: orderId }))
      )
        return res
          .status(400)
          .json({ message: "Order with the given id does not exist" });

      // Check if requester is related to order (is admin or driver or customer). Else disallow
      if (role !== 2 && (order.clientId !== _id || order.driverId !== _id))
        return res
          .status(400)
          .json({ message: "Not authorized to change the entry" });

      switch (Number(status)) {
        case 1:
          // Add Driver to order
          if (role !== 2)
            return res.status(400).json({ message: "Not an admin" });

          const { driverId } = req.body;
          console.log(await Users.exists({ _id: driverId, role: 1 }));
          console.log(
            driverId.length,
            await Users.exists({ _id: driverId, role: 1 })
          );
          if (
            driverId.length !== 24 ||
            !(await Users.exists({ _id: driverId, role: 1 }))
          )
            return res
              .status(400)
              .json({ message: "The driver with ID does not exist" });

          // Update account
          await Orders.findByIdAndUpdate(orderId, { driverId, status: 1 });

          return res.json({ message: "Driver Added Successfully" });
        case 2:
        // Picked Up

        case 3:
        // Washing

        case 4:
        //

        case 5:

        case 6:

        case 7:

        case 8:

        default:
          return res
            .status(400)
            .json({ message: "Please add correct Request Status" });
      }

      res.json({ message: "Status changed successfully" });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
};

module.exports = orderCtrl;
