const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.post('/', async (req, res, next) => {
    const { customer_name, invoice_number, customer_phone } = req.body;
  
    if (!customer_name || !invoice_number || !customer_phone) {
      return res.status(400).json({ message: "Customer name, invoice number, and phone number are required." });
    }
  
    try {
      const database = client.db('Swipe_Automatic_invoice_Management');
      const customersCollection = database.collection('customers');
  
      const result = await customersCollection.updateMany(
        { customer_name: customer_name, invoice_number: invoice_number },
        { $set: { customer_phone: customer_phone } }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "No matching customers found." });
      }
  
      res.status(200).json({ message: "Phone number updated successfully." });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;
