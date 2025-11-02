const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const productsCollection = database.collection('products');
    const products = await productsCollection.find({}).toArray();

    if (products.length === 0) {
      res.status(200).json({ data: [], message: "No product records found. Please add product data." });
    } else {
      res.status(200).json({ data: products, message: "Products retrieved successfully." });
    }
  } catch (err) {
    res.status(500).json({ data: [], message: err.message });
  }
});

module.exports = router;
