const express = require('express');
const router = express.Router();
const { client } = require('../config/mongodb');

router.get('/', async (req, res, next) => {
  try {
    const database = client.db('Swipe_Automatic_invoice_Management');
    const invoicesCollection = database.collection('invoices');
    const invoices = await invoicesCollection.find({}).toArray();

    if (invoices.length === 0) {
      res.status(200).json({ data: [], message: "No invoice records found. Please upload files." });
    } else {
      res.status(200).json({ data: invoices, message: "Invoices retrieved successfully." });
    }
  } catch (err) {
    res.status(500).json({ data: [], message: err.message });
  }
});

module.exports = router;
