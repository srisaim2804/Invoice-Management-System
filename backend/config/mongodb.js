require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGO_STRING;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = client.db('Swipe_Automatic_invoice_Management');
const invoicesCollection = db.collection('invoices');
const productsCollection = db.collection('products');
const customersCollection = db.collection('customers');

let mongoConnected = false;

async function connectToMongo() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    mongoConnected = true;
    console.log("Connected to MongoDB successfully!");
  } catch (err) {
    mongoConnected = false;
    console.error("");
  }
}

// Middleware to check MongoDB connection status
const checkMongoConnection = (req, res, next) => {
  if (!mongoConnected) {
    return res.status(500).json({ message: "Failed to connect to MongoDB from backend. Please configure MongoDB properly." });
  }
  next();
};

connectToMongo();

module.exports = {
  client,
  invoicesCollection,
  customersCollection,
  productsCollection,
  checkMongoConnection,
};
