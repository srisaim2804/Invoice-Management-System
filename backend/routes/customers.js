const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const customersCollection = database.collection('customers');
    const customers = await customersCollection.find({}).toArray();

    if (customers.length === 0) {
      res.status(200).json({ data: [], message: "No customer records found. Please add customer data." });
    } else {
      res.status(200).json({ data: customers, message: "Customers retrieved successfully." });
    }
  } catch (err) {
    res.status(500).json({ data: [], message: err.message });
  }
});

module.exports = router;
