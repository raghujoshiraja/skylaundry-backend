const Categories = require("../models/categoryModel");

const categoryController = {
  getAll: async (req, res) => {
    try {
      res.json(await Categories.find());
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getSingle: async (req, res) => {
    try {
      const { id } = req.params;
      res.json(await Categories.findById(id));
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  create: async (req, res) => {
    try {
      const { name, price } = req.body;

      const newCategory = new Categories({ name, price });
      await newCategory.save();

      return res.json({ message: "New Category created" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = categoryController;
