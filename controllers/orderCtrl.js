const Categories = require('../models/categoryModel')
const Orders = require('../models/orderModel')

const orderCtrl = {
  get: async (req, res) => {
    try {
      const { role } = req.userDetails;

      if (role === 2) {
        // Admin Response
        res.json({ message: "Admin" });
      } else if (role === 1) {
        // Driver Response
        res.json({ message: "Driver" });
      } else {
        // User Reponse
        const orders = await Orders.find({ clientId: req.user.id })

        res.json(orders)
      }
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
        const rawOrder = await Promise.all(order.map(async (item) => {
          const { categoryId, weight } = item;

          const categoryPrice = (await Categories.findById(
            categoryId
          )).price
          
          return {categoryId, weight, price: categoryPrice}
        }));

        console.log(rawOrder)

        const newOrder = new Orders({
          clientId: req.user.id,
          order: rawOrder
        })
        await newOrder.save()

        res.json({ message: "Added order successfully" })
      } catch (err) {
        res.status(400).json({
          message: `Order validation failed: ${err.message}`,
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.mesage });
    }
  },
};

const resolveOrder = async ({orders}) => {

  await Promise.all(orders.map(async (order) => {
    
  }));
}

module.exports = orderCtrl;
