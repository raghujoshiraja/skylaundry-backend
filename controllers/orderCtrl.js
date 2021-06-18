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
      const { role, id: userId } = req.userDetails;

      const { order } = req;
      // order structure: [{categoryId: '', weight: 1}, {...}, ...]
      // Add some sort of array avlidator in the future here

      // Check if user is admin or driver. Else disallow
      if (role !== 2 && order.clientId !== userId && order.driverId !== _id)
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

        const newOrder = new Orders({
          clientId: req.user.id,
          order: rawOrder,
          total: rawOrder
            .map((order) => order.price * order.weight)
            .reduce((a, b) => a + b, 0),
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
      const { role, id: userId } = req.userDetails;
      const isAuthorizedDriver = req.order.driverId === userId;
      const isAuthorizedClient = req.order.clientId === userId;

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
      if (role !== 2 && !isAuthorizedDriver && !isAuthorizedClient)
        return res
          .status(400)
          .json({ message: "Not authorized to change the entry" });

      switch (Number(status)) {
        case 1:
          // Add Driver to order
          if (role !== 2)
            return res.status(400).json({ message: "Not an admin" });

          const { driverId } = req.body;
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
          if (!isAuthorizedDriver || req.order.status !== 1)
            return res
              .status(403)
              .json({ message: "Not authorized driver, or invalid status" });

          await Orders.findByIdAndUpdate(orderId, { status: 2 });

          return res.json({ message: "Successfully picked up" });
        case 3:
          // Delivered to facility, Washing (Processing wash cycle)
          if (!isAuthorizedDriver || req.order.status !== 2)
            // Driver only
            return res
              .status(403)
              .json({ message: "Not authorized driver, or invalid status" });

          await Orders.findByIdAndUpdate(orderId, { status: 3 });

          return res.json({ message: "Successfully Dropped off" });
        case 4:
          // 4 = Washed, Ready to be deliverd
          // Delivered to facility, Washing (Processing wash cycle)
          if (role !== 2 || req.order.status !== 3)
            // Driver only
            return res
              .status(403)
              .json({ message: "Not authorized Admin, or invalid status" });

          await Orders.findByIdAndUpdate(orderId, { status: 4 });

          return res.json({ message: "Successfully Dropped off" });
        case 5:
          // 5 = Delivery Driver Allotted
          if (role !== 2)
            return res.status(400).json({ message: "Not an admin" });

          const { dropOffDriverId } = req.body;

          if (
            dropOffDriverId.length !== 24 ||
            !(await Users.exists({ _id: dropOffDriverId, role: 1 }))
          )
            return res
              .status(400)
              .json({ message: "The driver with ID does not exist" });

          // Update account
          await Orders.findByIdAndUpdate(orderId, {
            dropOffDriverId,
            status: 5,
          });

          return res.json({ message: "added drop off driver successfully" });
        case 6:
          // 6 = Delivered by delivery Driver, payment pending by default
          // Picked Up
          if (!isAuthorizedDriver || req.order.status !== 5)
            return res
              .status(403)
              .json({ message: "Not authorized driver, or invalid status" });

          await Orders.findByIdAndUpdate(orderId, { status: 6 });

          return res.json({ message: "Successfully dropped off" });
        default:
          return res.status(400).json({
            message: "Please add correct Request Status (allowed: 0 to 9)",
          });
      }

      res.json({ message: "Status changed successfully" });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
  confirmPayment: async (req, res) => {
    try {
      const { id } = req.params;

      if (!id || id.length !== 24 || !(await Orders.exists({ _id: id })))
        return res
          .status(400)
          .json({ message: "Order with the given id does not exist" });

      // Update account
      await Orders.findByIdAndUpdate(id, { paymentDone: true });

      return res.json({ message: "Payment Successfull" });
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
};

module.exports = orderCtrl;
